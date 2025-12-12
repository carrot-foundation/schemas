import { z } from 'zod';
import {
  NonNegativeFloatSchema,
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  OriginCityAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
  CertificateIssuanceDateAttributeSchema,
  NftAttributeSchema,
  createNumericAttributeSchema,
  GasTypeSchema,
} from '../shared';

const GasIDAttributeMethodologySchema = MethodologyAttributeSchema;
export type GasIDAttributeMethodology = z.infer<
  typeof GasIDAttributeMethodologySchema
>;

const GasIDAttributeGasTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Gas Type'),
  value: GasTypeSchema,
}).meta({
  title: 'Gas Type Attribute',
  description: 'Gas type attribute',
});
export type GasIDAttributeGasType = z.infer<typeof GasIDAttributeGasTypeSchema>;

const GasIDAttributeCo2ePreventedSchema = createNumericAttributeSchema({
  traitType: 'CO₂e Prevented (kg)',
  title: 'CO₂e Prevented',
  description: 'Total CO₂ equivalent emissions prevented in kilograms',
  valueSchema: NonNegativeFloatSchema,
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

const GasIDAttributeMassIDTokenIdSchema = MassIDTokenIdAttributeSchema;
export type GasIDAttributeMassIDTokenId = z.infer<
  typeof GasIDAttributeMassIDTokenIdSchema
>;

const GasIDAttributeMassIDRecyclingDateSchema =
  MassIDRecyclingDateAttributeSchema;
export type GasIDAttributeMassIDRecyclingDate = z.infer<
  typeof GasIDAttributeMassIDRecyclingDateSchema
>;

const GasIDAttributeCertificateIssuanceDateSchema =
  CertificateIssuanceDateAttributeSchema;
export type GasIDAttributeCertificateIssuanceDate = z.infer<
  typeof GasIDAttributeCertificateIssuanceDateSchema
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
    GasIDAttributeMassIDTokenIdSchema,
    GasIDAttributeMassIDRecyclingDateSchema,
    GasIDAttributeCertificateIssuanceDateSchema,
  ])
  .meta({
    title: 'GasID NFT Attribute Array',
    description:
      'Schema for the fixed set of GasID NFT attributes, enforcing order and type for each trait',
  });
export type GasIDAttributes = z.infer<typeof GasIDAttributesSchema>;
