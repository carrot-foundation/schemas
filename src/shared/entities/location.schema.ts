import { z } from 'zod';
import {
  Sha256HashSchema,
  LatitudeSchema,
  LongitudeSchema,
  IsoCountryCodeSchema,
  IsoAdministrativeDivisionCodeSchema,
  MunicipalitySchema,
  AdministrativeDivisionSchema,
  CountryNameSchema,
} from '../definitions.schema';

const PrecisionLevelSchema = z
  .enum(['exact', 'neighborhood', 'city', 'region', 'country'])
  .meta({
    title: 'Coordinate Precision Level',
    description: 'Level of coordinate precision',
    examples: ['city', 'exact', 'neighborhood'],
  });

export type PrecisionLevel = z.infer<typeof PrecisionLevelSchema>;

export const CoordinatesSchema = z
  .strictObject({
    latitude: LatitudeSchema,
    longitude: LongitudeSchema,
    precision_level: PrecisionLevelSchema,
  })
  .meta({
    title: 'Coordinates',
    description: 'GPS coordinates of the location',
  });
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Location ID Hash',
      description: 'Anonymized identifier for the location',
    }),
    municipality: MunicipalitySchema,
    administrative_division: AdministrativeDivisionSchema,
    administrative_division_code:
      IsoAdministrativeDivisionCodeSchema.optional(),
    country: CountryNameSchema,
    country_code: IsoCountryCodeSchema,
    responsible_participant_id_hash: Sha256HashSchema.meta({
      title: 'Responsible Participant ID Hash',
      description:
        'Anonymized ID of the participant responsible for this location',
    }),
    coordinates: CoordinatesSchema,
  })
  .meta({
    title: 'Location',
    description: 'Geographic location with address and coordinate information',
  });

export type Location = z.infer<typeof LocationSchema>;
