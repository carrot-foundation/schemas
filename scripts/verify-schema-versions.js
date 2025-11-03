#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const SCHEMAS_DIR = path.join(process.cwd(), 'schemas');
const EXPECTED_VERSION = process.env.SCHEMA_VERSION || '0.0.0-dev';
const EXPECTED_REF = `refs/tags/${EXPECTED_VERSION}`;

function collectSchemaFiles(dir, collected = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectSchemaFiles(fullPath, collected);
      continue;
    }

    if (
      fullPath.endsWith('.schema.json') &&
      !fullPath.includes('.data.schema.json')
    ) {
      collected.push(fullPath);
    }
  }

  return collected;
}

function verifySchemaVersion(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!content.$id) {
    return { valid: true, reason: 'No $id field (optional)' };
  }

  const expectedPattern = `https://raw.githubusercontent.com/carrot-foundation/schemas/${EXPECTED_REF}/`;

  if (!content.$id.startsWith(expectedPattern)) {
    return {
      valid: false,
      reason: `Expected $id to start with "${expectedPattern}", but got "${content.$id}"`,
    };
  }

  return { valid: true };
}

function main() {
  console.log(`Verifying schema versions against: ${EXPECTED_REF}`);
  console.log(`Expected version: ${EXPECTED_VERSION}\n`);

  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas directory not found at ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const schemaFiles = collectSchemaFiles(SCHEMAS_DIR);
  const results = [];
  let hasErrors = false;

  for (const filePath of schemaFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const result = verifySchemaVersion(filePath);

    results.push({
      file: relativePath,
      ...result,
    });

    if (result.valid === false) {
      hasErrors = true;
      console.error(`❌ ${relativePath}`);
      console.error(`   ${result.reason}\n`);
    } else {
      console.log(`✅ ${relativePath}`);
      if (result.reason) {
        console.log(`   ${result.reason}`);
      }
    }
  }

  console.log(`\nVerified ${results.length} schema file(s)`);

  if (hasErrors) {
    console.error('\n❌ Some schemas have incorrect version references');
    process.exit(1);
  }

  console.log('✅ All schema versions are correct');
}

main();
