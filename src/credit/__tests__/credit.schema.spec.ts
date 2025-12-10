import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { CreditSchema } from '../credit.schema';
import exampleJson from '../../../schemas/ipfs/credit/credit.example.json';

describe('CreditSchema', () => {
  const schema = CreditSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'Invalid' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects missing required fields', () => {
    expectSchemaInvalidWithout(schema, base, 'symbol');
  });

  it('rejects invalid decimals', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.decimals = -1;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('Credit');
        expect(data.decimals).toBe(18);
      },
    );
  });
});
