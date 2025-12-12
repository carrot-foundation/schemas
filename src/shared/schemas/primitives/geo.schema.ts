import { z } from 'zod';
import { NonEmptyStringSchema } from './text.schema';
import { BRAZIL_MUNICIPALITIES, BRAZIL_SUBDIVISION_CODES } from '../../data';

export const IsoCountryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code')
  .meta({
    title: 'Country Code',
    description:
      'Two-letter country code following ISO 3166-1 alpha-2 standard',
    examples: ['BR'],
  })
  .refine((data) => data === 'BR', 'Must be Brazil (BR)');
export type IsoCountryCode = z.infer<typeof IsoCountryCodeSchema>;

export const IsoCountrySubdivisionCodeSchema = z
  .string()
  .regex(
    /^[A-Z]{2}-[A-Z0-9]{1,3}$/,
    'Must be a valid ISO 3166-2 country subdivision code',
  )
  .meta({
    title: 'Country Subdivision Code',
    description: 'Subdivision code following ISO 3166-2 standard',
    examples: ['BR-AP', 'BR-DF'],
  })
  .refine(
    (data) => BRAZIL_SUBDIVISION_CODES.includes(data),
    'Must be a valid Brazil subdivision code',
  );
export type IsoCountrySubdivisionCode = z.infer<
  typeof IsoCountrySubdivisionCodeSchema
>;

export const CitySchema = NonEmptyStringSchema.max(50)
  .meta({
    title: 'City',
    description: 'City name',
    examples: ['Brasília', 'São Paulo'],
  })
  .refine(
    (data) =>
      BRAZIL_MUNICIPALITIES.some((municipality) => municipality.name === data),
    'Must be a valid Brazil municipality',
  );
export type City = z.infer<typeof CitySchema>;

export const LatitudeSchema = z
  .number()
  .min(-90)
  .max(90)
  .multipleOf(0.1)
  .meta({
    title: 'Latitude',
    description:
      'Geographic latitude coordinate in decimal degrees with maximum 1 decimal place precision (~11km accuracy for city-level)',
    examples: [-0.2, -20.3],
  });
export type Latitude = z.infer<typeof LatitudeSchema>;

export const LongitudeSchema = z
  .number()
  .min(-180)
  .max(180)
  .multipleOf(0.1)
  .meta({
    title: 'Longitude',
    description:
      'Geographic longitude coordinate in decimal degrees with maximum 1 decimal place precision (~11km accuracy for city-level)',
    examples: [-51, -40.3],
  });
export type Longitude = z.infer<typeof LongitudeSchema>;
