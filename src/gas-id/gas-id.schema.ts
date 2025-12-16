import { z } from 'zod';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
  createAttributeMap,
  validateAttributeValue,
  validateDateTimeAttribute,
  validateNumericAttributeValue,
  validateTokenIdInName,
  validateFormattedName,
  nearlyEqual,
  GasIDNameSchema,
  GasIDShortNameSchema,
  createGasIDNameSchema,
  createGasIDShortNameSchema,
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
  name: GasIDNameSchema,
  short_name: GasIDShortNameSchema,
  attributes: GasIDAttributesSchema,
  data: GasIDDataSchema,
})
  .superRefine((record, ctx) => {
    validateTokenIdInName({
      ctx,
      name: record.name,
      tokenId: record.blockchain.token_id,
      pattern: /^GasID #(\d+)/,
      path: ['name'],
    });

    validateTokenIdInName({
      ctx,
      name: record.short_name,
      tokenId: record.blockchain.token_id,
      pattern: /^GasID #(\d+)/,
      path: ['short_name'],
      message: `Short name token_id must match blockchain.token_id: ${record.blockchain.token_id}`,
    });

    const nameSchema = createGasIDNameSchema(record.blockchain.token_id);
    validateFormattedName({
      ctx,
      name: record.name,
      schema: nameSchema,
      path: ['name'],
    });

    const shortNameSchema = createGasIDShortNameSchema(
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

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Gas Type',
      expectedValue: data.summary.gas_type,
      missingMessage:
        'Gas Type attribute must be present and match data.summary.gas_type',
      mismatchMessage: 'Gas Type attribute must equal data.summary.gas_type',
    });

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'CO₂e Prevented (kg)',
      expectedValue: data.summary.prevented_co2e_kg,
      epsilon: 0.01,
      mismatchMessage:
        'CO₂e Prevented (kg) attribute must equal data.summary.prevented_co2e_kg',
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

    // MassID Recycling Date: Use GasID issuance date as the source (GasID is issued when recycling is complete)
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

    const resultValue = data.prevented_emissions_calculation.values.find(
      (value) => value.reference === 'R',
    );

    if (!resultValue) {
      ctx.addIssue({
        code: 'custom',
        message:
          'prevented_emissions_calculation.values must include a value with reference "R"',
        path: ['data', 'prevented_emissions_calculation', 'values'],
      });
    } else if (
      !nearlyEqual(resultValue.value, data.summary.prevented_co2e_kg, 0.01)
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'prevented_emissions_calculation.values R value must match summary.prevented_co2e_kg',
        path: ['data', 'prevented_emissions_calculation', 'values'],
      });
    }
  })
  .meta(GasIDIpfsSchemaMeta);
export type GasIDIpfs = z.infer<typeof GasIDIpfsSchema>;
