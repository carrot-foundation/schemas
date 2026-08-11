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

  it('rejects viewer reference with integrity_hash', () => {
    const viewerReferenceWithIntegrityHash = {
      ...minimalViewerReferenceStub,
      integrity_hash:
        'd6672ee3a93d0d6e3c30bdef89f310799c2f3ab781098a9792040d5541ce3ed3',
    };

    const result = ViewerReferenceSchema.safeParse(
      viewerReferenceWithIntegrityHash,
    );

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
