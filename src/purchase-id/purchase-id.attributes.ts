import { z } from 'zod';
import {
  ParticipantNameSchema,
  TokenSymbolSchema,
  NftAttributeSchema,
  uniqueBy,
  CreditAmountSchema,
  UnixTimestampSchema,
  CollectionNameSchema,
} from '../shared';

const PurchaseIDAttributeCreditSchema = NftAttributeSchema.extend({
  trait_type: TokenSymbolSchema.meta({
    title: 'Credit Token Symbol',
    description: 'Symbol of the credit token (e.g., C-CARB, C-BIOW)',
    examples: ['C-CARB', 'C-BIOW'],
  }),
  value: CreditAmountSchema.meta({
    description: 'Amount of credits purchased',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'Credit Attribute',
  description: 'Attribute representing the amount purchased for a credit token',
});

export type PurchaseIDAttributeCredit = z.infer<
  typeof PurchaseIDAttributeCreditSchema
>;

const PurchaseIDAttributeBuyerSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Buyer'),
  value: ParticipantNameSchema.meta({
    title: 'Buyer Name',
    description:
      'Organization or individual that purchased the credits and received the receipt',
    examples: ['EcoTech Solutions Inc.'],
  }),
}).meta({
  title: 'Buyer Attribute',
  description: 'Attribute containing the buyer name',
});

export type PurchaseIDAttributeBuyer = z.infer<
  typeof PurchaseIDAttributeBuyerSchema
>;

const PurchaseIDAttributePurchaseDateSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Purchase Date'),
  value: UnixTimestampSchema.meta({
    title: 'Purchase Date',
    description:
      'Unix timestamp in milliseconds when the purchase was completed',
  }),
  display_type: z.literal('date'),
}).meta({
  title: 'Purchase Date Attribute',
  description:
    'Attribute representing the purchase date with date display type',
});

export type PurchaseIDAttributePurchaseDate = z.infer<
  typeof PurchaseIDAttributePurchaseDateSchema
>;

const PurchaseIDAttributeCollectionSchema = NftAttributeSchema.extend({
  trait_type: CollectionNameSchema,
  value: CreditAmountSchema.meta({
    title: 'Credits from Collection',
    description: 'Amount of credits purchased from the collection',
  }),
  display_type: z.literal('number'),
}).meta({
  title: 'Collection Attribute',
  description:
    'Attribute representing the number of credits purchased from a collection',
});

export type PurchaseIDAttributeCollection = z.infer<
  typeof PurchaseIDAttributeCollectionSchema
>;

export const PurchaseIDAttributesSchema = uniqueBy(
  z.union([
    PurchaseIDAttributeCreditSchema,
    PurchaseIDAttributeBuyerSchema,
    PurchaseIDAttributePurchaseDateSchema,
    PurchaseIDAttributeCollectionSchema,
  ]),
  (attribute) => attribute.trait_type,
  'Attribute trait_type values must be unique',
)
  .min(4)
  .meta({
    title: 'PurchaseID NFT Attribute Array',
    description:
      'Schema for PurchaseID NFT attributes including credit breakdowns, buyer, purchase date, and per-collection credit amounts. Attributes must have unique trait types.',
  });

export type PurchaseIDAttributes = z.infer<typeof PurchaseIDAttributesSchema>;
