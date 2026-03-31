#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { globSync } from 'glob';
import { getErrorMessage } from './utils/fs-utils.js';

interface Finding {
  schema: string;
  type: string;
  detail: string;
}

interface SchemaObject {
  properties?: Record<string, SchemaObject>;
  required?: string[];
  type?: string | string[];
  enum?: unknown[];
  additionalProperties?: boolean;
  $defs?: Record<string, SchemaObject>;
  items?: SchemaObject;
  [key: string]: unknown;
}

const SCHEMAS_DIR = resolve(process.cwd(), 'schemas/ipfs');
const BASELINE_DIR = process.env.BASELINE_SCHEMAS_DIR;
const isAdvisory = process.argv.includes('--advisory');
const isCI = !!process.env.CI;

if (!BASELINE_DIR) {
  // In CI the variable is required; locally it's acceptable to skip
  if (isCI) {
    console.error(
      'ERROR: BASELINE_SCHEMAS_DIR is not set but CI=true. ' +
        'The compatibility check cannot run without a baseline. ' +
        'Ensure the baseline schema generation step completed successfully.',
    );
    process.exit(1);
  }
  console.warn(
    'BASELINE_SCHEMAS_DIR not set. Skipping compatibility check (local dev only).',
  );
  process.exit(0);
}

if (!existsSync(BASELINE_DIR)) {
  console.error(
    `ERROR: BASELINE_SCHEMAS_DIR is set to "${BASELINE_DIR}" but the directory does not exist. ` +
      'This likely means the baseline schema generation failed.',
  );
  process.exit(1);
}

if (!existsSync(SCHEMAS_DIR)) {
  console.error(
    `ERROR: Current schemas directory "${SCHEMAS_DIR}" does not exist. ` +
      'Run "pnpm generate-schemas" before the compatibility check.',
  );
  process.exit(1);
}

const baselineSchemaCount = globSync('**/*.schema.json', {
  cwd: BASELINE_DIR,
}).length;
if (baselineSchemaCount === 0) {
  console.error(
    `ERROR: BASELINE_SCHEMAS_DIR "${BASELINE_DIR}" exists but contains no .schema.json files. ` +
      'The baseline schema generation likely failed or wrote to the wrong directory.',
  );
  process.exit(1);
}

const findings: Finding[] = [];
let hasInfrastructureFailure = false;

function joinPath(parent: string, segment: string): string {
  return parent ? `${parent}.${segment}` : segment;
}

function addFinding(schema: string, type: string, detail: string): void {
  const finding: Finding = { schema, type, detail };
  findings.push(finding);
  if (isCI) {
    // Must be console.log (stdout) for GitHub Actions to parse the ::warning:: annotation
    console.log(
      `::warning::Schema compat [${finding.type}] ${finding.schema}: ${finding.detail}`,
    );
  }
}

function compareProperties(
  baselineObj: SchemaObject,
  currentObj: SchemaObject,
  schemaName: string,
  propertyPath = '',
): void {
  const baseProps = baselineObj.properties;
  const curProps = currentObj.properties;

  if (!baseProps && !curProps) return;

  if (baseProps && !curProps) {
    addFinding(
      schemaName,
      'PROPERTIES_REMOVED',
      `Properties block removed${propertyPath ? ` at "${propertyPath}"` : ''} (was ${Object.keys(baseProps).length} properties)`,
    );
    return;
  }

  if (baseProps && curProps) {
    comparePropertyEntries(baseProps, curProps, schemaName, propertyPath);
  }

  const baselineRequired = new Set(baselineObj.required || []);
  const currentRequired = new Set(currentObj.required || []);
  for (const req of currentRequired) {
    if (!baselineRequired.has(req)) {
      addFinding(
        schemaName,
        'NEW_REQUIRED_FIELD',
        `"${joinPath(propertyPath, req)}" is now required (was optional or absent)`,
      );
    }
  }

  if (
    baselineObj.additionalProperties !== false &&
    currentObj.additionalProperties === false
  ) {
    const pathSuffix = propertyPath ? ` at "${propertyPath}"` : '';
    addFinding(
      schemaName,
      'ADDITIONAL_PROPERTIES_RESTRICTED',
      `additionalProperties set to false${pathSuffix} (was not restricted)`,
    );
  }
}

