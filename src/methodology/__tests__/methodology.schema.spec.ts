import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { MethodologySchema } from '../methodology.schema';
import exampleJson from '../../../schemas/ipfs/methodology/methodology.example.json';

describe('MethodologySchema', () => {
  const schema = MethodologySchema;
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
      description: 'rejects missing audit rules',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.data = {
          ...invalid.data,
          mass_id_audit_rules:
            undefined as unknown as typeof invalid.data.mass_id_audit_rules,
        };
      },
    },
    {
      description: 'rejects non-GitHub source_code_url',
      mutate: (invalid: z.input<typeof schema>) => {
        const rules = invalid.data.mass_id_audit_rules.map((rule) => ({
          ...rule,
        }));
        rules[0] = {
          ...rules[0],
          source_code_url: 'https://example.com/not-github',
        };
        invalid.data.mass_id_audit_rules = rules;
      },
    },
    {
      description: 'rejects audit rules with mandatory flag',
      mutate: (invalid: z.input<typeof schema>) => {
        const rules = invalid.data.mass_id_audit_rules.map((rule) => ({
          ...rule,
          mandatory: true,
        }));
        invalid.data.mass_id_audit_rules = rules;
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
        expect(data.schema.type).toBe('Methodology');
        expect(data.data.mass_id_audit_rules.length).toBeGreaterThan(0);
      },
    );
  });
});
