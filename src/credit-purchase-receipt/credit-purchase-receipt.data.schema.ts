import { z } from 'zod';
import {
  CollectionNameSchema,
  CollectionSlugSchema,
  CreditAmountSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateSchema,
  NonNegativeFloatSchema,
  ParticipantNameSchema,
  ParticipantRoleSchema,
  PositiveIntegerSchema,
  RecordSchemaTypeSchema,
  Sha256HashSchema,
  SlugSchema,
  SmartContractSchema,
  TokenIdSchema,
  TokenSymbolSchema,
  EthereumAddressSchema,
  uniqueArrayItems,
  uniqueBy,
} from '../shared';
import { MassIDReferenceSchema } from '../shared/references/mass-id-reference.schema';

const CreditPurchaseReceiptExternalIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Must be a valid UUID string',
  )
  .meta({
    title: 'External ID',
    description: 'UUID string identifier for external references',
    examples: [
      'f1a2b3c4-d5e6-4789-9012-34567890abcd',
      '0f1e2d3c-4b5a-6978-9012-3456789abcde',
    ],
  });

const CreditPurchaseReceiptSummarySchema = z
  .strictObject({
    total_usdc_amount: NonNegativeFloatSchema.meta({
      title: 'Total USDC Amount',
      description: 'Total amount paid in USDC for the purchase',
      examples: [1950],
    }),
    total_credits: NonNegativeFloatSchema.meta({
      title: 'Total Credits',
      description: 'Total amount of credits purchased',
      examples: [8.5],
    }),
    total_certificates: PositiveIntegerSchema.meta({
      title: 'Total Certificates',
      description: 'Total number of certificates purchased',
      examples: [3],
    }),
    purchase_date: IsoDateSchema.meta({
      title: 'Purchase Date',
      description: 'Date when the purchase was made (YYYY-MM-DD)',
      examples: ['2025-02-03'],
    }),
    credit_symbols: uniqueArrayItems(
      TokenSymbolSchema,
      'Credit symbols must be unique',
    )
      .min(1)
      .meta({
        title: 'Credit Symbols',
        description: 'Array of credit token symbols included in the purchase',
        examples: [['C-CARB', 'C-BIOW']],
      }),
    certificate_types: uniqueArrayItems(
      RecordSchemaTypeSchema.extract(['GasID', 'RecycledID']),
      'Certificate types must be unique',
    )
      .min(1)
      .meta({
        title: 'Certificate Types',
        description: 'Array of certificate types included in the purchase',
        examples: [['GasID', 'RecycledID']],
      }),
    collection_slugs: uniqueArrayItems(
      CollectionSlugSchema,
      'Collection slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Collection Slugs',
        description: 'Array of collection slugs represented in the purchase',
        examples: [['bold-cold-start-carazinho', 'bold-brazil']],
      }),
  })
  .meta({
    title: 'Credit Purchase Receipt Summary',
    description:
      'Summary totals for the credit purchase including amounts and collections represented',
  });

export type CreditPurchaseReceiptSummary = z.infer<
  typeof CreditPurchaseReceiptSummarySchema
>;

