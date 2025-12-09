import { describe, expect, it } from 'vitest';
import { MethodologySchema } from '../methodology.schema';
import exampleJson from '../../../schemas/ipfs/methodology/methodology.example.json';

describe('MethodologySchema', () => {
  it('validates example.json successfully', () => {
    const result = MethodologySchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'Invalid',
      },
    };

    const result = MethodologySchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing audit rules', () => {
    const invalid = {
      ...exampleJson,
      data: {
        ...exampleJson.data,

        mass_id_audit_rules: undefined,
      },
    };

    const result = MethodologySchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects non-GitHub source_code_url', () => {
    const rules = exampleJson.data.mass_id_audit_rules.map((rule) => ({
      ...rule,
    }));
    rules[0] = {
      ...rules[0],
      source_code_url: 'https://example.com/not-github',
    };
    const invalid = {
      ...exampleJson,
      data: {
        ...exampleJson.data,
        mass_id_audit_rules: rules,
      },
    };

    const result = MethodologySchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MethodologySchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('Methodology');
      expect(data.data.mass_id_audit_rules.length).toBeGreaterThan(0);
    }
  });
});
