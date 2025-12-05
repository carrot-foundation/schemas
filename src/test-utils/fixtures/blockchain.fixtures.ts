import type { BlockchainReference } from '../../shared/nft.schema';

/**
 * Polygon blockchain reference fixture for testing.
 *
 * Represents blockchain metadata for the Polygon network.
 * Used in tests to validate blockchain reference schema validation and
 * as a component of NFT fixtures that require blockchain information.
 */
export const polygonBlockchain: BlockchainReference = {
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  chain_id: 137,
  network_name: 'Polygon',
  token_id: '123',
};
