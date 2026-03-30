#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { hashObject } from '../src/index.js';
import {
  collectJsonFiles,
  getErrorMessage,
  getVersion,
  loadJson,
  writeJson,
} from './utils/fs-utils.js';

interface SchemaManifest {
  version: string;
  schemas: Record<string, { hash: string; path: string }>;
}

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas', 'ipfs');
const MANIFEST_PATH = path.join(process.cwd(), 'schemas', 'schema-hashes.json');

function main(): void {
  if (!fs.existsSync(SCHEMAS_ROOT)) {
    console.error(`Schemas root not found: ${SCHEMAS_ROOT}`);
    process.exit(1);
  }

  const version = getVersion();
  const manifest: SchemaManifest = { version, schemas: {} };
  const files = collectJsonFiles(SCHEMAS_ROOT, '.schema.json');

  for (const filePath of files) {
    const relative = path.relative(
      path.join(process.cwd(), 'schemas'),
      filePath,
    );
    let json: Record<string, unknown>;
    try {
      json = loadJson<Record<string, unknown>>(filePath);
    } catch (error) {
      console.error(`Failed to parse ${relative}: ${getErrorMessage(error)}`);
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
