import { z } from 'zod';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const CreditPurchaseReceiptReferenceSchema =
  NftTokenReferenceBaseSchema.meta({
    title: 'Credit Purchase Receipt Reference',
    description:
      'Reference to the credit purchase receipt when retirement occurs during purchase',
  });
export type CreditPurchaseReceiptReference = z.infer<
  typeof CreditPurchaseReceiptReferenceSchema
>;

export const CreditRetirementReceiptReferenceSchema =
  NftTokenReferenceBaseSchema.meta({
    title: 'Credit Retirement Receipt Reference',
    description: 'Reference to the retirement receipt NFT',
  });
export type CreditRetirementReceiptReference = z.infer<
  typeof CreditRetirementReceiptReferenceSchema
>;
