import { z } from 'zod';
import {
  NftIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  createAttributeMap,
  validateAttributeValue,
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
        description: 'Schema type identifier for this record',
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
        expectedValue: data.summary.total_credits_retired,
        missingMessage: 'Attribute "Total Credits Retired" is required',
        mismatchMessage:
          'Attribute "Total Credits Retired" must match data.summary.total_credits_retired',
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

      const retirementDateAttribute =
        attributeByTraitType.get('Retirement Date');
      if (retirementDateAttribute) {
        const dateMs = Date.parse(data.summary.retired_at);
        if (Number.isNaN(dateMs)) {
          ctx.addIssue({
            code: 'custom',
            message:
              'data.summary.retired_at must be a valid ISO 8601 date-time string',
            path: ['data', 'summary', 'retired_at'],
          });
        } else if (retirementDateAttribute.value !== dateMs) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Attribute "Retirement Date" must match data.summary.retired_at as a Unix timestamp in milliseconds',
            path: ['attributes'],
          });
        }
      } else {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Retirement Date" is required',
          path: ['attributes'],
        });
      }

      if (data.purchase_receipt) {
        const purchaseReceiptAttribute =
          attributeByTraitType.get('Purchase Receipt');
        if (purchaseReceiptAttribute) {
          const expectedTokenId = `#${data.purchase_receipt.token_id}`;
          if (purchaseReceiptAttribute.value !== expectedTokenId) {
            ctx.addIssue({
              code: 'custom',
              message:
                'Attribute "Purchase Receipt" must match purchase_receipt.token_id as #<token_id> when present',
              path: ['attributes'],
            });
          }
        }
      }

      const creditTotalsBySymbol = new Map<string, number>();
      data.certificates.forEach((certificate) => {
        certificate.credits_retired.forEach((creditRetired) => {
          const currentTotal =
            creditTotalsBySymbol.get(creditRetired.credit_symbol) ?? 0;
          creditTotalsBySymbol.set(
            creditRetired.credit_symbol,
            currentTotal + Number(creditRetired.amount),
          );
        });
      });

      data.credits.forEach((credit) => {
        const expectedTotal = creditTotalsBySymbol.get(credit.symbol) ?? 0;
        const attribute = attributeByTraitType.get(credit.symbol);
        if (!attribute) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for credit symbol ${credit.symbol} is required`,
            path: ['attributes'],
          });
        } else if (Number(attribute.value) !== expectedTotal) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for credit symbol ${credit.symbol} must match sum of certificate credits_retired amounts for the credit symbol`,
            path: ['attributes'],
          });
        }
      });
    })
    .meta(CreditRetirementReceiptIpfsSchemaMeta);

export type CreditRetirementReceiptIpfs = z.infer<
  typeof CreditRetirementReceiptIpfsSchema
>;
