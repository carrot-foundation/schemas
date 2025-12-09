import { describe, it, expect } from 'vitest';
import { MassIDReferenceSchema } from '../mass-id-reference.schema';
import { validMassIDReferenceFixture } from '../../../test-utils';

describe('MassIDReferenceSchema', () => {
  it('validates valid MassID reference successfully', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIDReferenceFixture);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validMassIDReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validMassIDReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validMassIDReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMassIDReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMassIDReferenceFixture,
      external_id: 'not-a-uuid',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validMassIDReferenceFixture,
      token_id: 'abc',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMassIDReferenceFixture,
      external_url: 'not-a-url',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validMassIDReferenceFixture,
      uri: 'https://example.com/file.json',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIDReferenceFixture);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validMassIDReferenceFixture.external_id);
      expect(data.token_id).toBe(validMassIDReferenceFixture.token_id);
      expect(data.external_url).toBe(validMassIDReferenceFixture.external_url);
      expect(data.uri).toBe(validMassIDReferenceFixture.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMassIDReferenceFixture,
      extra_field: 'not allowed',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
