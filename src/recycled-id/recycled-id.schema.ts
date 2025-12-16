import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
  RecycledIDNameSchema,
  RecycledIDShortNameSchema,
  createRecycledIDNameSchema,
  createRecycledIDShortNameSchema,
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
  name: RecycledIDNameSchema,
  short_name: RecycledIDShortNameSchema,
  attributes: RecycledIDAttributesSchema,
  data: RecycledIDDataSchema,
})
  .superRefine((record, ctx) => {
    const nameTokenIdRegex = /^RecycledID #(\d+)/;
    const nameTokenIdMatch = nameTokenIdRegex.exec(record.name);
    if (
      !nameTokenIdMatch ||
      nameTokenIdMatch[1] !== record.blockchain.token_id
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Name token_id must match blockchain.token_id: ${record.blockchain.token_id}`,
        path: ['name'],
      });
    }

    const shortNameTokenIdRegex = /^RecycledID #(\d+)/;
    const shortNameTokenIdMatch = shortNameTokenIdRegex.exec(record.short_name);
    if (
      !shortNameTokenIdMatch ||
      shortNameTokenIdMatch[1] !== record.blockchain.token_id
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Short name token_id must match blockchain.token_id: ${record.blockchain.token_id}`,
        path: ['short_name'],
      });
    }
    const nameSchema = createRecycledIDNameSchema(record.blockchain.token_id);
    const nameResult = nameSchema.safeParse(record.name);
    if (!nameResult.success) {
      ctx.addIssue({
        code: 'custom',
        message: nameResult.error.issues[0].message,
        path: ['name'],
      });
    }

    const shortNameSchema = createRecycledIDShortNameSchema(
      record.blockchain.token_id,
    );
    const shortNameResult = shortNameSchema.safeParse(record.short_name);
    if (!shortNameResult.success) {
      ctx.addIssue({
        code: 'custom',
        message: shortNameResult.error.issues[0].message,
        path: ['short_name'],
      });
    }
  })
  .meta(RecycledIDIpfsSchemaMeta);
export type RecycledIDIpfs = z.infer<typeof RecycledIDIpfsSchema>;
