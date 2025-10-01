import { z } from 'zod';
import {
  uuid,
  nonEmptyString,
  latitude,
  longitude,
  isoCountryCode,
  isoAdministrativeDivisionCode,
  facilityType,
} from '../definitions.schema.js';

const precisionLevel = z
  .enum(['exact', 'neighborhood', 'city', 'region', 'country'])
  .describe('Level of coordinate precision')
  .meta({
    title: 'Precision Level',
    examples: ['city', 'exact', 'neighborhood'],
  });

export const coordinates = z
  .strictObject({
    latitude: latitude.describe('GPS latitude coordinate').meta({
      title: 'Latitude',
      examples: [-0.02, -20.38, 40.7128],
    }),
    longitude: longitude.describe('GPS longitude coordinate').meta({
      title: 'Longitude',
      examples: [-51.06, -40.34, -74.006],
    }),
    precision_level: precisionLevel.describe('Level of coordinate precision'),
  })
  .describe('GPS coordinates of the location')
  .meta({
    title: 'Coordinates',
    examples: [
      {
        latitude: -0.02,
        longitude: -51.06,
        precision_level: 'city',
      },
      {
        latitude: -20.38,
        longitude: -40.34,
        precision_level: 'city',
      },
    ],
  });

export const locationSchema = z
  .strictObject({
    id: uuid.describe('Unique identifier for the location').meta({
      title: 'Location ID',
      examples: [
        'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
        'd01217a9-9d21-4f16-8908-0fea6750953e',
      ],
    }),
    municipality: nonEmptyString
      .max(50)
      .describe('Municipality or city name')
      .meta({
        title: 'Municipality',
        examples: ['Macapá', 'Cariacica', 'São Paulo'],
      }),
    administrative_division: nonEmptyString
      .max(50)
      .describe('State, province, or administrative region')
      .meta({
        title: 'Administrative Division',
        examples: ['Amapá', 'Espirito Santo', 'São Paulo'],
      }),
    administrative_division_code: isoAdministrativeDivisionCode
      .describe('ISO 3166-2 administrative division code')
      .meta({
        title: 'Administrative Division Code',
        examples: ['BR-AP', 'BR-ES', 'BR-SP'],
      }),
    country: nonEmptyString
      .max(50)
      .describe('Full country name in English')
      .meta({
        title: 'Country',
        examples: ['Brazil', 'United States', 'Germany'],
      }),
    country_code: isoCountryCode
      .describe('ISO 3166-1 alpha-2 country code')
      .meta({
        title: 'Country Code',
        examples: ['BR', 'US', 'DE'],
      }),
    responsible_participant_id: uuid
      .describe('ID of the participant responsible for this location')
      .meta({
        title: 'Responsible Participant ID',
        examples: [
          '6f520d88-864d-432d-bf9f-5c3166c4818f',
          '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
        ],
      }),
    coordinates: coordinates,
    facility_type: facilityType
      .describe('Type of facility at a location')
      .meta({
        title: 'Facility Type',
        examples: [
          'Waste Generation',
          'Recycling Facility',
          'Collection Point',
        ],
      }),
  })
  .describe('Geographic location with address and coordinate information')
  .meta({
    title: 'Location',
    examples: [
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
        responsible_participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
      },
      {
        id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
        municipality: 'Cariacica',
        administrative_division: 'Espirito Santo',
        administrative_division_code: 'BR-ES',
        country: 'Brazil',
        country_code: 'BR',
        facility_type: 'Recycling Facility',
        coordinates: {
          latitude: -20.38,
          longitude: -40.34,
          precision_level: 'city',
        },
        responsible_participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
      },
    ],
  });

export type LocationSchema = z.infer<typeof locationSchema>;
export type Coordinates = z.infer<typeof coordinates>;
export type PrecisionLevel = z.infer<typeof precisionLevel>;
