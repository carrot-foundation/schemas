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

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'Invalid' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects missing audit rules', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data = {
        ...invalid.data,
        mass_id_audit_rules:
          undefined as unknown as typeof invalid.data.mass_id_audit_rules,
      };
    });
  });

  it('rejects non-GitHub source_code_url', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const rules = invalid.data.mass_id_audit_rules.map((rule) => ({
        ...rule,
      }));
      rules[0] = {
        ...rules[0],
        source_code_url: 'https://example.com/not-github',
      };
      invalid.data.mass_id_audit_rules = rules;
    });
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
