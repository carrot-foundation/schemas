import { z } from 'zod';
import { nftIpfsSchema } from '../shared/nft.schema.js';
import { massIDDataSchema } from './mass-id.data.schema.js';
import {
  wasteType,
  wasteSubtype,
  weightKg,
} from '../shared/definitions.schema.js';

const attributeWasteType = z
  .strictObject({
    trait_type: z.literal('Waste Type'),
    value: wasteType,
  })
  .describe('Waste type attribute')
  .meta({
    title: 'Waste Type Attribute',
    examples: [
      {
        trait_type: 'Waste Type',
        value: 'Organic',
      },
    ],
  });

const attributeWasteSubtype = z
  .strictObject({
    trait_type: z.literal('Waste Subtype'),
    value: wasteSubtype,
  })
  .describe('Waste subtype attribute')
  .meta({
    title: 'Waste Subtype Attribute',
    examples: [
      {
        trait_type: 'Waste Subtype',
        value: 'Food, Food Waste and Beverages',
      },
    ],
  });

const attributeWeight = z
  .strictObject({
    trait_type: z.literal('Weight (kg)'),
    value: weightKg,
    display_type: z.literal('number'),
  })
  .describe('Weight attribute with numeric display')
  .meta({
    title: 'Weight Attribute',
    examples: [
      {
        trait_type: 'Weight (kg)',
        value: 3000,
        display_type: 'number',
      },
    ],
  });

const attributeOriginCountry = z
  .strictObject({
    trait_type: z.literal('Origin Country'),
    value: z
      .string()
      .max(100)
      .describe('Country where the waste was generated')
      .meta({
        title: 'Origin Country Value',
        examples: ['Brazil', 'United States', 'Germany'],
      }),
  })
  .describe('Origin country attribute')
  .meta({
    title: 'Origin Country Attribute',
    examples: [
      {
        trait_type: 'Origin Country',
        value: 'Brazil',
      },
    ],
  });

const attributeOriginMunicipality = z
  .strictObject({
    trait_type: z.literal('Origin Municipality'),
    value: z
      .string()
      .max(100)
      .describe('Municipality where the waste was generated')
      .meta({
        title: 'Origin Municipality Value',
        examples: ['Macapá', 'São Paulo', 'Rio de Janeiro'],
      }),
  })
  .describe('Origin municipality attribute')
  .meta({
    title: 'Origin Municipality Attribute',
    examples: [
      {
        trait_type: 'Origin Municipality',
        value: 'Macapá',
      },
    ],
  });

const attributeOriginDivision = z
  .strictObject({
    trait_type: z.literal('Origin Administrative Division'),
    value: z
      .string()
      .max(100)
      .describe(
        'Administrative division (state/province) where the waste was generated',
      )
      .meta({
        title: 'Origin Division Value',
        examples: ['Amapá', 'São Paulo', 'California'],
      }),
  })
  .describe('Origin administrative division attribute')
  .meta({
    title: 'Origin Administrative Division Attribute',
    examples: [
      {
        trait_type: 'Origin Administrative Division',
        value: 'Amapá',
      },
    ],
  });

const attributeRecycler = z
  .strictObject({
    trait_type: z.literal('Recycler'),
    value: z
      .string()
      .max(100)
      .describe('Organization that processed the waste')
      .meta({
        title: 'Recycler Value',
        examples: ['Eco Reciclagem', 'Green Solutions Ltd', 'RecycleCorp'],
      }),
  })
  .describe('Recycler attribute')
  .meta({
    title: 'Recycler Attribute',
    examples: [
      {
        trait_type: 'Recycler',
        value: 'Eco Reciclagem',
      },
    ],
  });

