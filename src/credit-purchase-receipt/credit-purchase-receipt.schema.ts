import { z } from 'zod';
import {
  NftIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  createAttributeMap,
  validateAttributeValue,
} from '../shared';
import { CreditPurchaseReceiptDataSchema } from './credit-purchase-receipt.data.schema';
import { CreditPurchaseReceiptAttributesSchema } from './credit-purchase-receipt.attributes';

export const CreditPurchaseReceiptIpfsSchemaMeta = {
  title: 'CreditPurchaseReceipt NFT IPFS Record',
  description:
    'Complete CreditPurchaseReceipt NFT IPFS record including attributes and credit purchase data',
  $id: buildSchemaUrl(
    'credit-purchase-receipt/credit-purchase-receipt.schema.json',
  ),
  version: getSchemaVersionOrDefault(),
} as const;

export const CreditPurchaseReceiptIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('CreditPurchaseReceipt').meta({
      title: 'CreditPurchaseReceipt Schema Type',
      description: 'Schema type identifier for this record',
    }),
  }),
  attributes: CreditPurchaseReceiptAttributesSchema,
  data: CreditPurchaseReceiptDataSchema,
})
  .superRefine((value, ctx) => {
    const attributes = value.attributes;
    const data = value.data;

    const attributeByTraitType = createAttributeMap(attributes);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Total Credits Purchased',
      expectedValue: data.summary.total_credits,
      missingMessage: 'Attribute "Total Credits Purchased" is required',
      mismatchMessage:
        'Attribute "Total Credits Purchased" must match data.summary.total_credits',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Total Amount (USDC)',
      expectedValue: data.summary.total_amount_usdc,
      missingMessage: 'Attribute "Total Amount (USDC)" is required',
      mismatchMessage:
        'Attribute "Total Amount (USDC)" must match data.summary.total_amount_usdc',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Certificates Purchased',
      expectedValue: data.summary.total_certificates,
      missingMessage: 'Attribute "Certificates Purchased" is required',
      mismatchMessage:
        'Attribute "Certificates Purchased" must match data.summary.total_certificates',
    });

    const buyerName = data.buyer.identity?.name;
    if (buyerName) {
      validateAttributeValue({
        ctx,
        attributeByTraitType,
        traitType: 'Buyer',
        expectedValue: String(buyerName),
        missingMessage:
          'Attribute "Buyer" is required when buyer.identity.name is provided',
        mismatchMessage: 'Attribute "Buyer" must match buyer.identity.name',
      });
    }

    const purchaseDateAttribute = attributeByTraitType.get('Purchase Date');
    if (purchaseDateAttribute) {
      const dateMs = Date.parse(data.summary.purchased_at);
      if (Number.isNaN(dateMs)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'data.summary.purchased_at must be a valid ISO 8601 date-time string',
          path: ['data', 'summary', 'purchased_at'],
        });
      } else if (purchaseDateAttribute.value !== dateMs) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Purchase Date" must match data.summary.purchased_at as a Unix timestamp in milliseconds',
          path: ['attributes'],
        });
      }
    } else {
      ctx.addIssue({
        code: 'custom',
        message: 'Attribute "Purchase Date" is required',
        path: ['attributes'],
      });
    }

    if (data.retirement_receipt) {
      const retirementReceiptAttribute =
        attributeByTraitType.get('Retirement Receipt');
      if (retirementReceiptAttribute) {
        const expectedTokenId = `#${data.retirement_receipt.token_id}`;
        if (retirementReceiptAttribute.value !== expectedTokenId) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Attribute "Retirement Receipt" must match retirement_receipt.token_id as #<token_id> when present',
            path: ['attributes'],
          });
        }
      }
    }

    const creditTotalsBySymbol = new Map<string, number>();
    data.certificates.forEach((certificate) => {
      const credit = data.credits.find(
        (c) => c.slug === certificate.credit_slug,
      );
      if (credit) {
        const certificatePurchasedTotal = certificate.collections.reduce(
          (sum, collection) => sum + Number(collection.purchased_amount),
          0,
        );
        const currentTotal = creditTotalsBySymbol.get(credit.symbol) ?? 0;
        creditTotalsBySymbol.set(
          credit.symbol,
          currentTotal + certificatePurchasedTotal,
        );
      }
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
          message: `Attribute for credit symbol ${credit.symbol} must match sum of certificate.collections[].purchased_amount for the credit symbol`,
          path: ['attributes'],
        });
      }
    });
  })
  .meta(CreditPurchaseReceiptIpfsSchemaMeta);
export type CreditPurchaseReceiptIpfs = z.infer<
  typeof CreditPurchaseReceiptIpfsSchema
>;
