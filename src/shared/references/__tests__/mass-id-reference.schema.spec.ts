import { describe, it, expect } from 'vitest';
import { MassIDReferenceSchema } from '../mass-id-reference.schema';
import { validMassIdReferenceFixture } from '../../../test-utils';

describe('MassIDReferenceSchema', () => {
  it('validates valid MassID reference successfully', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIdReferenceFixture);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validMassIdReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validMassIdReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validMassIdReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMassIdReferenceFixture;
    const result = MassIDReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMassIdReferenceFixture,
      external_id: 'not-a-uuid',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validMassIdReferenceFixture,
      token_id: 'abc',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMassIdReferenceFixture,
      external_url: 'not-a-url',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validMassIdReferenceFixture,
      uri: 'https://example.com/file.json',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIdReferenceFixture);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validMassIdReferenceFixture.external_id);
      expect(data.token_id).toBe(validMassIdReferenceFixture.token_id);
      expect(data.external_url).toBe(validMassIdReferenceFixture.external_url);
      expect(data.uri).toBe(validMassIdReferenceFixture.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMassIdReferenceFixture,
      extra_field: 'not allowed',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
