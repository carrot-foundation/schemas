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
  data: RecycledIDDataSchema,
})
  .superRefine((value, ctx) => {
    const attributesResult = RecycledIDAttributesSchema.safeParse(
      value.attributes,
    );

    if (!attributesResult.success) {
      attributesResult.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['attributes', ...issue.path],
        });
      });
    }
  })
  .meta(RecycledIDIpfsSchemaMeta);
export type RecycledIDIpfs = z.infer<typeof RecycledIDIpfsSchema>;
