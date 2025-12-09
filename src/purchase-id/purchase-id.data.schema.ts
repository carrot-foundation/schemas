import { z } from 'zod';
import {
  EthereumAddressSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateSchema,
  NonNegativeFloatSchema,
  ParticipantNameSchema,
  ParticipantRoleSchema,
  PercentageSchema,
  PositiveIntegerSchema,
  RecordSchemaTypeSchema,
  SlugSchema,
  TokenIdSchema,
  TokenSymbolSchema,
  UuidSchema,
  uniqueArrayItems,
  uniqueBy,
  CollectionNameSchema,
  CollectionSlugSchema,
  SmartContractSchema,
} from '../shared';
import { MassIDReferenceSchema } from '../shared/references/mass-id-reference.schema';

const PurchaseIDSummarySchema = z
  .strictObject({
    total_usdc_amount: NonNegativeFloatSchema.meta({
      title: 'Total USDC Amount',
      description: 'Total amount paid in USDC for the purchase',
      examples: [1250],
    }),
    total_certificates: PositiveIntegerSchema.meta({
      title: 'Total Certificates',
      description: 'Total number of certificates purchased',
      examples: [3],
    }),
    total_credits: NonNegativeFloatSchema.meta({
      title: 'Total Credits',
      description: 'Total amount of credits purchased',
      examples: [5.5],
    }),
    purchase_date: IsoDateSchema.meta({
      title: 'Purchase Date',
      description: 'Date when the purchase was made',
      examples: ['2025-01-15'],
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
  })
  .meta({
    title: 'PurchaseID Summary',
    description:
      'Summary of the purchase totals and included certificate types',
  });

export type PurchaseIDSummary = z.infer<typeof PurchaseIDSummarySchema>;

const PurchaseIDBuyerIdentitySchema = z
  .strictObject({
    name: ParticipantNameSchema.meta({
      title: 'Buyer Name',
      description: 'Legal name of the buyer organization',
      examples: ['EcoTech Solutions Inc.'],
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Buyer External ID',
      description: 'External identifier for the buyer',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Buyer External URL',
      description: 'External URL for the buyer profile',
    }),
  })
  .meta({
    title: 'Buyer Identity',
    description: 'Optional buyer identity information',
  });

export type PurchaseIDBuyerIdentity = z.infer<
  typeof PurchaseIDBuyerIdentitySchema
>;

const PurchaseIDBuyerSchema = z
  .strictObject({
    wallet_address: EthereumAddressSchema.meta({
      title: 'Buyer Wallet Address',
      description: 'Ethereum address of the buyer',
    }),
    identity: PurchaseIDBuyerIdentitySchema.optional(),
  })
  .meta({
    title: 'Buyer',
    description: 'Buyer wallet and optional identity information',
  });

export type PurchaseIDBuyer = z.infer<typeof PurchaseIDBuyerSchema>;

const PurchaseIDCollectionSchema = z
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
  })
  .meta({
    title: 'Collection',
    description: 'Collection included in the purchase',
  });

export type PurchaseIDCollection = z.infer<typeof PurchaseIDCollectionSchema>;

const PurchaseIDCreditSchema = z
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
  })
  .meta({
    title: 'Credit',
    description: 'Credit token included in the purchase',
  });

export type PurchaseIDCredit = z.infer<typeof PurchaseIDCreditSchema>;

const PurchaseIDCertificateSchema = z
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
    mass_id: MassIDReferenceSchema,
  })
  .meta({
    title: 'Certificate',
    description: 'Certificate associated with a purchased item',
  });

export type PurchaseIDCertificate = z.infer<typeof PurchaseIDCertificateSchema>;

const PurchaseIDItemSchema = z
  .strictObject({
    certificate: PurchaseIDCertificateSchema,
    collection_slug: CollectionSlugSchema.meta({
      title: 'Collection Slug',
      description: 'Slug of the collection this item belongs to',
    }),
    credit_slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'Slug of the credit type for this item',
      examples: ['carbon', 'organic'],
    }),
    credit_amount: NonNegativeFloatSchema.meta({
      title: 'Credit Amount',
      description: 'Amount of credits for this item',
      examples: [2.5, 3],
    }),
    usdc_amount: NonNegativeFloatSchema.meta({
      title: 'USDC Amount',
      description: 'USDC amount paid for this item',
      examples: [500, 450],
    }),
  })
  .meta({
    title: 'Purchase Item',
    description:
      'Individual purchased item linking a certificate to credit data',
  });

