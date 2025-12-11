import { z } from 'zod';

const nativeDateParse = Date.parse.bind(Date);

const ISO_TIMESTAMP_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export const IsoTimestampSchema = z
  .string()
  .regex(
    ISO_TIMESTAMP_REGEX,
    'Must be a valid ISO 8601 timestamp with timezone information',
  )
  .superRefine((value, ctx) => {
    const parsed = nativeDateParse(value);

    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must be a valid ISO 8601 timestamp with timezone information',
      });
    }
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
