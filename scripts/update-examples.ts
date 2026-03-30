#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { hashObject } from '../src/index.js';
import { emitters } from './example-content/index.js';
import {
  collectJsonFiles,
  getVersion,
  loadJson,
  writeJson,
} from './utils/fs-utils.js';

interface SchemaManifest {
  schemas: Record<string, { hash: string; path: string }>;
}

interface JsonSchema {
  $id?: string;
  properties?: Record<string, unknown>;
}

const SCHEMAS_ROOT = path.join(process.cwd(), 'schemas');
const EXAMPLES_ROOT = path.join(SCHEMAS_ROOT, 'ipfs');
const MANIFEST_PATH = path.join(SCHEMAS_ROOT, 'schema-hashes.json');

function findSchemaPathForExample(examplePath: string): string {
  const dir = path.dirname(examplePath);
  const base = path.basename(examplePath, '.example.json');
  return path.join(dir, `${base}.schema.json`);
}

function computeContentHash(exampleData: Record<string, unknown>): string {
  const clone = structuredClone(exampleData);
  delete clone.content_hash;
  delete clone.audit_data_hash;
  return hashObject(clone);
}

function main(): void {
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

  const manifest = loadJson<SchemaManifest>(MANIFEST_PATH);
  const version = getVersion();
  const examples = collectJsonFiles(EXAMPLES_ROOT, '.example.json');

  for (const examplePath of examples) {
    const schemaPath = findSchemaPathForExample(examplePath);
    const schemaKey = path.relative(SCHEMAS_ROOT, schemaPath);
    const manifestEntry = manifest.schemas[schemaKey];
    const schemaJson = loadJson<JsonSchema>(schemaPath);

    if (!manifestEntry) {
      console.error(
        `No manifest entry for schema ${schemaKey}. Did you run pnpm hash-schemas?`,
      );
      process.exit(1);
    }

    // If an emitter exists for this schema type, generate base content first
    const typeName = path.basename(path.dirname(examplePath));
    const emitter = emitters[typeName as keyof typeof emitters];
    if (emitter) {
      let emitterResult: unknown;
      try {
        emitterResult = emitter();
      } catch (error) {
        console.error(
          `Emitter for schema type "${typeName}" failed while generating ${path.relative(process.cwd(), examplePath)}:`,
        );
        console.error(error);
        process.exit(1);
      }

      if (!emitterResult || typeof emitterResult !== 'object') {
        console.error(
          `Emitter for schema type "${typeName}" returned an invalid result ` +
            `(${typeof emitterResult}). Emitters must return a non-null object.`,
        );
        process.exit(1);
      }

      try {
        writeJson(examplePath, emitterResult);
      } catch (error) {
        console.error(
          `Failed to write emitter output for "${typeName}" to ${path.relative(process.cwd(), examplePath)}:`,
        );
        console.error(error);
        process.exit(1);
      }
    } else {
      console.error(
        `Error: No emitter registered for schema type "${typeName}". ` +
          `Register an emitter in scripts/example-content/index.ts for ` +
          `${path.relative(process.cwd(), examplePath)}.`,
      );
      process.exit(1);
    }

    const exampleJson = loadJson<Record<string, unknown>>(examplePath);
    const hasContentHash =
      schemaJson?.properties && 'content_hash' in schemaJson.properties;
    const hasAuditDataHash =
      schemaJson?.properties && 'audit_data_hash' in schemaJson.properties;

    if (schemaJson?.$id) {
      exampleJson.$schema = schemaJson.$id;
    }

    const schema = (exampleJson.schema ?? {}) as Record<string, unknown>;
    exampleJson.schema = schema;
    schema.version = version;
    schema.hash = manifestEntry.hash;

    const contentHash = computeContentHash(exampleJson);
    if (hasContentHash) {
      exampleJson.content_hash = contentHash;
    } else {
      delete exampleJson.content_hash;
    }
    if (hasAuditDataHash) {
      exampleJson.audit_data_hash = contentHash;
    } else {
      delete exampleJson.audit_data_hash;
    }

    writeJson(examplePath, exampleJson);
    console.log(`Updated example ${path.relative(process.cwd(), examplePath)}`);
  }

  console.log(
    '\nExamples updated with schema hashes, versions, and content hashes.',
  );
}

main();
