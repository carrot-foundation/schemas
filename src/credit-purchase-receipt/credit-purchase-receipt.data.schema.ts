import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  NonNegativeFloatSchema,
  ParticipantRoleSchema,
  SlugSchema,
  TokenIdSchema,
  uniqueArrayItems,
  uniqueBy,
  CreditPurchaseReceiptSummarySchema,
  ReceiptIdentitySchema,
  CertificateCollectionItemPurchaseSchema,
  createReceiptCertificateSchema,
  createReceiptCollectionSchema,
  createReceiptCreditSchema,
  validateCountMatches,
  validateTotalMatches,
  validateCertificateCollectionSlugs,
  validateRetirementReceiptRequirement,
  validateCreditSlugExists,
} from '../shared';
import {
  EthereumAddressSchema,
  Sha256HashSchema,
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

const CreditPurchaseReceiptCreditSchema = createReceiptCreditSchema({
  meta: {
    title: 'Credit',
    description: 'Credit token included in the purchase',
  },
});
export type CreditPurchaseReceiptCredit = z.infer<
  typeof CreditPurchaseReceiptCreditSchema
>;

const CreditPurchaseReceiptCertificateSchema = createReceiptCertificateSchema({
  additionalShape: {
    credit_slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'Slug of the credit type for this certificate',
      examples: ['carbon', 'organic'],
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
    participant_id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description:
        'Hash representing the participant identifier (SHA-256 hex string)',
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
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Retirement Receipt IPFS URI',
      description: 'IPFS URI for the retirement receipt metadata',
    }),
    smart_contract_address: EthereumAddressSchema.meta({
      title: 'Smart Contract Address',
      description: 'Ethereum address of the smart contract',
    }),
  })
  .meta({
    title: 'Retirement Receipt Reference',
    description: 'Reference to the retirement receipt NFT',
  });
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
    participant_rewards: uniqueBy(
      CreditPurchaseReceiptParticipantRewardSchema,
      (reward) => reward.participant_id_hash,
      'Participant participant_id_hash must be unique',
    )
      .min(1)
      .meta({
        title: 'Participant Rewards',
        description:
          'Rewards distributed to participants in the supply chain for this purchase',
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

    const participantRewardTotal = data.participant_rewards.reduce(
      (sum, reward) => sum + Number(reward.usdc_amount),
      0,
    );

    validateTotalMatches({
      ctx,
      actualTotal: participantRewardTotal,
      expectedTotal: data.summary.total_amount_usdc,
      path: ['summary', 'total_amount_usdc'],
      message:
        'summary.total_amount_usdc must equal sum of participant_rewards.usdc_amount',
    });
  })
  .meta({
    title: 'Credit Purchase Receipt Data',
    description: 'Complete data structure for a credit purchase receipt',
  });
export type CreditPurchaseReceiptData = z.infer<
  typeof CreditPurchaseReceiptDataSchema
>;
