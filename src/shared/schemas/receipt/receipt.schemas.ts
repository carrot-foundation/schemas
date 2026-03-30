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
    description:
      'Total number of impact certificates (GasID or RecycledID) included in this receipt',
  }),
});

export const CreditPurchaseReceiptSummarySchema = SummaryBaseSchema.safeExtend({
  total_amount_usdc: UsdcAmountSchema.meta({
    title: 'Total Amount (USDC)',
    description: 'Total amount paid in USDC stablecoin for the credit purchase',
  }),
  total_credits: CreditAmountSchema.meta({
    title: 'Total Credits',
    description:
      'Total number of environmental impact credits purchased in this transaction',
  }),
  purchased_at: IsoDateTimeSchema.meta({
    title: 'Purchased At',
    description: 'ISO 8601 timestamp when the purchase was completed',
  }),
}).meta({
  title: 'Credit Purchase Receipt Summary',
  description:
    'Summary totals for the credit purchase including payment amount, credit quantity, certificate count, and timestamp',
});
export type CreditPurchaseReceiptSummary = z.infer<
  typeof CreditPurchaseReceiptSummarySchema
>;

export const CreditRetirementReceiptSummarySchema =
  SummaryBaseSchema.safeExtend({
    total_credits_retired: CreditAmountSchema.meta({
      title: 'Total Credits Retired',
      description:
        'Total number of environmental impact credits permanently retired (removed from circulation)',
    }),
    retired_at: IsoDateTimeSchema.meta({
      title: 'Retired At',
      description: 'ISO 8601 timestamp when the retirement occurred',
    }),
  }).meta({
    title: 'Credit Retirement Receipt Summary',
    description:
      'Summary totals for the credit retirement including credit quantity, certificate count, and timestamp',
  });
export type CreditRetirementReceiptSummary = z.infer<
  typeof CreditRetirementReceiptSummarySchema
>;

export const ReceiptIdentitySchema = z
  .strictObject({
    name: NonEmptyStringSchema.max(100).meta({
      title: 'Identity Name',
      description: 'Display name of the buyer or beneficiary on the receipt',
      examples: ['EcoTech Solutions Inc.', 'Climate Action Corp'],
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Identity External ID',
      description:
        'Unique identifier for the buyer or beneficiary in the Carrot platform',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Identity External URL',
      description:
        'Link to the buyer or beneficiary profile page on the Carrot platform',
    }),
  })
  .meta({
    title: 'Identity',
    description:
      'Identity information for the buyer or beneficiary associated with this receipt',
  });
export type ReceiptIdentity = z.infer<typeof ReceiptIdentitySchema>;

export function createReceiptCollectionSchema(params: { meta: Meta }) {
  const { meta } = params;

  return z
    .strictObject({
      slug: CollectionSlugSchema,
      external_id: ExternalIdSchema.meta({
        title: 'Collection External ID',
        description:
          'Unique identifier for the collection in the Carrot platform',
      }),
      name: CollectionNameSchema,
      external_url: ExternalUrlSchema.meta({
        title: 'Collection External URL',
        description: 'Link to the collection page on the Carrot platform',
      }),
      ipfs_uri: IpfsUriSchema.meta({
        title: 'Collection IPFS URI',
        description:
          'IPFS URI pointing to the immutable collection metadata record',
      }),
    })
    .meta(meta);
}

export const CertificateCollectionItemPurchaseSchema = z
  .strictObject({
    slug: CollectionSlugSchema.meta({
      title: 'Collection Slug',
      description:
        'URL-friendly identifier of the collection this certificate belongs to',
    }),
    purchased_amount: CreditAmountSchema.meta({
      title: 'Purchased Amount',
      description:
        'Number of credits purchased from this collection for this certificate',
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
