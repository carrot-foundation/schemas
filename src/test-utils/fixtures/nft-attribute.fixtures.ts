import type { NftAttribute } from '../../shared/nft.schema';

/**
 * Minimal NFT attribute stub for testing.
 *
 * Contains only required fields for NFT attribute schema validation.
 * Used as a base for creating custom NFT attribute fixtures in tests.
 */
export const minimalNftAttributeStub: NftAttribute = {
  trait_type: 'Type',
  value: 'Organic',
};

/**
 * Valid NFT attribute fixture with number value for testing.
 *
 * Represents a complete NFT attribute with number value that satisfies the NFT attribute schema.
 * Used in tests to validate NFT attribute schema parsing and validation.
 */
export const validNftAttributeNumberFixture: NftAttribute = {
  trait_type: 'Weight',
  value: 1000,
  display_type: 'number',
};

/**
 * Valid NFT attribute fixture with date display type for testing.
 *
 * Represents a complete NFT attribute with date display type that satisfies the NFT attribute schema.
 * Used in tests to validate NFT attribute schema parsing and validation.
 */
export const validNftAttributeDateFixture: NftAttribute = {
  trait_type: 'Pick-up Date',
  value: '2024-12-05',
  display_type: 'date',
};

/**
 * Valid NFT attribute fixture with max_value for testing.
 *
 * Represents a complete NFT attribute with max_value that satisfies the NFT attribute schema.
 * Used in tests to validate NFT attribute schema parsing and validation.
 */
export const validNftAttributeWithMaxValueFixture: NftAttribute = {
  trait_type: 'Weight (kg)',
  value: 3000,
  display_type: 'number',
  max_value: 10000,
};

/**
 * Creates an NFT attribute fixture with optional overrides.
 *
 * @param overrides - Optional partial NFT attribute to override default values
 * @returns A complete NFT attribute fixture
 */
export function createNftAttributeFixture(
  overrides?: Partial<NftAttribute>,
): NftAttribute {
  return {
    ...minimalNftAttributeStub,
    ...overrides,
  };
}