const CreditPurchaseReceiptIdentitySchema = z
  .strictObject({
    name: ParticipantNameSchema.meta({
      title: 'Identity Name',
      description: 'Display name for the participant',
      examples: ['EcoTech Solutions Inc.'],
    }),
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
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

export type CreditPurchaseReceiptIdentity = z.infer<
  typeof CreditPurchaseReceiptIdentitySchema
>;

const CreditPurchaseReceiptReceiverSchema = z
  .strictObject({
    wallet_address: EthereumAddressSchema.meta({
      title: 'Receiver Wallet Address',
      description: 'Ethereum address of the receiver',
    }),
    identity: CreditPurchaseReceiptIdentitySchema.optional(),
  })
  .meta({
    title: 'Receiver',
    description: 'Receiver wallet and optional identity information',
  });

export type CreditPurchaseReceiptReceiver = z.infer<
  typeof CreditPurchaseReceiptReceiverSchema
>;

const CreditPurchaseReceiptBuyerSchema = z
  .strictObject({
    buyer_id: CreditPurchaseReceiptExternalIdSchema.meta({
      title: 'Buyer ID',
      description: 'Unique identifier for the buyer',
    }),
    identity: CreditPurchaseReceiptIdentitySchema.optional(),
  })
  .meta({
    title: 'Buyer',
    description: 'Buyer identifier and optional identity information',
  });

export type CreditPurchaseReceiptBuyer = z.infer<
  typeof CreditPurchaseReceiptBuyerSchema
>;

const CreditPurchaseReceiptPartiesSchema = z
  .strictObject({
    payer: EthereumAddressSchema.meta({
      title: 'Payer Wallet Address',
      description: 'Ethereum address paying for the purchase',
    }),
    receiver: CreditPurchaseReceiptReceiverSchema,
    buyer: CreditPurchaseReceiptBuyerSchema.optional(),
  })
  .meta({
    title: 'Parties',
    description:
      'Parties involved in the purchase including payer, receiver, and optional buyer',
  });

export type CreditPurchaseReceiptParties = z.infer<
  typeof CreditPurchaseReceiptPartiesSchema
>;

const CreditPurchaseReceiptCollectionSchema = z
  .strictObject({
    slug: CollectionSlugSchema,
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
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
    credit_amount: CreditAmountSchema.meta({
      title: 'Collection Credit Amount',
      description: 'Total credits purchased from this collection',
      examples: [5, 3.5],
    }),
  })
  .meta({
    title: 'Collection',
    description: 'Collection included in the purchase',
  });

export type CreditPurchaseReceiptCollection = z.infer<
  typeof CreditPurchaseReceiptCollectionSchema
>;

const CreditPurchaseReceiptCreditSchema = z
  .strictObject({
    slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'URL-friendly identifier for the credit',
      examples: ['carbon', 'organic'],
    }),
    symbol: TokenSymbolSchema.meta({
      title: 'Credit Token Symbol',
      description: 'Symbol of the credit token',
      examples: ['C-CARB', 'C-BIOW'],
    }),
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
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
    purchase_amount: CreditAmountSchema.meta({
      title: 'Credit Purchase Amount',
      description: 'Total credits purchased for this credit type',
    }),
    retirement_amount: CreditAmountSchema.optional().meta({
      title: 'Credit Retirement Amount',
      description:
        'Credits retired immediately for this credit type during purchase',
      examples: [0, 2],
    }),
  })
  .meta({
    title: 'Credit',
    description: 'Credit token included in the purchase',
  });

export type CreditPurchaseReceiptCredit = z.infer<
  typeof CreditPurchaseReceiptCreditSchema
>;

const MassIdReferenceWithContractSchema = MassIDReferenceSchema.omit({
  external_id: true,
})
  .extend({
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
      title: 'MassID External ID',
      description: 'Unique identifier for the referenced MassID',
    }),
    smart_contract: SmartContractSchema,
  })
  .meta({
    title: 'MassID Reference with Smart Contract',
    description:
      'Reference to a MassID record including smart contract details',
  });

export type MassIdReferenceWithContract = z.infer<
  typeof MassIdReferenceWithContractSchema
>;

const CreditPurchaseReceiptCertificateSchema = z
  .strictObject({
    token_id: TokenIdSchema.meta({
      title: 'Certificate Token ID',
      description: 'Token ID of the certificate',
      examples: ['456', '789'],
    }),
    type: RecordSchemaTypeSchema.extract(['GasID', 'RecycledID']).meta({
      title: 'Certificate Type',
      description: 'Type of certificate (e.g., GasID, RecycledID)',
    }),
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
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
    purchased_amount: CreditAmountSchema.meta({
      title: 'Certificate Purchased Amount',
      description: 'Credits purchased from this certificate',
    }),
    retired_amount: CreditAmountSchema.meta({
      title: 'Certificate Retired Amount',
      description:
        'Credits retired from this certificate during the purchase (0 if none)',
    }),
    credit_slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'Slug of the credit type for this certificate',
      examples: ['carbon', 'organic'],
    }),
    mass_id: MassIdReferenceWithContractSchema,
  })
  .meta({
    title: 'Certificate',
    description: 'Certificate associated with the purchase',
  });

export type CreditPurchaseReceiptCertificate = z.infer<
  typeof CreditPurchaseReceiptCertificateSchema
>;

const CreditPurchaseReceiptParticipantRewardSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description:
        'Hash representing the participant identifier (SHA-256 hex string)',
    }),
    participant_name: ParticipantNameSchema.meta({
      title: 'Participant Name',
      description: 'Legal name of the participant receiving the reward',
    }),
    roles: uniqueArrayItems(
      ParticipantRoleSchema,
      'Participant roles must be unique',
    )
      .min(1)
      .meta({
        title: 'Participant Roles',
        description: 'Roles the participant has in the supply chain',
      }),
    usdc_amount: NonNegativeFloatSchema.meta({
      title: 'USDC Reward Amount',
      description: 'USDC amount allocated to this participant',
      examples: [487.5],
    }),
  })
  .meta({
    title: 'Participant Reward',
    description: 'Reward distribution for a participant',
  });

export type CreditPurchaseReceiptParticipantReward = z.infer<
  typeof CreditPurchaseReceiptParticipantRewardSchema
>;

const CreditPurchaseReceiptRetirementReceiptSchema = z
  .strictObject({
    token_id: TokenIdSchema.meta({
      title: 'Retirement Receipt Token ID',
      description: 'Token ID of the retirement receipt NFT',
    }),
    external_id: CreditPurchaseReceiptExternalIdSchema.meta({
      title: 'Retirement Receipt External ID',
      description: 'External identifier for the retirement receipt',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Retirement Receipt External URL',
      description: 'External URL for the retirement receipt',
    }),
    uri: IpfsUriSchema.meta({
      title: 'Retirement Receipt URI',
      description: 'IPFS URI for the retirement receipt metadata',
    }),
    smart_contract: SmartContractSchema,
  })
  .meta({
    title: 'Retirement Receipt Reference',
    description: 'Reference to the retirement receipt NFT',
  });

export type CreditPurchaseReceiptRetirementReceipt = z.infer<
  typeof CreditPurchaseReceiptRetirementReceiptSchema
>;

const CreditPurchaseReceiptRetirementSchema = z
  .strictObject({
    beneficiary_id: CreditPurchaseReceiptExternalIdSchema.meta({
      title: 'Retirement Beneficiary ID',
      description:
        'UUID identifying the beneficiary of the retirement (bytes16 normalized to UUID)',
    }),
    retirement_receipt: CreditPurchaseReceiptRetirementReceiptSchema.optional(),
  })
  .meta({
    title: 'Retirement',
    description: 'Immediate retirement details performed as part of purchase',
  });

export type CreditPurchaseReceiptRetirement = z.infer<
  typeof CreditPurchaseReceiptRetirementSchema
>;

const EPSILON = 1e-9;

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON;
}

