import { describe, it, expect } from 'vitest';
import { MethodologyReferenceSchema } from '../methodology-reference.schema';
import { validMethodologyReferenceFixture } from '../../../test-utils';

describe('MethodologyReferenceSchema', () => {
  it('validates valid methodology reference successfully', () => {
    const result = MethodologyReferenceSchema.safeParse(
      validMethodologyReferenceFixture,
    );

    expect(result.success).toBe(true);
  });

  it('validates without optional uri field', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uri, ...withoutUri } = validMethodologyReferenceFixture;
    const result = MethodologyReferenceSchema.safeParse(withoutUri);

    expect(result.success).toBe(true);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } =
      validMethodologyReferenceFixture;
    const result = MethodologyReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...withoutName } = validMethodologyReferenceFixture;
    const result = MethodologyReferenceSchema.safeParse(withoutName);

    expect(result.success).toBe(false);
  });

  it('rejects missing version', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { version, ...withoutVersion } = validMethodologyReferenceFixture;
    const result = MethodologyReferenceSchema.safeParse(withoutVersion);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } =
      validMethodologyReferenceFixture;
    const result = MethodologyReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      external_id: 'not-a-uuid',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 5 characters', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      name: 'BOLD',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects name longer than 150 characters', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      name: 'A'.repeat(151),
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      name: '',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid semantic version format', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      version: 'invalid-version',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates semantic version with v prefix', () => {
    const valid = {
      ...validMethodologyReferenceFixture,
      version: 'v1.3.0',
    };
    const result = MethodologyReferenceSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it('validates semantic version with prerelease', () => {
    const valid = {
      ...validMethodologyReferenceFixture,
      version: '1.3.0-beta',
    };
    const result = MethodologyReferenceSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      external_url: 'not-a-url',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format for uri', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      uri: 'https://example.com/file.pdf',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MethodologyReferenceSchema.safeParse(
      validMethodologyReferenceFixture,
    );

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.external_id).toBe(
        validMethodologyReferenceFixture.external_id,
      );
      expect(data.name).toBe(validMethodologyReferenceFixture.name);
      expect(data.version).toBe(validMethodologyReferenceFixture.version);
      expect(data.external_url).toBe(
        validMethodologyReferenceFixture.external_url,
      );
      expect(data.uri).toBe(validMethodologyReferenceFixture.uri);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validMethodologyReferenceFixture,
      extra_field: 'not allowed',
    };
    const result = MethodologyReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
