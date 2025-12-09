import { z } from 'zod';
import { NftAttributeSchema } from './nft.schema';
import {
  NonEmptyStringSchema,
  WeightKgSchema,
  UnixTimestampSchema,
  WasteTypeSchema,
  MethodologyNameSchema,
  StringifiedTokenIdSchema,
  CountryNameSchema,
  MunicipalitySchema,
  CreditAmountSchema,
  CreditTypeSchema,
} from './definitions.schema';

export const MethodologyAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Methodology'),
  value: MethodologyNameSchema,
}).meta({
  title: 'Methodology Attribute',
  description: 'Methodology used for certification',
});
export type MethodologyAttribute = z.infer<typeof MethodologyAttributeSchema>;

export const CreditAmountAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Credit Amount'),
  value: CreditAmountSchema,
  display_type: z.literal('number'),
}).meta({
  title: 'Credit Amount Attribute',
  description: 'Credit amount attribute with numeric display',
});
export type CreditAmountAttribute = z.infer<typeof CreditAmountAttributeSchema>;

export const CreditTypeAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Credit Type'),
  value: CreditTypeSchema,
}).meta({
  title: 'Credit Type Attribute',
  description: 'Credit type attribute',
});
export type CreditTypeAttribute = z.infer<typeof CreditTypeAttributeSchema>;

export const SourceWasteTypeAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Source Waste Type Attribute',
  description: 'Source waste type attribute',
});
export type SourceWasteTypeAttribute = z.infer<
  typeof SourceWasteTypeAttributeSchema
>;

export const SourceWeightAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Source Weight (kg)'),
  value: WeightKgSchema.meta({
    title: 'Source Weight',
    description: 'Weight of the source waste in kilograms',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'Source Weight Attribute',
  description: 'Source weight attribute with numeric display',
});
export type SourceWeightAttribute = z.infer<typeof SourceWeightAttributeSchema>;

export const OriginCountryAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Origin Country'),
  value: CountryNameSchema,
}).meta({
  title: 'Origin Country Attribute',
  description: 'Origin country attribute',
});
export type OriginCountryAttribute = z.infer<
  typeof OriginCountryAttributeSchema
>;

export const OriginMunicipalityAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Origin Municipality'),
  value: MunicipalitySchema,
}).meta({
  title: 'Origin Municipality Attribute',
  description: 'Origin municipality attribute',
});
export type OriginMunicipalityAttribute = z.infer<
  typeof OriginMunicipalityAttributeSchema
>;

export const RecyclerAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycler'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Recycler',
    description: 'Organization that processed the waste',
    example: 'Eco Reciclagem',
  }),
}).meta({
  title: 'Recycler Attribute',
  description: 'Recycler attribute',
});
export type RecyclerAttribute = z.infer<typeof RecyclerAttributeSchema>;

export const MassIDTokenIdAttributeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('MassID'),
  value: StringifiedTokenIdSchema.meta({
    title: 'MassID Token ID',
    description: 'Token ID of the source MassID NFT as #<token_id>',
  }),
}).meta({
  title: 'MassID Token ID Attribute',
  description: 'MassID token ID attribute',
});
export type MassIDTokenIdAttribute = z.infer<
  typeof MassIDTokenIdAttributeSchema
>;

export const MassIDRecyclingDateAttributeSchema = NftAttributeSchema.omit({
  max_value: true,
})
  .extend({
    trait_type: z.literal('MassID Recycling Date'),
    value: UnixTimestampSchema.meta({
      title: 'MassID Recycling Date',
      description:
        'Unix timestamp in milliseconds when the source waste was recycled',
    }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'MassID Recycling Date Attribute',
    description:
      'MassID recycling date attribute using Unix timestamp in milliseconds',
  });
export type MassIDRecyclingDateAttribute = z.infer<
  typeof MassIDRecyclingDateAttributeSchema
>;
