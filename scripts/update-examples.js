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

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas');
const EXAMPLES_ROOT = path.join(SCHEMAS_ROOT, 'ipfs');
const MANIFEST_PATH = path.join(SCHEMAS_ROOT, 'schema-hashes.json');

function findSchemaPathForExample(examplePath) {
  const dir = path.dirname(examplePath);
  const base = path.basename(examplePath, '.example.json');
  return path.join(dir, `${base}.schema.json`);
}

function computeContentHash(exampleData) {
  const clone = structuredClone(exampleData);
  delete clone.content_hash;
  delete clone.original_content_hash;
  return hashObject(clone);
}

function main() {
  const distEntry = path.join(process.cwd(), 'dist', 'index.js');
  if (!fs.existsSync(distEntry)) {
    console.error(
      `Compiled entry not found at ${distEntry}. Run "pnpm build" first.`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(EXAMPLES_ROOT)) {
    console.error(`Examples root not found: ${EXAMPLES_ROOT}`);
    process.exit(1);
  }

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(
      `Schema hash manifest not found at ${MANIFEST_PATH}. Run pnpm hash-schemas first.`,
    );
    process.exit(1);
  }

  const manifest = loadJson(MANIFEST_PATH);
  const version = getVersion();
  const examples = collectJsonFiles(EXAMPLES_ROOT, '.example.json');

  for (const examplePath of examples) {
    const schemaPath = findSchemaPathForExample(examplePath);
    const schemaKey = path.relative(SCHEMAS_ROOT, schemaPath);
    const manifestEntry = manifest.schemas[schemaKey];
    const schemaJson = loadJson(schemaPath);

    if (!manifestEntry) {
      console.error(
        `No manifest entry for schema ${schemaKey}. Did you run pnpm hash-schemas?`,
      );
      process.exit(1);
    }

    const exampleJson = loadJson(examplePath);
    const hasOriginalContentHash =
      schemaJson?.properties &&
      'original_content_hash' in schemaJson.properties;

    if (schemaJson?.$id) {
      exampleJson.$schema = schemaJson.$id;
    }

    exampleJson.schema ??= {};
    exampleJson.schema.version = version;
    exampleJson.schema.hash = manifestEntry.hash;

    const contentHash = computeContentHash(exampleJson);
    exampleJson.content_hash = contentHash;
    if (hasOriginalContentHash) {
      exampleJson.original_content_hash = contentHash;
    } else {
      delete exampleJson.original_content_hash;
    }

    writeJson(examplePath, exampleJson);
    console.log(`Updated example ${path.relative(process.cwd(), examplePath)}`);
  }

  console.log(
    '\nExamples updated with schema hashes, versions, and content hashes.',
  );
}

main();
