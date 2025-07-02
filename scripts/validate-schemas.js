#!/usr/bin/env node

/**
 * JSON Schema Validation Script
 * Validates JSON schemas and data files using AJV with Draft 2020-12 support.
 */

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { glob } from 'glob';
import https from 'https';

const CONFIG = {
  schemasDir: './schemas',
  schemaPattern: '**/*.schema.json',
  dataPattern: '**/*.example.json',
  verbose: false,
};

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let currentSchemaContext = null;
let schemaCache = new Map();

function createAjv(baseUri) {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: CONFIG.verbose,
    loadSchema: (uri) => loadSchemaFromFile(uri, baseUri),
    addUsedSchema: false,
    draft: '2020-12',
  });

  addFormats(ajv);
  return ajv;
}

async function loadSchemaFromFile(uri, baseUri) {
  try {
    let filePath = resolveSchemaPath(uri, baseUri);

    if (CONFIG.verbose) {
      console.log(`  Loading schema: ${uri} -> ${filePath}`);
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Schema file not found: ${filePath}`);
    }

    const normalizedPath = path.resolve(filePath);

    if (schemaCache.has(normalizedPath)) {
      return schemaCache.get(normalizedPath);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(content);

    schemaCache.set(normalizedPath, schema);
    return schema;
  } catch (error) {
    console.error(
      `${colors.red}Error loading schema ${uri}:${colors.reset}`,
      error.message,
    );
    throw error;
  }
}

function resolveSchemaPath(uri, baseUri) {
  if (uri.startsWith('file://')) {
    return uri.replace('file://', '');
  }

  if (uri.startsWith('./') || uri.startsWith('../')) {
    const resolveBase = currentSchemaContext || baseUri;
    if (resolveBase) {
      return path.resolve(path.dirname(resolveBase), uri);
    }
    return path.resolve(CONFIG.schemasDir, uri);
  }

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const localPath = uri.replace(/^https?:\/\/.*\/schemas\//, './schemas/');
    const resolved = path.resolve(localPath);
    currentSchemaContext = resolved;
    return resolved;
  }

  // Try multiple resolution strategies for non-relative URIs
  const strategies = [
    () => (baseUri ? path.resolve(path.dirname(baseUri), uri) : null),
    () =>
      currentSchemaContext
        ? path.resolve(path.dirname(currentSchemaContext), uri)
        : null,
    () => path.resolve(CONFIG.schemasDir, uri),
    () => path.resolve(CONFIG.schemasDir, 'ipfs', uri),
    () => path.resolve(CONFIG.schemasDir, 'ipfs', 'shared', uri),
  ];

  for (const strategy of strategies) {
    const candidate = strategy();
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(CONFIG.schemasDir, uri);
}

function getSchemaFiles() {
  return glob.sync(path.join(CONFIG.schemasDir, CONFIG.schemaPattern));
}

function getDataFiles() {
  return glob.sync(path.join(CONFIG.schemasDir, CONFIG.dataPattern));
}

async function validateSchema(schemaPath) {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    const ajv = createAjv();
    const metaSchema = await loadMetaSchema();
    const validate = ajv.compile(metaSchema);
    const valid = validate(schema);

    return { valid, errors: validate.errors, schema, path: schemaPath };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error.message }],
      path: schemaPath,
    };
  }
}

async function loadMetaSchema() {
  try {
    const metaSchema = await import(
      'ajv/dist/refs/json-schema-2020-12/schema.json',
      { with: { type: 'json' } }
    );
    return metaSchema;
  } catch (error) {
    return fetchOnlineMetaSchema();
  }
}

function fetchOnlineMetaSchema() {
  return new Promise((resolve, reject) => {
    https
      .get('https://json-schema.org/draft/2020-12/schema', (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(
              new Error(`Failed to parse online meta-schema: ${e.message}`),
            );
          }
        });
      })
      .on('error', (error) => {
        reject(
          new Error(`Failed to fetch online meta-schema: ${error.message}`),
        );
      });
  });
}

async function validateData(dataPath, schemaPath) {
  try {
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(dataContent);
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);

    schemaCache.clear();
    currentSchemaContext = path.resolve(schemaPath);

    const ajv = createAjv(path.resolve(schemaPath));
    const validate = await ajv.compileAsync(schema);
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || [],
      data,
      path: dataPath,
      schemaPath,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error.message }],
      path: dataPath,
      schemaPath,
    };
  }
}

function findSchemaForData(dataPath) {
  const dataDir = path.dirname(dataPath);
  const dataName = path.basename(dataPath, '.example.json');
  const schemaInSameDir = path.join(dataDir, `${dataName}.schema.json`);

  if (fs.existsSync(schemaInSameDir)) {
    return schemaInSameDir;
  }

  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(content);

    if (data.metadata_type) {
      const type = data.metadata_type.toLowerCase();
      const matches = glob.sync(
        path.join(CONFIG.schemasDir, `**/${type}.schema.json`),
      );
      if (matches.length > 0) {
        return matches[0];
      }
    }
  } catch (error) {
    // Ignore parsing errors
  }

  return null;
}

function formatErrors(errors, verbose = false) {
  if (!errors || errors.length === 0) return '';

  return errors
    .map((error) => {
      let msg = `  ${colors.red}✗${colors.reset} `;

      if (error.instancePath) {
        msg += `${colors.yellow}${error.instancePath}${colors.reset}: `;
      }

      msg += error.message;

      if (verbose) {
        if (error.schemaPath) {
          msg += `\n    ${colors.blue}Schema path: ${error.schemaPath}${colors.reset}`;
        }
        if (error.data !== undefined) {
          msg += `\n    ${colors.cyan}Data: ${JSON.stringify(error.data)}${
            colors.reset
          }`;
        }
      }

      return msg;
    })
    .join('\n');
}

async function validateAll(options = {}) {
  const results = {
    schemas: { passed: 0, failed: 0, results: [] },
    data: { passed: 0, failed: 0, results: [] },
  };

  console.log(
    `${colors.bright}🔍 Schema Validation (Draft 2020-12)${colors.reset}\n`,
  );

  // If specific files are provided, only validate those files (skip schema validation)
  const isValidatingSpecificFiles = options.files && options.files.length > 0;
  const shouldValidateSchemas = !options.dataOnly && !isValidatingSpecificFiles;
  const shouldValidateData = !options.schemasOnly;

  // Validate schemas
  if (shouldValidateSchemas) {
    console.log(`${colors.cyan}📋 Validating Schemas...${colors.reset}`);
    const schemaFiles = getSchemaFiles();

    for (const schemaFile of schemaFiles) {
      const result = await validateSchema(schemaFile);
      results.schemas.results.push(result);

      if (result.valid) {
        results.schemas.passed++;
        if (CONFIG.verbose) {
          console.log(
            `  ${colors.green}✓${colors.reset} ${path.relative(
              '.',
              schemaFile,
            )}`,
          );
        }
      } else {
        results.schemas.failed++;
        console.log(
          `${colors.red}Schema validation failed:${
            colors.reset
          } ${path.relative('.', schemaFile)}`,
        );
        console.log(formatErrors(result.errors, CONFIG.verbose));
        console.log();
      }
    }

    console.log(
      `Schemas: ${colors.green}${results.schemas.passed} passed${colors.reset}, ${colors.red}${results.schemas.failed} failed${colors.reset}\n`,
    );
  }

  // Validate data files
  if (shouldValidateData) {
    console.log(`${colors.cyan}📄 Validating Data Files...${colors.reset}`);
    const dataFiles = isValidatingSpecificFiles
      ? options.files
      : getDataFiles();

    for (const dataFile of dataFiles) {
      const schemaFile = findSchemaForData(dataFile);

      if (!schemaFile) {
        console.log(
          `${colors.yellow}⚠ No schema found for:${
            colors.reset
          } ${path.relative('.', dataFile)}`,
        );
        continue;
      }

      const result = await validateData(dataFile, schemaFile);
      results.data.results.push(result);

      if (result.valid) {
        results.data.passed++;
        if (CONFIG.verbose) {
          console.log(
            `  ${colors.green}✓${colors.reset} ${path.relative('.', dataFile)}`,
          );
        }
      } else {
        results.data.failed++;
        console.log(
          `${colors.red}Data validation failed:${colors.reset} ${path.relative(
            '.',
            dataFile,
          )}`,
        );
        console.log(
          `${colors.blue}Schema:${colors.reset} ${path.relative(
            '.',
            schemaFile,
          )}`,
        );
        console.log(formatErrors(result.errors, CONFIG.verbose));
        console.log();
      }
    }

    console.log(
      `Data files: ${colors.green}${results.data.passed} passed${colors.reset}, ${colors.red}${results.data.failed} failed${colors.reset}\n`,
    );
  }

  // Summary
  const totalPassed = results.schemas.passed + results.data.passed;
  const totalFailed = results.schemas.failed + results.data.failed;

  console.log(`${colors.bright}📊 Summary:${colors.reset}`);
  console.log(
    `Total: ${colors.green}${totalPassed} passed${colors.reset}, ${colors.red}${totalFailed} failed${colors.reset}`,
  );

  if (totalFailed > 0) {
    console.log(
      `\n${colors.red}❌ Validation completed with errors${colors.reset}`,
    );
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All validations passed!${colors.reset}`);
    process.exit(0);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--schemas-only':
        options.schemasOnly = true;
        break;
      case '--data-only':
        options.dataOnly = true;
        break;
      case '--file':
        options.files = [];
        while (args[i + 1] && !args[i + 1].startsWith('--')) {
          options.files.push(args[++i]);
        }
        break;
      case '--verbose':
      case '-v':
        CONFIG.verbose = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      default:
        console.error(`Unknown option: ${args[i]}`);
        showHelp();
        process.exit(1);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
${colors.bright}Schema Validator${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node validate-schemas.js [options]

${colors.cyan}Options:${colors.reset}
  --schemas-only     Validate only schema files
  --data-only        Validate only JSON data files
  --file <path> [more...]  Validate specific file(s)
  --verbose, -v      Show detailed output
  --help, -h         Show this help message

${colors.cyan}Examples:${colors.reset}
  node validate-schemas.js                    # Validate everything
  node validate-schemas.js --schemas-only     # Validate schemas only
  node validate-schemas.js --file file1.json file2.json  # Validate specific files
  node validate-schemas.js --verbose          # Show detailed output
`);
}

async function main() {
  try {
    const options = parseArgs();
    await validateAll(options);
  } catch (error) {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error.message);
    if (CONFIG.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateSchema, validateData, validateAll, createAjv };
