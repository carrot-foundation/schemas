import { z } from 'zod';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const GasIDReferenceSchema = NftTokenReferenceBaseSchema.meta({
  title: 'GasID Reference',
  description: 'Reference to a GasID record',
});
export type GasIDReference = z.infer<typeof GasIDReferenceSchema>;
