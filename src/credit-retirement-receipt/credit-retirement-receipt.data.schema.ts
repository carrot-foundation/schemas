import { z } from 'zod';
import {
  CollectionNameSchema,
  CollectionSlugSchema,
  CreditAmountSchema,
  EthereumAddressSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateSchema,
  ParticipantNameSchema,
  PositiveIntegerSchema,
  RecordSchemaTypeSchema,
  SlugSchema,
  SmartContractSchema,
  TokenIdSchema,
  CreditTokenSymbolSchema,
  uniqueArrayItems,
  uniqueBy,
} from '../shared';
import { MassIDReferenceSchema } from '../shared/references/mass-id-reference.schema';

const CreditRetirementReceiptSummarySchema = z
  .strictObject({
    total_retirement_amount: CreditAmountSchema.meta({
      title: 'Total Retirement Amount',
      description: 'Total amount of credits retired',
    }),
    total_certificates: PositiveIntegerSchema.meta({
      title: 'Total Certificates',
      description: 'Total number of certificates retired',
    }),
    retirement_date: IsoDateSchema.meta({
      title: 'Retirement Date',
      description: 'Date when the retirement occurred (YYYY-MM-DD)',
    }),
    credit_symbols: uniqueArrayItems(
      CreditTokenSymbolSchema,
      'Credit symbols must be unique',
    )
      .min(1)
      .meta({
        title: 'Credit Symbols',
        description: 'Array of credit token symbols retired',
      }),
    certificate_types: uniqueArrayItems(
      RecordSchemaTypeSchema.extract(['GasID', 'RecycledID']),
      'Certificate types must be unique',
    )
      .min(1)
      .meta({
        title: 'Certificate Types',
        description: 'Array of certificate types included in the retirement',
      }),
    collection_slugs: uniqueArrayItems(
      CollectionSlugSchema,
      'Collection slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Collection Slugs',
        description: 'Array of collection slugs represented in the retirement',
      }),
  })
  .meta({
    title: 'Credit Retirement Receipt Summary',
    description:
      'Summary totals for the credit retirement including amounts and collections represented',
  });

export type CreditRetirementReceiptSummary = z.infer<
  typeof CreditRetirementReceiptSummarySchema
>;

const CreditRetirementReceiptIdentitySchema = z
  .strictObject({
    name: ParticipantNameSchema.meta({
      title: 'Identity Name',
      description: 'Display name for the participant',
      examples: ['Climate Action Corp'],
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Identity External ID',
      description: 'External identifier for the participant',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Identity External URL',
      description: 'External URL for the participant profile',
    }),
  })
  .meta({
    title: 'Identity',
    description: 'Participant identity information',
  });

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

const CreditRetirementReceiptCollectionSchema = z
  .strictObject({
    slug: CollectionSlugSchema,
    external_id: ExternalIdSchema.meta({
      title: 'Collection External ID',
      description: 'External identifier for the collection',
    }),
    name: CollectionNameSchema,
    external_url: ExternalUrlSchema.meta({
      title: 'Collection External URL',
      description: 'External URL for the collection',
    }),
    uri: IpfsUriSchema.meta({
      title: 'Collection URI',
      description: 'IPFS URI for the collection metadata',
    }),
    amount: CreditAmountSchema.meta({
      title: 'Collection Retirement Amount',
      description: 'Total credits retired from this collection',
    }),
  })
  .meta({
    title: 'Collection',
    description: 'Collection included in the retirement',
  });

export type CreditRetirementReceiptCollection = z.infer<
  typeof CreditRetirementReceiptCollectionSchema
>;

