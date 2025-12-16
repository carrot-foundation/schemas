import type { NftIpfs } from '../../shared';
import { minimalBlockchainReferenceStub } from './blockchain.fixtures';
import {
  minimalNftAttributeStub,
  validNftAttributeNumberFixture,
} from './nft-attribute.fixtures';
import { minimalRecordEnvironmentStub } from './record-environment.fixtures';
import { minimalViewerReferenceStub } from './viewer-reference.fixtures';

/**
 * Minimal NFT IPFS record stub for testing.
 *
 * Contains only required fields for NFT IPFS schema validation.
 * Used as a base for creating custom NFT fixtures in tests.
 */
export const minimalNftIpfsStub: NftIpfs = {
  $schema:
    'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/ipfs/shared/nft/nft.schema.json',
  schema: {
    hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
    type: 'MassID' as const,
    version: '0.1.0',
    ipfs_uri:
      'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  },
  blockchain: minimalBlockchainReferenceStub,
  viewer_reference: minimalViewerReferenceStub,
  environment: minimalRecordEnvironmentStub,
  created_at: '2024-12-05T11:02:47.000Z',
  external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  external_url:
    'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  name: 'MassID #123 • Organic • 3.0t',
  short_name: 'MassID #123',
  description: 'This is a test NFT description with enough characters',
  image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  full_content_hash:
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  content_hash:
    '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
  attributes: [minimalNftAttributeStub, validNftAttributeNumberFixture],
};

/**
 * Valid NFT IPFS record fixture for testing.
 *
 * Represents a complete NFT IPFS metadata record that satisfies the NFT schema.
 * Used in tests to validate NFT schema parsing and type inference.
 */
export const validNftIpfsFixture: NftIpfs = {
  $schema:
    'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/ipfs/shared/nft/nft.schema.json',
  schema: {
    hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
    type: 'MassID' as const,
    version: '0.1.0',
    ipfs_uri:
      'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  },
  blockchain: minimalBlockchainReferenceStub,
  viewer_reference: minimalViewerReferenceStub,
  environment: minimalRecordEnvironmentStub,
  created_at: '2024-12-05T11:02:47.000Z',
  external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  external_url:
    'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  name: 'MassID #123 • Organic • 3.0t',
  short_name: 'MassID #123',
  description: 'This is a test NFT description with enough characters',
  image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  full_content_hash:
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  content_hash:
    '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
  attributes: [minimalNftAttributeStub, validNftAttributeNumberFixture],
};

/**
 * Creates an NFT IPFS fixture with optional overrides.
 *
 * @param overrides - Optional partial NFT IPFS record to override default values
 * @returns A complete NFT IPFS fixture
 */
export function createNftIpfsFixture(overrides?: Partial<NftIpfs>): NftIpfs {
  return {
    ...minimalNftIpfsStub,
    ...overrides,
  };
}
