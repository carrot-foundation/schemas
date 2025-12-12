import { z } from 'zod';
import {
  CollectionNameSchema,
  CreditAmountSchema,
  NftAttributeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  CreditTokenSymbolSchema,
  uniqueBy,
  createDateAttributeSchema,
  createNumericAttributeSchema,
} from '../shared';

const CreditPurchaseReceiptCreditAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: CreditTokenSymbolSchema,
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
  createNumericAttributeSchema({
    traitType: 'Total Credits Purchased',
    title: 'Total Credits Purchased',
    description: 'Total number of credits purchased across all tokens',
    valueSchema: CreditAmountSchema,
  });

const CreditPurchaseReceiptTotalUsdcAttributeSchema =
  createNumericAttributeSchema({
    traitType: 'Total USDC Amount',
    title: 'Total USDC Amount',
    description: 'Total USDC amount paid for the purchase',
    valueSchema: CreditAmountSchema,
  });

const CreditPurchaseReceiptPurchaseDateAttributeSchema =
  createDateAttributeSchema({
    traitType: 'Purchase Date',
    title: 'Purchase Date',
    description:
      'Unix timestamp in milliseconds when the purchase was completed',
  });

const CreditPurchaseReceiptCertificatesAttributeSchema =
  createNumericAttributeSchema({
    traitType: 'Certificates Purchased',
    title: 'Certificates Purchased',
    description: 'Total number of certificates purchased',
    valueSchema: PositiveIntegerSchema,
  });

const CreditPurchaseReceiptReceiverAttributeSchema = NftAttributeSchema.omit({
  display_type: true,
  max_value: true,
})
  .safeExtend({
    trait_type: z.literal('Receiver'),
    value: NonEmptyStringSchema.max(100).meta({
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
