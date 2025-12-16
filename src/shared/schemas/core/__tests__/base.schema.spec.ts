import { describe, expect, it } from 'vitest';

import { SchemaInfoSchema, ViewerReferenceSchema } from '../base.schema';
import {
  createSchemaInfoFixture,
  minimalSchemaInfoStub,
  schemaInfoWithIpfsUriFixture,
  createViewerReferenceFixture,
  minimalViewerReferenceStub,
} from '../../../../test-utils/fixtures';

describe('SchemaInfoSchema', () => {
  it('accepts schema info with ipfs_uri', () => {
    const result = SchemaInfoSchema.safeParse(schemaInfoWithIpfsUriFixture);

    expect(result.success).toBe(true);
  });

  it('rejects schema info without ipfs_uri', () => {
    const { ipfs_uri, ...missingIpfsUri } = minimalSchemaInfoStub;
    expect(ipfs_uri).toBeDefined();
    const result = SchemaInfoSchema.safeParse(missingIpfsUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid ipfs_uri', () => {
    const invalidSchemaInfo = createSchemaInfoFixture({
      ipfs_uri: 'https://example.com/schema.json',
    });
    const result = SchemaInfoSchema.safeParse(invalidSchemaInfo);

    expect(result.success).toBe(false);
  });
});

describe('ViewerReferenceSchema', () => {
  it('accepts viewer reference with required fields', () => {
    const result = ViewerReferenceSchema.safeParse(minimalViewerReferenceStub);

    expect(result.success).toBe(true);
  });

  it('rejects viewer reference without ipfs_uri', () => {
    const { ipfs_uri, ...missingIpfsUri } = minimalViewerReferenceStub;
    expect(ipfs_uri).toBeDefined();

    const result = ViewerReferenceSchema.safeParse(missingIpfsUri);

    expect(result.success).toBe(false);
  });

  it('rejects viewer reference without integrity_hash', () => {
    const { integrity_hash, ...missingIntegrityHash } =
      minimalViewerReferenceStub;
    expect(integrity_hash).toBeDefined();

    const result = ViewerReferenceSchema.safeParse(missingIntegrityHash);

    expect(result.success).toBe(false);
  });

  it('rejects viewer reference with invalid ipfs_uri', () => {
    const invalidViewerReference = createViewerReferenceFixture({
      ipfs_uri: 'not-a-valid-uri',
    });
    const result = ViewerReferenceSchema.safeParse(invalidViewerReference);

    expect(result.success).toBe(false);
  });
});
