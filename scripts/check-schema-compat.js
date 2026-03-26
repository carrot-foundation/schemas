#!/usr/bin/env node

/**
 * Schema backward compatibility checker.
 * Compares generated JSON schemas in `schemas/ipfs/` against a baseline
 * directory specified by the `BASELINE_SCHEMAS_DIR` environment variable.
 * Detects breaking changes: removed properties, new required fields,
 * type changes, narrowed enums, additionalProperties restrictions,
 * deleted schemas, and deleted $defs.
 *
 * Checks nested properties recursively (including $defs).
 *
 * Pass --advisory to exit 0 even when findings exist.
 * Default: exits 1 when breaking changes are found.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { globSync } from 'glob';

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

const findings = [];

function joinPath(parent, segment) {
  return parent ? `${parent}.${segment}` : segment;
}

function addFinding(schema, type, detail) {
  const finding = { schema, type, detail };
  findings.push(finding);
  if (isCI) {
    console.log(
      `::warning::Schema compat [${finding.type}] ${finding.schema}: ${finding.detail}`,
    );
  }
}

/**
 * Recursively compare properties between baseline and current schemas.
 * @param {object} baselineObj - Baseline schema or sub-schema object
 * @param {object} currentObj - Current schema or sub-schema object
 * @param {string} schemaName - Schema name for reporting
 * @param {string} propertyPath - Dot-separated property path for context
 */
function compareProperties(
  baselineObj,
  currentObj,
  schemaName,
  propertyPath = '',
) {
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

  if (!baseProps && curProps) return;

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

    // Only handles single-type values; array types (e.g., ["string", "null"]) are not compared
    if (baseVal.type && curVal.type && baseVal.type !== curVal.type) {
      addFinding(
        schemaName,
        'TYPE_CHANGED',
        `"${fullPath}" changed type from "${baseVal.type}" to "${curVal.type}"`,
      );
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
    addFinding(
      schemaName,
      'ADDITIONAL_PROPERTIES_RESTRICTED',
      `additionalProperties changed to false${propertyPath ? ` at "${propertyPath}"` : ''}`,
    );
  }
}

function checkSchema(currentPath, baselinePath) {
  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
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
      // Infrastructure failures are not advisory -- the tool cannot function
      console.error(
        `FATAL: Failed to compare schema ${schemaFile}: ${error.message}`,
      );
      if (error.stack) console.error(error.stack);
      process.exit(1);
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

  if (isAdvisory) {
    console.error('\nRunning in advisory mode — exiting 0 despite findings.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}