function comparePropertyEntries(
  baseProps: Record<string, SchemaObject>,
  curProps: Record<string, SchemaObject>,
  schemaName: string,
  propertyPath: string,
): void {
  for (const prop of Object.keys(baseProps)) {
    const fullPath = joinPath(propertyPath, prop);

    if (!(prop in curProps)) {
      addFinding(
        schemaName,
        'REMOVED_PROPERTY',
        `Property "${fullPath}" was removed`,
      );
      continue;
    }

    const baseVal = baseProps[prop];
    const curVal = curProps[prop];

    // Compare type values — handles both scalar ("string") and array (["string", "null"]) forms
    if (baseVal.type !== undefined && curVal.type !== undefined) {
      const baseTypes = new Set(
        Array.isArray(baseVal.type) ? baseVal.type : [baseVal.type],
      );
      const curTypes = new Set(
        Array.isArray(curVal.type) ? curVal.type : [curVal.type],
      );
      const removedTypes = [...baseTypes].filter((t) => !curTypes.has(t));
      if (removedTypes.length > 0) {
        addFinding(
          schemaName,
          'TYPE_CHANGED',
          `"${fullPath}" removed allowed type(s): ${removedTypes.map((t) => `"${t}"`).join(', ')} (was ${JSON.stringify(baseVal.type)}, now ${JSON.stringify(curVal.type)})`,
        );
      }
    }

    if (baseVal.enum && curVal.enum) {
      const currentEnumSet = new Set(curVal.enum);
      for (const val of baseVal.enum) {
        if (!currentEnumSet.has(val)) {
          addFinding(
            schemaName,
            'ENUM_VALUE_REMOVED',
            `"${fullPath}" lost enum value "${val}"`,
          );
        }
      }
    }

    if (baseVal.properties && curVal.properties) {
      compareProperties(baseVal, curVal, schemaName, fullPath);
    }

    if (baseVal.items?.properties && curVal.items?.properties) {
      compareProperties(
        baseVal.items,
        curVal.items,
        schemaName,
        `${fullPath}[]`,
      );
    }
  }
}

function checkSchema(currentPath: string, baselinePath: string): void {
  const current = JSON.parse(readFileSync(currentPath, 'utf8')) as SchemaObject;
  const baseline = JSON.parse(
    readFileSync(baselinePath, 'utf8'),
  ) as SchemaObject;
  const schemaName = basename(currentPath, '.schema.json');

  compareProperties(baseline, current, schemaName);

  if (baseline.$defs && current.$defs) {
    for (const defName of Object.keys(baseline.$defs)) {
      if (current.$defs[defName]) {
        compareProperties(
          baseline.$defs[defName],
          current.$defs[defName],
          schemaName,
          `$defs.${defName}`,
        );
      } else {
        addFinding(schemaName, 'DEF_REMOVED', `$defs.${defName} was removed`);
      }
    }
  } else if (baseline.$defs && !current.$defs) {
    addFinding(
      schemaName,
      'ALL_DEFS_REMOVED',
      `Entire $defs block was removed (had ${Object.keys(baseline.$defs).length} definitions)`,
    );
  }
}

const currentSchemas = globSync('**/*.schema.json', { cwd: SCHEMAS_DIR });

for (const schemaFile of currentSchemas) {
  const currentPath = resolve(SCHEMAS_DIR, schemaFile);
  const baselinePath = resolve(BASELINE_DIR, schemaFile);

  if (existsSync(baselinePath)) {
    try {
      checkSchema(currentPath, baselinePath);
    } catch (error) {
      // Infrastructure failures (JSON parse, filesystem) are not advisory
      const errMsg = getErrorMessage(error);
      console.error(`ERROR: Failed to compare schema ${schemaFile}: ${errMsg}`);
      if (error instanceof Error && error.stack) console.error(error.stack);
      addFinding(
        schemaFile,
        'PARSE_ERROR',
        `Failed to compare schema: ${errMsg}`,
      );
      hasInfrastructureFailure = true;
    }
  } else {
    console.log(`  [NEW_SCHEMA] ${schemaFile}: Not present in baseline`);
  }
}

// Detect deleted schemas (present in baseline but absent in current)
const baselineSchemas = globSync('**/*.schema.json', { cwd: BASELINE_DIR });
for (const schemaFile of baselineSchemas) {
  const currentPath = resolve(SCHEMAS_DIR, schemaFile);
  if (!existsSync(currentPath)) {
    addFinding(
      basename(schemaFile, '.schema.json'),
      'SCHEMA_DELETED',
      `Schema file "${schemaFile}" was deleted entirely`,
    );
  }
}

if (findings.length === 0) {
  console.log('No breaking schema changes detected.');
  process.exit(0);
} else {
  console.error(`Found ${findings.length} potential breaking change(s):\n`);
  for (const f of findings) {
    console.error(`  [${f.type}] ${f.schema}: ${f.detail}`);
  }

  // Infrastructure errors are never advisory — they mean the tool could not function
  if (hasInfrastructureFailure) {
    console.error(
      '\nInfrastructure errors occurred — exiting 1 regardless of advisory mode.',
    );
    process.exit(1);
  }

  if (isAdvisory) {
    console.error('\nRunning in advisory mode — exiting 0 despite findings.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}
