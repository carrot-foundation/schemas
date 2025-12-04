import { z } from 'zod';
import {
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  WeightKgSchema,
  IsoDateSchema,
  WasteTypeSchema,
} from '../shared/definitions.schema';
import { NftAttributeSchema } from '../shared/nft.schema';

const GasIDAttributeMethodologySchema = NftAttributeSchema.extend({
  trait_type: z.literal('Methodology'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Methodology Value',
    description: 'Name of the carbon methodology used for certification',
    examples: ['BOLD Carbon (CH₄)'],
  }),
}).meta({
  title: 'Methodology Attribute',
  description: 'Methodology attribute',
});

export type GasIDAttributeMethodology = z.infer<
  typeof GasIDAttributeMethodologySchema
>;

const GasIDAttributeGasTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Gas Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Gas Type Value',
    description: 'Type of gas prevented',
    examples: ['Methane (CH₄)', 'Carbon Dioxide (CO₂)'],
  }),
}).meta({
  title: 'Gas Type Attribute',
  description: 'Gas type attribute',
});

export type GasIDAttributeGasType = z.infer<typeof GasIDAttributeGasTypeSchema>;

const GasIDAttributeCo2ePreventedSchema = NftAttributeSchema.extend({
  trait_type: z.literal('CO₂e Prevented (kg)'),
  value: NonNegativeFloatSchema.meta({
    title: 'CO₂e Prevented Value',
    description: 'Total CO₂ equivalent emissions prevented in kilograms',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'CO₂e Prevented Attribute',
  description: 'CO₂e prevented attribute with numeric display',
});

export type GasIDAttributeCo2ePrevented = z.infer<
  typeof GasIDAttributeCo2ePreventedSchema
>;

const GasIDAttributeCreditAmountSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Credit Amount'),
  value: NonNegativeFloatSchema.meta({
    title: 'Credit Amount Value',
    description: 'Amount of credits issued',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'Credit Amount Attribute',
  description: 'Credit amount attribute with numeric display',
});

export type GasIDAttributeCreditAmount = z.infer<
  typeof GasIDAttributeCreditAmountSchema
>;

const GasIDAttributeCreditTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Credit Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Credit Type Value',
    description: 'Type of credit issued',
    examples: ['Carrot Carbon'],
  }),
}).meta({
  title: 'Credit Type Attribute',
  description: 'Credit type attribute',
});

export type GasIDAttributeCreditType = z.infer<
  typeof GasIDAttributeCreditTypeSchema
>;

const GasIDAttributeSourceWasteTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Source Waste Type Attribute',
  description: 'Source waste type attribute',
});

export type GasIDAttributeSourceWasteType = z.infer<
  typeof GasIDAttributeSourceWasteTypeSchema
>;

const GasIDAttributeSourceWeightSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Weight (kg)'),
  value: WeightKgSchema,
  display_type: z.literal('number'),
}).meta({
  title: 'Source Weight Attribute',
  description: 'Source weight attribute with numeric display',
});

export type GasIDAttributeSourceWeight = z.infer<
  typeof GasIDAttributeSourceWeightSchema
>;

const GasIDAttributeOriginCountrySchema = NftAttributeSchema.extend({
  trait_type: z.literal('Origin Country'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Origin Country Value',
    description: 'Country where the waste was generated',
    examples: ['Brazil'],
  }),
}).meta({
  title: 'Origin Country Attribute',
  description: 'Origin country attribute',
});

export type GasIDAttributeOriginCountry = z.infer<
  typeof GasIDAttributeOriginCountrySchema
>;

const GasIDAttributeOriginMunicipalitySchema = NftAttributeSchema.extend({
  trait_type: z.literal('Origin Municipality'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Origin Municipality Value',
    description: 'Municipality where the waste was generated',
    examples: ['Macapá'],
  }),
}).meta({
  title: 'Origin Municipality Attribute',
  description: 'Origin municipality attribute',
});

export type GasIDAttributeOriginMunicipality = z.infer<
  typeof GasIDAttributeOriginMunicipalitySchema
>;

const GasIDAttributeRecyclerSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycler'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Recycler Value',
    description: 'Organization that processed the waste',
    examples: ['Eco Reciclagem'],
  }),
}).meta({
  title: 'Recycler Attribute',
  description: 'Recycler attribute',
});

export type GasIDAttributeRecycler = z.infer<
  typeof GasIDAttributeRecyclerSchema
>;

const GasIDAttributeMassIDTokenIdSchema = NftAttributeSchema.extend({
  trait_type: z.literal('MassID'),
  value: NonEmptyStringSchema.regex(
    /^#[0-9]+$/,
    'Must match pattern #<token_id>',
  ).meta({
    title: 'MassID Token ID Value',
    description: 'Token ID of the source MassID NFT',
    examples: ['#123'],
  }),
}).meta({
  title: 'MassID Token ID Attribute',
  description: 'MassID token ID attribute',
});

export type GasIDAttributeMassIDTokenId = z.infer<
  typeof GasIDAttributeMassIDTokenIdSchema
>;

const GasIDAttributeMassIDRecyclingDateSchema = NftAttributeSchema.extend({
  trait_type: z.literal('MassID Recycling Date'),
  value: IsoDateSchema.meta({
    title: 'MassID Recycling Date Value',
    description: 'Date when the source waste was recycled',
    examples: ['2025-02-22'],
  }),
  display_type: z.literal('date'),
}).meta({
  title: 'MassID Recycling Date Attribute',
  description: 'MassID recycling date attribute with date display',
});

export type GasIDAttributeMassIDRecyclingDate = z.infer<
  typeof GasIDAttributeMassIDRecyclingDateSchema
>;

export const GasIDAttributesSchema = z
  .tuple([
    GasIDAttributeMethodologySchema,
    GasIDAttributeGasTypeSchema,
    GasIDAttributeCo2ePreventedSchema,
    GasIDAttributeCreditAmountSchema,
    GasIDAttributeCreditTypeSchema,
    GasIDAttributeSourceWasteTypeSchema,
    GasIDAttributeSourceWeightSchema,
    GasIDAttributeOriginCountrySchema,
    GasIDAttributeOriginMunicipalitySchema,
    GasIDAttributeRecyclerSchema,
    GasIDAttributeMassIDTokenIdSchema,
    GasIDAttributeMassIDRecyclingDateSchema,
  ])
  .meta({
    title: 'GasID NFT Attribute Array',
    description:
      'Schema for the fixed set of GasID NFT attributes, enforcing order and type for each trait',
  });

export type GasIDAttributes = z.infer<typeof GasIDAttributesSchema>;
