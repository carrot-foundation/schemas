import { z } from 'zod';
import { BaseIpfsSchema } from './base.schema';
import {
  EthereumAddressSchema,
  BlockchainChainIdSchema,
  TokenIdSchema,
  IpfsUriSchema,
  HexColorSchema,
  NonNegativeFloatSchema,
  RecordSchemaTypeSchema,
} from './definitions.schema';
import { uniqueBy } from './helpers.schema';

const NftSchemaTypeSchema = RecordSchemaTypeSchema.extract([
  'MassID',
  'RecycledID',
  'GasID',
  'PurchaseID',
]).meta({
  title: 'NFT Schema Type',
  description: 'Type of schema for NFT records',
});

export type NftSchemaType = z.infer<typeof NftSchemaTypeSchema>;

const BlockchainReferenceSchema = z
  .strictObject({
    smart_contract_address: EthereumAddressSchema.meta({
      title: 'Smart Contract Address',
    }),
    chain_id: BlockchainChainIdSchema.meta({
      title: 'Chain ID',
      description: 'Blockchain chain ID',
    }),
    network_name: z.string().min(5).max(100).meta({
      title: 'Network Name',
      description: 'Name of the blockchain network',
    }),
    token_id: TokenIdSchema.meta({
      title: 'Token ID',
      description: 'NFT token ID',
    }),
  })
  .meta({
    title: 'Blockchain Information',
    description: 'Blockchain-specific information for the NFT',
  });

export type BlockchainReference = z.infer<typeof BlockchainReferenceSchema>;

const ExternalLinkSchema = z
  .strictObject({
    label: z.string().min(1).max(50).meta({
      title: 'Link Label',
      description: 'Display name for the external link',
    }),
    url: z.url('Must be a valid URI').meta({
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

const NftAttributeSchema = z
  .strictObject({
    trait_type: z.string().max(50).meta({
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
  name: z
    .string()
    .min(1)
    .max(100)
    .meta({
      title: 'NFT Name',
      description: 'Full display name for this NFT, including extra context',
      examples: [
        'MassID #123 • Organic • 3.0t',
        'RecycledID #456 • Plastic • 2.5t',
        'GasID #789 • Methane • 1000 m³',
      ],
    }),
  short_name: z
    .string()
    .min(1)
    .max(50)
    .meta({
      title: 'Short Name',
      description: 'Compact name for UI summaries, tables, or tooltips',
      examples: ['MassID #123', 'RecycledID #456', 'GasID #789'],
    }),
  description: z
    .string()
    .min(10)
    .max(500)
    .meta({
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
      'ipfs://QmAnimation123/mass-id-animation.mp4',
      'ipfs://QmInteractive456/recycled-visualization.webm',
    ],
  }),
  external_links: uniqueBy(
    ExternalLinkSchema,
    (link) => link.url,
    'External link URLs must be unique',
  )
    .max(10)
    .optional()
    .meta({
      title: 'External Links',
      description: 'Optional list of public resource links with labels',
      examples: [
        [
          {
            label: 'Carrot Explorer',
            url: 'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
            description: 'Complete chain of custody and audit trail',
          },
          {
            label: 'Carrot White Paper',
            url: 'https://carrot.eco/whitepaper.pdf',
            description: 'Carrot Foundation technical and impact white paper',
          },
        ],
      ],
    }),
  attributes: uniqueBy(
    NftAttributeSchema,
    (attr) => attr.trait_type,
    'Attribute trait_type values must be unique',
  ).meta({
    title: 'NFT Attributes',
    description:
      'List of visual traits and filterable attributes compatible with NFT marketplaces',
    examples: [
      [
        {
          trait_type: 'Waste Type',
          value: 'Organic',
        },
        {
          trait_type: 'Waste Subtype',
          value: 'Food, Food Waste and Beverages',
        },
        {
          trait_type: 'Weight (kg)',
          value: 3000,
          display_type: 'number',
        },
        {
          trait_type: 'Origin Country',
          value: 'Brazil',
        },
        {
          trait_type: 'Pick-up Date',
          value: '2024-12-05',
          display_type: 'date',
        },
      ],
    ],
  }),
}).meta({
  title: 'NFT IPFS Record',
  description: 'NFT-specific fields for Carrot IPFS records',
});

export type NftIpfs = z.infer<typeof NftIpfsSchema>;
