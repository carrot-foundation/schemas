import { z } from 'zod';

import { NonEmptyStringSchema } from './text.schema';

export const RecordSchemaTypeSchema = z
  .enum([
    'MassID',
    'MassID Audit',
    'RecycledID',
    'GasID',
    'CreditPurchaseReceipt',
    'CreditRetirementReceipt',
    'Methodology',
    'Credit',
    'Collection',
  ])
  .meta({
    title: 'Schema Type',
    description: 'Type of schema in the Carrot ecosystem',
    examples: ['MassID', 'RecycledID', 'GasID'],
  });
export type RecordSchemaType = z.infer<typeof RecordSchemaTypeSchema>;

export const TokenSymbolSchema = NonEmptyStringSchema.max(10)
  .regex(
    /^[A-Z0-9-]+$/,
    'Must contain only uppercase letters, numbers, and hyphens',
  )
  .meta({
    title: 'Token Symbol',
    description: 'Symbol representing a token or cryptocurrency',
    examples: ['MASS', 'REC', 'GAS'],
  });
export type TokenSymbol = z.infer<typeof TokenSymbolSchema>;

export const CreditTokenSymbolSchema = TokenSymbolSchema.meta({
  title: 'Credit Token Symbol',
  description: 'Symbol of the credit token (e.g., C-CARB, C-BIOW)',
  examples: ['C-CARB', 'C-BIOW'],
});
export type CreditTokenSymbol = z.infer<typeof CreditTokenSymbolSchema>;
