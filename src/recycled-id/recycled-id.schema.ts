import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
  RecycledIDNameSchema,
  RecycledIDShortNameSchema,
  createRecycledIDNameSchema,
  createRecycledIDShortNameSchema,
  createAttributeMap,
  validateAttributeValue,
  validateDateTimeAttribute,
  validateNumericAttributeValue,
  validateTokenIdInName,
  validateFormattedName,
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
    validateTokenIdInName({
      ctx,
      name: record.name,
      tokenId: record.blockchain.token_id,
      pattern: /^RecycledID #(\d+)/,
      path: ['name'],
    });

    validateTokenIdInName({
      ctx,
      name: record.short_name,
      tokenId: record.blockchain.token_id,
      pattern: /^RecycledID #(\d+)/,
      path: ['short_name'],
      message: `Short name token_id must match blockchain.token_id: ${record.blockchain.token_id}`,
    });

    const nameSchema = createRecycledIDNameSchema(record.blockchain.token_id);
    validateFormattedName({
      ctx,
      name: record.name,
      schema: nameSchema,
      path: ['name'],
    });

    const shortNameSchema = createRecycledIDShortNameSchema(
      record.blockchain.token_id,
    );
    validateFormattedName({
      ctx,
      name: record.short_name,
      schema: shortNameSchema,
      path: ['short_name'],
    });

    const { data, attributes } = record;
    const attributeByTraitType = createAttributeMap(attributes);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Methodology',
      expectedValue: data.methodology.name,
      missingMessage:
        'Methodology attribute must be present and match data.methodology.name',
      mismatchMessage: 'Methodology attribute must equal data.methodology.name',
    });

    // Recycled Weight uses nearlyEqual for floating-point comparison
    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Recycled Weight (kg)',
      expectedValue: data.summary.recycled_mass_kg,
      epsilon: 0.01,
      missingMessage:
        'Recycled Weight (kg) attribute must be present and match data.summary.recycled_mass_kg',
      mismatchMessage:
        'Recycled Weight (kg) attribute must equal data.summary.recycled_mass_kg',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Credit Amount',
      expectedValue: data.summary.credit_amount,
      missingMessage:
        'Credit Amount attribute must be present and match data.summary.credit_amount',
      mismatchMessage:
        'Credit Amount attribute must equal data.summary.credit_amount',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Credit Type',
      expectedValue: data.summary.credit_type,
      missingMessage:
        'Credit Type attribute must be present and match data.summary.credit_type',
      mismatchMessage:
        'Credit Type attribute must equal data.summary.credit_type',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Source Waste Type',
      expectedValue: data.waste_properties.type,
      missingMessage:
        'Source Waste Type attribute must be present and match data.waste_properties.type',
      mismatchMessage:
        'Source Waste Type attribute must equal data.waste_properties.type',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Source Weight (kg)',
      expectedValue: data.waste_properties.net_weight_kg,
      missingMessage:
        'Source Weight (kg) attribute must be present and match data.waste_properties.net_weight_kg',
      mismatchMessage:
        'Source Weight (kg) attribute must equal data.waste_properties.net_weight_kg',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Origin City',
      expectedValue: data.origin_location.city,
      missingMessage:
        'Origin City attribute must be present and match data.origin_location.city',
      mismatchMessage:
        'Origin City attribute must equal data.origin_location.city',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'MassID',
      expectedValue: `#${data.mass_id.token_id}`,
      missingMessage:
        'MassID attribute must be present and match data.mass_id.token_id as #<token_id>',
      mismatchMessage:
        'MassID attribute must equal data.mass_id.token_id as #<token_id>',
    });

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'MassID Recycling Date',
      dateTimeValue: data.summary.issued_at,
      missingMessage:
        'MassID Recycling Date attribute must be present and match data.summary.issued_at',
      invalidDateMessage:
        'data.summary.issued_at must be a valid ISO 8601 date-time string',
      mismatchMessage:
        'MassID Recycling Date attribute must equal data.summary.issued_at as a Unix timestamp in milliseconds',
    });

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Certificate Issuance Date',
      dateTimeValue: data.summary.issued_at,
      missingMessage:
        'Certificate Issuance Date attribute must be present and match data.summary.issued_at',
      invalidDateMessage:
        'data.summary.issued_at must be a valid ISO 8601 date-time string',
      mismatchMessage:
        'Certificate Issuance Date attribute must equal data.summary.issued_at as a Unix timestamp in milliseconds',
    });
  })
  .meta(RecycledIDIpfsSchemaMeta);
export type RecycledIDIpfs = z.infer<typeof RecycledIDIpfsSchema>;
