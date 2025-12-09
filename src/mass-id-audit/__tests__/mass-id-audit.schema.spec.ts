import { describe, expect, it } from 'vitest';
import { MassIdAuditSchema } from '../mass-id-audit.schema';
import exampleJson from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';

describe('MassIdAuditSchema', () => {
  it('validates example.json successfully', () => {
    const result = MassIdAuditSchema.safeParse(exampleJson);

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

    const result = MassIdAuditSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid rule execution result', () => {
    const invalidRules = exampleJson.data.rules_execution_results.map(
      (rule, index) =>
        index === 0
          ? {
              ...rule,
              result: 'UNKNOWN',
            }
          : rule,
    );
    const invalid = {
      ...exampleJson,
      data: {
        ...exampleJson.data,
        rules_execution_results: invalidRules,
      },
    };

    const result = MassIdAuditSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing audit summary', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { audit_summary, ...dataWithoutSummary } = exampleJson.data;
    const invalid = {
      ...exampleJson,
      data: dataWithoutSummary,
    };

    const result = MassIdAuditSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIdAuditSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('MassID Audit');
      expect(data.data.rules_execution_results.length).toBeGreaterThan(0);
    }
  });
});
