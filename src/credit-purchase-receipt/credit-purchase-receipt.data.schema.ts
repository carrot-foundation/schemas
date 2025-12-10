import { z } from 'zod';
import {
  CreditAmountSchema,
  EthereumAddressSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  NonNegativeFloatSchema,
  ParticipantNameSchema,
  ParticipantRoleSchema,
  Sha256HashSchema,
  SlugSchema,
  SmartContractSchema,
  TokenIdSchema,
  uniqueArrayItems,
  uniqueBy,
  CreditPurchaseReceiptSummarySchema,
  MassIdReferenceWithContractSchema,
  ReceiptIdentitySchema,
  createReceiptCertificateSchema,
  createReceiptCollectionSchema,
  createReceiptCreditSchema,
  nearlyEqual,
  validateCountMatches,
  validateSummaryListMatchesData,
  validateTotalMatches,
} from '../shared';

export type CreditPurchaseReceiptSummary = z.infer<
  typeof CreditPurchaseReceiptSummarySchema
>;

const CreditPurchaseReceiptIdentitySchema = ReceiptIdentitySchema;

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
    buyer_id: ExternalIdSchema.meta({
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

const CreditPurchaseReceiptCollectionSchema = createReceiptCollectionSchema({
  amountKey: 'credit_amount',
  amountMeta: {
    title: 'Collection Credit Amount',
    description: 'Total credits purchased from this collection',
  },
  meta: {
    title: 'Collection',
    description: 'Collection included in the purchase',
  },
});

export type CreditPurchaseReceiptCollection = z.infer<
  typeof CreditPurchaseReceiptCollectionSchema
>;

const CreditPurchaseReceiptCreditSchema = createReceiptCreditSchema({
  amountKey: 'purchase_amount',
  amountMeta: {
    title: 'Credit Purchase Amount',
    description: 'Total credits purchased for this credit type',
  },
  retirementAmountMeta: {
    title: 'Credit Retirement Amount',
    description:
      'Credits retired immediately for this credit type during purchase',
  },
  meta: {
    title: 'Credit',
    description: 'Credit token included in the purchase',
  },
});

export type CreditPurchaseReceiptCredit = z.infer<
  typeof CreditPurchaseReceiptCreditSchema
>;

export type MassIDReferenceWithContract = z.infer<
  typeof MassIdReferenceWithContractSchema
>;

const CreditPurchaseReceiptCertificateSchema = createReceiptCertificateSchema({
  additionalShape: {
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
  },
  meta: {
    title: 'Certificate',
    description: 'Certificate associated with the purchase',
  },
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
    external_id: ExternalIdSchema.meta({
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
    beneficiary_id: ExternalIdSchema.meta({
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
        const retirementAmount = Number(credit.retirement_amount ?? 0);
        if (retirementAmount > 0) {
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
    const creditSymbols = new Set<string>(
      data.credits.map((credit) => String(credit.symbol)),
    );
    const certificateTypes = new Set<string>(
      data.certificates.map((certificate) => String(certificate.type)),
    );

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

      totalCreditsFromCertificates += Number(certificate.purchased_amount);

      creditPurchaseTotalsBySlug.set(
        String(certificate.credit_slug),
        (creditPurchaseTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          Number(certificate.purchased_amount),
      );
      creditRetiredTotalsBySlug.set(
        String(certificate.credit_slug),
        (creditRetiredTotalsBySlug.get(certificate.credit_slug) ?? 0) +
          Number(certificate.retired_amount),
      );
      collectionTotalsBySlug.set(
        String(certificate.collection_slug),
        (collectionTotalsBySlug.get(certificate.collection_slug) ?? 0) +
          Number(certificate.purchased_amount),
      );
    });

    const totalCreditsFromCollections = data.collections.reduce(
      (sum, collection) => sum + Number(collection.credit_amount),
      0,
    );

    const totalCreditsFromCredits = data.credits.reduce(
      (sum, credit) => sum + Number(credit.purchase_amount),
      0,
    );

    validateTotalMatches({
      ctx,
      actualTotal: totalCreditsFromCertificates,
      expectedTotal: data.summary.total_credits,
      path: ['summary', 'total_credits'],
      message:
        'summary.total_credits must equal sum of certificates.purchased_amount',
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalCreditsFromCredits,
      expectedTotal: data.summary.total_credits,
      path: ['summary', 'total_credits'],
      message:
        'summary.total_credits must equal sum of credits.purchase_amount',
    });

    validateTotalMatches({
      ctx,
      actualTotal: totalCreditsFromCollections,
      expectedTotal: data.summary.total_credits,
      path: ['summary', 'total_credits'],
      message:
        'summary.total_credits must equal sum of collections.credit_amount',
    });

    data.credits.forEach((credit, index) => {
      const purchasedTotal =
        creditPurchaseTotalsBySlug.get(String(credit.slug)) ?? 0;
      if (!nearlyEqual(Number(credit.purchase_amount), purchasedTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'credit.purchase_amount must equal sum of certificate purchased_amount for the credit slug',
          path: ['credits', index, 'purchase_amount'],
        });
      }

      const retiredTotal =
        creditRetiredTotalsBySlug.get(String(credit.slug)) ?? 0;
      const retirementAmount = Number(credit.retirement_amount ?? 0);
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
      const purchasedTotal =
        collectionTotalsBySlug.get(String(collection.slug)) ?? 0;
      if (!nearlyEqual(Number(collection.credit_amount), purchasedTotal)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'collection.credit_amount must equal sum of certificate purchased_amount for the collection slug',
          path: ['collections', index, 'credit_amount'],
        });
      }
    });

    const participantRewardTotal = data.participant_rewards.reduce(
      (sum, reward) => sum + Number(reward.usdc_amount),
      0,
    );

    validateTotalMatches({
      ctx,
      actualTotal: participantRewardTotal,
      expectedTotal: data.summary.total_usdc_amount,
      path: ['summary', 'total_usdc_amount'],
      message:
        'summary.total_usdc_amount must equal sum of participant_rewards.usdc_amount',
    });
  })
  .meta({
    title: 'Credit Purchase Receipt Data',
    description: 'Complete data structure for a credit purchase receipt',
  });

export type CreditPurchaseReceiptData = z.infer<
  typeof CreditPurchaseReceiptDataSchema
>;
