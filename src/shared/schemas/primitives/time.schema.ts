import { z } from 'zod';

export const IsoTimestampSchema = z
  .string()
  .datetime({
    message: 'Must be a valid ISO 8601 timestamp with timezone information',
    offset: true,
  })
  .meta({
    title: 'ISO Timestamp',
    description: 'ISO 8601 formatted timestamp with timezone information',
    examples: ['2024-12-05T11:02:47.000Z'],
  });
export type IsoTimestamp = z.infer<typeof IsoTimestampSchema>;

export const IsoDateSchema = z.iso
  .date('Must be a valid ISO 8601 date (YYYY-MM-DD)')
  .meta({
    title: 'ISO Date',
    description: 'ISO 8601 formatted date in YYYY-MM-DD format',
    examples: ['2024-12-05'],
  });
export type IsoDate = z.infer<typeof IsoDateSchema>;

export const UnixTimestampSchema = z
  .number()
  .int()
  .positive()
  .meta({
    title: 'Unix Timestamp',
    description:
      'Unix timestamp in milliseconds since epoch (January 1, 1970 00:00:00 UTC)',
    examples: [1704067200000],
  });
export type UnixTimestamp = z.infer<typeof UnixTimestampSchema>;
