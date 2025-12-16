import { z } from 'zod';
import {
  CreditAmountSchema,
  CreditTokenSymbolSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  TokenIdSchema,
  uniqueBy,
  CreditRetirementReceiptSummarySchema,
  ReceiptIdentitySchema,
  CertificateCollectionItemRetirementSchema,
  createReceiptCertificateSchema,
  createReceiptCollectionSchema,
  createReceiptCreditSchema,
  nearlyEqual,
  validateCountMatches,
  validateTotalMatches,
  CreditTokenSlugSchema,
  EthereumAddressSchema,
  validateCertificateCollectionSlugs,
  validateCollectionsHaveRetiredAmounts,
  validateCreditSlugExists,
  validateCreditSymbolExists,
  SmartContractAddressSchema,
} from '../shared';

const CreditRetirementReceiptIdentitySchema = ReceiptIdentitySchema;
export type CreditRetirementReceiptIdentity = z.infer<
  typeof CreditRetirementReceiptIdentitySchema
>;

const CreditRetirementReceiptBeneficiarySchema = z
  .strictObject({
    beneficiary_id: ExternalIdSchema.meta({
      title: 'Retirement Beneficiary ID',
      description:
        'UUID identifying the beneficiary of the retirement (bytes16 normalized to UUID)',
    }),
    identity: CreditRetirementReceiptIdentitySchema,
  })
  .meta({
    title: 'Beneficiary',
    description: 'Beneficiary receiving the retirement benefit',
  });
export type CreditRetirementReceiptBeneficiary = z.infer<
  typeof CreditRetirementReceiptBeneficiarySchema
>;

const CreditRetirementReceiptCreditHolderSchema = z
  .strictObject({
    wallet_address: EthereumAddressSchema.meta({
      title: 'Credit Holder Wallet Address',
      description: 'Ethereum address of the credit holder surrendering credits',
    }),
    identity: CreditRetirementReceiptIdentitySchema.optional(),
  })
  .meta({
    title: 'Credit Holder',
    description: 'Credit holder wallet and optional identity information',
  });
export type CreditRetirementReceiptCreditHolder = z.infer<
  typeof CreditRetirementReceiptCreditHolderSchema
>;

const CreditRetirementReceiptCollectionSchema = createReceiptCollectionSchema({
  meta: {
    title: 'Collection',
    description: 'Collection included in the retirement',
  },
});
export type CreditRetirementReceiptCollection = z.infer<
  typeof CreditRetirementReceiptCollectionSchema
>;

const CreditRetirementReceiptCreditSchema = createReceiptCreditSchema({
  meta: {
    title: 'Credit',
    description: 'Credit token retired in this receipt',
  },
});
export type CreditRetirementReceiptCredit = z.infer<
  typeof CreditRetirementReceiptCreditSchema
>;

const CreditRetirementReceiptCertificateCreditSchema = z
  .strictObject({
    credit_symbol: CreditTokenSymbolSchema.meta({
      description: 'Symbol of the credit token retired from the certificate',
    }),
    credit_slug: CreditTokenSlugSchema.meta({
      description: 'Slug of the credit type retired from the certificate',
    }),
    amount: CreditAmountSchema.meta({
      title: 'Retired Credit Amount',
      description: 'Credits retired of this type from the certificate',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Retired Credit External ID',
      description: 'External identifier for the retired credit entry',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Retired Credit External URL',
      description: 'External URL for the retired credit entry',
    }),
  })
  .meta({
    title: 'Certificate Credit Retirement',
    description: 'Credit retirement breakdown for a certificate',
  });
export type CreditRetirementReceiptCertificateCredit = z.infer<
  typeof CreditRetirementReceiptCertificateCreditSchema
>;

const CreditPurchaseReceiptReferenceSchema = z
  .strictObject({
    token_id: TokenIdSchema.meta({
      title: 'Purchase Receipt Token ID',
      description: 'Token ID of the credit purchase receipt',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Purchase Receipt External ID',
      description: 'External identifier for the purchase receipt',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Purchase Receipt External URL',
      description: 'External URL for the purchase receipt',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Purchase Receipt IPFS URI',
      description: 'IPFS URI for the purchase receipt metadata',
    }),
    smart_contract_address: SmartContractAddressSchema,
  })
  .meta({
    title: 'Credit Purchase Receipt Reference',
    description:
      'Reference to the credit purchase receipt when retirement occurs during purchase',
  });
export type CreditPurchaseReceiptReference = z.infer<
  typeof CreditPurchaseReceiptReferenceSchema
>;

const CreditRetirementReceiptCertificateSchema = createReceiptCertificateSchema(
  {
    additionalShape: {
      collections: uniqueBy(
        CertificateCollectionItemRetirementSchema,
        (item) => item.slug,
        'Collection slugs within certificate collections must be unique',
      )
        .min(1)
        .meta({
          title: 'Certificate Collections',
          description:
            'Collections associated with this certificate, each with retired amounts',
        }),
      credits_retired: uniqueBy(
        CreditRetirementReceiptCertificateCreditSchema,
        (credit) => credit.credit_symbol,
        'Credit symbols within credits_retired must be unique',
      )
        .min(1)
        .meta({
          title: 'Credits Retired',
          description:
            'Breakdown of credits retired from this certificate by symbol',
        }),
    },
    meta: {
      title: 'Certificate',
      description: 'Certificate associated with the retirement',
    },
  },
);
export type CreditRetirementReceiptCertificate = z.infer<
  typeof CreditRetirementReceiptCertificateSchema
