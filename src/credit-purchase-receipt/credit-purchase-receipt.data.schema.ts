import { z } from 'zod';
import {
  ExternalIdSchema,
  uniqueBy,
  CreditPurchaseReceiptSummarySchema,
  ReceiptIdentitySchema,
  CertificateCollectionItemPurchaseSchema,
  CertificateReferenceBaseSchema,
  createReceiptCollectionSchema,
  CreditReferenceSchema,
  validateCountMatches,
  validateTotalMatches,
  validateCertificateCollectionSlugs,
  validateRetirementReceiptRequirement,
  validateCreditSlugExists,
  CreditRetirementReceiptReferenceSchema,
} from '../shared';
import {
  CreditTokenSlugSchema,
  EthereumAddressSchema,
} from '../shared/schemas/primitives';

const CreditPurchaseReceiptIdentitySchema = ReceiptIdentitySchema;
export type CreditPurchaseReceiptIdentity = z.infer<
  typeof CreditPurchaseReceiptIdentitySchema
>;

const CreditPurchaseReceiptBuyerSchema = z
  .strictObject({
    wallet_address: EthereumAddressSchema.meta({
      title: 'Buyer Wallet Address',
      description: 'Ethereum address receiving the credits',
    }),
    id: ExternalIdSchema.optional().meta({
      title: 'Buyer ID',
      description: 'Unique identifier for the buyer',
    }),
    identity: CreditPurchaseReceiptIdentitySchema.optional(),
  })
  .meta({
    title: 'Buyer',
    description:
      'Buyer information including wallet address, optional ID, and optional identity',
  });
export type CreditPurchaseReceiptBuyer = z.infer<
  typeof CreditPurchaseReceiptBuyerSchema
>;

const CreditPurchaseReceiptCollectionSchema = createReceiptCollectionSchema({
  meta: {
    title: 'Collection',
    description: 'Collection included in the purchase',
  },
});
export type CreditPurchaseReceiptCollection = z.infer<
  typeof CreditPurchaseReceiptCollectionSchema
>;

const CreditPurchaseReceiptCreditSchema = CreditReferenceSchema.meta({
  title: 'Credit',
  description: 'Credit token included in the purchase',
});
export type CreditPurchaseReceiptCredit = z.infer<
  typeof CreditPurchaseReceiptCreditSchema
>;

const CreditPurchaseReceiptCertificateSchema =
  CertificateReferenceBaseSchema.safeExtend({
    credit_slug: CreditTokenSlugSchema.meta({
      description: 'Slug of the credit type for this certificate',
    }),
    collections: uniqueBy(
      CertificateCollectionItemPurchaseSchema,
      (item) => item.slug,
      'Collection slugs within certificate collections must be unique',
    )
      .min(1)
      .meta({
        title: 'Certificate Collections',
        description:
          'Collections associated with this certificate, each with purchased and retired amounts',
      }),
  }).meta({
    title: 'Certificate',
    description: 'Certificate associated with the purchase',
  });
export type CreditPurchaseReceiptCertificate = z.infer<
  typeof CreditPurchaseReceiptCertificateSchema
>;

const CreditPurchaseReceiptRetirementReceiptSchema =
  CreditRetirementReceiptReferenceSchema;
export type CreditPurchaseReceiptRetirementReceipt = z.infer<
  typeof CreditPurchaseReceiptRetirementReceiptSchema
>;

