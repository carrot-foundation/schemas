#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { glob } from 'glob';

const SCHEMAS_DIR = './schemas';
const EXAMPLES_DIR = './schemas/examples';

function createValidator() {
  const ajv = new Ajv({ allErrors: true, strictSchema: false });
  addFormats(ajv);
  return ajv;
}

function findExampleSchemaPairs() {
  const exampleFiles = glob.sync(path.join(EXAMPLES_DIR, '*.example.json'));
  const pairs = [];

  for (const exampleFile of exampleFiles) {
    const baseName = path.basename(exampleFile, '.example.json');
    const schemaFile = path.join(SCHEMAS_DIR, `${baseName}.schema.json`);

    if (fs.existsSync(schemaFile)) {
      pairs.push({ example: exampleFile, schema: schemaFile });
    } else {
      console.warn(`⚠️  No schema found for ${path.basename(exampleFile)}`);
    }
  }

  return pairs;
}

function validatePair(exampleFile, schemaFile, validator) {
  try {
    const exampleData = JSON.parse(fs.readFileSync(exampleFile, 'utf8'));
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));

    const validate = validator.compile(schema);
    const isValid = validate(exampleData);

    return {
      valid: isValid,
      errors: validate.errors || [],
      exampleFile,
      schemaFile,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error.message }],
      exampleFile,
      schemaFile,
    };
  }
}

function formatErrors(errors) {
  return errors
    .map((error) => {
      let msg = '  ❌ ';
      if (error.instancePath) {
        msg += `${error.instancePath}: `;
      }
      msg += error.message;
      return msg;
    })
    .join('\n');
}

function main() {
  console.log('🔍 Validating JSON Examples against Schemas\n');

  const pairs = findExampleSchemaPairs();
  const validator = createValidator();

  let passed = 0;
  let failed = 0;

  for (const pair of pairs) {
    const result = validatePair(pair.example, pair.schema, validator);
    const exampleName = path.basename(pair.example);

    if (result.valid) {
      console.log(`✅ ${exampleName}`);
      passed++;
    } else {
      console.log(`❌ ${exampleName}`);
      console.log(formatErrors(result.errors));
      console.log();
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('❌ Validation failed');
    process.exit(1);
  } else {
    console.log('✅ All validations passed');
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
