import type { WasteProperties } from '../../shared';

/**
 * Minimal waste properties stub for testing.
 *
 * Contains only required fields for waste properties schema validation.
 * Used as a base for creating custom waste properties fixtures in tests.
 */
export const minimalWastePropertiesStub: WasteProperties = {
  type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  weight_kg: 3000,
};

/**
 * Valid waste properties fixture for testing.
 *
 * Represents a complete waste properties that satisfies the waste properties schema.
 * Used in tests to validate waste properties schema parsing and validation.
 */
export const validWastePropertiesFixture: WasteProperties = {
  type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  weight_kg: 3000,
};

/**
 * Creates a waste properties fixture with optional overrides.
 *
 * @param overrides - Optional partial waste properties to override default values
 * @returns A complete waste properties fixture
 */
export function createWastePropertiesFixture(
  overrides?: Partial<WasteProperties>,
): WasteProperties {
  return {
    ...minimalWastePropertiesStub,
    ...overrides,
  };
}
