import type { SchemaInfo } from '../../shared/schemas/core/base.schema';

/**
 * Minimal schema info stub with required fields only.
 */
export const minimalSchemaInfoStub: SchemaInfo = {
  hash: '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  type: 'MassID',
  version: '1.0.0',
  ipfs_uri:
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
};

/**
 * Schema info fixture including an IPFS URI fallback for the schema.
 */
export const schemaInfoWithIpfsUriFixture: SchemaInfo = {
  ...minimalSchemaInfoStub,
  ipfs_uri:
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
};

/**
 * Creates a schema info fixture with optional overrides.
 */
export function createSchemaInfoFixture(
  overrides?: Partial<SchemaInfo>,
): SchemaInfo {
  return {
    ...minimalSchemaInfoStub,
    ...overrides,
  };
}
