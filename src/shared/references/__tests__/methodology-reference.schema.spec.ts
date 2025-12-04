import { describe, it, expect } from 'vitest';
import { MethodologyReferenceSchema } from '../methodology-reference.schema';

describe('MethodologyReferenceSchema', () => {
  const validMethodologyReference = {
    external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    name: 'BOLD Carbon (CH₄)',
    version: '1.3.0',
    external_url:
      'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d480',
    uri: 'ipfs://QmMethodologyHash/bold-carbon-ch4-v1.3.0.pdf',
  };

  it('validates valid methodology reference successfully', () => {
    const result = MethodologyReferenceSchema.safeParse(
      validMethodologyReference,
    );

    expect(result.success).toBe(true);
  });

  it('validates without optional uri field', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMethodologyReference;
    const result = MethodologyReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validMethodologyReference;
    const result = MethodologyReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...withoutName } = validMethodologyReference;
    const result = MethodologyReferenceSchema.safeParse(withoutName);

    expect(result.success).toBe(false);
  });

  it('rejects missing version', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { version, ...withoutVersion } = validMethodologyReference;
    const result = MethodologyReferenceSchema.safeParse(withoutVersion);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validMethodologyReference;
    const result = MethodologyReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMethodologyReference,
      external_id: 'not-a-uuid',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 5 characters', () => {
    const invalid = {
      ...validMethodologyReference,
      name: 'BOLD',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects name longer than 150 characters', () => {
    const invalid = {
      ...validMethodologyReference,
      name: 'A'.repeat(151),
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const invalid = {
      ...validMethodologyReference,
      name: '',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid semantic version format', () => {
    const invalid = {
      ...validMethodologyReference,
      version: 'invalid-version',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates semantic version with v prefix', () => {
    const valid = {
      ...validMethodologyReference,
      version: 'v1.3.0',
    };
    const result = MethodologyReferenceSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it('validates semantic version with prerelease', () => {
    const valid = {
      ...validMethodologyReference,
      version: '1.3.0-beta',
    };
    const result = MethodologyReferenceSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMethodologyReference,
      external_url: 'not-a-url',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format for uri', () => {
    const invalid = {
      ...validMethodologyReference,
      uri: 'https://example.com/file.pdf',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MethodologyReferenceSchema.safeParse(
      validMethodologyReference,
    );

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(validMethodologyReference.external_id);
      expect(data.name).toBe(validMethodologyReference.name);
      expect(data.version).toBe(validMethodologyReference.version);
      expect(data.external_url).toBe(validMethodologyReference.external_url);
      expect(data.uri).toBe(validMethodologyReference.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMethodologyReference,
      extra_field: 'not allowed',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
