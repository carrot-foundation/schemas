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
  description:
    'UUID v4 identifier linking this IPFS record to its counterpart in the Carrot platform and other consuming systems',
});
export type ExternalId = z.infer<typeof ExternalIdSchema>;

export const TokenIdSchema = NonEmptyStringSchema.regex(
  /^\d+$/,
  'Must be a numeric string (supports uint256)',
).meta({
  title: 'Token ID',
  description: 'Unique token identifier for this NFT within the smart contract',
  examples: ['456789', '1000000'],
});
export type TokenId = z.infer<typeof TokenIdSchema>;

export const StringifiedTokenIdSchema = NonEmptyStringSchema.regex(
  /^#\d+$/,
  'Must match pattern #<token_id>',
).meta({
  title: 'Display Token ID',
  description:
    'Human-readable token ID prefixed with # for display purposes (e.g., #456789)',
  examples: ['#456789', '#1000000'],
  example: '#456789',
});
export type StringifiedTokenId = z.infer<typeof StringifiedTokenIdSchema>;
