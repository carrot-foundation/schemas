import { describe, expect, it } from 'vitest';

import { SchemaInfoSchema } from '../base.schema';
import {
  createSchemaInfoFixture,
  minimalSchemaInfoStub,
  schemaInfoWithIpfsUriFixture,
} from '../../../../test-utils/fixtures';

describe('SchemaInfoSchema', () => {
  it('accepts schema info with ipfs_uri', () => {
    const result = SchemaInfoSchema.safeParse(schemaInfoWithIpfsUriFixture);

    expect(result.success).toBe(true);
  });

  it('rejects schema info without ipfs_uri', () => {
    // Remove ipfs_uri to simulate missing field
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