const CreditRetirementReceiptCreditSchema = z
  .strictObject({
    slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'URL-friendly identifier for the credit',
      examples: ['carbon', 'organic'],
    }),
    symbol: CreditTokenSymbolSchema.meta({
      title: 'Credit Token Symbol',
      description: 'Symbol of the credit token',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Credit External ID',
      description: 'External identifier for the credit',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Credit External URL',
      description: 'External URL for the credit',
    }),
    uri: IpfsUriSchema.meta({
      title: 'Credit URI',
      description: 'IPFS URI for the credit details',
    }),
    smart_contract: SmartContractSchema,
    amount: CreditAmountSchema.meta({
      title: 'Credit Retirement Amount',
      description: 'Total credits retired for this credit type',
    }),
  })
  .meta({
    title: 'Credit',
    description: 'Credit token retired in this receipt',
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

const CreditRetirementMassIdReferenceSchema = MassIDReferenceSchema.extend({
  smart_contract: SmartContractSchema,
}).meta({
  title: 'MassID Reference with Smart Contract',
  description: 'Reference to a MassID record including smart contract details',
});

export type CreditRetirementMassIdReference = z.infer<
  typeof CreditRetirementMassIdReferenceSchema
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

const CreditRetirementReceiptCertificateSchema = z
  .strictObject({
    token_id: TokenIdSchema.meta({
      title: 'Certificate Token ID',
      description: 'Token ID of the certificate',
    }),
    type: RecordSchemaTypeSchema.extract(['GasID', 'RecycledID']).meta({
      title: 'Certificate Type',
      description: 'Type of certificate (e.g., GasID, RecycledID)',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Certificate External ID',
      description: 'External identifier for the certificate',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Certificate External URL',
      description: 'External URL for the certificate',
    }),
    uri: IpfsUriSchema.meta({
      title: 'Certificate URI',
      description: 'IPFS URI for the certificate metadata',
    }),
    smart_contract: SmartContractSchema,
    collection_slug: CollectionSlugSchema.meta({
      title: 'Collection Slug',
      description: 'Slug of the collection this certificate belongs to',
    }),
    total_amount: CreditAmountSchema.meta({
      title: 'Certificate Total Amount',
      description: 'Total credits available in this certificate',
    }),
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
    mass_id: CreditRetirementMassIdReferenceSchema,
  })
  .meta({
    title: 'Certificate',
    description: 'Certificate associated with the retirement',
  });

export type CreditRetirementReceiptCertificate = z.infer<
  typeof CreditRetirementReceiptCertificateSchema
>;

const EPSILON = 1e-9;

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON;
}

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
    const creditSymbols = new Set(data.credits.map((credit) => credit.symbol));
    const creditBySlug = new Map(
      data.credits.map((credit) => [credit.slug, credit]),
    );
    const collectionSlugs = new Set(
      data.collections.map((collection) => collection.slug),
    );
    const summaryCreditSymbols = new Set(data.summary.credit_symbols);
    const summaryCollectionSlugs = new Set(data.summary.collection_slugs);
    const summaryCertificateTypes = new Set(data.summary.certificate_types);
    const certificateTypes = new Set(
      data.certificates.map((certificate) => certificate.type),
    );

    if (data.summary.total_certificates !== data.certificates.length) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_certificates must equal the number of certificates',
        path: ['summary', 'total_certificates'],
      });
    }

    data.summary.credit_symbols.forEach((symbol) => {
      if (!creditSymbols.has(symbol)) {
        ctx.addIssue({
          code: 'custom',
          message: 'summary.credit_symbols must reference symbols from credits',
          path: ['summary', 'credit_symbols'],
        });
      }
    });

    creditSymbols.forEach((symbol) => {
      if (!summaryCreditSymbols.has(symbol)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'All credit symbols must be listed in summary.credit_symbols',
          path: ['summary', 'credit_symbols'],
        });
      }
    });

    data.summary.collection_slugs.forEach((slug) => {
      if (!collectionSlugs.has(slug)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'summary.collection_slugs must reference slugs from collections',
          path: ['summary', 'collection_slugs'],
        });
      }
    });

    collectionSlugs.forEach((slug) => {
      if (!summaryCollectionSlugs.has(slug)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'All collection slugs must be listed in summary.collection_slugs',
          path: ['summary', 'collection_slugs'],
        });
      }
    });

    data.summary.certificate_types.forEach((type) => {
      if (!certificateTypes.has(type)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'summary.certificate_types must reference types present in certificates',
          path: ['summary', 'certificate_types'],
        });
      }
    });

    certificateTypes.forEach((type) => {
      if (!summaryCertificateTypes.has(type)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'All certificate types must be listed in summary.certificate_types',
          path: ['summary', 'certificate_types'],
        });
      }
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
        (sum, credit) => sum + credit.amount,
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
        certificate.collection_slug,
        (collectionTotalsBySlug.get(certificate.collection_slug) ?? 0) +
          certificate.retired_amount,
      );

      totalRetiredFromCertificates += certificate.retired_amount;
    });

    const totalRetiredFromCollections = data.collections.reduce(
      (sum, collection) => sum + collection.amount,
      0,
    );

    const totalRetiredFromCredits = data.credits.reduce(
      (sum, credit) => sum + credit.amount,
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

    if (
      !nearlyEqual(
        totalRetiredFromCertificates,
        data.summary.total_retirement_amount,
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_retirement_amount must equal sum of certificates.retired_amount',
        path: ['summary', 'total_retirement_amount'],
      });
    }

    if (
      !nearlyEqual(
        totalRetiredFromCredits,
        data.summary.total_retirement_amount,
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_retirement_amount must equal sum of credits.amount',
        path: ['summary', 'total_retirement_amount'],
      });
    }

    if (
      !nearlyEqual(
        totalRetiredFromCollections,
        data.summary.total_retirement_amount,
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_retirement_amount must equal sum of collections.amount',
        path: ['summary', 'total_retirement_amount'],
      });
    }

    data.credits.forEach((credit, index) => {
      const retiredTotal = creditTotalsBySymbol.get(credit.symbol) ?? 0;
      if (!nearlyEqual(credit.amount, retiredTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit.amount must equal sum of retired amounts for the credit symbol across certificates',
          path: ['credits', index, 'amount'],
        });
      }
    });

    data.collections.forEach((collection, index) => {
      const retiredTotal = collectionTotalsBySlug.get(collection.slug) ?? 0;
      if (!nearlyEqual(collection.amount, retiredTotal)) {
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
