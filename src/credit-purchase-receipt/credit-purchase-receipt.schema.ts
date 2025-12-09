import { z } from 'zod';
import {
  NftIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';
import { CreditPurchaseReceiptDataSchema } from './credit-purchase-receipt.data.schema';
import { CreditPurchaseReceiptAttributesSchema } from './credit-purchase-receipt.attributes';

const CreditPurchaseReceiptIpfsSchemaBase = NftIpfsSchema.omit({
  original_content_hash: true,
});

export const CreditPurchaseReceiptIpfsSchemaMeta = {
  title: 'CreditPurchaseReceipt NFT IPFS Record',
  description:
    'Complete CreditPurchaseReceipt NFT IPFS record including attributes and credit purchase data',
  $id: buildSchemaUrl(
    'credit-purchase-receipt/credit-purchase-receipt.schema.json',
  ),
  version: getSchemaVersionOrDefault(),
} as const;

export const CreditPurchaseReceiptIpfsSchema =
  CreditPurchaseReceiptIpfsSchemaBase.safeExtend({
    schema: CreditPurchaseReceiptIpfsSchemaBase.shape.schema.safeExtend({
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

      const attributeByTraitType = new Map(
        attributes.map((attribute) => [attribute.trait_type, attribute]),
      );

      const totalCreditsAttribute = attributeByTraitType.get(
        'Total Credits Purchased',
      );
      const totalCreditsAttr = totalCreditsAttribute;
      if (!totalCreditsAttr) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Total Credits Purchased" is required',
          path: ['attributes'],
        });
      } else if (totalCreditsAttr.value !== data.summary.total_credits) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Total Credits Purchased" must match data.summary.total_credits',
          path: ['attributes'],
        });
      }

      const totalUsdcAttribute = attributeByTraitType.get('Total USDC Amount');
      if (!totalUsdcAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Total USDC Amount" is required',
          path: ['attributes'],
        });
      } else if (totalUsdcAttribute.value !== data.summary.total_usdc_amount) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Total USDC Amount" must match data.summary.total_usdc_amount',
          path: ['attributes'],
        });
      }

      const certificatesAttribute = attributeByTraitType.get(
        'Certificates Purchased',
      );
      if (!certificatesAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Certificates Purchased" is required',
          path: ['attributes'],
        });
      } else if (
        certificatesAttribute.value !== data.summary.total_certificates
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Certificates Purchased" must match data.summary.total_certificates',
          path: ['attributes'],
        });
      }

      const receiverAttribute = attributeByTraitType.get('Receiver');
      if (data.parties.receiver.identity?.name && !receiverAttribute) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Receiver" is required when receiver.identity.name is provided',
          path: ['attributes'],
        });
      } else if (
        receiverAttribute &&
        data.parties.receiver.identity?.name &&
        receiverAttribute.value !== data.parties.receiver.identity.name
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Receiver" must match receiver.identity.name',
          path: ['attributes'],
        });
      }

      const purchaseDateAttribute = attributeByTraitType.get('Purchase Date');
      const purchaseDateAttr = purchaseDateAttribute;
      if (!purchaseDateAttr) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Purchase Date" is required',
          path: ['attributes'],
        });
      } else {
        const purchaseDateMs = Date.parse(
          `${data.summary.purchase_date}T00:00:00.000Z`,
        );
        if (Number.isNaN(purchaseDateMs)) {
          ctx.addIssue({
            code: 'custom',
            message: 'data.summary.purchase_date must be a valid date string',
            path: ['data', 'summary', 'purchase_date'],
          });
        } else if (purchaseDateAttr.value !== purchaseDateMs) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Attribute "Purchase Date" must match data.summary.purchase_date as a Unix timestamp in milliseconds',
            path: ['attributes'],
          });
        }
      }

      data.credits.forEach((credit) => {
        const creditAttribute = attributeByTraitType.get(credit.symbol);
        if (!creditAttribute) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for credit symbol ${credit.symbol} is required`,
            path: ['attributes'],
          });
          return;
        }

        if (creditAttribute.value !== credit.purchase_amount) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for credit symbol ${credit.symbol} must match credit.purchase_amount`,
            path: ['attributes'],
          });
        }
      });

      data.collections.forEach((collection) => {
        const collectionAttribute = attributeByTraitType.get(collection.name);
        if (!collectionAttribute) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for collection ${collection.name} is required`,
            path: ['attributes'],
          });
          return;
        }

        if (collectionAttribute.value !== collection.credit_amount) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for collection ${collection.name} must match collection.credit_amount`,
            path: ['attributes'],
          });
        }
      });
    })
    .meta(CreditPurchaseReceiptIpfsSchemaMeta);

export type CreditPurchaseReceiptIpfs = z.infer<
  typeof CreditPurchaseReceiptIpfsSchema
>;
