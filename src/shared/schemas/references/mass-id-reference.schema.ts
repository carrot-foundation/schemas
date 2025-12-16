import { z } from 'zod';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const MassIDReferenceSchema = NftTokenReferenceBaseSchema.meta({
  title: 'MassID Reference',
  description: 'Reference to a MassID record',
});
export type MassIDReference = z.infer<typeof MassIDReferenceSchema>;
