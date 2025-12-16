import { z } from 'zod';
import {
  CreditAmountSchema,
  NftAttributeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  CreditTokenSymbolSchema,
  StringifiedTokenIdSchema,
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

const CreditPurchaseReceiptPurchasePriceAttributeSchema =
  createNumericAttributeSchema({
    traitType: 'Total Amount (USDC)',
    title: 'Total Amount (USDC)',
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

const CreditPurchaseReceiptBuyerAttributeSchema = NftAttributeSchema.omit({
  display_type: true,
  max_value: true,
})
  .safeExtend({
    trait_type: z.literal('Buyer'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Buyer',
      description: 'Organization or individual purchasing the credits',
      examples: ['EcoTech Solutions Inc.'],
    }),
  })
  .meta({
    title: 'Buyer Attribute',
    description: 'Attribute containing the buyer display name',
  });

const CreditPurchaseReceiptRetirementDateAttributeSchema =
  createDateAttributeSchema({
    traitType: 'Retirement Date',
    title: 'Retirement Date',
    description:
      'Unix timestamp in milliseconds when credits were retired (if retirement occurred)',
  });

const CreditPurchaseReceiptRetirementReceiptAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Retirement Receipt'),
    value: StringifiedTokenIdSchema.meta({
      title: 'Retirement Receipt Token ID',
      description:
        'Token ID of the retirement receipt NFT as #<token_id> (if retirement occurred)',
    }),
  }).meta({
    title: 'Retirement Receipt Attribute',
    description: 'Retirement receipt token ID attribute',
  });

const REQUIRED_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptTotalCreditsAttributeSchema,
  CreditPurchaseReceiptPurchasePriceAttributeSchema,
  CreditPurchaseReceiptPurchaseDateAttributeSchema,
  CreditPurchaseReceiptCertificatesAttributeSchema,
] as const;

const CONDITIONAL_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptBuyerAttributeSchema,
  CreditPurchaseReceiptRetirementDateAttributeSchema,
  CreditPurchaseReceiptRetirementReceiptAttributeSchema,
] as const;

const DYNAMIC_CREDIT_PURCHASE_RECEIPT_ATTRIBUTES = [
  CreditPurchaseReceiptCreditAttributeSchema,
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
      'Attributes for credit purchase receipts including per-credit breakdowns, totals, buyer, purchase date, and optional retirement info. ' +
      'Fixed required attributes: Total Credits Purchased, Total Amount (USDC), Purchase Date, Certificates Purchased. ' +
      'Conditional attributes: Buyer (required when buyer.identity.name is provided), Retirement Date (optional, when retirement_receipt is present), Retirement Receipt (optional, when retirement_receipt is present). ' +
      'Dynamic attributes: Credit attributes (one per credit symbol in data.credits).',
    uniqueBySelector: (attribute: unknown) =>
      (attribute as { trait_type: string }).trait_type,
    requiredTraitTypes: [
      'Total Credits Purchased',
      'Total Amount (USDC)',
      'Purchase Date',
      'Certificates Purchased',
    ],
  });
export type CreditPurchaseReceiptAttributes = z.infer<
  typeof CreditPurchaseReceiptAttributesSchema
>;
