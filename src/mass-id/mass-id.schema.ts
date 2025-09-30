import { z } from 'zod';
import { nftIpfsSchema } from '../shared/nft.schema.js';
import { massIDDataSchema } from './mass-id.data.schema.js';
import {
  wasteType,
  wasteSubtype,
  weightKg,
} from '../shared/definitions.schema.js';

const attributeWasteType = z
  .object({
    trait_type: z.literal('Waste Type'),
    value: wasteType,
  })
  .strict()
  .describe('Waste type attribute');

const attributeWasteSubtype = z
  .object({
    trait_type: z.literal('Waste Subtype'),
    value: wasteSubtype,
  })
  .strict()
  .describe('Waste subtype attribute');

const attributeWeight = z
  .object({
    trait_type: z.literal('Weight (kg)'),
    value: weightKg,
    display_type: z.literal('number'),
  })
  .strict()
  .describe('Weight attribute with numeric display');

const attributeOriginCountry = z
  .object({
    trait_type: z.literal('Origin Country'),
    value: z
      .string()
      .max(100)
      .describe('Country where the waste was generated'),
  })
  .strict()
  .describe('Origin country attribute');

const attributeOriginMunicipality = z
  .object({
    trait_type: z.literal('Origin Municipality'),
    value: z
      .string()
      .max(100)
      .describe('Municipality where the waste was generated'),
  })
  .strict()
  .describe('Origin municipality attribute');

const attributeOriginDivision = z
  .object({
    trait_type: z.literal('Origin Administrative Division'),
    value: z
      .string()
      .max(100)
      .describe(
        'Administrative division (state/province) where the waste was generated',
      ),
  })
  .strict()
  .describe('Origin administrative division attribute');

const attributeRecycler = z
  .object({
    trait_type: z.literal('Recycler'),
    value: z
      .string()
      .max(100)
      .describe('Organization that processed the waste'),
  })
  .strict()
  .describe('Recycler attribute');

const attributeIntegrator = z
  .object({
    trait_type: z.literal('Integrator'),
    value: z
      .string()
      .max(100)
      .describe(
        'Organization that integrated the waste into the Carrot network',
      ),
  })
  .strict()
  .describe('Integrator attribute');

const attributePickupDate = z
  .object({
    trait_type: z.literal('Pick-up Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .describe('Date when the waste was picked up from the source'),
    display_type: z.literal('date'),
  })
  .strict()
  .describe('Pick-up date attribute');

const attributeRecyclingDate = z
  .object({
    trait_type: z.literal('Recycling Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .describe('Date when the waste was recycled/processed'),
    display_type: z.literal('date'),
  })
  .strict()
  .describe('Recycling date attribute');

const massIDAttributes = z
  .tuple([
    attributeWasteType,
    attributeWasteSubtype,
    attributeWeight,
    attributeOriginCountry,
    attributeOriginMunicipality,
    attributeOriginDivision,
    attributeRecycler,
    attributeIntegrator,
    attributePickupDate,
    attributeRecyclingDate,
  ])
  .describe('Fixed set of MassID NFT attributes in required order');

export const massIDIpfsSchema = nftIpfsSchema
  .safeExtend({
    schema: nftIpfsSchema.shape.schema.safeExtend({
      type: z.literal('MassID').describe('MassID NFT schema type'),
    }),

    attributes: massIDAttributes
      .describe(
        'Fixed set of MassID NFT attributes enforcing order and type for each trait',
      )
      .check(z.minLength(10), z.maxLength(10)),

    data: massIDDataSchema.describe(
      'MassID-specific data containing waste tracking and chain of custody information',
    ),
  })
  .describe('Complete MassID NFT Ipfs record')
  .refine((data) => {
    const { net_weight, measurement_unit } = data.data.waste_classification;
    const normalizedKg =
      measurement_unit === 'ton' ? net_weight * 1000 : net_weight;
    const attributeWeightKg = data.attributes[2].value;
    return Math.abs(attributeWeightKg - normalizedKg) < 1e-6;
  }, 'Weight in attributes must match net_weight in waste classification data')
  .refine((data) => {
    const attributeWasteType = data.attributes[0].value;
    const dataWasteType = data.data.waste_classification.primary_type;
    return attributeWasteType === dataWasteType;
  }, 'Waste type in attributes must match primary_type in waste classification data')
  .refine((data) => {
    const attributeWasteSubtype = data.attributes[1].value;
    const dataWasteSubtype = data.data.waste_classification.subtype;
    return attributeWasteSubtype === dataWasteSubtype;
  }, 'Waste subtype in attributes must match subtype in waste classification data')
  .refine((data) => {
    const attributeOriginCountry = data.attributes[3].value;
    const originLocationId = data.data.geographic_data.origin_location_id;
    const originLocation = data.data.locations.find(
      (loc) => loc.id === originLocationId,
    );
    return originLocation
      ? attributeOriginCountry === originLocation.country
      : false;
  }, 'Origin country in attributes must match the country of the origin location in data')
  .refine((data) => {
    const attributeOriginMunicipality = data.attributes[4].value;
    const originLocationId = data.data.geographic_data.origin_location_id;
    const originLocation = data.data.locations.find(
      (loc) => loc.id === originLocationId,
    );
    return originLocation
      ? attributeOriginMunicipality === originLocation.municipality
      : false;
  }, 'Origin municipality in attributes must match the municipality of the origin location in data')
  .refine((data) => {
    const attributeOriginDivision = data.attributes[5].value;
    const originLocationId = data.data.geographic_data.origin_location_id;
    const originLocation = data.data.locations.find(
      (loc) => loc.id === originLocationId,
    );
    return originLocation
      ? attributeOriginDivision === originLocation.administrative_division
      : false;
  }, 'Origin administrative division in attributes must match the administrative division of the origin location in data')
  .meta({
    title: 'MassID NFT IPFS Record',
    description:
      'Complete MassID NFT IPFS record including fixed attributes and detailed waste tracking data',
    $id: 'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
    version: '1.0.0',
  });

export type MassIDIpfsSchema = z.infer<typeof massIDIpfsSchema>;
export type MassIDAttributes = z.infer<typeof massIDAttributes>;
export type AttributeWasteType = z.infer<typeof attributeWasteType>;
export type AttributeWasteSubtype = z.infer<typeof attributeWasteSubtype>;
export type AttributeWeight = z.infer<typeof attributeWeight>;
export type AttributeOriginCountry = z.infer<typeof attributeOriginCountry>;
export type AttributeOriginMunicipality = z.infer<
  typeof attributeOriginMunicipality
>;
export type AttributeOriginDivision = z.infer<typeof attributeOriginDivision>;
export type AttributeRecycler = z.infer<typeof attributeRecycler>;
export type AttributeIntegrator = z.infer<typeof attributeIntegrator>;
export type AttributePickupDate = z.infer<typeof attributePickupDate>;
export type AttributeRecyclingDate = z.infer<typeof attributeRecyclingDate>;
