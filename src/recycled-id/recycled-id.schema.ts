import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
} from '../shared';
import { RecycledIDDataSchema } from './recycled-id.data.schema';
import { RecycledIDAttributesSchema } from './recycled-id.attributes';

export const RecycledIDIpfsSchemaMeta = {
  title: 'RecycledID NFT IPFS Record',
  description:
    'Complete RecycledID NFT IPFS record including fixed attributes and recycling outcome data',
  $id: buildSchemaUrl('recycled-id/recycled-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const RecycledIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('RecycledID').meta({
      title: 'RecycledID Schema Type',
      description: 'RecycledID NFT schema type',
    }),
  }),
  attributes: RecycledIDAttributesSchema,
  data: RecycledIDDataSchema,
}).meta(RecycledIDIpfsSchemaMeta);

export type RecycledIDIpfs = z.infer<typeof RecycledIDIpfsSchema>;
