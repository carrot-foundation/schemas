#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { hashObject } from '../dist/index.js';

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas', 'ipfs');
const MANIFEST_PATH = path.join(process.cwd(), 'schemas', 'schema-hashes.json');

function collectSchemaFiles(rootDir) {
  const results = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function getVersion() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return process.env.SCHEMA_VERSION || pkg.version || '0.0.0-dev';
  } catch {
    return process.env.SCHEMA_VERSION || '0.0.0-dev';
  }
}

function main() {
  if (!fs.existsSync(SCHEMAS_ROOT)) {
    console.error(`Schemas root not found: ${SCHEMAS_ROOT}`);
    process.exit(1);
  }

  const version = getVersion();
  const manifest = { version, schemas: {} };
  const files = collectSchemaFiles(SCHEMAS_ROOT);

  for (const filePath of files) {
    const relative = path.relative(
      path.join(process.cwd(), 'schemas'),
      filePath,
    );
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const hash = hashObject(json);
    manifest.schemas[relative] = {
      hash,
      path: relative,
    };
    console.log(`✔ hashed ${relative}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote manifest to ${MANIFEST_PATH}`);
}

main();
