#!/usr/bin/env node

import { MassIDIpfsSchema } from '../dist/mass-id/index.js';
import { toJSONSchema } from 'zod';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const schemas = [
  {
    fileName: 'mass-id.schema',
    schema: MassIDIpfsSchema,
  },
];

function getFilePath(fullFileName) {
  const fileFolder = fullFileName.split('.schema').join('');
  return resolve('schemas', 'ipfs', `${fileFolder}`, `${fullFileName}.json`);
}

for (const { fileName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const filePath = getFilePath(fileName);

  writeFileSync(filePath, JSON.stringify(jsonSchema, null, 2));

  console.log(`Generated schema: ${filePath}`);
}
