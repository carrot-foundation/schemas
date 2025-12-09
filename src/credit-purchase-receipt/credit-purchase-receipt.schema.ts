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
      description: 'CreditPurchaseReceipt NFT schema type',
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
      traitType: 'Total USDC Amount',
      expectedValue: data.summary.total_usdc_amount,
      missingMessage: 'Attribute "Total USDC Amount" is required',
      mismatchMessage:
        'Attribute "Total USDC Amount" must match data.summary.total_usdc_amount',
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

    const receiverName = data.parties.receiver.identity?.name;
    if (receiverName) {
      validateAttributeValue({
        ctx,
        attributeByTraitType,
        traitType: 'Receiver',
        expectedValue: String(receiverName),
        missingMessage:
          'Attribute "Receiver" is required when receiver.identity.name is provided',
        mismatchMessage:
          'Attribute "Receiver" must match receiver.identity.name',
      });
    }

    validateDateAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Purchase Date',
      dateValue: data.summary.purchase_date,
      missingMessage: 'Attribute "Purchase Date" is required',
      invalidDateMessage:
        'data.summary.purchase_date must be a valid date string',
      mismatchMessage:
        'Attribute "Purchase Date" must match data.summary.purchase_date as a Unix timestamp in milliseconds',
      datePath: ['data', 'summary', 'purchase_date'],
    });

    validateAttributesForItems({
      ctx,
      attributeByTraitType,
      items: data.credits,
      traitSelector: (credit) => String(credit.symbol),
      valueSelector: (credit) => Number(credit.purchase_amount),
      missingMessage: (symbol) =>
        `Attribute for credit symbol ${symbol} is required`,
      mismatchMessage: (symbol) =>
        `Attribute for credit symbol ${symbol} must match credit.purchase_amount`,
    });

    validateAttributesForItems({
      ctx,
      attributeByTraitType,
      items: data.collections,
      traitSelector: (collection) => String(collection.name),
      valueSelector: (collection) => Number(collection.credit_amount),
      missingMessage: (name) => `Attribute for collection ${name} is required`,
      mismatchMessage: (name) =>
        `Attribute for collection ${name} must match collection.credit_amount`,
    });
  })
  .meta(CreditPurchaseReceiptIpfsSchemaMeta);

export type CreditPurchaseReceiptIpfs = z.infer<
  typeof CreditPurchaseReceiptIpfsSchema
>;
