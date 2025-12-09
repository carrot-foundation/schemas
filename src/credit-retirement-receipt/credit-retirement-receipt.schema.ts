import { z } from 'zod';
import {
  NftIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
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

      const attributeByTraitType = new Map(
        attributes.map((attribute) => [attribute.trait_type, attribute]),
      );

      const totalCreditsAttribute = attributeByTraitType.get(
        'Total Credits Retired',
      );
      if (!totalCreditsAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Total Credits Retired" is required',
          path: ['attributes'],
        });
      } else if (
        totalCreditsAttribute.value !== data.summary.total_retirement_amount
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Total Credits Retired" must match data.summary.total_retirement_amount',
          path: ['attributes'],
        });
      }

      const certificatesAttribute = attributeByTraitType.get(
        'Certificates Retired',
      );
      if (!certificatesAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Certificates Retired" is required',
          path: ['attributes'],
        });
      } else if (
        certificatesAttribute.value !== data.summary.total_certificates
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Certificates Retired" must match data.summary.total_certificates',
          path: ['attributes'],
        });
      }

      const beneficiaryAttribute = attributeByTraitType.get('Beneficiary');
      const beneficiaryName = data.beneficiary.identity.name;
      if (!beneficiaryAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Beneficiary" is required',
          path: ['attributes'],
        });
      } else if (beneficiaryAttribute.value !== beneficiaryName) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Beneficiary" must match beneficiary.identity.name',
          path: ['attributes'],
        });
      }

      const creditHolderName = data.credit_holder.identity?.name;
      const creditHolderAttribute = attributeByTraitType.get('Credit Holder');
      if (creditHolderName && !creditHolderAttribute) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Credit Holder" is required when credit_holder.identity.name is provided',
          path: ['attributes'],
        });
      } else if (
        creditHolderAttribute &&
        creditHolderName &&
        creditHolderAttribute.value !== creditHolderName
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Attribute "Credit Holder" must match credit_holder.identity.name',
          path: ['attributes'],
        });
      }

      const retirementDateAttribute =
        attributeByTraitType.get('Retirement Date');
      if (!retirementDateAttribute) {
        ctx.addIssue({
          code: 'custom',
          message: 'Attribute "Retirement Date" is required',
          path: ['attributes'],
        });
      } else {
        const retirementDateMs = Date.parse(
          `${data.summary.retirement_date}T00:00:00.000Z`,
        );
        if (Number.isNaN(retirementDateMs)) {
          ctx.addIssue({
            code: 'custom',
            message: 'data.summary.retirement_date must be a valid date string',
            path: ['data', 'summary', 'retirement_date'],
          });
        } else if (retirementDateAttribute.value !== retirementDateMs) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Attribute "Retirement Date" must match data.summary.retirement_date as a Unix timestamp in milliseconds',
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

        if (creditAttribute.value !== credit.amount) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for credit symbol ${credit.symbol} must match credit.amount`,
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

        if (collectionAttribute.value !== collection.amount) {
          ctx.addIssue({
            code: 'custom',
            message: `Attribute for collection ${collection.name} must match collection.amount`,
            path: ['attributes'],
          });
        }
      });
    })
    .meta(CreditRetirementReceiptIpfsSchemaMeta);

export type CreditRetirementReceiptIpfs = z.infer<
  typeof CreditRetirementReceiptIpfsSchema
>;
