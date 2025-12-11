#!/usr/bin/env node
// Note: run after building (pnpm build) because it imports from dist/index.js

import fs from 'node:fs';
import path from 'node:path';
import { hashObject } from '../dist/index.js';
import {
  collectJsonFiles,
  getVersion,
  loadJson,
  writeJson,
} from './utils/fs-utils.js';

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas', 'ipfs');
const MANIFEST_PATH = path.join(process.cwd(), 'schemas', 'schema-hashes.json');

function main() {
  if (!fs.existsSync(SCHEMAS_ROOT)) {
    console.error(`Schemas root not found: ${SCHEMAS_ROOT}`);
    process.exit(1);
  }

  const distEntry = path.join(process.cwd(), 'dist', 'index.js');
  if (!fs.existsSync(distEntry)) {
    console.error(
      `Compiled entry not found at ${distEntry}. Run "pnpm build" first.`,
    );
    process.exit(1);
  }

  const version = getVersion();
  const manifest = { version, schemas: {} };
  const files = collectJsonFiles(SCHEMAS_ROOT, '.schema.json');

  for (const filePath of files) {
    const relative = path.relative(
      path.join(process.cwd(), 'schemas'),
      filePath,
    );
    let json;
    try {
      json = loadJson(filePath);
    } catch (error) {
      console.error(`Failed to parse ${relative}: ${error.message}`);
      process.exit(1);
    }
    const hash = hashObject(json);
    manifest.schemas[relative] = {
      hash,
      path: relative,
    };
    console.log(`✔ hashed ${relative}`);
  }

  writeJson(MANIFEST_PATH, manifest);
  console.log(`\nWrote manifest to ${MANIFEST_PATH}`);
}

main();
