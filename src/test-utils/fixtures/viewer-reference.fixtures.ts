import type { ViewerReference } from '../../shared/schemas/core/base.schema';

/**
 * Minimal viewer reference stub with required fields only.
 */
export const minimalViewerReferenceStub: ViewerReference = {
  ipfs_uri:
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
};

/**
 * Creates a viewer reference fixture with optional overrides.
 */
export function createViewerReferenceFixture(
  overrides?: Partial<ViewerReference>,
): ViewerReference {
  return {
    ...minimalViewerReferenceStub,
    ...overrides,
  };
}
