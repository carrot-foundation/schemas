import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { GasIDIpfsSchema } from '../gas-id.schema';
import exampleJson from '../../../schemas/ipfs/gas-id/gas-id.example.json';

describe('GasIDIpfsSchema', () => {
  const schema = GasIDIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid data', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.blockchain = {
        ...invalid.blockchain,
        token_id: 'invalid',
      };
    });
  });

  it('rejects missing required fields', () => {
    expectSchemaInvalidWithout(schema, base, 'schema');
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('GasID');
        expect(data.blockchain.token_id).toBe('456');
      },
    );
  });

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'InvalidType' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects attributes array with wrong length', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.slice(
        0,
        10,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects attributes array with wrong order', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const attributes = invalid.attributes.slice() as unknown[];
      [attributes[0], attributes[1]] = [attributes[1], attributes[0]];
      invalid.attributes = attributes as typeof invalid.attributes;
    });
  });

  it('rejects missing data fields', () => {
    expectSchemaInvalidWithout(schema, base, 'data');
  });

  it('rejects missing summary in data', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(
        invalid.data as Record<string, unknown>,
        'summary',
      );
    });
  });

  it('rejects name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'GasID #999 • BOLD Carbon (CH₄) • 0.86t CO₂e';
      return next;
    }, ['Name token_id must match blockchain.token_id: 456']);
  });

  it('rejects short_name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'GasID #999';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 456']);
  });

  it('rejects name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Invalid Name Format';
      return next;
    }, ['Name token_id must match blockchain.token_id: 456']);
  });

  it('rejects short_name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Invalid Short Name';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 456']);
  });

  it('rejects name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'GasID #456 • Invalid Format';
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'GasID #456 Extra';
      return next;
    }, ['Short name must match format']);
  });
});
