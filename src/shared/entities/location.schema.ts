import { z } from 'zod';
import {
  UuidSchema,
  NonEmptyStringSchema,
  LatitudeSchema,
  LongitudeSchema,
  IsoCountryCodeSchema,
  IsoAdministrativeDivisionCodeSchema,
  FacilityTypeSchema,
} from '../definitions.schema.js';

const PrecisionLevelSchema = z
  .enum(['exact', 'neighborhood', 'city', 'region', 'country'])
  .meta({
    title: 'Precision Level',
    description: 'Level of coordinate precision',
    examples: ['city', 'exact', 'neighborhood'],
  });

export const CoordinatesSchema = z
  .strictObject({
    latitude: LatitudeSchema.meta({
      title: 'Latitude',
      description: 'GPS latitude coordinate',
    }),
    longitude: LongitudeSchema.meta({
      title: 'Longitude',
      description: 'GPS longitude coordinate',
    }),
    precision_level: PrecisionLevelSchema,
  })
  .meta({
    title: 'Coordinates',
    description: 'GPS coordinates of the location',
  });

export const LocationSchema = z
  .strictObject({
    id: UuidSchema.meta({
      title: 'Location ID',
      description: 'Unique identifier for the location',
    }),
    municipality: NonEmptyStringSchema.max(50).meta({
      title: 'Municipality',
      description: 'Municipality or city name',
    }),
    administrative_division: NonEmptyStringSchema.max(50).meta({
      title: 'Administrative Division',
      description: 'State, province, or administrative region',
    }),
    administrative_division_code: IsoAdministrativeDivisionCodeSchema.meta({
      title: 'Administrative Division Code',
      description: 'ISO 3166-2 administrative division code',
    }),
    country: NonEmptyStringSchema.max(50).meta({
      title: 'Country',
      description: 'Full country name in English',
    }),
    country_code: IsoCountryCodeSchema.meta({
      title: 'Country Code',
      description: 'ISO 3166-1 alpha-2 country code',
    }),
    responsible_participant_id: UuidSchema.meta({
      title: 'Responsible Participant ID',
      description: 'ID of the participant responsible for this location',
    }),
    coordinates: CoordinatesSchema,
    facility_type: FacilityTypeSchema.meta({
      title: 'Facility Type',
      description: 'Type of facility at this location',
    }),
  })
  .meta({
    title: 'Location',
    description: 'Geographic location with address and coordinate information',
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

export type LocationSchemaType = z.infer<typeof LocationSchema>;
export type CoordinatesType = z.infer<typeof CoordinatesSchema>;
export type PrecisionLevelType = z.infer<typeof PrecisionLevelSchema>;
