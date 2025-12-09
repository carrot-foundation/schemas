import { z } from 'zod';
import {
  CreditAmountSchema,
  CreditTokenSymbolSchema,
  EthereumAddressSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  SlugSchema,
  SmartContractSchema,
  TokenIdSchema,
  uniqueBy,
} from '../shared';
import {
  CreditRetirementReceiptSummarySchema,
  MassIdReferenceWithContractSchema,
  ReceiptIdentitySchema,
  createReceiptCertificateSchema,
  createReceiptCollectionSchema,
  createReceiptCreditSchema,
  nearlyEqual,
} from '../shared/receipt';
import {
  validateCountMatches,
  validateSummaryListMatchesData,
  validateTotalMatches,
} from '../shared/receipt/receipt.validation';

export type CreditRetirementReceiptSummary = z.infer<
  typeof CreditRetirementReceiptSummarySchema
>;

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
  amountKey: 'amount',
  amountMeta: {
    title: 'Collection Retirement Amount',
    description: 'Total credits retired from this collection',
  },
  meta: {
    title: 'Collection',
    description: 'Collection included in the retirement',
  },
});

export type CreditRetirementReceiptCollection = z.infer<
  typeof CreditRetirementReceiptCollectionSchema
>;

const CreditRetirementReceiptCreditSchema = createReceiptCreditSchema({
  amountKey: 'amount',
  amountMeta: {
    title: 'Credit Retirement Amount',
    description: 'Total credits retired for this credit type',
  },
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
      title: 'Credit Token Symbol',
      description: 'Symbol of the credit token retired from the certificate',
    }),
    credit_slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'Slug of the credit type retired from the certificate',
      examples: ['carbon', 'organic'],
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

