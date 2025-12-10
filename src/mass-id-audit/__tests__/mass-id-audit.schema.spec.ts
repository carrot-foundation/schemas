import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { MassIDAuditSchema } from '../mass-id-audit.schema';
import exampleJson from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';

describe('MassIDAuditSchema', () => {
  const schema = MassIDAuditSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it.each([
    {
      description: 'rejects invalid schema type',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.schema = {
          ...invalid.schema,
          type: 'Invalid' as unknown as typeof invalid.schema.type,
        };
      },
    },
    {
      description: 'rejects invalid rule execution result',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.data.rules_execution_results =
          invalid.data.rules_execution_results.map((rule, index) =>
            index === 0
              ? {
                  ...rule,
                  result: 'UNKNOWN',
                }
              : rule,
          ) as typeof invalid.data.rules_execution_results;
      },
    },
    {
      description: 'rejects missing audit summary',
      mutate: (invalid: z.input<typeof schema>) => {
        Reflect.deleteProperty(
          invalid.data as Record<string, unknown>,
          'audit_summary',
        );
      },
    },
  ])('$description', ({ mutate }) => {
    expectSchemaInvalid(schema, base, mutate);
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('MassID Audit');
        expect(data.data.rules_execution_results.length).toBeGreaterThan(0);
      },
    );
  });
});
