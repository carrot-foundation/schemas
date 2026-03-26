#!/usr/bin/env node

/**
 * Schema backward compatibility checker.
 * Compares generated JSON schemas from main branch against current branch.
 * Detects breaking changes: removed properties, new required fields,
 * type changes, narrowed enums, additionalProperties restrictions,
 * and deleted schemas.
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
  console.log('BASELINE_SCHEMAS_DIR not set. Skipping compatibility check.');
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

function emitAnnotation(finding) {
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
 * @param {string} path - Dot-separated property path for context
 */
function compareProperties(baselineObj, currentObj, schemaName, path = '') {
  const baseProps = baselineObj.properties;
  const curProps = currentObj.properties;

  if (!baseProps || !curProps) return;

  for (const prop of Object.keys(baseProps)) {
    const fullPath = path ? `${path}.${prop}` : prop;

    if (!(prop in curProps)) {
      const finding = {
        schema: schemaName,
        type: 'REMOVED_PROPERTY',
        detail: `Property "${fullPath}" was removed`,
      };
      findings.push(finding);
      emitAnnotation(finding);
      continue;
    }

    const baseVal = baseProps[prop];
    const curVal = curProps[prop];

    // Check type changes
    if (baseVal.type && curVal.type && baseVal.type !== curVal.type) {
      const finding = {
        schema: schemaName,
        type: 'TYPE_CHANGED',
        detail: `"${fullPath}" changed type from "${baseVal.type}" to "${curVal.type}"`,
      };
      findings.push(finding);
      emitAnnotation(finding);
    }

    // Check narrowed enums
    if (baseVal.enum && curVal.enum) {
      const currentEnumSet = new Set(curVal.enum);
      for (const val of baseVal.enum) {
        if (!currentEnumSet.has(val)) {
          const finding = {
            schema: schemaName,
            type: 'ENUM_VALUE_REMOVED',
            detail: `"${fullPath}" lost enum value "${val}"`,
          };
          findings.push(finding);
          emitAnnotation(finding);
        }
      }
    }

    // Recurse into nested properties
    if (baseVal.properties && curVal.properties) {
      compareProperties(baseVal, curVal, schemaName, fullPath);
    }

    // Recurse into array items
    if (baseVal.items?.properties && curVal.items?.properties) {
      compareProperties(
        baseVal.items,
        curVal.items,
        schemaName,
        `${fullPath}[]`,
      );
    }
  }

  // Check new required fields at this level
  const baselineRequired = new Set(baselineObj.required || []);
  const currentRequired = new Set(currentObj.required || []);
  for (const req of currentRequired) {
    if (!baselineRequired.has(req)) {
      const fullPath = path ? `${path}.${req}` : req;
      const finding = {
        schema: schemaName,
        type: 'NEW_REQUIRED_FIELD',
        detail: `"${fullPath}" is now required (was optional or absent)`,
      };
      findings.push(finding);
      emitAnnotation(finding);
    }
  }

  // Check additionalProperties restriction at this level
  if (
    baselineObj.additionalProperties !== false &&
    currentObj.additionalProperties === false
  ) {
    const finding = {
      schema: schemaName,
      type: 'ADDITIONAL_PROPERTIES_RESTRICTED',
      detail: `additionalProperties changed to false${path ? ` at "${path}"` : ''}`,
    };
    findings.push(finding);
    emitAnnotation(finding);
  }
}

function checkSchema(currentPath, baselinePath) {
  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const schemaName = basename(currentPath, '.schema.json');

  // Compare top-level and nested properties recursively
  compareProperties(baseline, current, schemaName);

  // Also recurse into $defs
  if (baseline.$defs && current.$defs) {
    for (const defName of Object.keys(baseline.$defs)) {
      if (current.$defs[defName]) {
        compareProperties(
          baseline.$defs[defName],
          current.$defs[defName],
          schemaName,
          `$defs.${defName}`,
        );
      }
    }
  }
}

// Find all current schemas and compare against baseline
const currentSchemas = globSync('**/*.schema.json', { cwd: SCHEMAS_DIR });

for (const schemaFile of currentSchemas) {
  const currentPath = resolve(SCHEMAS_DIR, schemaFile);
  const baselinePath = resolve(BASELINE_DIR, schemaFile);

  if (existsSync(baselinePath)) {
    try {
      checkSchema(currentPath, baselinePath);
    } catch (error) {
      const finding = {
        schema: schemaFile,
        type: 'PARSE_ERROR',
        detail: `Failed to compare schema: ${error.message}`,
      };
      findings.push(finding);
      emitAnnotation(finding);
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
    const finding = {
      schema: basename(schemaFile, '.schema.json'),
      type: 'SCHEMA_DELETED',
      detail: `Schema file "${schemaFile}" was deleted entirely`,
    };
    findings.push(finding);
    emitAnnotation(finding);
  }
}

if (findings.length === 0) {
  console.log('No breaking schema changes detected.');
  process.exit(0);
} else {
  console.log(`Found ${findings.length} potential breaking change(s):\n`);
  for (const f of findings) {
    console.log(`  [${f.type}] ${f.schema}: ${f.detail}`);
  }

  if (isAdvisory) {
    console.log('\nRunning in advisory mode — exiting 0 despite findings.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}
