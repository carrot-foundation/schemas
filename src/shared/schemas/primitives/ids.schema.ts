import { z } from 'zod';

import { NonEmptyStringSchema } from './text.schema';

export const UuidSchema = z.uuidv4().meta({
  title: 'UUID V4',
  description: 'A universally unique identifier version 4',
  examples: ['ad44dd3f-f176-4b98-bf78-5ee6e77d0530'],
});
export type Uuid = z.infer<typeof UuidSchema>;

export const ExternalIdSchema = UuidSchema.meta({
  title: 'External ID',
  description: 'UUID identifier for external system references',
});
export type ExternalId = z.infer<typeof ExternalIdSchema>;

export const TokenIdSchema = NonEmptyStringSchema.regex(
  /^\d+$/,
  'Must be a numeric string (supports uint256)',
).meta({
  title: 'Token ID',
  description: 'Numeric identifier for blockchain tokens as string',
  examples: ['456789', '1000000'],
});
export type TokenId = z.infer<typeof TokenIdSchema>;

export const StringifiedTokenIdSchema = NonEmptyStringSchema.regex(
  /^#\d+$/,
  'Must match pattern #<token_id>',
).meta({
  title: 'Token ID',
  description: 'Token ID represented as #<token_id>',
  example: '#123',
});
export type StringifiedTokenId = z.infer<typeof StringifiedTokenIdSchema>;
