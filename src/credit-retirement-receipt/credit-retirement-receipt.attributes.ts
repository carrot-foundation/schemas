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

const CreditRetirementReceiptCreditAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: CreditTokenSymbolSchema,
    value: CreditAmountSchema.meta({
      title: 'Credit Retirement Amount',
      description: 'Amount of credits retired for the token symbol',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Credit Attribute',
    description:
      'Attribute representing retired amount per credit token symbol',
  });

const CreditRetirementReceiptTotalCreditsAttributeSchema =
  createNumericAttributeSchema({
    traitType: 'Total Credits Retired',
    title: 'Total Credits Retired',
    description: 'Total number of credits retired across all tokens',
    valueSchema: CreditAmountSchema,
  });

const CreditRetirementReceiptBeneficiaryAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Beneficiary'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Beneficiary',
      description: 'Beneficiary receiving the retirement benefit',
      examples: ['Climate Action Corp'],
    }),
  }).meta({
    title: 'Beneficiary Attribute',
    description: 'Attribute containing the beneficiary display name',
  });

const CreditRetirementReceiptCreditHolderAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Credit Holder'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Credit Holder',
      description: 'Entity that surrendered the credits',
      examples: ['EcoTech Solutions Inc.'],
    }),
  }).meta({
    title: 'Credit Holder Attribute',
    description: 'Attribute containing the credit holder display name',
  });

const CreditRetirementReceiptRetirementDateAttributeSchema =
  createDateAttributeSchema({
    traitType: 'Retirement Date',
    title: 'Retirement Date',
    description:
      'Unix timestamp in milliseconds when the retirement was completed',
  });

const CreditRetirementReceiptCertificatesAttributeSchema =
  createNumericAttributeSchema({
    traitType: 'Certificates Retired',
    title: 'Certificates Retired',
    description: 'Total number of certificates retired',
    valueSchema: PositiveIntegerSchema,
  });

const CreditRetirementReceiptPurchaseDateAttributeSchema =
  createDateAttributeSchema({
    traitType: 'Purchase Date',
    title: 'Purchase Date',
    description:
      'Unix timestamp in milliseconds when credits were purchased (if purchase_receipt is present)',
  });

const CreditRetirementReceiptPurchaseReceiptAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Purchase Receipt'),
    value: StringifiedTokenIdSchema.meta({
      title: 'Purchase Receipt Token ID',
      description:
        'Token ID of the purchase receipt NFT as #<token_id> (if purchase_receipt is present)',
    }),
  }).meta({
    title: 'Purchase Receipt Attribute',
    description: 'Attribute representing the purchase receipt token ID',
  });

const REQUIRED_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES = [
  CreditRetirementReceiptTotalCreditsAttributeSchema,
  CreditRetirementReceiptBeneficiaryAttributeSchema,
  CreditRetirementReceiptRetirementDateAttributeSchema,
  CreditRetirementReceiptCertificatesAttributeSchema,
] as const;

const CONDITIONAL_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES = [
  CreditRetirementReceiptCreditHolderAttributeSchema,
  CreditRetirementReceiptPurchaseDateAttributeSchema,
  CreditRetirementReceiptPurchaseReceiptAttributeSchema,
] as const;

// Dynamic attributes (one per credit symbol)
const DYNAMIC_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES = [
  CreditRetirementReceiptCreditAttributeSchema,
] as const;

export const CreditRetirementReceiptAttributesSchema =
  createOrderedAttributesSchema({
    required: REQUIRED_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES,
    optional: [
      ...CONDITIONAL_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES,
      ...DYNAMIC_CREDIT_RETIREMENT_RECEIPT_ATTRIBUTES,
    ],
    title: 'Credit Retirement Receipt NFT Attribute Array',
    description:
      'Attributes for credit retirement receipts including per-credit breakdowns, totals, beneficiary, credit holder, retirement date, certificate count, and optional purchase info. ' +
      'Fixed required attributes: Total Credits Retired, Beneficiary, Retirement Date, Certificates Retired. ' +
      'Conditional attributes: Credit Holder (required when credit_holder.identity.name is provided), Purchase Date (optional, when purchase_receipt is present), Purchase Receipt (optional, when purchase_receipt is present). ' +
      'Dynamic attributes: Credit attributes (one per credit symbol in data.credits).',
    uniqueBySelector: (attribute: unknown) =>
      (attribute as { trait_type: string }).trait_type,
    requiredTraitTypes: [
      'Total Credits Retired',
      'Beneficiary',
      'Retirement Date',
      'Certificates Retired',
    ],
  });
export type CreditRetirementReceiptAttributes = z.infer<
  typeof CreditRetirementReceiptAttributesSchema
>;
