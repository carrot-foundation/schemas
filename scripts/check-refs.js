#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function walk(dir, acc, exts) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, acc, exts);
    } else if (exts.some((ext) => full.endsWith(ext))) {
      acc.push(full);
    }
  }
}

function findRefs(json) {
  const refs = [];
  const stack = [json];
  while (stack.length) {
    const node = stack.pop();
    if (node && typeof node === 'object') {
      if (typeof node.$ref === 'string') refs.push(node.$ref);
      for (const key of Object.keys(node)) {
        stack.push(node[key]);
      }
    }
  }
  return refs;
}

function toLocalPath(ref, baseFile) {
  const filePart = ref.split('#')[0];
  if (!filePart) return null;

  if (filePart.startsWith('http://') || filePart.startsWith('https://')) {
    return path.resolve(
      filePart.replace(/^https?:\/\/.*\/schemas\//, path.join(process.cwd(), 'schemas/') ),
    );
  }

  if (filePart.startsWith('file://')) {
    return filePart.replace('file://', '');
  }

  if (filePart.startsWith('./') || filePart.startsWith('../') || !filePart.includes(':/')) {
    return path.resolve(path.dirname(baseFile), filePart);
  }

  return null;
}

async function main() {
  const root = path.join(process.cwd(), 'schemas');
  if (!fs.existsSync(root)) {
    console.error(`schemas directory not found at ${root}`);
    process.exit(1);
  }

  const files = [];
  walk(root, files, ['.schema.json', '.example.json']);

  let totalRefs = 0;
  let missing = [];

  for (const file of files) {
    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.error(`Invalid JSON: ${file}: ${e.message}`);
      process.exitCode = 1;
      continue;
    }

    const refs = findRefs(json);
    totalRefs += refs.length;

    for (const ref of refs) {
      const local = toLocalPath(ref, file);
      if (!local) continue;
      if (!fs.existsSync(local)) {
        missing.push({ file, ref, resolved: local });
      }
    }
  }

  if (missing.length > 0) {
    console.error(`Missing references (${missing.length}/${totalRefs}):`);
    for (const m of missing) {
      console.error(`- In ${m.file}: $ref ${m.ref} -> ${m.resolved} (NOT FOUND)`);
    }
    process.exit(1);
  } else {
    console.log(`All references resolved (${totalRefs} total).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});