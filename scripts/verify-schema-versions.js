#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function getPackageJsonVersion() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || '0.0.0-dev';
  } catch {
    return '0.0.0-dev';
  }
}

const SCHEMAS_DIR = path.join(process.cwd(), 'schemas');
const EXPECTED_VERSION = process.env.SCHEMA_VERSION || getPackageJsonVersion();
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

  if (!content.version) {
    return { valid: true, reason: 'Legacy schema (no version field)' };
  }

  if (!content.$id) {
    return { valid: false, reason: 'Schema missing required $id field' };
  }

  const expectedPattern = `https://raw.githubusercontent.com/carrot-foundation/schemas/${EXPECTED_REF}/`;

  if (!content.$id.startsWith(expectedPattern)) {
    return {
      valid: false,
      reason: `Expected $id to start with "${expectedPattern}", but got "${content.$id}"`,
    };
  }

  if (content.version !== EXPECTED_VERSION) {
    return {
      valid: false,
      reason: `Expected version "${EXPECTED_VERSION}", but got "${content.version}"`,
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
    } else if (result.reason) {
      console.log(`⚠️  ${relativePath}`);
      console.log(`   ${result.reason}`);
    } else {
      console.log(`✅ ${relativePath}`);
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
