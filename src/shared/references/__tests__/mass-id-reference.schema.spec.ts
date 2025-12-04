import { describe, it, expect } from 'vitest';
import { MassIdReferenceSchema } from '../mass-id-reference.schema';
import { validMassIdReference } from '../../../test-utils/fixtures';

describe('MassIdReferenceSchema', () => {
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
