import type { ViewerReference } from '../../shared/schemas/core/base.schema';

/**
 * Minimal viewer reference stub with required fields only.
 */
export const minimalViewerReferenceStub: ViewerReference = {
  ipfs_cid: 'bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  integrity_hash:
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
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
