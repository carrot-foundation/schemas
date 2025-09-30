#!/usr/bin/env node

import { massIDIpfsSchema } from '../dist/mass-id/index.js';
import { toJSONSchema } from 'zod';
import { writeFileSync } from 'node:fs';

const schemas = [
  {
    fileName: 'mass-id.schema',
    schema: massIDIpfsSchema,
  },
];

for (const { fileName: schemaName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const fileName = `./schemas/${schemaName}.json`;
  writeFileSync(fileName, JSON.stringify(jsonSchema, null, 2));
  console.log(`Generated schema: ${fileName}`);
}