export type PurchaseIDItem = z.infer<typeof PurchaseIDItemSchema>;

const PurchaseIDParticipantRewardSchema = z
  .strictObject({
    participant_id: UuidSchema.meta({
      title: 'Participant ID',
      description: 'Unique identifier for the participant',
    }),
    participant_name: ParticipantNameSchema.meta({
      title: 'Participant Name',
      description: 'Legal name of the participant',
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
    percentage: PercentageSchema.meta({
      title: 'Reward Percentage',
      description:
        'Percentage of the total purchase amount allocated to this participant',
      examples: [12.5, 60],
    }),
    usdc_amount: NonNegativeFloatSchema.meta({
      title: 'USDC Reward Amount',
      description: 'USDC amount allocated to this participant',
      examples: [156.25, 750],
    }),
  })
  .meta({
    title: 'Participant Reward',
    description: 'Reward distribution for a participant',
  });

export type PurchaseIDParticipantReward = z.infer<
  typeof PurchaseIDParticipantRewardSchema
>;

export const PurchaseIDDataSchema = z
  .strictObject({
    summary: PurchaseIDSummarySchema,
    buyer: PurchaseIDBuyerSchema,
    collections: uniqueBy(
      PurchaseIDCollectionSchema,
      (collection) => collection.slug,
      'Collection slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Collections',
        description: 'Collections included in the purchase',
      }),
    credits: uniqueBy(
      PurchaseIDCreditSchema,
      (credit) => credit.slug,
      'Credit slugs must be unique',
    )
      .min(1)
      .meta({
        title: 'Credits',
        description: 'Credits included in the purchase',
      }),
    items: z.array(PurchaseIDItemSchema).min(1).meta({
      title: 'Purchase Items',
      description: 'Array of individual items purchased',
    }),
    participant_rewards: z
      .array(PurchaseIDParticipantRewardSchema)
      .min(1)
      .meta({
        title: 'Participant Rewards',
        description:
          'Rewards distributed to participants in the supply chain for this purchase',
      }),
  })
  .superRefine((data, ctx) => {
    const collectionSlugs = new Set(
      data.collections.map((collection) => collection.slug),
    );
    const creditSlugs = new Set(data.credits.map((credit) => credit.slug));
    const creditSymbols = new Set(data.credits.map((credit) => credit.symbol));
    const summaryCreditSymbols = new Set(data.summary.credit_symbols);
    const summaryCertificateTypes = new Set(data.summary.certificate_types);

    data.items.forEach((item, index) => {
      if (!collectionSlugs.has(item.collection_slug)) {
        ctx.addIssue({
          code: 'custom',
          message: `collection_slug must match a collection slug in collections`,
          path: ['items', index, 'collection_slug'],
        });
      }

      if (!creditSlugs.has(item.credit_slug)) {
        ctx.addIssue({
          code: 'custom',
          message: `credit_slug must match a credit slug in credits`,
          path: ['items', index, 'credit_slug'],
        });
      }

      if (!summaryCertificateTypes.has(item.certificate.type)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'certificate.type must be included in summary.certificate_types',
          path: ['items', index, 'certificate', 'type'],
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

    data.summary.credit_symbols.forEach((symbol) => {
      if (!creditSymbols.has(symbol)) {
        ctx.addIssue({
          code: 'custom',
          message: 'summary.credit_symbols must reference symbols from credits',
          path: ['summary', 'credit_symbols'],
        });
      }
    });
  })
  .meta({
    title: 'PurchaseID Data',
    description: 'Complete data structure for a PurchaseID receipt',
  });

export type PurchaseIDData = z.infer<typeof PurchaseIDDataSchema>;
