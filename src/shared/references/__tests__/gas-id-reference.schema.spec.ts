import { describe, expect, it } from 'vitest';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validGasIdReferenceFixture,
} from '../../../test-utils';
import { GasIDReferenceSchema } from '../gas-id-reference.schema';

describe('GasIDReferenceSchema', () => {
  const schema = GasIDReferenceSchema;
  const base = validGasIdReferenceFixture;

  it('validates valid GasID reference successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('rejects missing external_id', () => {
    expectSchemaInvalidWithout(schema, base, 'external_id');
  });

  it('rejects missing token_id', () => {
    expectSchemaInvalidWithout(schema, base, 'token_id');
  });

  it('rejects missing external_url', () => {
    expectSchemaInvalidWithout(schema, base, 'external_url');
  });

  it('rejects missing uri', () => {
    expectSchemaInvalidWithout(schema, base, 'uri');
  });

  it('rejects invalid UUID for external_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_id = 'not-a-uuid';
    });
  });

  it('rejects invalid token_id (non-numeric)', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.token_id = 'abc';
    });
  });

  it('rejects invalid URL for external_url', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_url = 'not-a-url';
    });
  });

  it('rejects invalid IPFS URI format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.uri = 'https://example.com/file.json';
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.external_id).toBe(base.external_id);
        expect(data.token_id).toBe(base.token_id);
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
