import { z } from 'zod';
import { BaseIpfsSchema } from './base.schema';
import {
  TokenIdSchema,
  IpfsUriSchema,
  HexColorSchema,
  NonNegativeFloatSchema,
  RecordSchemaTypeSchema,
  ALLOWED_BLOCKCHAIN_NETWORKS,
  BLOCKCHAIN_NETWORK_CONFIG,
  BlockchainChainIdSchema,
  BlockchainNetworkNameSchema,
  ExternalUrlSchema,
  NonEmptyStringSchema,
  SmartContractAddressSchema,
} from '../primitives';
import { uniqueBy } from '../../schema-helpers';

const NftSchemaTypeSchema = RecordSchemaTypeSchema.extract([
  'MassID',
  'RecycledID',
  'GasID',
  'CreditPurchaseReceipt',
  'CreditRetirementReceipt',
]).meta({
  title: 'NFT Schema Type',
  description: 'Type of schema for NFT records',
});
export type NftSchemaType = z.infer<typeof NftSchemaTypeSchema>;

const BlockchainReferenceSchema = z
  .strictObject({
    smart_contract_address: SmartContractAddressSchema,
    chain_id: BlockchainChainIdSchema,
    network_name: BlockchainNetworkNameSchema,
    token_id: TokenIdSchema.meta({
      description: 'NFT token ID',
    }),
  })
  .superRefine((value, ctx) => {
    const matchedNetwork = ALLOWED_BLOCKCHAIN_NETWORKS.find(
      (network) =>
        network.chain_id === value.chain_id &&
        network.network_name === value.network_name,
    );

    if (!matchedNetwork) {
      ctx.addIssue({
        code: 'custom',
        message:
          'chain_id and network_name must match a supported network: 137/Polygon (mainnet) or 80002/Amoy (testnet)',
        path: ['chain_id'],
      });
      ctx.addIssue({
        code: 'custom',
        message:
          'chain_id and network_name must match a supported network: 137/Polygon (mainnet) or 80002/Amoy (testnet)',
        path: ['network_name'],
      });
    }
  })
  .meta({
    title: 'Blockchain Information',
    description: 'Blockchain-specific information for the NFT',
  });
export type BlockchainReference = z.infer<typeof BlockchainReferenceSchema>;

const ExternalLinkSchema = z
  .strictObject({
    label: NonEmptyStringSchema.max(50).meta({
      title: 'Link Label',
      description: 'Display name for the external link',
    }),
    url: ExternalUrlSchema.meta({
      title: 'Link URL',
      description: 'Direct URI to the linked resource',
    }),
    description: z.string().min(10).max(100).optional().meta({
      title: 'Link Description',
      description: 'Optional context about what the link provides',
    }),
  })
  .meta({
    title: 'External Link',
    description: 'External link with label and description',
  });
export type ExternalLink = z.infer<typeof ExternalLinkSchema>;

export const NftAttributeSchema = z
  .strictObject({
    trait_type: NonEmptyStringSchema.max(50).meta({
      title: 'Trait Type',
      description: 'Name of the trait or attribute',
    }),
    value: z.union([z.string(), z.number(), z.boolean()]).meta({
      title: 'Trait Value',
      description: 'Value of the trait - can be string, number, or boolean',
    }),
    display_type: z
      .enum(['number', 'date', 'boost_number', 'boost_percentage'])
      .optional()
      .meta({
        title: 'Display Type',
        description: 'How the trait should be displayed in marketplace UIs',
      }),
    max_value: NonNegativeFloatSchema.optional().meta({
      title: 'Max Value',
      description: 'Maximum possible value for numeric traits',
    }),
  })
  .meta({
    title: 'NFT Attribute',
    description: 'NFT attribute or trait with type and value',
  });
export type NftAttribute = z.infer<typeof NftAttributeSchema>;

export const NftIpfsSchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: NftSchemaTypeSchema.meta({
      title: 'NFT Schema Type',
      description: 'Type/category of this NFT schema',
    }),
  }),
  blockchain: BlockchainReferenceSchema,
  name: NonEmptyStringSchema.max(100).meta({
    title: 'NFT Name',
    description: 'Full display name for this NFT, including extra context',
    examples: [
      'MassID #123 • Organic • 3.0t',
      'RecycledID #456 • Plastic • 2.5t',
      'GasID #789 • Methane • 1000 m³',
    ],
  }),
  short_name: NonEmptyStringSchema.max(50).meta({
    title: 'Short Name',
    description: 'Compact name for UI summaries, tables, or tooltips',
    examples: ['MassID #123', 'RecycledID #456', 'GasID #789'],
  }),
  description: NonEmptyStringSchema.max(500).meta({
    title: 'Description',
    description:
      "Human-readable summary of the NFT's role and context. Ideally, maximum 300 characters.",
    examples: [
      'This MassID represents 3 metric tons of organic food waste from Enlatados Produção, tracked through complete chain of custody from generation to composting.',
      'This RecycledID represents 2.5 metric tons of recycled plastic bottles processed by Green Solutions Ltd.',
    ],
  }),
  image: IpfsUriSchema.meta({
    title: 'Image URI',
    description: 'IPFS URI pointing to the preview image',
  }),
  background_color: HexColorSchema.optional().meta({
    title: 'Background Color',
    description: 'Hex color code for marketplace background display',
  }),
  animation_url: IpfsUriSchema.optional().meta({
    title: 'Animation URL',
    description: 'IPFS URI pointing to an animated or interactive media file',
    examples: [
      'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm/mass-id-animation.mp4',
      'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/recycled-visualization.webm',
    ],
  }),
  external_links: uniqueBy(
    ExternalLinkSchema,
    (link) => link.url,
    'External link URLs must be unique',
  )
    .optional()
    .meta({
      title: 'External Links',
      description: 'Optional list of public resource links with labels',
    }),
  attributes: uniqueBy(
    NftAttributeSchema,
    (attr) => attr.trait_type,
    'Attribute trait_type values must be unique',
  ).meta({
    title: 'NFT Attributes',
    description:
      'List of visual traits and filterable attributes compatible with NFT marketplaces',
  }),
})
  .superRefine((value, ctx) => {
    const environmentNetwork = value.environment?.blockchain_network;
    if (!environmentNetwork) {
      return;
    }

    const config = BLOCKCHAIN_NETWORK_CONFIG[environmentNetwork];

    if (value.blockchain.chain_id !== config.chain_id) {
      ctx.addIssue({
        code: 'custom',
        message: `blockchain.chain_id must be ${config.chain_id} when environment.blockchain_network is ${environmentNetwork}`,
        path: ['blockchain', 'chain_id'],
      });
    }

    if (value.blockchain.network_name !== config.network_name) {
      ctx.addIssue({
        code: 'custom',
        message: `blockchain.network_name must be ${config.network_name} when environment.blockchain_network is ${environmentNetwork}`,
        path: ['blockchain', 'network_name'],
      });
    }
  })
  .meta({
    title: 'NFT IPFS Record',
    description: 'NFT-specific fields for Carrot IPFS records',
  });
export type NftIpfs = z.infer<typeof NftIpfsSchema>;
