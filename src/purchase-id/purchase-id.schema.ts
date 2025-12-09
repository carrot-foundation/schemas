import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
} from '../shared';
import { PurchaseIDDataSchema } from './purchase-id.data.schema';
import { PurchaseIDAttributesSchema } from './purchase-id.attributes';

export const PurchaseIDIpfsSchemaMeta = {
  title: 'PurchaseID NFT IPFS Record',
  description:
    'Complete PurchaseID NFT IPFS record including attributes and purchase receipt data',
  $id: buildSchemaUrl('purchase-id/purchase-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const PurchaseIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('PurchaseID').meta({
      title: 'PurchaseID Schema Type',
      description: 'PurchaseID NFT schema type',
    }),
  }),
  attributes: PurchaseIDAttributesSchema,
  data: PurchaseIDDataSchema,
}).meta(PurchaseIDIpfsSchemaMeta);

export type PurchaseIDIpfs = z.infer<typeof PurchaseIDIpfsSchema>;
