import { z } from 'zod';
import {
  PositiveIntegerSchema,
  SmartContractAddressSchema,
  TokenIdSchema,
} from '../primitives';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const CreditPurchaseReceiptReferenceSchema =
  NftTokenReferenceBaseSchema.meta({
    title: 'Credit Purchase Receipt Reference',
    description:
      'Reference to the purchase receipt snapshot associated with this retirement; ipfs_uri preserves the cited historical version',
  });
export type CreditPurchaseReceiptReference = z.infer<
  typeof CreditPurchaseReceiptReferenceSchema
>;

export const CreditRetirementReceiptReferenceSchema = z
  .strictObject({
    chain_id: PositiveIntegerSchema.meta({
      title: 'Chain ID',
      description:
        'Network where the reserved or minted retirement receipt token exists',
      examples: [137, 80002],
    }),
    smart_contract_address: SmartContractAddressSchema,
    token_id: TokenIdSchema,
  })
  .meta({
    title: 'Credit Retirement Receipt Reference',
    description:
      'On-chain identity of a planned or completed retirement receipt. Presence does not by itself prove that retirement has completed.',
  });
export type CreditRetirementReceiptReference = z.infer<
  typeof CreditRetirementReceiptReferenceSchema
>;
