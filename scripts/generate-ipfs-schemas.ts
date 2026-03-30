#!/usr/bin/env node

import type { ZodType } from 'zod';

import {
  CollectionSchema,
  CreditSchema,
  CreditPurchaseReceiptIpfsSchema,
  CreditRetirementReceiptIpfsSchema,
  GasIDIpfsSchema,
  MassIDIpfsSchema,
  MassIDAuditSchema,
  MethodologySchema,
  RecycledIDIpfsSchema,
} from '../src/index.js';
import { toJSONSchema } from 'zod';
import { resolve } from 'node:path';
import { writeJson } from './utils/fs-utils.js';

interface JsonSchemaNode {
  prefixItems?: unknown[];
  items?: unknown;
  [key: string]: unknown;
}

function addItemsFalseForTuples(node: unknown): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      addItemsFalseForTuples(item);
    }
    return;
  }

  const obj = node as JsonSchemaNode;

  if (Array.isArray(obj.prefixItems) && !('items' in obj)) {
    obj.items = false;
  }

  for (const value of Object.values(obj)) {
    addItemsFalseForTuples(value);
  }
}

const schemas: ReadonlyArray<{ fileName: string; schema: ZodType }> = [
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
  {
    fileName: 'credit-retirement-receipt.schema',
    schema: CreditRetirementReceiptIpfsSchema,
  },
];

function getFilePath(fullFileName: string): string {
  const fileFolder = fullFileName.replace('.schema', '');
  return resolve('schemas', 'ipfs', `${fileFolder}`, `${fullFileName}.json`);
}

for (const { fileName, schema } of schemas) {
  const jsonSchema = toJSONSchema(schema);
  const filePath = getFilePath(fileName);

  addItemsFalseForTuples(jsonSchema);
  writeJson(filePath, jsonSchema);

  console.log(`Generated schema: ${filePath}`);
}