>;

export const CreditRetirementReceiptDataSchema = z
  .strictObject({
    summary: CreditRetirementReceiptSummarySchema,
    beneficiary: CreditRetirementReceiptBeneficiarySchema,
    credit_holder: CreditRetirementReceiptCreditHolderSchema,
    collections: uniqueBy(
      CreditRetirementReceiptCollectionSchema,
      (collection) => collection.slug,
      'Collection slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Collections',
        description: 'Collections included in the retirement',
      }),
    credits: uniqueBy(
      CreditRetirementReceiptCreditSchema,
      (credit) => credit.slug,
      'Credit slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Credits',
        description: 'Credits included in the retirement',
      }),
    certificates: uniqueBy(
      CreditRetirementReceiptCertificateSchema,
      (certificate) => certificate.token_id,
      'Certificate token_ids must be unique',
    )
      .min(1)
      .meta({
        title: 'Certificates',
        description: 'Certificates retired in this receipt',
      }),
    purchase_receipt: CreditPurchaseReceiptReferenceSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const creditSymbols = new Set<string>(
      data.credits.map((credit) => String(credit.symbol)),
    );
    const creditSlugs = new Set<string>(
      data.credits.map((credit) => String(credit.slug)),
    );
    const creditBySlug = new Map(
      data.credits.map((credit) => [credit.slug, credit]),
    );
    const collectionSlugs = new Set<string>(
      data.collections.map((collection) => String(collection.slug)),
    );

    validateCountMatches({
      ctx,
      actualCount: data.certificates.length,
      expectedCount: data.summary.total_certificates,
      path: ['summary', 'total_certificates'],
      message:
        'summary.total_certificates must equal the number of certificates',
    });

    const creditTotalsBySymbol = new Map<string, number>();
    const collectionRetiredTotalsBySlug = new Map<string, number>();
    let totalRetiredFromCertificates = 0;

    data.certificates.forEach((certificate, index) => {
      const certificateCollectionRetiredTotal = certificate.collections.reduce(
        (sum, item) => sum + Number(item.retired_amount),
        0,
      );

      if (certificateCollectionRetiredTotal > certificate.total_amount) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Sum of certificate.collections[].retired_amount cannot exceed certificate.total_amount',
          path: ['certificates', index],
        });
      }

      validateCertificateCollectionSlugs({
        ctx,
        certificateCollections: certificate.collections,
        validCollectionSlugs: collectionSlugs,
        certificateIndex: index,
      });

      certificate.collections.forEach((collectionItem) => {
        collectionRetiredTotalsBySlug.set(
          collectionItem.slug,
          (collectionRetiredTotalsBySlug.get(collectionItem.slug) ?? 0) +
            Number(collectionItem.retired_amount),
        );
      });

      const creditsRetiredTotal = certificate.credits_retired.reduce(
        (sum, credit) => sum + Number(credit.amount),
        0,
      );

      if (
        !nearlyEqual(creditsRetiredTotal, certificateCollectionRetiredTotal)
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'certificates.credits_retired amounts must sum to certificate.collections[].retired_amount',
          path: ['certificates', index, 'credits_retired'],
        });
      }

      certificate.credits_retired.forEach((credit, creditIndex) => {
        const referencedCredit = creditBySlug.get(credit.credit_slug);

        validateCreditSlugExists({
          ctx,
          creditSlug: credit.credit_slug,
          validCreditSlugs: creditSlugs,
          path: [
            'certificates',
            index,
            'credits_retired',
            creditIndex,
            'credit_slug',
          ],
        });

        validateCreditSymbolExists({
          ctx,
          creditSymbol: credit.credit_symbol,
          validCreditSymbols: creditSymbols,
          path: [
            'certificates',
            index,
            'credits_retired',
            creditIndex,
            'credit_symbol',
          ],
        });

        if (
          referencedCredit &&
          referencedCredit.symbol !== credit.credit_symbol
        ) {
          ctx.addIssue({
            code: 'custom',
            message:
              'credit_symbol must match the symbol for the referenced credit_slug',
            path: [
              'certificates',
              index,
              'credits_retired',
              creditIndex,
              'credit_symbol',
            ],
          });
        }

        creditTotalsBySymbol.set(
          credit.credit_symbol,
          (creditTotalsBySymbol.get(credit.credit_symbol) ?? 0) + credit.amount,
        );
      });

      totalRetiredFromCertificates += certificateCollectionRetiredTotal;
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalRetiredFromCertificates,
      expectedTotal: data.summary.total_credits_retired,
      path: ['summary', 'total_credits_retired'],
      message:
        'summary.total_credits_retired must equal sum of certificate.collections[].retired_amount',
    });

    validateCollectionsHaveRetiredAmounts({
      ctx,
      collections: data.collections,
      retiredTotalsBySlug: collectionRetiredTotalsBySlug,
    });
  })
  .meta({
    title: 'Credit Retirement Receipt Data',
    description: 'Complete data structure for a credit retirement receipt',
  });
export type CreditRetirementReceiptData = z.infer<
  typeof CreditRetirementReceiptDataSchema
>;
