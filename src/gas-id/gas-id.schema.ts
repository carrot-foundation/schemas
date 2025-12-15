import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
} from '../shared';
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
  data: GasIDDataSchema,
})
  .superRefine((value, ctx) => {
    const attributesResult = GasIDAttributesSchema.safeParse(value.attributes);

    if (!attributesResult.success) {
      attributesResult.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['attributes', ...issue.path],
        });
      });
    }
  })
  .meta(GasIDIpfsSchemaMeta);
export type GasIDIpfs = z.infer<typeof GasIDIpfsSchema>;
