import { describe, it, expect } from 'vitest';
import { GasIDReferenceSchema } from '../gas-id-reference.schema';
import { validGasIdReferenceFixture } from '../../../test-utils';

describe('GasIDReferenceSchema', () => {
  it('validates valid GasID reference successfully', () => {
    const result = GasIDReferenceSchema.safeParse(validGasIdReferenceFixture);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validGasIdReferenceFixture;
    const result = GasIDReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validGasIdReferenceFixture;
    const result = GasIDReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validGasIdReferenceFixture;
    const result = GasIDReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validGasIdReferenceFixture;
    const result = GasIDReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validGasIdReferenceFixture,
      external_id: 'not-a-uuid',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validGasIdReferenceFixture,
      token_id: 'abc',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validGasIdReferenceFixture,
      external_url: 'not-a-url',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validGasIdReferenceFixture,
      uri: 'https://example.com/file.json',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = GasIDReferenceSchema.safeParse(validGasIdReferenceFixture);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validGasIdReferenceFixture.external_id);
      expect(data.token_id).toBe(validGasIdReferenceFixture.token_id);
      expect(data.external_url).toBe(validGasIdReferenceFixture.external_url);
      expect(data.uri).toBe(validGasIdReferenceFixture.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validGasIdReferenceFixture,
      extra_field: 'not allowed',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
