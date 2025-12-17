import { z } from 'zod';
import {
  CollectionNameSchema,
  CollectionSlugSchema,
  CreditAmountSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  UsdcAmountSchema,
} from '../primitives';

type Meta = {
  title: string;
  description: string;
};

const SummaryBaseSchema = z.strictObject({
  total_certificates: PositiveIntegerSchema.meta({
    title: 'Total Certificates',
    description: 'Total number of certificates represented in the receipt',
  }),
});

export const CreditPurchaseReceiptSummarySchema = SummaryBaseSchema.extend({
  total_amount_usdc: UsdcAmountSchema.meta({
    title: 'Total Amount (USDC)',
    description: 'Total amount paid in USDC for the purchase',
  }),
  total_credits: CreditAmountSchema.meta({
    title: 'Total Credits',
    description: 'Total amount of credits purchased',
  }),
  purchased_at: IsoDateTimeSchema.meta({
    title: 'Purchased At',
    description: 'ISO 8601 timestamp when the purchase was completed',
  }),
}).meta({
  title: 'Credit Purchase Receipt Summary',
  description:
    'Summary totals for the credit purchase including amounts and collections represented',
});
export type CreditPurchaseReceiptSummary = z.infer<
  typeof CreditPurchaseReceiptSummarySchema
>;

export const CreditRetirementReceiptSummarySchema = SummaryBaseSchema.extend({
  total_credits_retired: CreditAmountSchema.meta({
    title: 'Total Credits Retired',
    description: 'Total amount of credits retired',
  }),
  retired_at: IsoDateTimeSchema.meta({
    title: 'Retired At',
    description: 'ISO 8601 timestamp when the retirement occurred',
  }),
}).meta({
  title: 'Credit Retirement Receipt Summary',
  description:
    'Summary totals for the credit retirement including amounts and collections represented',
});
export type CreditRetirementReceiptSummary = z.infer<
  typeof CreditRetirementReceiptSummarySchema
>;

export const ReceiptIdentitySchema = z
  .strictObject({
    name: NonEmptyStringSchema.max(100).meta({
      title: 'Identity Name',
      description: 'Display name for the participant',
      examples: ['EcoTech Solutions Inc.', 'Climate Action Corp'],
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
export type ReceiptIdentity = z.infer<typeof ReceiptIdentitySchema>;

export function createReceiptCollectionSchema(params: { meta: Meta }) {
  const { meta } = params;

  return z
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
      ipfs_uri: IpfsUriSchema.meta({
        title: 'Collection IPFS URI',
        description: 'IPFS URI for the collection metadata',
      }),
    })
    .meta(meta);
}

export const CertificateCollectionItemPurchaseSchema = z
  .strictObject({
    slug: CollectionSlugSchema.meta({
      title: 'Collection Slug',
      description: 'Slug of the collection',
    }),
    purchased_amount: CreditAmountSchema.meta({
      title: 'Collection Purchased Amount',
      description:
        'Credits purchased from this collection for this certificate',
    }),
    retired_amount: CreditAmountSchema.meta({
      title: 'Collection Retired Amount',
      description:
        'Credits retired from this collection for this certificate (0 if none)',
    }),
  })
  .meta({
    title: 'Certificate Collection Item (Purchase)',
    description:
      'Collection reference with purchased and retired amounts for a certificate in a purchase receipt',
  });
export type CertificateCollectionItemPurchase = z.infer<
  typeof CertificateCollectionItemPurchaseSchema
>;

export const CertificateCollectionItemRetirementSchema = z
  .strictObject({
    slug: CollectionSlugSchema,
    retired_amount: CreditAmountSchema.meta({
      title: 'Collection Retired Amount',
      description: 'Credits retired from this collection for this certificate',
    }),
  })
  .meta({
    title: 'Certificate Collection Item (Retirement)',
    description:
      'Collection reference with retired amount for a certificate in a retirement receipt',
  });
export type CertificateCollectionItemRetirement = z.infer<
  typeof CertificateCollectionItemRetirementSchema
>;
