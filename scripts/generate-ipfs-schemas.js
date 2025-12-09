#!/usr/bin/env node

import {
  MassIDIpfsSchema,
  GasIDIpfsSchema,
  RecycledIDIpfsSchema,
} from '../dist/index.js';
import { toJSONSchema } from 'zod';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const schemas = [
  {
    fileName: 'mass-id.schema',
    schema: MassIDIpfsSchema,
  },
  {
    fileName: 'gas-id.schema',
    schema: GasIDIpfsSchema,
  },
  {
    fileName: 'recycled-id.schema',
    schema: RecycledIDIpfsSchema,
  },
];

function getFilePath(fullFileName) {
  const fileFolder = fullFileName.replace('.schema', '');
  return resolve('schemas', 'ipfs', `${fileFolder}`, `${fullFileName}.json`);
}

for (const { fileName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const filePath = getFilePath(fileName);

  writeFileSync(filePath, JSON.stringify(jsonSchema, null, 2));

  console.log(`Generated schema: ${filePath}`);
}
