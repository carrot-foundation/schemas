import { z } from 'zod';
import {
  WeightKgSchema,
  NftAttributeSchema,
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  OriginCountryAttributeSchema,
  OriginMunicipalityAttributeSchema,
  RecyclerAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
} from '../shared';

const RecycledIDAttributeMethodologySchema = MethodologyAttributeSchema;

export type RecycledIDAttributeMethodology = z.infer<
  typeof RecycledIDAttributeMethodologySchema
>;

const RecycledIDAttributeRecycledMassWeightSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Recycled Mass Weight (kg)'),
    value: WeightKgSchema.meta({
      title: 'Recycled Mass Weight',
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

const RecycledIDAttributeCreditAmountSchema = CreditAmountAttributeSchema;

export type RecycledIDAttributeCreditAmount = z.infer<
  typeof RecycledIDAttributeCreditAmountSchema
>;

const RecycledIDAttributeCreditTypeSchema = CreditTypeAttributeSchema;

export type RecycledIDAttributeCreditType = z.infer<
  typeof RecycledIDAttributeCreditTypeSchema
>;

const RecycledIDAttributeSourceWasteTypeSchema = SourceWasteTypeAttributeSchema;

export type RecycledIDAttributeSourceWasteType = z.infer<
  typeof RecycledIDAttributeSourceWasteTypeSchema
>;

const RecycledIDAttributeSourceWeightSchema = SourceWeightAttributeSchema;

export type RecycledIDAttributeSourceWeight = z.infer<
  typeof RecycledIDAttributeSourceWeightSchema
>;

const RecycledIDAttributeOriginCountrySchema = OriginCountryAttributeSchema;

export type RecycledIDAttributeOriginCountry = z.infer<
  typeof RecycledIDAttributeOriginCountrySchema
>;

const RecycledIDAttributeOriginMunicipalitySchema =
  OriginMunicipalityAttributeSchema;

export type RecycledIDAttributeOriginMunicipality = z.infer<
  typeof RecycledIDAttributeOriginMunicipalitySchema
>;

const RecycledIDAttributeRecyclerSchema = RecyclerAttributeSchema;

export type RecycledIDAttributeRecycler = z.infer<
  typeof RecycledIDAttributeRecyclerSchema
>;

const RecycledIDAttributeMassIDTokenIdSchema = MassIDTokenIdAttributeSchema;

export type RecycledIDAttributeMassIDTokenId = z.infer<
  typeof RecycledIDAttributeMassIDTokenIdSchema
>;

const RecycledIDAttributeMassIDRecyclingDateSchema =
  MassIDRecyclingDateAttributeSchema;

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
