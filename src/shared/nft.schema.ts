import { z } from 'zod';
import { baseIPFSSchema } from './base.schema.js';
import {
  ethereumAddress,
  chainId,
  tokenId,
  ipfsUri,
  hexColor,
  nonNegativeFloat,
} from './definitions.schema.js';

const nftSchemaType = z.enum(['MassID', 'RecycledID', 'GasID', 'PurchaseID']);

const blockchain = z
  .object({
    smart_contract_address: ethereumAddress.describe('Smart Contract Address'),
    chain_id: chainId.describe('Blockchain chain ID'),
    network_name: z
      .string()
      .min(5)
      .max(100)
      .describe('Name of the blockchain network'),
    token_id: tokenId.describe('NFT token ID'),
  })
  .strict()
  .describe('Blockchain-specific information for the NFT');

const externalLink = z
  .object({
    label: z
      .string()
      .min(1)
      .max(50)
      .describe('Display name for the external link'),
    url: z
      .url('Must be a valid URI')
      .describe('Direct URI to the linked resource'),
    description: z
      .string()
      .min(10)
      .max(100)
      .describe('Optional context about what the link provides'),
  })
  .strict();

const attribute = z
  .object({
    trait_type: z.string().max(50).describe('Name of the trait or attribute'),
    value: z
      .union([z.string(), z.number(), z.boolean()])
      .describe('Value of the trait - can be string, number, or boolean'),
    display_type: z
      .enum(['number', 'date', 'boost_number', 'boost_percentage'])
      .optional()
      .describe('How the trait should be displayed in marketplace UIs'),
    max_value: nonNegativeFloat
      .optional()
      .describe('Maximum possible value for numeric traits'),
  })
  .strict();

export const nftIPFSSchema = baseIPFSSchema
  .safeExtend({
    schema: baseIPFSSchema.shape.schema.safeExtend({
      type: nftSchemaType.describe('Type/category of this NFT schema'),
    }),

    blockchain: blockchain,

    name: z
      .string()
      .min(1)
      .max(100)
      .describe('Full display name for this NFT, including extra context'),

    short_name: z
      .string()
      .min(1)
      .max(50)
      .describe('Compact name for UI summaries, tables, or tooltips'),

    description: z
      .string()
      .min(10)
      .max(500)
      .describe(
        "Human-readable summary of the NFT's role and context. Ideally, maximum 300 characters.",
      ),

    image: ipfsUri.describe('IPFS URI pointing to the preview image'),

    background_color: hexColor
      .optional()
      .describe('Hex color code for marketplace background display'),

    animation_url: ipfsUri
      .optional()
      .describe('IPFS URI pointing to an animated or interactive media file'),

    external_links: z
      .array(externalLink)
      .max(10)
      .optional()
      .refine((links) => {
        if (!links) return true;
        const urls = links.map((link) => link.url);
        return urls.length === new Set(urls).size;
      }, 'External link URLs must be unique')
      .describe('Optional list of public resource links with labels'),

    attributes: z
      .array(attribute)
      .describe(
        'List of visual traits and filterable attributes compatible with NFT marketplaces',
      ),
  })
  .strict()
  .describe('NFT-specific fields for Carrot IPFS records')
  .refine((data) => {
    const allowedTypes = ['MassID', 'RecycledID', 'GasID', 'PurchaseID'];
    return allowedTypes.includes(data.schema.type);
  }, 'Schema type must be one of the supported NFT types')
  .refine((data) => {
    const traitTypes = data.attributes.map((attr) => attr.trait_type);
    return traitTypes.length === new Set(traitTypes).size;
  }, 'Attribute trait_type values must be unique');

export type NFTIPFSSchema = z.infer<typeof nftIPFSSchema>;
export type NFTSchemaType = z.infer<typeof nftSchemaType>;
export type Blockchain = z.infer<typeof blockchain>;
export type ExternalLink = z.infer<typeof externalLink>;
export type Attribute = z.infer<typeof attribute>;
