import { z } from 'zod';
import { NftAttributeSchema } from './nft.schema';
import {
  WasteTypeSchema,
  MethodologyNameSchema,
  StringifiedTokenIdSchema,
  CitySchema,
  CreditAmountSchema,
  CreditTypeSchema,
  IsoCountrySubdivisionCodeSchema,
} from '../primitives';
import {
  createDateAttributeSchema,
  createWeightAttributeSchema,
  createNumericAttributeSchema,
} from './attributes.helpers';

export const MethodologyAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Methodology'),
  value: MethodologyNameSchema,
}).meta({
  title: 'Methodology Attribute',
  description: 'Methodology used for certification',
});
export type MethodologyAttribute = z.infer<typeof MethodologyAttributeSchema>;

export const CreditAmountAttributeSchema = createNumericAttributeSchema({
  traitType: 'Credit Amount',
  title: 'Credit Amount',
  description: 'Credit amount',
  valueSchema: CreditAmountSchema,
});
export type CreditAmountAttribute = z.infer<typeof CreditAmountAttributeSchema>;

export const CreditTypeAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Credit Type'),
  value: CreditTypeSchema,
}).meta({
  title: 'Credit Type Attribute',
  description: 'Credit type attribute',
});
export type CreditTypeAttribute = z.infer<typeof CreditTypeAttributeSchema>;

export const SourceWasteTypeAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Source Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Source Waste Type Attribute',
  description: 'Source waste type attribute',
});
export type SourceWasteTypeAttribute = z.infer<
  typeof SourceWasteTypeAttributeSchema
>;

export const SourceWeightAttributeSchema = createWeightAttributeSchema({
  traitType: 'Source Weight (kg)',
  title: 'Source Weight',
  description: 'Weight of the source waste in kilograms',
});
export type SourceWeightAttribute = z.infer<typeof SourceWeightAttributeSchema>;

export const MassIDTokenIdAttributeSchema = NftAttributeSchema.safeExtend({
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

export const MassIDRecyclingDateAttributeSchema = createDateAttributeSchema({
  traitType: 'MassID Recycling Date',
  title: 'MassID Recycling Date',
  description:
    'Unix timestamp in milliseconds when the source waste was recycled',
});
export type MassIDRecyclingDateAttribute = z.infer<
  typeof MassIDRecyclingDateAttributeSchema
>;

export const CertificateIssuanceDateAttributeSchema = createDateAttributeSchema(
  {
    traitType: 'Certificate Issuance Date',
    title: 'Certificate Issuance Date',
    description:
      'Unix timestamp in milliseconds when the certificate was issued',
  },
);
export type CertificateIssuanceDateAttribute = z.infer<
  typeof CertificateIssuanceDateAttributeSchema
>;

export const OriginCityAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Origin City'),
  value: CitySchema,
}).meta({
  title: 'Origin City Attribute',
  description:
    'City or municipality where waste was originally generated and picked up',
});
export type OriginCityAttribute = z.infer<typeof OriginCityAttributeSchema>;

export const OriginCountrySubdivisionAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Origin Country Subdivision'),
    value: IsoCountrySubdivisionCodeSchema,
  }).meta({
    title: 'Origin Country Subdivision Attribute',
    description:
      'ISO 3166-2 country subdivision code where waste was originally generated and picked up',
  });
export type OriginCountrySubdivisionAttribute = z.infer<
  typeof OriginCountrySubdivisionAttributeSchema
>;
