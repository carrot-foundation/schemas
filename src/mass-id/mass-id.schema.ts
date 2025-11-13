import { z } from 'zod';
import { NftIpfsSchema } from '../shared/nft.schema';
import { MassIDDataSchema } from './mass-id.data.schema';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared/schema-version';
import { MassIDAttributesSchema } from './mass-id.attributes';

export const MassIDIpfsSchemaMeta = {
  title: 'MassID NFT IPFS Record',
  description:
    'Complete MassID NFT IPFS record including fixed attributes and detailed waste tracking data',
  $id: buildSchemaUrl('mass-id/mass-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const MassIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('MassID').meta({
      title: 'MassID Schema Type',
      description: 'MassID NFT schema type',
    }),
  }),
  attributes: MassIDAttributesSchema,
  data: MassIDDataSchema,
}).meta(MassIDIpfsSchemaMeta);

export type MassIDIpfs = z.infer<typeof MassIDIpfsSchema>;
