import { z } from 'zod';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const RecycledIDReferenceSchema = NftTokenReferenceBaseSchema.meta({
  title: 'RecycledID Reference',
  description: 'Reference to a RecycledID record',
});
export type RecycledIDReference = z.infer<typeof RecycledIDReferenceSchema>;
