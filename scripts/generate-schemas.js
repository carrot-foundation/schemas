#!/usr/bin/env node

import { massIdIPFSSchema } from '../dist/mass-id/index.js';
import { toJSONSchema } from 'zod';
import { writeFileSync } from 'fs';

const schemas = [
  {
    fileName: 'mass-id.schema',
    schema: massIdIPFSSchema,
  },
];

for (const { fileName: schemaName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const fileName = `./schemas/${schemaName}.json`;
  console.log(jsonSchema.$id);
  writeFileSync(fileName, JSON.stringify(jsonSchema, null, 2));
  console.log(`Generated schema: ${fileName}`);
}
