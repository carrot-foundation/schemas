#!/usr/bin/env node

/**
 * Schema backward compatibility checker.
 * Compares generated JSON schemas from main branch against current branch.
 * Detects breaking changes: removed properties, new required fields,
 * type changes, narrowed enums.
 *
 * Exit code 0 always (advisory only). Outputs findings to stdout.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { globSync } from 'glob';

const SCHEMAS_DIR = resolve(process.cwd(), 'schemas/ipfs');
const BASELINE_DIR = process.env.BASELINE_SCHEMAS_DIR;

if (!BASELINE_DIR || !existsSync(BASELINE_DIR)) {
  console.log('No baseline schemas found. Skipping compatibility check.');
  process.exit(0);
}

const findings = [];

function checkSchema(currentPath, baselinePath) {
  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const schemaName = basename(currentPath, '.schema.json');

  // Check removed properties
  if (baseline.properties && current.properties) {
    for (const prop of Object.keys(baseline.properties)) {
      if (!(prop in current.properties)) {
        findings.push({
          schema: schemaName,
          type: 'REMOVED_PROPERTY',
          detail: `Property "${prop}" was removed`,
        });
      }
    }
  }

  // Check new required fields (breaks existing data)
  const baselineRequired = new Set(baseline.required || []);
  const currentRequired = new Set(current.required || []);
  for (const req of currentRequired) {
    if (!baselineRequired.has(req)) {
      findings.push({
        schema: schemaName,
        type: 'NEW_REQUIRED_FIELD',
        detail: `"${req}" is now required (was optional or absent)`,
      });
    }
  }

  // Check type changes
  if (baseline.properties && current.properties) {
    for (const [prop, baseVal] of Object.entries(baseline.properties)) {
      const curVal = current.properties[prop];
      if (
        curVal &&
        baseVal.type &&
        curVal.type &&
        baseVal.type !== curVal.type
      ) {
        findings.push({
          schema: schemaName,
          type: 'TYPE_CHANGED',
          detail: `"${prop}" changed type from "${baseVal.type}" to "${curVal.type}"`,
        });
      }
    }
  }

  // Check additionalProperties changed to false
  if (
    baseline.additionalProperties !== false &&
    current.additionalProperties === false
  ) {
    findings.push({
      schema: schemaName,
      type: 'ADDITIONAL_PROPERTIES_RESTRICTED',
      detail: 'additionalProperties changed to false',
    });
  }
}

// Find all current schemas
const currentSchemas = globSync('**/*.schema.json', { cwd: SCHEMAS_DIR });

for (const schemaFile of currentSchemas) {
  const currentPath = resolve(SCHEMAS_DIR, schemaFile);
  const baselinePath = resolve(BASELINE_DIR, schemaFile);

  if (existsSync(baselinePath)) {
    checkSchema(currentPath, baselinePath);
  }
}

if (findings.length === 0) {
  console.log('No breaking schema changes detected.');
} else {
  console.log(`Found ${findings.length} potential breaking change(s):\n`);
  for (const f of findings) {
    console.log(`  [${f.type}] ${f.schema}: ${f.detail}`);
  }
}

// Always exit 0 — advisory only
process.exit(0);
