import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
} from '../shared';
import { GasIDDataSchema } from './gas-id.data.schema';
import { GasIDAttributesSchema } from './gas-id.attributes';
import {
  GasIDNameSchema,
  GasIDShortNameSchema,
  createGasIDNameSchema,
  createGasIDShortNameSchema,
} from '../shared';

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
  name: GasIDNameSchema,
  short_name: GasIDShortNameSchema,
  attributes: GasIDAttributesSchema,
  data: GasIDDataSchema,
})
  .superRefine((record, ctx) => {
    const nameTokenIdRegex = /^GasID #(\d+)/;
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

    const shortNameTokenIdRegex = /^GasID #(\d+)/;
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
    const nameSchema = createGasIDNameSchema(record.blockchain.token_id);
    const nameResult = nameSchema.safeParse(record.name);
    if (!nameResult.success) {
      ctx.addIssue({
        code: 'custom',
        message: nameResult.error.issues[0].message,
        path: ['name'],
      });
    }

    const shortNameSchema = createGasIDShortNameSchema(
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
  .meta(GasIDIpfsSchemaMeta);
export type GasIDIpfs = z.infer<typeof GasIDIpfsSchema>;
