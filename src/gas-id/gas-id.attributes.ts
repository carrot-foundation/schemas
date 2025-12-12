import { z } from 'zod';
import {
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  OriginCityAttributeSchema,
  RecyclerAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
  NftAttributeSchema,
} from '../shared';

const GasIDAttributeMethodologySchema = MethodologyAttributeSchema;

export type GasIDAttributeMethodology = z.infer<
  typeof GasIDAttributeMethodologySchema
>;

const GasIDAttributeGasTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Gas Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Gas Type',
    description: 'Type of gas prevented',
    examples: ['Methane (CH₄)', 'Carbon Dioxide (CO₂)'],
  }),
}).meta({
  title: 'Gas Type Attribute',
  description: 'Gas type attribute',
});

export type GasIDAttributeGasType = z.infer<typeof GasIDAttributeGasTypeSchema>;

const GasIDAttributeCo2ePreventedSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('CO₂e Prevented (kg)'),
  value: NonNegativeFloatSchema.meta({
    title: 'CO₂e Prevented',
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

const GasIDAttributeCreditAmountSchema = CreditAmountAttributeSchema;

export type GasIDAttributeCreditAmount = z.infer<
  typeof GasIDAttributeCreditAmountSchema
>;

const GasIDAttributeCreditTypeSchema = CreditTypeAttributeSchema;

export type GasIDAttributeCreditType = z.infer<
  typeof GasIDAttributeCreditTypeSchema
>;

const GasIDAttributeSourceWasteTypeSchema = SourceWasteTypeAttributeSchema;

export type GasIDAttributeSourceWasteType = z.infer<
  typeof GasIDAttributeSourceWasteTypeSchema
>;

const GasIDAttributeSourceWeightSchema = SourceWeightAttributeSchema;

export type GasIDAttributeSourceWeight = z.infer<
  typeof GasIDAttributeSourceWeightSchema
>;

const GasIDAttributeOriginCitySchema = OriginCityAttributeSchema;

export type GasIDAttributeOriginCity = z.infer<
  typeof GasIDAttributeOriginCitySchema
>;

const GasIDAttributeRecyclerSchema = RecyclerAttributeSchema;

export type GasIDAttributeRecycler = z.infer<
  typeof GasIDAttributeRecyclerSchema
>;

const GasIDAttributeMassIDTokenIdSchema = MassIDTokenIdAttributeSchema;

export type GasIDAttributeMassIDTokenId = z.infer<
  typeof GasIDAttributeMassIDTokenIdSchema
>;

const GasIDAttributeMassIDRecyclingDateSchema =
  MassIDRecyclingDateAttributeSchema;

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
    GasIDAttributeOriginCitySchema,
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
