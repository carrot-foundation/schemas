import { z } from 'zod';
import { NftIpfsSchema } from '../shared/nft.schema';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared/schema-version';
import { GasIDDataSchema } from './gas-id.data.schema';
import { GasIDAttributesSchema } from './gas-id.attributes';

export const GasIDIpfsSchemaMeta = {
  title: 'GasID NFT IPFS Record',
  description:
    'Complete GasID NFT IPFS record including fixed attributes and detailed carbon emissions prevention data',
  $id: buildSchemaUrl('gas-id/gas-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const GasIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('GasID').meta({
      title: 'GasID Schema Type',
      description: 'GasID NFT schema type',
    }),
  }),
  attributes: GasIDAttributesSchema,
  data: GasIDDataSchema,
}).meta(GasIDIpfsSchemaMeta);

export type GasIDIpfs = z.infer<typeof GasIDIpfsSchema>;