export const CreditPurchaseReceiptDataSchema = z
  .strictObject({
    summary: CreditPurchaseReceiptSummarySchema,
    buyer: CreditPurchaseReceiptBuyerSchema,
    collections: uniqueBy(
      CreditPurchaseReceiptCollectionSchema,
      (collection) => collection.slug,
      'Collection slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Collections',
        description: 'Collections included in the purchase',
      }),
    credits: uniqueBy(
      CreditPurchaseReceiptCreditSchema,
      (credit) => credit.slug,
      'Credit slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Credits',
        description: 'Credits included in the purchase',
      }),
    certificates: uniqueBy(
      CreditPurchaseReceiptCertificateSchema,
      (certificate) => certificate.token_id,
      'Certificate token_ids must be unique',
    )
      .min(1)
      .meta({
        title: 'Certificates',
        description: 'Certificates involved in the purchase',
      }),
    retirement_receipt: CreditPurchaseReceiptRetirementReceiptSchema.optional(),
  })
  .superRefine((data, ctx) => {
    validateCountMatches({
      ctx,
      actualCount: data.certificates.length,
      expectedCount: data.summary.total_certificates,
      path: ['summary', 'total_certificates'],
      message:
        'summary.total_certificates must equal the number of certificates',
    });

    const collectionSlugs = new Set<string>(
      data.collections.map((collection) => String(collection.slug)),
    );
    const creditSlugs = new Set<string>(
      data.credits.map((credit) => String(credit.slug)),
    );

    const creditPurchaseTotalsBySlug = new Map<string, number>();
    const creditRetiredTotalsBySlug = new Map<string, number>();
    const collectionPurchasedTotalsBySlug = new Map<string, number>();
    const collectionRetiredTotalsBySlug = new Map<string, number>();
    let totalCreditsFromCertificates = 0;

    data.certificates.forEach((certificate, index) => {
      validateCreditSlugExists({
        ctx,
        creditSlug: certificate.credit_slug,
        validCreditSlugs: creditSlugs,
        path: ['certificates', index, 'credit_slug'],
      });

      let certificatePurchasedTotal = 0;
      let certificateRetiredTotal = 0;

      validateCertificateCollectionSlugs({
        ctx,
        certificateCollections: certificate.collections,
        validCollectionSlugs: collectionSlugs,
        certificateIndex: index,
      });

      certificate.collections.forEach((collectionItem, collectionIndex) => {
        if (collectionItem.retired_amount > collectionItem.purchased_amount) {
          ctx.addIssue({
            code: 'custom',
            message:
              'certificate.collections[].retired_amount cannot exceed purchased_amount',
            path: [
              'certificates',
              index,
              'collections',
              collectionIndex,
              'retired_amount',
            ],
          });
        }

        certificatePurchasedTotal += Number(collectionItem.purchased_amount);
        certificateRetiredTotal += Number(collectionItem.retired_amount);

        collectionPurchasedTotalsBySlug.set(
          collectionItem.slug,
          (collectionPurchasedTotalsBySlug.get(collectionItem.slug) ?? 0) +
            Number(collectionItem.purchased_amount),
        );
        collectionRetiredTotalsBySlug.set(
          collectionItem.slug,
          (collectionRetiredTotalsBySlug.get(collectionItem.slug) ?? 0) +
            Number(collectionItem.retired_amount),
        );
      });

      if (certificatePurchasedTotal > certificate.total_amount) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Sum of certificate.collections[].purchased_amount cannot exceed certificate.total_amount',
          path: ['certificates', index],
        });
      }

      totalCreditsFromCertificates += certificatePurchasedTotal;

      creditPurchaseTotalsBySlug.set(
        String(certificate.credit_slug),
        (creditPurchaseTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          certificatePurchasedTotal,
      );
      creditRetiredTotalsBySlug.set(
        String(certificate.credit_slug),
        (creditRetiredTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          certificateRetiredTotal,
      );
    });

    const certificateCollectionRetiredTotal = Array.from(
      collectionRetiredTotalsBySlug.values(),
    ).reduce((sum, amount) => sum + amount, 0);

    validateTotalMatches({
      ctx,
      actualTotal: totalCreditsFromCertificates,
      expectedTotal: data.summary.total_credits,
      path: ['summary', 'total_credits'],
      message:
        'summary.total_credits must equal sum of certificate.collections[].purchased_amount',
    });

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: !!data.retirement_receipt,
      totalRetiredAmount: certificateCollectionRetiredTotal,
    });
  })
  .meta({
    title: 'Credit Purchase Receipt Data',
    description: 'Complete data structure for a credit purchase receipt',
  });
export type CreditPurchaseReceiptData = z.infer<
  typeof CreditPurchaseReceiptDataSchema
>;
