import { z } from 'zod';
import { baseIpfsSchema } from './base.schema.js';
import {
  ethereumAddress,
  chainId,
  tokenId,
  ipfsUri,
  hexColor,
  nonNegativeFloat,
  schemaType,
} from './definitions.schema.js';

const nftSchemaType = schemaType
  .extract(['MassID', 'RecycledID', 'GasID', 'PurchaseID'])
  .meta({
    title: 'NFT Schema Type',
    examples: ['MassID', 'RecycledID', 'GasID'],
  });

const blockchain = z
  .strictObject({
    smart_contract_address: ethereumAddress
      .describe('Smart Contract Address')
      .meta({
        title: 'Smart Contract Address',
        examples: [
          '0x1234567890abcdef1234567890abcdef12345678',
          '0xabcdef1234567890abcdef1234567890abcdef12',
        ],
      }),
    chain_id: chainId.describe('Blockchain chain ID').meta({
      title: 'Chain ID',
      examples: [1, 137, 11155111],
    }),
    network_name: z
      .string()
      .min(5)
      .max(100)
      .describe('Name of the blockchain network')
      .meta({
        title: 'Network Name',
        examples: ['Polygon', 'Ethereum', 'Sepolia'],
      }),
    token_id: tokenId.describe('NFT token ID').meta({
      title: 'Token ID',
      examples: ['123', '456', '789'],
    }),
  })
  .describe('Blockchain-specific information for the NFT')
  .meta({
    title: 'Blockchain Information',
    examples: [
      {
        token_id: '123',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        chain_id: 1,
        network_name: 'Polygon',
      },
    ],
  });

