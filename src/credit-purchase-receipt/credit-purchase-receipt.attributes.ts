import { z } from 'zod';
import {
  CollectionNameSchema,
  CreditAmountSchema,
  NftAttributeSchema,
  ParticipantNameSchema,
  PositiveIntegerSchema,
  TokenSymbolSchema,
  UnixTimestampSchema,
  uniqueBy,
} from '../shared';

const CreditPurchaseReceiptCreditAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: TokenSymbolSchema.meta({
      title: 'Credit Token Symbol',
      description: 'Symbol of the credit token (e.g., C-CARB, C-BIOW)',
      examples: ['C-CARB', 'C-BIOW'],
    }),
    value: CreditAmountSchema.meta({
      title: 'Credit Amount',
      description: 'Amount of credits purchased for the token symbol',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Credit Attribute',
    description:
      'Attribute representing purchased amount per credit token symbol',
  });

const CreditPurchaseReceiptTotalCreditsAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Total Credits Purchased'),
    value: CreditAmountSchema.meta({
      title: 'Total Credits Purchased',
      description: 'Total number of credits purchased across all tokens',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Total Credits Purchased Attribute',
    description: 'Aggregate credits purchased attribute',
  });

const CreditPurchaseReceiptTotalUsdcAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Total USDC Amount'),
    value: CreditAmountSchema.meta({
      title: 'Total USDC Amount',
      description: 'Total USDC amount paid for the purchase',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Total USDC Amount Attribute',
    description: 'Aggregate USDC amount attribute',
  });

const CreditPurchaseReceiptPurchaseDateAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Purchase Date'),
    value: UnixTimestampSchema.meta({
      title: 'Purchase Date',
      description:
        'Unix timestamp in milliseconds when the purchase was completed',
    }),
    display_type: z.literal('date'),
  }).meta({
    title: 'Purchase Date Attribute',
    description: 'Purchase date attribute using Unix timestamp in milliseconds',
  });

const CreditPurchaseReceiptCertificatesAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Certificates Purchased'),
    value: PositiveIntegerSchema.meta({
      title: 'Certificates Purchased',
      description: 'Total number of certificates purchased',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Certificates Purchased Attribute',
    description: 'Attribute representing how many certificates were purchased',
  });

const CreditPurchaseReceiptReceiverAttributeSchema = NftAttributeSchema.omit({
  display_type: true,
  max_value: true,
})
  .safeExtend({
    trait_type: z.literal('Receiver'),
    value: ParticipantNameSchema.meta({
      title: 'Receiver',
      description:
        'Organization or individual receiving the credits from the purchase',
      examples: ['EcoTech Solutions Inc.'],
    }),
  })
  .meta({
    title: 'Receiver Attribute',
    description: 'Attribute containing the receiver display name',
  });

const CreditPurchaseReceiptCollectionAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: CollectionNameSchema,
    value: CreditAmountSchema.meta({
      title: 'Credits from Collection',
      description: 'Amount of credits purchased from the collection',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Collection Attribute',
    description:
      'Attribute representing the amount of credits purchased from a collection',
  });

export const CreditPurchaseReceiptAttributesSchema = uniqueBy(
  z.union([
    CreditPurchaseReceiptCreditAttributeSchema,
    CreditPurchaseReceiptTotalCreditsAttributeSchema,
    CreditPurchaseReceiptTotalUsdcAttributeSchema,
    CreditPurchaseReceiptPurchaseDateAttributeSchema,
    CreditPurchaseReceiptCertificatesAttributeSchema,
    CreditPurchaseReceiptReceiverAttributeSchema,
    CreditPurchaseReceiptCollectionAttributeSchema,
  ]),
  (attribute) => attribute.trait_type,
  'Attribute trait_type values must be unique',
)
  .min(5)
  .meta({
    title: 'Credit Purchase Receipt NFT Attribute Array',
    description:
      'Attributes for credit purchase receipts including per-credit breakdowns, totals, receiver, purchase date, and per-collection amounts. Attributes must have unique trait types.',
  });

export type CreditPurchaseReceiptAttributes = z.infer<
  typeof CreditPurchaseReceiptAttributesSchema
>;
