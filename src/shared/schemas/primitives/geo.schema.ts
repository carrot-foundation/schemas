import { z } from 'zod';

export const IsoCountryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code')
  .meta({
    title: 'ISO Country Code',
    description:
      'Two-letter country code following ISO 3166-1 alpha-2 standard',
    examples: ['BR', 'US', 'DE'],
  });
export type IsoCountryCode = z.infer<typeof IsoCountryCodeSchema>;

export const IsoAdministrativeDivisionCodeSchema = z
  .string()
  .regex(
    /^[A-Z]{2}-[A-Z0-9]{1,3}$/,
    'Must be a valid ISO 3166-2 administrative division code',
  )
  .meta({
    title: 'ISO Administrative Division Code',
    description: 'Administrative division code following ISO 3166-2 standard',
    examples: ['BR-AP', 'BR-ES', 'US-CA'],
  });
export type IsoAdministrativeDivisionCode = z.infer<
  typeof IsoAdministrativeDivisionCodeSchema
>;

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
