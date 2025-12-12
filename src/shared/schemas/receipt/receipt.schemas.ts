import { z, type ZodRawShape } from 'zod';
import {
  CollectionNameSchema,
  CollectionSlugSchema,
  CreditAmountSchema,
  CreditTokenSymbolSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateSchema,
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  PositiveIntegerSchema,
  RecordSchemaTypeSchema,
  SlugSchema,
  SmartContractSchema,
  TokenIdSchema,
} from '../primitives';
import { uniqueArrayItems } from '../../schema-helpers';
import { MassIDReferenceSchema } from '../references';

type Meta = {
  title: string;
  description: string;
};

const SummaryBaseSchema = z.strictObject({
  total_certificates: PositiveIntegerSchema.meta({
    title: 'Total Certificates',
    description: 'Total number of certificates represented in the receipt',
  }),
  credit_symbols: uniqueArrayItems(
    CreditTokenSymbolSchema,
    'Credit symbols must be unique',
  )
    .min(1)
    .meta({
      title: 'Credit Symbols',
      description: 'Array of credit token symbols represented in the receipt',
    }),
  certificate_types: uniqueArrayItems(
    RecordSchemaTypeSchema.extract(['GasID', 'RecycledID']),
    'Certificate types must be unique',
  )
    .min(1)
    .meta({
      title: 'Certificate Types',
      description: 'Array of certificate types represented in the receipt',
    }),
  collection_slugs: uniqueArrayItems(
    CollectionSlugSchema,
    'Collection slugs must be unique',
  )
    .min(1)
    .meta({
      title: 'Collection Slugs',
      description: 'Array of collection slugs represented in the receipt',
    }),
});

export const CreditPurchaseReceiptSummarySchema = SummaryBaseSchema.extend({
  total_usdc_amount: NonNegativeFloatSchema.meta({
    title: 'Total USDC Amount',
    description: 'Total amount paid in USDC for the purchase',
  }),
  total_credits: CreditAmountSchema.meta({
    title: 'Total Credits',
    description: 'Total amount of credits purchased',
  }),
  purchase_date: IsoDateSchema.meta({
    title: 'Purchase Date',
    description: 'Date when the purchase was made (YYYY-MM-DD)',
  }),
}).meta({
  title: 'Credit Purchase Receipt Summary',
  description:
    'Summary totals for the credit purchase including amounts and collections represented',
});

export const CreditRetirementReceiptSummarySchema = SummaryBaseSchema.extend({
  total_retirement_amount: CreditAmountSchema.meta({
    title: 'Total Retirement Amount',
    description: 'Total amount of credits retired',
  }),
  retirement_date: IsoDateSchema.meta({
    title: 'Retirement Date',
    description: 'Date when the retirement occurred (YYYY-MM-DD)',
  }),
}).meta({
  title: 'Credit Retirement Receipt Summary',
  description:
    'Summary totals for the credit retirement including amounts and collections represented',
});

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

export const MassIdReferenceWithContractSchema =
  MassIDReferenceSchema.safeExtend({
    smart_contract: SmartContractSchema,
  }).meta({
    title: 'MassID Reference with Smart Contract',
    description:
      'Reference to a MassID record including smart contract details',
  });

export type MassIdReferenceWithContract = z.infer<
  typeof MassIdReferenceWithContractSchema
>;

export function createReceiptCollectionSchema(params: {
  amountKey: 'credit_amount' | 'amount';
  amountMeta: Meta;
  meta: Meta;
}) {
  const { amountKey, amountMeta, meta } = params;

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
      uri: IpfsUriSchema.meta({
        title: 'Collection URI',
        description: 'IPFS URI for the collection metadata',
      }),
      [amountKey]: CreditAmountSchema.meta(amountMeta),
    })
    .meta(meta);
}

export function createReceiptCreditSchema(params: {
  amountKey: 'purchase_amount' | 'amount';
  amountMeta: Meta;
  meta: Meta;
  retirementAmountMeta?: Meta;
}) {
  const { amountKey, amountMeta, meta, retirementAmountMeta } = params;
  const creditShape: Record<string, z.ZodTypeAny> = {
    slug: SlugSchema.meta({
      title: 'Credit Slug',
      description: 'URL-friendly identifier for the credit',
    }),
    symbol: CreditTokenSymbolSchema.meta({
      title: 'Credit Token Symbol',
      description: 'Symbol of the credit token',
      examples: ['CARBON', 'ORGANIC', 'C-CARB.CH4', 'C-BIOW'],
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
    [amountKey]: CreditAmountSchema.meta(amountMeta),
  };

  if (retirementAmountMeta) {
    creditShape.retirement_amount =
      CreditAmountSchema.optional().meta(retirementAmountMeta);
  }

  return z.strictObject(creditShape).meta(meta);
}

const certificateBaseShape = {
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
  mass_id: MassIdReferenceWithContractSchema,
} satisfies ZodRawShape;

export function createReceiptCertificateSchema<T extends ZodRawShape>(params: {
  additionalShape: T;
  meta: Meta;
}) {
  return z
    .strictObject({
      ...certificateBaseShape,
      ...params.additionalShape,
    } as typeof certificateBaseShape & T)
    .meta(params.meta);
}