export const CreditPurchaseReceiptDataSchema = z
  .strictObject({
    summary: CreditPurchaseReceiptSummarySchema,
    parties: CreditPurchaseReceiptPartiesSchema,
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
    participant_rewards: uniqueBy(
      CreditPurchaseReceiptParticipantRewardSchema,
      (reward) => reward.id_hash,
      'Participant id_hash must be unique',
    )
      .min(1)
      .meta({
        title: 'Participant Rewards',
        description:
          'Rewards distributed to participants in the supply chain for this purchase',
      }),
    retirement: CreditPurchaseReceiptRetirementSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const retirementProvided = Boolean(data.retirement);
    const creditsWithRetirement = data.credits.reduce<number[]>(
      (indices, credit, index) => {
        if ((credit.retirement_amount ?? 0) > 0) {
          indices.push(index);
        }
        return indices;
      },
      [],
    );

    if (retirementProvided && creditsWithRetirement.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message:
          'retirement is present but no credit has retirement_amount greater than 0',
        path: ['retirement'],
      });
    }

    if (!retirementProvided && creditsWithRetirement.length > 0) {
      creditsWithRetirement.forEach((index) => {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit retirement_amount greater than 0 requires retirement details',
          path: ['credits', index, 'retirement_amount'],
        });
      });
    }

    const collectionSlugs = new Set(
      data.collections.map((collection) => collection.slug),
    );
    const creditSlugs = new Set(data.credits.map((credit) => credit.slug));
    const creditSymbols = new Set(data.credits.map((credit) => credit.symbol));
    const summaryCreditSymbols = new Set(data.summary.credit_symbols);
    const summaryCollectionSlugs = new Set(data.summary.collection_slugs);
    const summaryCertificateTypes = new Set(data.summary.certificate_types);

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

    const certificateTypes = new Set(
      data.certificates.map((certificate) => certificate.type),
    );
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

    const creditPurchaseTotalsBySlug = new Map<string, number>();
    const creditRetiredTotalsBySlug = new Map<string, number>();
    const collectionTotalsBySlug = new Map<string, number>();
    let totalCreditsFromCertificates = 0;

    data.certificates.forEach((certificate, index) => {
      if (!collectionSlugs.has(certificate.collection_slug)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'collection_slug must match a collection slug in collections',
          path: ['certificates', index, 'collection_slug'],
        });
      }

      if (!creditSlugs.has(certificate.credit_slug)) {
        ctx.addIssue({
          code: 'custom',
          message: 'credit_slug must match a credit slug in credits',
          path: ['certificates', index, 'credit_slug'],
        });
      }

      if (certificate.retired_amount > certificate.purchased_amount) {
        ctx.addIssue({
          code: 'custom',
          message: 'retired_amount cannot exceed purchased_amount',
          path: ['certificates', index, 'retired_amount'],
        });
      }

      if (certificate.purchased_amount > certificate.total_amount) {
        ctx.addIssue({
          code: 'custom',
          message: 'purchased_amount cannot exceed total_amount',
          path: ['certificates', index, 'purchased_amount'],
        });
      }

      totalCreditsFromCertificates += certificate.purchased_amount;

      creditPurchaseTotalsBySlug.set(
        certificate.credit_slug,
        (creditPurchaseTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          certificate.purchased_amount,
      );
      creditRetiredTotalsBySlug.set(
        certificate.credit_slug,
        (creditRetiredTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          certificate.retired_amount,
      );
      collectionTotalsBySlug.set(
        certificate.collection_slug,
        (collectionTotalsBySlug.get(certificate.collection_slug) ?? 0) +
          certificate.purchased_amount,
      );
    });

    const totalCreditsFromCollections = data.collections.reduce(
      (sum, collection) => sum + collection.credit_amount,
      0,
    );

    const totalCreditsFromCredits = data.credits.reduce(
      (sum, credit) => sum + credit.purchase_amount,
      0,
    );

    if (
      !nearlyEqual(totalCreditsFromCertificates, data.summary.total_credits)
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_credits must equal sum of certificates.purchased_amount',
        path: ['summary', 'total_credits'],
      });
    }

    if (!nearlyEqual(totalCreditsFromCredits, data.summary.total_credits)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_credits must equal sum of credits.purchase_amount',
        path: ['summary', 'total_credits'],
      });
    }

    if (!nearlyEqual(totalCreditsFromCollections, data.summary.total_credits)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_credits must equal sum of collections.credit_amount',
        path: ['summary', 'total_credits'],
      });
    }

    data.credits.forEach((credit, index) => {
      const purchasedTotal = creditPurchaseTotalsBySlug.get(credit.slug) ?? 0;
      if (!nearlyEqual(credit.purchase_amount, purchasedTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit.purchase_amount must equal sum of certificate purchased_amount for the credit slug',
          path: ['credits', index, 'purchase_amount'],
        });
      }

      const retiredTotal = creditRetiredTotalsBySlug.get(credit.slug) ?? 0;
      const retirementAmount = credit.retirement_amount ?? 0;
      if (!nearlyEqual(retirementAmount, retiredTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit.retirement_amount must equal sum of certificate retired_amount for the credit slug',
          path: ['credits', index, 'retirement_amount'],
        });
      }
    });

    data.collections.forEach((collection, index) => {
      const purchasedTotal = collectionTotalsBySlug.get(collection.slug) ?? 0;
      if (!nearlyEqual(collection.credit_amount, purchasedTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'collection.credit_amount must equal sum of certificate purchased_amount for the collection slug',
          path: ['collections', index, 'credit_amount'],
        });
      }
    });

    const participantRewardTotal = data.participant_rewards.reduce(
      (sum, reward) => sum + reward.usdc_amount,
      0,
    );

    if (!nearlyEqual(participantRewardTotal, data.summary.total_usdc_amount)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'summary.total_usdc_amount must equal sum of participant_rewards.usdc_amount',
        path: ['summary', 'total_usdc_amount'],
      });
    }
  })
  .meta({
    title: 'Credit Purchase Receipt Data',
    description: 'Complete data structure for a credit purchase receipt',
  });

export type CreditPurchaseReceiptData = z.infer<
  typeof CreditPurchaseReceiptDataSchema
>;
