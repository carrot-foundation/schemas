import { z } from 'zod';
import {
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  WeightKgSchema,
  IsoDateSchema,
  WasteTypeSchema,
} from '../shared/definitions.schema';
import { NftAttributeSchema } from '../shared/nft.schema';

const RecycledIDAttributeMethodologySchema = NftAttributeSchema.extend({
  trait_type: z.literal('Methodology'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Methodology Value',
    description: 'Name of the recycling methodology used for certification',
    examples: ['BOLD Recycling'],
  }),
}).meta({
  title: 'Methodology Attribute',
  description: 'Methodology attribute',
});

export type RecycledIDAttributeMethodology = z.infer<
  typeof RecycledIDAttributeMethodologySchema
>;

const RecycledIDAttributeRecycledMassWeightSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycled Mass Weight (kg)'),
  value: WeightKgSchema.meta({
    title: 'Recycled Mass Weight Value',
    description: 'Total weight of recycled materials in kilograms',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'Recycled Mass Weight Attribute',
  description: 'Recycled mass weight attribute with numeric display',
});

export type RecycledIDAttributeRecycledMassWeight = z.infer<
  typeof RecycledIDAttributeRecycledMassWeightSchema
>;

const RecycledIDAttributeCreditAmountSchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeCreditAmount = z.infer<
  typeof RecycledIDAttributeCreditAmountSchema
>;

const RecycledIDAttributeCreditTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Credit Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Credit Type Value',
    description: 'Type of credit issued',
    examples: ['Carrot Organic'],
  }),
}).meta({
  title: 'Credit Type Attribute',
  description: 'Credit type attribute',
});

export type RecycledIDAttributeCreditType = z.infer<
  typeof RecycledIDAttributeCreditTypeSchema
>;

const RecycledIDAttributeSourceWasteTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Source Waste Type Attribute',
  description: 'Source waste type attribute',
});

export type RecycledIDAttributeSourceWasteType = z.infer<
  typeof RecycledIDAttributeSourceWasteTypeSchema
>;

const RecycledIDAttributeSourceWeightSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Weight (kg)'),
  value: WeightKgSchema,
  display_type: z.literal('number'),
}).meta({
  title: 'Source Weight Attribute',
  description: 'Source weight attribute with numeric display',
});

export type RecycledIDAttributeSourceWeight = z.infer<
  typeof RecycledIDAttributeSourceWeightSchema
>;

const RecycledIDAttributeOriginCountrySchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeOriginCountry = z.infer<
  typeof RecycledIDAttributeOriginCountrySchema
>;

const RecycledIDAttributeOriginMunicipalitySchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeOriginMunicipality = z.infer<
  typeof RecycledIDAttributeOriginMunicipalitySchema
>;

const RecycledIDAttributeRecyclerSchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeRecycler = z.infer<
  typeof RecycledIDAttributeRecyclerSchema
>;

const RecycledIDAttributeMassIDTokenIdSchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeMassIDTokenId = z.infer<
  typeof RecycledIDAttributeMassIDTokenIdSchema
>;

const RecycledIDAttributeMassIDRecyclingDateSchema = NftAttributeSchema.extend({
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

export type RecycledIDAttributeMassIDRecyclingDate = z.infer<
  typeof RecycledIDAttributeMassIDRecyclingDateSchema
>;

export const RecycledIDAttributesSchema = z
  .tuple([
    RecycledIDAttributeMethodologySchema,
    RecycledIDAttributeRecycledMassWeightSchema,
    RecycledIDAttributeCreditAmountSchema,
    RecycledIDAttributeCreditTypeSchema,
    RecycledIDAttributeSourceWasteTypeSchema,
    RecycledIDAttributeSourceWeightSchema,
    RecycledIDAttributeOriginCountrySchema,
    RecycledIDAttributeOriginMunicipalitySchema,
    RecycledIDAttributeRecyclerSchema,
    RecycledIDAttributeMassIDTokenIdSchema,
    RecycledIDAttributeMassIDRecyclingDateSchema,
  ])
  .meta({
    title: 'RecycledID NFT Attribute Array',
    description:
      'Schema for the fixed set of RecycledID NFT attributes, enforcing order and type for each trait',
  });

export type RecycledIDAttributes = z.infer<typeof RecycledIDAttributesSchema>;
