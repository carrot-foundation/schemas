import type { NftIpfs } from '../../shared/nft.schema';
import { polygonBlockchain } from './blockchain.fixtures';

/**
 * Minimal valid NFT IPFS record fixture for testing.
 *
 * Represents a complete NFT IPFS metadata record that satisfies the NFT schema.
 * Used in tests to validate NFT schema parsing and type inference.
 */
export const minimalValidNft: NftIpfs = {
  $schema:
    'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/ipfs/shared/nft/nft.schema.json',
  schema: {
    hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
    type: 'MassID' as const,
    version: '0.1.0',
  },
  blockchain: polygonBlockchain,
  created_at: '2024-12-05T11:02:47.000Z',
  external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  external_url:
    'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  name: 'Test NFT',
  short_name: 'Test',
  description: 'This is a test NFT description with enough characters',
  image: 'ipfs://QmTest/image.png',
  original_content_hash:
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  content_hash:
    '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
  attributes: [
    {
      trait_type: 'Type',
      value: 'Organic',
    },
    {
      trait_type: 'Weight',
      value: 1000,
    },
  ],
};
