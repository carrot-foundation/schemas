import { describe, expect, it } from 'vitest';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validMethodologyReferenceFixture,
} from '../../../test-utils';
import { MethodologyReferenceSchema } from '../methodology-reference.schema';

describe('MethodologyReferenceSchema', () => {
  const schema = MethodologyReferenceSchema;
  const base = validMethodologyReferenceFixture;

  it('validates valid methodology reference successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('validates without optional uri field', () => {
    expectSchemaValid(schema, () => {
      const withoutUri = structuredClone(base);
      Reflect.deleteProperty(withoutUri as Record<string, unknown>, 'uri');
      return withoutUri;
    });
  });

  it('rejects missing external_id', () => {
    expectSchemaInvalidWithout(schema, base, 'external_id');
  });

  it('rejects missing name', () => {
    expectSchemaInvalidWithout(schema, base, 'name');
  });

  it('rejects missing version', () => {
    expectSchemaInvalidWithout(schema, base, 'version');
  });

  it('rejects missing external_url', () => {
    expectSchemaInvalidWithout(schema, base, 'external_url');
  });

  it('rejects invalid UUID for external_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_id = 'not-a-uuid';
    });
  });

  it('rejects name shorter than 5 characters', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.name = 'BOLD';
    });
  });

  it('rejects name longer than 150 characters', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.name = 'A'.repeat(151);
    });
  });

  it('rejects empty name', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.name = '';
    });
  });

  it('rejects invalid semantic version format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.version = 'invalid-version';
    });
  });

  it('validates semantic version with v prefix', () => {
    expectSchemaValid(schema, () => ({
      ...base,
      version: 'v1.3.0',
    }));
  });

  it('validates semantic version with prerelease', () => {
    expectSchemaValid(schema, () => ({
      ...base,
      version: '1.3.0-beta',
    }));
  });

  it('rejects invalid URL for external_url', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_url = 'not-a-url';
    });
  });

  it('rejects invalid IPFS URI format for uri', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.uri = 'https://example.com/file.pdf';
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.external_id).toBe(base.external_id);
        expect(data.name).toBe(base.name);
        expect(data.version).toBe(base.version);
        expect(data.external_url).toBe(base.external_url);
        expect(data.uri).toBe(base.uri);
      },
    );
  });

  it('rejects additional properties', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      (invalid as typeof base & { extra_field?: string }).extra_field =
        'not allowed';
    });
  });
});
