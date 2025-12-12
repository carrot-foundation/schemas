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
    description: 'GPS coordinates of the location',
  });
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Location ID Hash',
      description: 'Anonymized identifier for the location',
    }),
    city: CitySchema,
    subdivision_code: IsoCountrySubdivisionCodeSchema,
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
  })
  .superRefine((record, ctx) => {
    validateLocationBrazilData(record, ctx);
  });
export type Location = z.infer<typeof LocationSchema>;
