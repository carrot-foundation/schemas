#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const SCHEMAS_DIR = path.join(process.cwd(), 'schemas');
const TARGET_EXTENSIONS = ['.schema.json', '.example.json'];

function collectFiles(dir, extensions, collected) {
  const results = collected ?? [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectFiles(fullPath, extensions, results);
      continue;
    }

    if (extensions.some((ext) => fullPath.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

function collectJsonSchemaRefs(rootJson) {
  const collectedRefs = [];
  const stack = [rootJson];

  while (stack.length > 0) {
    const node = stack.pop();

    if (!node || typeof node !== 'object') {
      continue;
    }

    if (typeof node.$ref === 'string') {
      collectedRefs.push(node.$ref);
    }

    for (const key of Object.keys(node)) {
      stack.push(node[key]);
    }
  }

  return collectedRefs;
}

function isHttpUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://');
}

function mapHttpSchemasUrlToLocalPath(url) {
  return path.resolve(
    url.replace(
      /^https?:\/\/.*\/schemas\//,
      path.join(process.cwd(), 'schemas/'),
    ),
  );
}

function resolveRefToLocalPath(reference, baseFilePath) {
  const filePart = reference.split('#')[0];

  if (!filePart) {
    return null;
  }

  if (isHttpUrl(filePart)) {
    return mapHttpSchemasUrlToLocalPath(filePart);
  }

  if (filePart.startsWith('file://')) {
    return filePart.slice('file://'.length);
  }

  if (path.isAbsolute(filePart)) {
    return filePart;
  }

  return path.resolve(path.dirname(baseFilePath), filePart);
}

async function main() {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`schemas directory not found at ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const filesToScan = collectFiles(SCHEMAS_DIR, TARGET_EXTENSIONS, []);

  let totalRefs = 0;
  const missing = [];

  for (const filePath of filesToScan) {
    let parsed;

    try {
      parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error(`Invalid JSON: ${filePath}: ${error.message}`);
      process.exitCode = 1;
      continue;
    }

    const refs = collectJsonSchemaRefs(parsed);
    totalRefs += refs.length;

    for (const ref of refs) {
      const localPath = resolveRefToLocalPath(ref, filePath);
      if (!localPath) {
        continue;
      }

      if (!fs.existsSync(localPath)) {
        missing.push({ file: filePath, ref, resolved: localPath });
      }
    }
  }

  if (missing.length > 0) {
    console.error(`Missing references (${missing.length}/${totalRefs}):`);

    for (const m of missing) {
      console.error(
        `- In ${m.file}: $ref ${m.ref} -> ${m.resolved} (NOT FOUND)`,
      );
    }

    process.exit(1);
  }

  console.log(`All references resolved (${totalRefs} total).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