const attributeIntegrator = z
  .strictObject({
    trait_type: z.literal('Integrator'),
    value: z
      .string()
      .max(100)
      .describe(
        'Organization that integrated the waste into the Carrot network',
      )
      .meta({
        title: 'Integrator Value',
        examples: ['Carrot Foundation', 'EcoTech Partners', 'Green Network'],
      }),
  })
  .describe('Integrator attribute')
  .meta({
    title: 'Integrator Attribute',
    examples: [
      {
        trait_type: 'Integrator',
        value: 'Carrot Foundation',
      },
    ],
  });

const attributePickupDate = z
  .strictObject({
    trait_type: z.literal('Pick-up Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .describe('Date when the waste was picked up from the source')
      .meta({
        title: 'Pick-up Date Value',
        examples: ['2024-12-05', '2024-11-15', '2024-10-20'],
      }),
    display_type: z.literal('date'),
  })
  .describe('Pick-up date attribute')
  .meta({
    title: 'Pick-up Date Attribute',
    examples: [
      {
        trait_type: 'Pick-up Date',
        value: '2024-12-05',
        display_type: 'date',
      },
    ],
  });

const attributeRecyclingDate = z
  .strictObject({
    trait_type: z.literal('Recycling Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .describe('Date when the waste was recycled/processed')
      .meta({
        title: 'Recycling Date Value',
        examples: ['2025-02-22', '2024-12-20', '2024-11-30'],
      }),
    display_type: z.literal('date'),
  })
  .describe('Recycling date attribute')
  .meta({
    title: 'Recycling Date Attribute',
    examples: [
      {
        trait_type: 'Recycling Date',
        value: '2025-02-22',
        display_type: 'date',
      },
    ],
  });

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
  .describe('Fixed set of MassID NFT attributes in required order')
  .meta({
    title: 'MassID Attributes',
    examples: [
      [
        { trait_type: 'Waste Type', value: 'Organic' },
        {
          trait_type: 'Waste Subtype',
          value: 'Food, Food Waste and Beverages',
        },
        { trait_type: 'Weight (kg)', value: 3000, display_type: 'number' },
        { trait_type: 'Origin Country', value: 'Brazil' },
        { trait_type: 'Origin Municipality', value: 'Macapá' },
        { trait_type: 'Origin Administrative Division', value: 'Amapá' },
        { trait_type: 'Recycler', value: 'Eco Reciclagem' },
        { trait_type: 'Integrator', value: 'Carrot Foundation' },
        {
          trait_type: 'Pick-up Date',
          value: '2024-12-05',
          display_type: 'date',
        },
        {
          trait_type: 'Recycling Date',
          value: '2025-02-22',
          display_type: 'date',
        },
      ],
    ],
  });

export const massIDIpfsSchema = nftIpfsSchema
  .safeExtend({
    schema: nftIpfsSchema.shape.schema.safeExtend({
      type: z
        .literal('MassID')
        .describe('MassID NFT schema type')
        .meta({
          title: 'MassID Schema Type',
          examples: ['MassID'],
        }),
    }),

    attributes: massIDAttributes
      .describe(
        'Fixed set of MassID NFT attributes enforcing order and type for each trait',
      )
      .meta({
        title: 'MassID NFT Attributes',
        examples: [
          [
            { trait_type: 'Waste Type', value: 'Organic' },
            {
              trait_type: 'Waste Subtype',
              value: 'Food, Food Waste and Beverages',
            },
            { trait_type: 'Weight (kg)', value: 3000, display_type: 'number' },
            { trait_type: 'Origin Country', value: 'Brazil' },
            { trait_type: 'Origin Municipality', value: 'Macapá' },
            { trait_type: 'Origin Administrative Division', value: 'Amapá' },
            { trait_type: 'Recycler', value: 'Eco Reciclagem' },
            { trait_type: 'Integrator', value: 'Carrot Foundation' },
            {
              trait_type: 'Pick-up Date',
              value: '2024-12-05',
              display_type: 'date',
            },
            {
              trait_type: 'Recycling Date',
              value: '2025-02-22',
              display_type: 'date',
            },
          ],
        ],
      })
      .check(z.minLength(10), z.maxLength(10)),

    data: massIDDataSchema
      .describe(
        'MassID-specific data containing waste tracking and chain of custody information',
      )
      .meta({
        title: 'MassID Data',
        examples: [
          {
            waste_classification: {
              primary_type: 'Organic',
              subtype: 'Food, Food Waste and Beverages',
              measurement_unit: 'kg',
              net_weight: 3000,
              contamination_level: 'Low',
            },
            locations: [
              {
                id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
                municipality: 'Macapá',
                administrative_division: 'Amapá',
                administrative_division_code: 'BR-AP',
                country: 'Brazil',
                country_code: 'BR',
                facility_type: 'Waste Generation',
                coordinates: {
                  latitude: -0.02,
                  longitude: -51.06,
                  precision_level: 'city',
                },
                responsible_participant_id:
                  '6f520d88-864d-432d-bf9f-5c3166c4818f',
              },
            ],
            participants: [
              {
                id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
                name: 'Enlatados Produção',
                roles: ['Waste Generator'],
              },
            ],
            chain_of_custody: {
              events: [
                {
                  event_id: '8f799606-4ed5-49ce-8310-83b0c56ac01e',
                  event_name: 'Pick-up',
                  description:
                    'Waste picked up by hauler Eco Reciclagem at Enlatados Produção',
                  timestamp: '2024-12-05T11:02:47.000Z',
                  participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
                  location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
                },
              ],
              total_distance_km: 45.2,
              total_duration_hours: 72.5,
            },
            geographic_data: {
              origin_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
              processing_location_ids: ['d01217a9-9d21-4f16-8908-0fea6750953e'],
              final_destination_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
              transport_routes: [
                {
                  from_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
                  to_location_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
                  distance_km: 45.2,
                  transport_method: 'Truck',
                  duration_hours: 72.5,
                },
              ],
            },
          },
        ],
      }),
  })
  .describe('Complete MassID NFT Ipfs record')
  .meta({
    title: 'MassID IPFS Record',
    examples: [
      {
        $schema:
          'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
        schema: {
          hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
          type: 'MassID',
          version: '0.1.0',
        },
        environment: {
          blockchain_network: 'testnet',
          deployment: 'development',
          data_set_name: 'TEST',
        },
        blockchain: {
          token_id: '123',
          smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
          chain_id: 1,
          network_name: 'Polygon',
        },
        created_at: '2024-12-05T11:02:47.000Z',
        external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        external_url:
          'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        name: 'MassID #123 • Organic • 3.0t',
        short_name: 'MassID #123',
        description:
          'This MassID represents 3 metric tons of organic food waste from Enlatados Produção, tracked through complete chain of custody from generation to composting.',
        image:
          'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
        background_color: '#2D5A27',
        external_links: [
          {
            label: 'Carrot Explorer',
            url: 'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
            description: 'Complete chain of custody and audit trail',
          },
        ],
        attributes: [
          { trait_type: 'Waste Type', value: 'Organic' },
          {
            trait_type: 'Waste Subtype',
            value: 'Food, Food Waste and Beverages',
          },
          { trait_type: 'Weight (kg)', value: 3000, display_type: 'number' },
          { trait_type: 'Origin Country', value: 'Brazil' },
          { trait_type: 'Origin Municipality', value: 'Macapá' },
          { trait_type: 'Origin Administrative Division', value: 'Amapá' },
          { trait_type: 'Recycler', value: 'Eco Reciclagem' },
          { trait_type: 'Integrator', value: 'Carrot Foundation' },
          {
            trait_type: 'Pick-up Date',
            value: '2024-12-05',
            display_type: 'date',
          },
          {
            trait_type: 'Recycling Date',
            value: '2025-02-22',
            display_type: 'date',
          },
        ],
        original_content_hash:
          '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
        content_hash:
          '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
      },
    ],
  })
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
