#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import type { SchemaManifest } from './utils/schema-types.js';
import { loadJson } from './utils/fs-utils.js';

const MANIFEST_PATH = path.join(process.cwd(), 'schemas', 'schema-hashes.json');
const OUTPUT_PATH = path.join(
  process.cwd(),
  'src',
  'generated',
  'schema-hashes.ts',
);

function extractSchemaType(manifestKey: string): string {
  const match = manifestKey.match(/^ipfs\/([^/]+)\//);
  if (!match) {
    throw new Error(`Unexpected manifest key format: ${manifestKey}`);
  }
  return match[1];
}

function main(): void {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found: ${MANIFEST_PATH}`);
    console.error('Run "pnpm hash-schemas" first.');
    process.exit(1);
  }

  const manifest = loadJson<SchemaManifest>(MANIFEST_PATH);
  const entries = Object.entries(manifest.schemas)
    .map(([key, value]) => ({
      type: extractSchemaType(key),
      hash: value.hash,
    }))
    .sort((a, b) => a.type.localeCompare(b.type));

  const lines = [
    '// AUTO-GENERATED — do not edit manually. Run: pnpm generate-hash-constants',
    '',
    'export const SCHEMA_HASHES = {',
    ...entries.map((entry) => `  '${entry.type}': '${entry.hash}',`),
    '} as const;',
    '',
  ];

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'));
  console.log(
    `Wrote schema hash constants to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
  );
}

main();
