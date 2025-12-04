import { describe, it, expect } from 'vitest';
import { MassIdReferenceSchema } from '../mass-id-reference.schema';

describe('MassIdReferenceSchema', () => {
  const validMassIdReference = {
    external_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
    token_id: '123',
    external_url:
      'https://explore.carrot.eco/document/6f520d88-864d-432d-bf9f-5c3166c4818f',
    uri: 'ipfs://QmYx8FdKl2mN9pQ7rS6tV8wB3cE4fG5hI9jK0lM1nO2pQ3r/mass-id.json',
  };

  it('validates valid MassID reference successfully', () => {
    const result = MassIdReferenceSchema.safeParse(validMassIdReference);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validMassIdReference;
    const result = MassIdReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validMassIdReference;
    const result = MassIdReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validMassIdReference;
    const result = MassIdReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMassIdReference;
    const result = MassIdReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMassIdReference,
      external_id: 'not-a-uuid',
    };
    const result = MassIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validMassIdReference,
      token_id: 'abc',
    };
    const result = MassIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMassIdReference,
      external_url: 'not-a-url',
    };
    const result = MassIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validMassIdReference,
      uri: 'https://example.com/file.json',
    };
    const result = MassIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIdReferenceSchema.safeParse(validMassIdReference);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validMassIdReference.external_id);
      expect(data.token_id).toBe(validMassIdReference.token_id);
      expect(data.external_url).toBe(validMassIdReference.external_url);
      expect(data.uri).toBe(validMassIdReference.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMassIdReference,
      extra_field: 'not allowed',
    };
    const result = MassIdReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
