import { z } from 'zod';
import {
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  OriginCityAttributeSchema,
  OriginCountrySubdivisionAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
  CertificateIssuanceDateAttributeSchema,
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

const RecycledIDAttributeOriginCountrySubdivisionSchema =
  OriginCountrySubdivisionAttributeSchema;
export type RecycledIDAttributeOriginCountrySubdivision = z.infer<
  typeof RecycledIDAttributeOriginCountrySubdivisionSchema
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

const RecycledIDAttributeCertificateIssuanceDateSchema =
  CertificateIssuanceDateAttributeSchema;
export type RecycledIDAttributeCertificateIssuanceDate = z.infer<
  typeof RecycledIDAttributeCertificateIssuanceDateSchema
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
    RecycledIDAttributeOriginCountrySubdivisionSchema,
    RecycledIDAttributeMassIDTokenIdSchema,
    RecycledIDAttributeMassIDRecyclingDateSchema,
    RecycledIDAttributeCertificateIssuanceDateSchema,
  ])
  .meta({
    title: 'RecycledID NFT Attribute Array',
    description:
      'Schema for the fixed set of RecycledID NFT attributes, enforcing order and type for each trait.\n\n' +
      'Required attributes (11, in order): Methodology, Recycled Mass Weight (kg), Credit Amount, ' +
      'Credit Type, Source Waste Type, Source Weight (kg), Origin City, Origin Country Subdivision, MassID, MassID Recycling Date, ' +
      'Certificate Issuance Date.',
  });
export type RecycledIDAttributes = z.infer<typeof RecycledIDAttributesSchema>;