export type CreditRetirementMassIdReference = z.infer<
  typeof MassIdReferenceWithContractSchema
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
    uri: IpfsUriSchema.meta({
      title: 'Purchase Receipt URI',
      description: 'IPFS URI for the purchase receipt metadata',
    }),
    smart_contract: SmartContractSchema,
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
      retired_amount: CreditAmountSchema.meta({
        title: 'Certificate Retired Amount',
        description: 'Credits retired from this certificate',
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
    const creditBySlug = new Map(
      data.credits.map((credit) => [credit.slug, credit]),
    );
    const collectionSlugs = new Set<string>(
      data.collections.map((collection) => String(collection.slug)),
    );
    const certificateTypes = new Set<string>(
      data.certificates.map((certificate) => String(certificate.type)),
    );

    validateCountMatches({
      ctx,
      actualCount: data.certificates.length,
      expectedCount: data.summary.total_certificates,
      path: ['summary', 'total_certificates'],
      message:
        'summary.total_certificates must equal the number of certificates',
    });

    validateSummaryListMatchesData({
      ctx,
      summaryValues: data.summary.credit_symbols,
      dataValues: creditSymbols,
      summaryPath: ['summary', 'credit_symbols'],
      missingFromDataMessage:
        'summary.credit_symbols must reference symbols from credits',
      missingFromSummaryMessage:
        'All credit symbols must be listed in summary.credit_symbols',
    });

    validateSummaryListMatchesData({
      ctx,
      summaryValues: data.summary.collection_slugs,
      dataValues: collectionSlugs,
      summaryPath: ['summary', 'collection_slugs'],
      missingFromDataMessage:
        'summary.collection_slugs must reference slugs from collections',
      missingFromSummaryMessage:
        'All collection slugs must be listed in summary.collection_slugs',
    });

    validateSummaryListMatchesData({
      ctx,
      summaryValues: data.summary.certificate_types,
      dataValues: certificateTypes,
      summaryPath: ['summary', 'certificate_types'],
      missingFromDataMessage:
        'summary.certificate_types must reference types present in certificates',
      missingFromSummaryMessage:
        'All certificate types must be listed in summary.certificate_types',
    });

    const creditTotalsBySymbol = new Map<string, number>();
    const collectionTotalsBySlug = new Map<string, number>();
    let totalRetiredFromCertificates = 0;

    data.certificates.forEach((certificate, index) => {
      if (!collectionSlugs.has(certificate.collection_slug)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'collection_slug must match a collection slug in collections',
          path: ['certificates', index, 'collection_slug'],
        });
      }

      if (certificate.retired_amount > certificate.total_amount) {
        ctx.addIssue({
          code: 'custom',
          message: 'retired_amount cannot exceed total_amount',
          path: ['certificates', index, 'retired_amount'],
        });
      }

      const creditsRetiredTotal = certificate.credits_retired.reduce(
        (sum, credit) => sum + Number(credit.amount),
        0,
      );

      if (!nearlyEqual(creditsRetiredTotal, certificate.retired_amount)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'certificates.credits_retired amounts must sum to certificates.retired_amount',
          path: ['certificates', index, 'credits_retired'],
        });
      }

      certificate.credits_retired.forEach((credit, creditIndex) => {
        const referencedCredit = creditBySlug.get(credit.credit_slug);
        if (!referencedCredit) {
          ctx.addIssue({
            code: 'custom',
            message: 'credit_slug must match a credit slug in credits',
            path: [
              'certificates',
              index,
              'credits_retired',
              creditIndex,
              'credit_slug',
            ],
          });
        }

        if (!creditSymbols.has(credit.credit_symbol)) {
          ctx.addIssue({
            code: 'custom',
            message: 'credit_symbol must match a credit symbol in credits',
            path: [
              'certificates',
              index,
              'credits_retired',
              creditIndex,
              'credit_symbol',
            ],
          });
        }

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

      collectionTotalsBySlug.set(
        String(certificate.collection_slug),
        (collectionTotalsBySlug.get(certificate.collection_slug) ?? 0) +
          Number(certificate.retired_amount),
      );

      totalRetiredFromCertificates += Number(certificate.retired_amount);
    });

    const totalRetiredFromCollections = data.collections.reduce(
      (sum, collection) => sum + Number(collection.amount),
      0,
    );

    const totalRetiredFromCredits = data.credits.reduce(
      (sum, credit) => sum + Number(credit.amount),
      0,
    );

    data.summary.credit_symbols.forEach((symbol) => {
      if ((creditTotalsBySymbol.get(symbol) ?? 0) === 0) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Each summary credit symbol must appear in certificates.credits_retired with a retired amount',
          path: ['summary', 'credit_symbols'],
        });
      }
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalRetiredFromCertificates,
      expectedTotal: data.summary.total_retirement_amount,
      path: ['summary', 'total_retirement_amount'],
      message:
        'summary.total_retirement_amount must equal sum of certificates.retired_amount',
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalRetiredFromCredits,
      expectedTotal: data.summary.total_retirement_amount,
      path: ['summary', 'total_retirement_amount'],
      message:
        'summary.total_retirement_amount must equal sum of credits.amount',
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalRetiredFromCollections,
      expectedTotal: data.summary.total_retirement_amount,
      path: ['summary', 'total_retirement_amount'],
      message:
        'summary.total_retirement_amount must equal sum of collections.amount',
    });

    data.credits.forEach((credit, index) => {
      const retiredTotal = creditTotalsBySymbol.get(String(credit.symbol)) ?? 0;
      if (!nearlyEqual(Number(credit.amount), retiredTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit.amount must equal sum of retired amounts for the credit symbol across certificates',
          path: ['credits', index, 'amount'],
        });
      }
    });

    data.collections.forEach((collection, index) => {
      const retiredTotal =
        collectionTotalsBySlug.get(String(collection.slug)) ?? 0;
      if (!nearlyEqual(Number(collection.amount), retiredTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'collection.amount must equal sum of certificate retired_amount for the collection slug',
          path: ['collections', index, 'amount'],
        });
      }
    });
  })
  .meta({
    title: 'Credit Retirement Receipt Data',
    description: 'Complete data structure for a credit retirement receipt',
  });

export type CreditRetirementReceiptData = z.infer<
  typeof CreditRetirementReceiptDataSchema
>;
