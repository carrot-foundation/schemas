import { z } from 'zod';
import {
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  OriginCityAttributeSchema,
  RecyclerAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
  createWeightAttributeSchema,
} from '../shared';

const RecycledIDAttributeMethodologySchema = MethodologyAttributeSchema;

export type RecycledIDAttributeMethodology = z.infer<
  typeof RecycledIDAttributeMethodologySchema
>;

const RecycledIDAttributeRecycledMassWeightSchema = createWeightAttributeSchema(
  {
    traitType: 'Recycled Mass Weight (kg)',
    title: 'Recycled Mass Weight',
    description: 'Total weight of recycled materials in kilograms',
  },
);

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

const RecycledIDAttributeOriginCitySchema = OriginCityAttributeSchema;

export type RecycledIDAttributeOriginCity = z.infer<
  typeof RecycledIDAttributeOriginCitySchema
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
    RecycledIDAttributeOriginCitySchema,
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
