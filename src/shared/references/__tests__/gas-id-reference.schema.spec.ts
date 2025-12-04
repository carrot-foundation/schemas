import { describe, it, expect } from 'vitest';
import { GasIDReferenceSchema } from '../gas-id-reference.schema';
import { validGasIDReference } from '../../../test-utils/fixtures';

describe('GasIDReferenceSchema', () => {
  it('validates valid GasID reference successfully', () => {
    const result = GasIDReferenceSchema.safeParse(validGasIDReference);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validGasIDReference;
    const result = GasIDReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validGasIDReference;
    const result = GasIDReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validGasIDReference;
    const result = GasIDReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validGasIDReference;
    const result = GasIDReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validGasIDReference,
      external_id: 'not-a-uuid',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validGasIDReference,
      token_id: 'abc',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validGasIDReference,
      external_url: 'not-a-url',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validGasIDReference,
      uri: 'https://example.com/file.json',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = GasIDReferenceSchema.safeParse(validGasIDReference);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validGasIDReference.external_id);
      expect(data.token_id).toBe(validGasIDReference.token_id);
      expect(data.external_url).toBe(validGasIDReference.external_url);
      expect(data.uri).toBe(validGasIDReference.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validGasIDReference,
      extra_field: 'not allowed',
    };
    const result = GasIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
