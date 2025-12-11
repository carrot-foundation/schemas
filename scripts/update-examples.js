#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { hashObject } from '../dist/index.js';

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas');
const EXAMPLES_ROOT = path.join(SCHEMAS_ROOT, 'ipfs');
const MANIFEST_PATH = path.join(SCHEMAS_ROOT, 'schema-hashes.json');

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(
      `Schema hash manifest not found at ${MANIFEST_PATH}. Run pnpm hash-schemas first.`,
    );
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function collectExampleFiles(rootDir) {
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
      if (entry.isFile() && entry.name.endsWith('.example.json')) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
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
  if (!fs.existsSync(EXAMPLES_ROOT)) {
    console.error(`Examples root not found: ${EXAMPLES_ROOT}`);
    process.exit(1);
  }

  const manifest = readManifest();
  const version = getVersion();
  const examples = collectExampleFiles(EXAMPLES_ROOT);

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

    exampleJson.schema = {
      ...(exampleJson.schema ?? {}),
      version,
      hash: manifestEntry.hash,
    };

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