const externalLink = z
  .strictObject({
    label: z
      .string()
      .min(1)
      .max(50)
      .describe('Display name for the external link')
      .meta({
        title: 'Link Label',
        examples: ['Carrot Explorer', 'Carrot White Paper', 'Documentation'],
      }),
    url: z
      .url('Must be a valid URI')
      .describe('Direct URI to the linked resource')
      .meta({
        title: 'Link URL',
        examples: [
          'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
          'https://carrot.eco/whitepaper.pdf',
        ],
      }),
    description: z
      .string()
      .min(10)
      .max(100)
      .describe('Optional context about what the link provides')
      .optional()
      .meta({
        title: 'Link Description',
        examples: [
          'Complete chain of custody and audit trail',
          'Carrot Foundation technical and impact white paper',
          'Additional documentation and resources',
        ],
      }),
  })
  .meta({
    title: 'External Link',
    examples: [
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
  });

const attribute = z
  .strictObject({
    trait_type: z
      .string()
      .max(50)
      .describe('Name of the trait or attribute')
      .meta({
        title: 'Trait Type',
        examples: ['Waste Type', 'Weight (kg)', 'Origin Country'],
      }),
    value: z
      .union([z.string(), z.number(), z.boolean()])
      .describe('Value of the trait - can be string, number, or boolean')
      .meta({
        title: 'Trait Value',
        examples: ['Organic', 3000, 'Brazil'],
      }),
    display_type: z
      .enum(['number', 'date', 'boost_number', 'boost_percentage'])
      .optional()
      .describe('How the trait should be displayed in marketplace UIs')
      .meta({
        title: 'Display Type',
        examples: ['number', 'date'],
      }),
    max_value: nonNegativeFloat
      .optional()
      .describe('Maximum possible value for numeric traits')
      .meta({
        title: 'Max Value',
        examples: [10000, 100],
      }),
  })
  .meta({
    title: 'NFT Attribute',
    examples: [
      {
        trait_type: 'Waste Type',
        value: 'Organic',
      },
      {
        trait_type: 'Weight (kg)',
        value: 3000,
        display_type: 'number',
      },
      {
        trait_type: 'Pick-up Date',
        value: '2024-12-05',
        display_type: 'date',
      },
    ],
  });

export const nftIpfsSchema = baseIpfsSchema
  .safeExtend({
    schema: baseIpfsSchema.shape.schema.safeExtend({
      type: nftSchemaType.describe('Type/category of this NFT schema').meta({
        title: 'NFT Schema Type',
        examples: ['MassID', 'RecycledID', 'GasID'],
      }),
    }),

    blockchain: blockchain,

    name: z
      .string()
      .min(1)
      .max(100)
      .describe('Full display name for this NFT, including extra context')
      .meta({
        title: 'NFT Name',
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
      .describe('Compact name for UI summaries, tables, or tooltips')
      .meta({
        title: 'Short Name',
        examples: ['MassID #123', 'RecycledID #456', 'GasID #789'],
      }),

    description: z
      .string()
      .min(10)
      .max(500)
      .describe(
        "Human-readable summary of the NFT's role and context. Ideally, maximum 300 characters.",
      )
      .meta({
        title: 'Description',
        examples: [
          'This MassID represents 3 metric tons of organic food waste from Enlatados Produção, tracked through complete chain of custody from generation to composting.',
          'This RecycledID represents 2.5 metric tons of recycled plastic bottles processed by Green Solutions Ltd.',
        ],
      }),

    image: ipfsUri.describe('IPFS URI pointing to the preview image').meta({
      title: 'Image URI',
      examples: [
        'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
        'ipfs://QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o/recycled-plastic.png',
      ],
    }),

    background_color: hexColor
      .optional()
      .describe('Hex color code for marketplace background display')
      .meta({
        title: 'Background Color',
        examples: ['#2D5A27', '#FF5733', '#1E90FF'],
      }),

    animation_url: ipfsUri
      .optional()
      .describe('IPFS URI pointing to an animated or interactive media file')
      .meta({
        title: 'Animation URL',
        examples: [
          'ipfs://QmAnimation123/mass-id-animation.mp4',
          'ipfs://QmInteractive456/recycled-visualization.webm',
        ],
      }),

    external_links: z
      .array(externalLink)
      .max(10)
      .optional()
      .refine((links) => {
        if (!links) return true;
        const urls = links.map((link) => link.url);
        return urls.length === new Set(urls).size;
      }, 'External link URLs must be unique')
      .describe('Optional list of public resource links with labels')
      .meta({
        title: 'External Links',
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

    attributes: z
      .array(attribute)
      .describe(
        'List of visual traits and filterable attributes compatible with NFT marketplaces',
      )
      .meta({
        title: 'NFT Attributes',
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
  })
  .describe('NFT-specific fields for Carrot IPFS records')
  .meta({
    title: 'NFT IPFS Record',
    examples: [
      {
        $schema:
          'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
        schema: {
          hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
          type: 'MassID',
          version: '0.1.0',
        },
        environment: {
          blockchain_network: 'testnet',
          deployment: 'development',
          data_set_name: 'TEST',
        },
        blockchain: {
          token_id: '123',
          smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
          chain_id: 1,
          network_name: 'Polygon',
        },
        created_at: '2024-12-05T11:02:47.000Z',
        external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        external_url:
          'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        name: 'MassID #123 • Organic • 3.0t',
        short_name: 'MassID #123',
        description:
          'This MassID represents 3 metric tons of organic food waste from Enlatados Produção, tracked through complete chain of custody from generation to composting.',
        image:
          'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
        background_color: '#2D5A27',
        original_content_hash:
          '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
        content_hash:
          '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
      },
    ],
  })
  .refine((data) => {
    const traitTypes = data.attributes.map((attr) => attr.trait_type);
    return traitTypes.length === new Set(traitTypes).size;
  }, 'Attribute trait_type values must be unique');

export type NFTIpfsSchema = z.infer<typeof nftIpfsSchema>;
export type NFTSchemaType = z.infer<typeof nftSchemaType>;
export type Blockchain = z.infer<typeof blockchain>;
export type ExternalLink = z.infer<typeof externalLink>;
export type Attribute = z.infer<typeof attribute>;
