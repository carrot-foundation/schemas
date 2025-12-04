import { describe, it, expect } from 'vitest';
import { GasIdReferenceSchema } from '../gas-id-reference.schema';

describe('GasIdReferenceSchema', () => {
  const validGasIdReference = {
    external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    token_id: '456',
    external_url:
      'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d479',
    uri: 'ipfs://QmGasIdHash456/gas-id.json',
  };

  it('validates valid GasID reference successfully', () => {
    const result = GasIdReferenceSchema.safeParse(validGasIdReference);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validGasIdReference;
    const result = GasIdReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validGasIdReference;
    const result = GasIdReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validGasIdReference;
    const result = GasIdReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validGasIdReference;
    const result = GasIdReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validGasIdReference,
      external_id: 'not-a-uuid',
    };
    const result = GasIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validGasIdReference,
      token_id: 'abc',
    };
    const result = GasIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validGasIdReference,
      external_url: 'not-a-url',
    };
    const result = GasIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validGasIdReference,
      uri: 'https://example.com/file.json',
    };
    const result = GasIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = GasIdReferenceSchema.safeParse(validGasIdReference);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validGasIdReference.external_id);
      expect(data.token_id).toBe(validGasIdReference.token_id);
      expect(data.external_url).toBe(validGasIdReference.external_url);
      expect(data.uri).toBe(validGasIdReference.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validGasIdReference,
      extra_field: 'not allowed',
    };
    const result = GasIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
