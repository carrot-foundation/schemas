import { z } from 'zod';
import {
  BaseIpfsSchema,
  CollectionNameSchema,
  CollectionSlugSchema,
  IpfsUriSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';

export const CollectionSchemaMeta = {
  title: 'Collection IPFS Record',
  description:
    "Collection metadata stored in IPFS, extending the base schema with collection-specific fields used to group and organize credit purchases and retirements in Carrot's ecosystem",
  $id: buildSchemaUrl('collection/collection.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const CollectionSchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: z.literal('Collection').meta({
      title: 'Collection Schema Type',
      description:
        'Discriminator value identifying this record as a Collection grouping of credits and receipts',
    }),
  }),
  data: z.record(z.string(), z.unknown()).optional().meta({
    title: 'Custom Data',
    description: 'Collection-specific data payload',
  }),
  name: CollectionNameSchema,
  slug: CollectionSlugSchema,
  image: IpfsUriSchema.meta({
    title: 'Collection Image',
    description: "IPFS URI pointing to the collection's visual representation",
    examples: [
      'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    ],
  }),
  description: z
    .string()
    .min(50)
    .max(1000)
    .meta({
      title: 'Collection Description',
      description:
        'Human-readable purpose and context of this collection grouping; this document is distinct from its image asset',
      examples: [
        'Illustrative collection grouping credit purchases and retirements for an example campaign. The collection document describes the grouping and points to a separate image asset; its URI is what receipt collection references cite.',
      ],
    }),
}).meta(CollectionSchemaMeta);

export type Collection = z.infer<typeof CollectionSchema>;
