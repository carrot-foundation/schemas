import { z } from 'zod';
import {
  UuidSchema,
  NonEmptyStringSchema,
  LatitudeSchema,
  LongitudeSchema,
  IsoCountryCodeSchema,
  IsoAdministrativeDivisionCodeSchema,
  FacilityTypeSchema,
} from '../definitions.schema';

const PrecisionLevelSchema = z
  .enum(['exact', 'neighborhood', 'city', 'region', 'country'])
  .meta({
    title: 'Precision Level',
    description: 'Level of coordinate precision',
    examples: ['city', 'exact', 'neighborhood'],
  });

export type PrecisionLevel = z.infer<typeof PrecisionLevelSchema>;

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
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z
  .strictObject({
    id: UuidSchema.meta({
      title: 'Location ID',
      description: 'Unique identifier for the location',
    }),
    municipality: NonEmptyStringSchema.max(50).meta({
      title: 'Municipality',
      description: 'Municipality or city name',
      examples: ['New York', 'São Paulo', 'London', 'Tokyo'],
    }),
    administrative_division: NonEmptyStringSchema.max(50).meta({
      title: 'Administrative Division',
      description: 'State, province, or administrative region',
      examples: ['California', 'Ontario', 'Bavaria', 'Queensland'],
    }),
    administrative_division_code:
      IsoAdministrativeDivisionCodeSchema.optional().meta({
        title: 'Administrative Division Code',
        description: 'ISO 3166-2 administrative division code',
      }),
    country: NonEmptyStringSchema.max(50).meta({
      title: 'Country',
      description: 'Full country name in English',
      examples: ['United States', 'Canada', 'Germany', 'Australia'],
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
    facility_type: FacilityTypeSchema.optional().meta({
      title: 'Facility Type',
      description: 'Type of facility at this location',
    }),
  })
  .meta({
    title: 'Location',
    description: 'Geographic location with address and coordinate information',
  });

export type Location = z.infer<typeof LocationSchema>;
