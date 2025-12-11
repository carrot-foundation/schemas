import { z } from 'zod';
import {
  CollectionNameSchema,
  CreditAmountSchema,
  NftAttributeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  CreditTokenSymbolSchema,
  UnixTimestampSchema,
  uniqueBy,
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
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Total Credits Retired'),
    value: CreditAmountSchema.meta({
      title: 'Total Credits Retired',
      description: 'Total number of credits retired across all tokens',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Total Credits Retired Attribute',
    description: 'Aggregate credits retired attribute',
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
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Retirement Date'),
    value: UnixTimestampSchema.meta({
      title: 'Retirement Date',
      description:
        'Unix timestamp in milliseconds when the retirement was completed',
    }),
    display_type: z.literal('date'),
  }).meta({
    title: 'Retirement Date Attribute',
    description:
      'Retirement date attribute using Unix timestamp in milliseconds',
  });

const CreditRetirementReceiptCertificatesAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Certificates Retired'),
    value: PositiveIntegerSchema.meta({
      title: 'Certificates Retired',
      description: 'Total number of certificates retired',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Certificates Retired Attribute',
    description:
      'Attribute representing how many certificates were retired in total',
  });

const CreditRetirementReceiptCollectionAttributeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: CollectionNameSchema,
    value: CreditAmountSchema.meta({
      title: 'Credits from Collection',
      description: 'Amount of credits retired from the collection',
    }),
    display_type: z.literal('number'),
  }).meta({
    title: 'Collection Attribute',
    description:
      'Attribute representing the amount of credits retired from a collection',
  });

export const CreditRetirementReceiptAttributesSchema = uniqueBy(
  z.union([
    CreditRetirementReceiptCreditAttributeSchema,
    CreditRetirementReceiptTotalCreditsAttributeSchema,
    CreditRetirementReceiptBeneficiaryAttributeSchema,
    CreditRetirementReceiptCreditHolderAttributeSchema,
    CreditRetirementReceiptRetirementDateAttributeSchema,
    CreditRetirementReceiptCertificatesAttributeSchema,
    CreditRetirementReceiptCollectionAttributeSchema,
  ]),
  (attribute) => attribute.trait_type,
  'Attribute trait_type values must be unique',
)
  .min(6)
  .meta({
    title: 'Credit Retirement Receipt NFT Attribute Array',
    description:
      'Attributes for credit retirement receipts including per-credit breakdowns, totals, beneficiary, credit holder, retirement date, certificate count, and per-collection amounts. Attributes must have unique trait types.',
  });

export type CreditRetirementReceiptAttributes = z.infer<
  typeof CreditRetirementReceiptAttributesSchema
>;
