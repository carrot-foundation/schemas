import { z } from 'zod';
import {
  NftIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  createAttributeMap,
  validateAttributeValue,
  validateAttributesForItems,
  validateDateAttribute,
} from '../shared';
import { CreditRetirementReceiptDataSchema } from './credit-retirement-receipt.data.schema';
import { CreditRetirementReceiptAttributesSchema } from './credit-retirement-receipt.attributes';

const CreditRetirementReceiptIpfsSchemaBase = NftIpfsSchema.omit({
  original_content_hash: true,
});

export const CreditRetirementReceiptIpfsSchemaMeta = {
  title: 'CreditRetirementReceipt NFT IPFS Record',
  description:
    'Complete CreditRetirementReceipt NFT IPFS record including attributes and credit retirement data',
  $id: buildSchemaUrl(
    'credit-retirement-receipt/credit-retirement-receipt.schema.json',
  ),
  version: getSchemaVersionOrDefault(),
} as const;

export const CreditRetirementReceiptIpfsSchema =
  CreditRetirementReceiptIpfsSchemaBase.safeExtend({
    schema: CreditRetirementReceiptIpfsSchemaBase.shape.schema.safeExtend({
      type: z.literal('CreditRetirementReceipt').meta({
        title: 'CreditRetirementReceipt Schema Type',
        description: 'CreditRetirementReceipt NFT schema type',
      }),
    }),
    attributes: CreditRetirementReceiptAttributesSchema,
    data: CreditRetirementReceiptDataSchema,
  })
    .superRefine((value, ctx) => {
      const attributes = value.attributes;
      const data = value.data;

      const attributeByTraitType = createAttributeMap(attributes);

      validateAttributeValue({
        ctx,
        attributeByTraitType,
        traitType: 'Total Credits Retired',
        expectedValue: data.summary.total_retirement_amount,
        missingMessage: 'Attribute "Total Credits Retired" is required',
        mismatchMessage:
          'Attribute "Total Credits Retired" must match data.summary.total_retirement_amount',
      });

      validateAttributeValue({
        ctx,
        attributeByTraitType,
        traitType: 'Certificates Retired',
        expectedValue: data.summary.total_certificates,
        missingMessage: 'Attribute "Certificates Retired" is required',
        mismatchMessage:
          'Attribute "Certificates Retired" must match data.summary.total_certificates',
      });

      validateAttributeValue({
        ctx,
        attributeByTraitType,
        traitType: 'Beneficiary',
        expectedValue: String(data.beneficiary.identity.name),
        missingMessage: 'Attribute "Beneficiary" is required',
        mismatchMessage:
          'Attribute "Beneficiary" must match beneficiary.identity.name',
      });

      const creditHolderName = data.credit_holder.identity?.name;
      if (creditHolderName) {
        validateAttributeValue({
          ctx,
          attributeByTraitType,
          traitType: 'Credit Holder',
          expectedValue: String(creditHolderName),
          missingMessage:
            'Attribute "Credit Holder" is required when credit_holder.identity.name is provided',
          mismatchMessage:
            'Attribute "Credit Holder" must match credit_holder.identity.name',
        });
      }

      validateDateAttribute({
        ctx,
        attributeByTraitType,
        traitType: 'Retirement Date',
        dateValue: data.summary.retirement_date,
        missingMessage: 'Attribute "Retirement Date" is required',
        invalidDateMessage:
          'data.summary.retirement_date must be a valid date string',
        mismatchMessage:
          'Attribute "Retirement Date" must match data.summary.retirement_date as a Unix timestamp in milliseconds',
        datePath: ['data', 'summary', 'retirement_date'],
      });

      validateAttributesForItems({
        ctx,
        attributeByTraitType,
        items: data.credits,
        traitSelector: (credit) => String(credit.symbol),
        valueSelector: (credit) => Number(credit.amount),
        missingMessage: (symbol) =>
          `Attribute for credit symbol ${symbol} is required`,
        mismatchMessage: (symbol) =>
          `Attribute for credit symbol ${symbol} must match credit.amount`,
      });

      validateAttributesForItems({
        ctx,
        attributeByTraitType,
        items: data.collections,
        traitSelector: (collection) => String(collection.name),
        valueSelector: (collection) => Number(collection.amount),
        missingMessage: (name) =>
          `Attribute for collection ${name} is required`,
        mismatchMessage: (name) =>
          `Attribute for collection ${name} must match collection.amount`,
      });
    })
    .meta(CreditRetirementReceiptIpfsSchemaMeta);

export type CreditRetirementReceiptIpfs = z.infer<
  typeof CreditRetirementReceiptIpfsSchema
>;
