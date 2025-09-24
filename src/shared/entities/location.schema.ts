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
  .describe('Level of coordinate precision');

export const coordinates = z
  .object({
    latitude: latitude.describe('GPS latitude coordinate'),
    longitude: longitude.describe('GPS longitude coordinate'),
    precision_level: precisionLevel.describe('Level of coordinate precision'),
  })
  .strict()
  .describe('GPS coordinates of the location');

export const locationSchema = z
  .object({
    id: uuid.describe('Unique identifier for the location'),
    municipality: nonEmptyString.max(50).describe('Municipality or city name'),
    administrative_division: nonEmptyString
      .max(50)
      .describe('State, province, or administrative region'),
    administrative_division_code: isoAdministrativeDivisionCode.describe(
      'ISO 3166-2 administrative division code',
    ),
    country: nonEmptyString.max(50).describe('Full country name in English'),
    country_code: isoCountryCode.describe('ISO 3166-1 alpha-2 country code'),
    responsible_participant_id: uuid.describe(
      'ID of the participant responsible for this location',
    ),
    coordinates: coordinates,
    facility_type: facilityType.describe('Type of facility at a location'),
  })
  .strict()
  .describe('Geographic location with address and coordinate information');

export type LocationSchema = z.infer<typeof locationSchema>;
export type Coordinates = z.infer<typeof coordinates>;
export type PrecisionLevel = z.infer<typeof precisionLevel>;
