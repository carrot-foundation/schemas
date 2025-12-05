import type { BlockchainReference } from '../../shared/nft.schema';

/**
 * Minimal blockchain reference stub for testing.
 *
 * Contains only required fields for blockchain reference schema validation.
 * Used as a base for creating custom blockchain references in tests.
 */
export const minimalBlockchainReferenceStub: BlockchainReference = {
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  chain_id: 137,
  network_name: 'Polygon',
  token_id: '123',
};

/**
 * Polygon blockchain reference fixture for testing.
 *
 * Represents blockchain metadata for the Polygon network.
 * Used in tests to validate blockchain reference schema validation and
 * as a component of NFT fixtures that require blockchain information.
 */
export const polygonBlockchainReferenceFixture: BlockchainReference = {
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  chain_id: 137,
  network_name: 'Polygon',
  token_id: '123',
};

/**
 * Creates a blockchain reference fixture with optional overrides.
 *
 * @param overrides - Optional partial blockchain reference to override default values
 * @returns A complete blockchain reference fixture
 */
export function createBlockchainReferenceFixture(
  overrides?: Partial<BlockchainReference>,
): BlockchainReference {
  return {
    ...minimalBlockchainReferenceStub,
    ...overrides,
  };
}
