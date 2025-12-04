import { describe, it, expect } from 'vitest';
import { MassIDReferenceSchema } from '../mass-id-reference.schema';
import { validMassIDReference } from '../../../test-utils';
import exampleJson from '../../../../schemas/ipfs/shared/references/mass-id-reference/mass-id-reference.example.json';

describe('MassIDReferenceSchema', () => {
  it('validates valid MassID reference successfully', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIDReference);

    expect(result.success).toBe(true);
  });

  it('validates example JSON file from schemas/ipfs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $schema, ...data } = exampleJson;
    const result = MassIDReferenceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validMassIDReference;
    const result = MassIDReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing token_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token_id, ...withoutTokenId } = validMassIDReference;
    const result = MassIDReferenceSchema.safeParse(withoutTokenId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validMassIDReference;
    const result = MassIDReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing uri', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMassIDReference;
    const result = MassIDReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMassIDReference,
      external_id: 'not-a-uuid',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid token_id (non-numeric)', () => {
    const invalid = {
      ...validMassIDReference,
      token_id: 'abc',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMassIDReference,
      external_url: 'not-a-url',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validMassIDReference,
      uri: 'https://example.com/file.json',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIDReferenceSchema.safeParse(validMassIDReference);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validMassIDReference.external_id);
      expect(data.token_id).toBe(validMassIDReference.token_id);
      expect(data.external_url).toBe(validMassIDReference.external_url);
      expect(data.uri).toBe(validMassIDReference.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMassIDReference,
      extra_field: 'not allowed',
    };
    const result = MassIDReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
