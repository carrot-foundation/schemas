import { z } from 'zod';
import {
  LatitudeSchema,
  LongitudeSchema,
  IsoCountryCodeSchema,
  IsoCountrySubdivisionCodeSchema,
  CitySchema,
  Sha256HashSchema,
} from '../primitives';
import { validateLocationBrazilData } from '../../data';

export const CoordinatesSchema = z
  .strictObject({
    latitude: LatitudeSchema,
    longitude: LongitudeSchema,
  })
  .meta({
    title: 'Coordinates',
    description:
      'Approximate GPS coordinates of the site (city-level precision for privacy)',
  });
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Location ID Hash',
      description:
        'SHA-256 hash anonymizing the real location identifier for privacy',
    }),
    city: CitySchema,
    subdivision_code: IsoCountrySubdivisionCodeSchema,
    country_code: IsoCountryCodeSchema,
    responsible_participant_id_hash: Sha256HashSchema.meta({
      title: 'Responsible Participant ID Hash',
      description:
        'SHA-256 hash identifying the participant responsible for operations at this location',
    }),
    coordinates: CoordinatesSchema,
  })
  .superRefine((record, ctx) => {
    validateLocationBrazilData(record, ctx);
  })
  .meta({
    title: 'Location',
    description: 'Geographic location with address and coordinate information',
  });
export type Location = z.infer<typeof LocationSchema>;
