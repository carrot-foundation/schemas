import type { ExternalLink } from '../../shared';

/**
 * Minimal external link stub for testing.
 *
 * Contains only required fields for external link schema validation.
 * Used as a base for creating custom external link fixtures in tests.
 */
export const minimalExternalLinkStub: ExternalLink = {
  label: 'Carrot Explorer',
  url: 'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
};

/**
 * Valid external link fixture for testing.
 *
 * Represents a complete external link that satisfies the external link schema.
 * Used in tests to validate external link schema parsing and validation.
 */
export const validExternalLinkFixture: ExternalLink = {
  label: 'Carrot Explorer',
  url: 'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  description: 'Complete chain of custody and audit trail',
};

/**
 * Valid external link fixture with different label for testing.
 *
 * Represents a complete external link with alternative label that satisfies the external link schema.
 * Used in tests to validate external link schema parsing and validation.
 */
export const validExternalLinkWhitePaperFixture: ExternalLink = {
  label: 'Carrot White Paper',
  url: 'https://carrot.eco/whitepaper.pdf',
  description: 'Carrot Foundation technical and impact white paper',
};

/**
 * Creates an external link fixture with optional overrides.
 *
 * @param overrides - Optional partial external link to override default values
 * @returns A complete external link fixture
 */
export function createExternalLinkFixture(
  overrides?: Partial<ExternalLink>,
): ExternalLink {
  return {
    ...minimalExternalLinkStub,
    ...overrides,
  };
}
