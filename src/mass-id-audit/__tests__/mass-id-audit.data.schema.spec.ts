import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { expectSchemaInvalid, expectSchemaValid } from '../../test-utils';
import {
  MassIDAuditDataSchema,
  MassIDAuditSummarySchema,
} from '../mass-id-audit.data.schema';
import exampleJson from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';

describe('MassIDAuditSummarySchema', () => {
  const schema = MassIDAuditSummarySchema;
  const base = exampleJson.data.audit_summary as z.input<typeof schema>;

  it('validates example audit summary successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('validates when completed_at equals started_at', () => {
    expectSchemaValid(schema, () => ({
      ...structuredClone(base),
      completed_at: base.started_at,
    }));
  });

  it('validates when completed_at is after started_at', () => {
    expectSchemaValid(schema, () => ({
      ...structuredClone(base),
      started_at: '2025-01-27T15:42:17.000Z',
      completed_at: '2025-01-27T15:42:18.000Z',
    }));
  });

  it('rejects when completed_at is before started_at', () => {
    const invalidData = {
      ...structuredClone(base),
      started_at: '2025-01-27T15:42:18.000Z',
      completed_at: '2025-01-27T15:42:17.000Z',
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toEqual(['completed_at']);
      expect(result.error.issues[0].message).toBe(
        'completed_at must be greater than or equal to started_at',
      );
    }
  });

  it('rejects missing started_at', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'started_at');
    });
  });

  it('rejects missing completed_at', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'completed_at',
      );
    });
  });

  it('rejects missing result', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'result');
    });
  });

  it('rejects invalid started_at format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.started_at =
        'invalid-date' as unknown as typeof invalid.started_at;
    });
  });

  it('rejects invalid completed_at format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.completed_at =
        'invalid-date' as unknown as typeof invalid.completed_at;
    });
  });

  it('rejects invalid result', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.result = 'INVALID' as unknown as typeof invalid.result;
    });
  });
});

describe('MassIDAuditDataSchema', () => {
  const schema = MassIDAuditDataSchema;
  const base = exampleJson.data as z.input<typeof schema>;

  it('validates example data successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects missing methodology', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'methodology');
    });
  });

  it('rejects missing mass_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'mass_id');
    });
  });

  it('validates with gas_id only', () => {
    const validData = {
      ...structuredClone(base),
      gas_id: base.gas_id,
      recycled_id: undefined,
    };
    expectSchemaValid(schema, () => validData);
  });

  it('validates with recycled_id only', () => {
    const validData = {
      ...structuredClone(base),
      gas_id: undefined,
      recycled_id: {
        external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
        token_id: '789',
        external_url:
          'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
        ipfs_uri:
          'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/recycled-id.json',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
    };
    expectSchemaValid(schema, () => validData);
  });

  it('rejects when both gas_id and recycled_id are missing', () => {
    const invalidData = {
      ...structuredClone(base),
      gas_id: undefined,
      recycled_id: undefined,
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const gasIdIssue = result.error.issues.find(
        (issue) => issue.path.length === 1 && issue.path[0] === 'gas_id',
      );
      const recycledIdIssue = result.error.issues.find(
        (issue) => issue.path.length === 1 && issue.path[0] === 'recycled_id',
      );
      expect(gasIdIssue).toBeDefined();
      expect(recycledIdIssue).toBeDefined();
      expect(gasIdIssue?.message).toContain('must be provided');
      expect(recycledIdIssue?.message).toContain('must be provided');
    }
  });

  it('rejects when both gas_id and recycled_id are present', () => {
    const invalidData = {
      ...structuredClone(base),
      gas_id: base.gas_id,
      recycled_id: {
        external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
        token_id: '789',
        external_url:
          'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
        ipfs_uri:
          'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/recycled-id.json',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const gasIdIssue = result.error.issues.find(
        (issue) => issue.path.length === 1 && issue.path[0] === 'gas_id',
      );
      const recycledIdIssue = result.error.issues.find(
        (issue) => issue.path.length === 1 && issue.path[0] === 'recycled_id',
      );
      expect(gasIdIssue).toBeDefined();
      expect(recycledIdIssue).toBeDefined();
      expect(gasIdIssue?.message).toContain('mutually exclusive');
      expect(recycledIdIssue?.message).toContain('mutually exclusive');
    }
  });

  it('rejects missing audit_summary', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'audit_summary',
      );
    });
  });

  it('rejects missing rule_execution_results', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'rule_execution_results',
      );
    });
  });

  it('rejects audit_summary with completed_at before started_at', () => {
    const invalidData = structuredClone(base);
    invalidData.audit_summary = {
      ...invalidData.audit_summary,
      started_at: '2025-01-27T15:42:18.000Z',
      completed_at: '2025-01-27T15:42:17.000Z',
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const completedAtIssue = result.error.issues.find(
        (issue) =>
          issue.path.length === 2 &&
          issue.path[0] === 'audit_summary' &&
          issue.path[1] === 'completed_at',
      );
      expect(completedAtIssue).toBeDefined();
      expect(completedAtIssue?.message).toBe(
        'completed_at must be greater than or equal to started_at',
      );
    }
  });
});
