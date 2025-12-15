import { z } from 'zod';
import {
  CollectionNameSchema,
  CreditAmountSchema,
  NftAttributeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  CreditTokenSymbolSchema,
  createDateAttributeSchema,
  createNumericAttributeSchema,
  createOrderedAttributesSchema,
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

const REQUIRED_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptTotalCreditsAttributeSchema,
  CreditPurchaseReceiptTotalUsdcAttributeSchema,
  CreditPurchaseReceiptPurchaseDateAttributeSchema,
  CreditPurchaseReceiptCertificatesAttributeSchema,
] as const;

const CONDITIONAL_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptReceiverAttributeSchema,
] as const;

// Dynamic attributes (one per credit symbol and one per collection name)
const DYNAMIC_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptCreditAttributeSchema,
  CreditPurchaseReceiptCollectionAttributeSchema,
] as const;

export const CreditPurchaseReceiptAttributesSchema =
  createOrderedAttributesSchema({
    required: REQUIRED_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES,
    optional: [
      ...CONDITIONAL_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES,
      ...DYNAMIC_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES,
    ],
    title: 'Credit Purchase Receipt NFT Attribute Array',
    description:
      'Attributes for credit purchase receipts including per-credit breakdowns, totals, receiver, purchase date, and per-collection amounts. ' +
      'Fixed required attributes: Total Credits Purchased, Total USDC Amount, Purchase Date, Certificates Purchased. ' +
      'Conditional attributes: Receiver (required when receiver.identity.name is provided). ' +
      'Dynamic attributes: Credit attributes (one per credit symbol in data.credits), Collection attributes (one per collection name in data.collections).',
    uniqueBySelector: (attribute: unknown) =>
      (attribute as { trait_type: string }).trait_type,
    requiredTraitTypes: [
      'Total Credits Purchased',
      'Total USDC Amount',
      'Purchase Date',
      'Certificates Purchased',
    ],
  });

export type CreditPurchaseReceiptAttributes = z.infer<
  typeof CreditPurchaseReceiptAttributesSchema
>;
