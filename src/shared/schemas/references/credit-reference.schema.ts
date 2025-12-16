import { z } from 'zod';
import {
  CreditTokenSlugSchema,
  CreditTokenSymbolSchema,
} from '../primitives/enums.schema';
import { TokenReferenceBaseSchema } from './token-reference-base.schema';

export const CreditReferenceSchema = TokenReferenceBaseSchema.safeExtend({
  slug: CreditTokenSlugSchema,
  symbol: CreditTokenSymbolSchema,
}).meta({
  title: 'Credit Reference',
  description: 'Reference to an ERC20 credit token',
});
export type CreditReference = z.infer<typeof CreditReferenceSchema>;
