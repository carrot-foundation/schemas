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
      description: 'Collection schema type',
    }),
  }),
  name: CollectionNameSchema,
  slug: CollectionSlugSchema,
  image: IpfsUriSchema.meta({
    title: 'Collection Image',
    description: "IPFS URI pointing to the collection's visual representation",
    examples: [
      'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/collection-icon.png',
    ],
  }),
  description: z
    .string()
    .min(50)
    .max(1000)
    .meta({
      title: 'Collection Description',
      description:
        'Comprehensive description of the collection, its purpose, and context',
      examples: [
        'Cold Start is a limited-edition collection created for early supporters of BOLD - Breakthrough in Organic Landfill Diversion. This purchase contributes to reducing global waste and promoting circularity, with funds distributed via smart contract to local recycling operations and communities.',
      ],
    }),
}).meta(CollectionSchemaMeta);

export type Collection = z.infer<typeof CollectionSchema>;
