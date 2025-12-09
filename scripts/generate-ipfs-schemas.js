#!/usr/bin/env node

import {
  CollectionSchema,
  CreditSchema,
  CreditPurchaseReceiptIpfsSchema,
  GasIDIpfsSchema,
  MassIDIpfsSchema,
  MassIDAuditSchema,
  MethodologySchema,
  RecycledIDIpfsSchema,
} from '../dist/index.js';
import { toJSONSchema } from 'zod';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function addItemsFalseForTuples(node) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      addItemsFalseForTuples(item);
    }
    return;
  }

  if (Array.isArray(node.prefixItems) && !('items' in node)) {
    node.items = false;
  }

  for (const value of Object.values(node)) {
    addItemsFalseForTuples(value);
  }
}

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
  {
    fileName: 'collection.schema',
    schema: CollectionSchema,
  },
  {
    fileName: 'credit.schema',
    schema: CreditSchema,
  },
  {
    fileName: 'methodology.schema',
    schema: MethodologySchema,
  },
  {
    fileName: 'mass-id-audit.schema',
    schema: MassIDAuditSchema,
  },
  {
    fileName: 'credit-purchase-receipt.schema',
    schema: CreditPurchaseReceiptIpfsSchema,
  },
];

function getFilePath(fullFileName) {
  const fileFolder = fullFileName.replace('.schema', '');
  return resolve('schemas', 'ipfs', `${fileFolder}`, `${fullFileName}.json`);
}

for (const { fileName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const filePath = getFilePath(fileName);

  addItemsFalseForTuples(jsonSchema);
  writeFileSync(filePath, JSON.stringify(jsonSchema, null, 2));

  console.log(`Generated schema: ${filePath}`);
}
