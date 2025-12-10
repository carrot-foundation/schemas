import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validAuditReferenceFixture,
} from '../../../test-utils';
import {
  AuditReferenceSchema,
  MethodologyComplianceSchema,
} from '../audit-reference.schema';

describe('AuditReferenceSchema', () => {
  const schema = AuditReferenceSchema;
  const base = validAuditReferenceFixture;

  it('validates valid audit reference successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('validates FAILED compliance status', () => {
    expectSchemaValid(schema, () => ({
      ...base,
      methodology_compliance: 'FAILED' as const,
    }));
  });

  it('rejects missing date', () => {
    expectSchemaInvalidWithout(schema, base, 'date');
  });

  it('rejects missing external_id', () => {
    expectSchemaInvalidWithout(schema, base, 'external_id');
  });

  it('rejects missing external_url', () => {
    expectSchemaInvalidWithout(schema, base, 'external_url');
  });

  it('rejects missing methodology_compliance', () => {
    expectSchemaInvalidWithout(schema, base, 'methodology_compliance');
  });

  it('rejects missing rules_executed', () => {
    expectSchemaInvalidWithout(schema, base, 'rules_executed');
  });

  it('rejects missing report', () => {
    expectSchemaInvalidWithout(schema, base, 'report');
  });

  it('rejects invalid date format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.date = '2025/06/24';
    });
  });

  it('rejects invalid UUID for external_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_id = 'not-a-uuid';
    });
  });

  it('rejects invalid URL for external_url', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.external_url = 'not-a-url';
    });
  });

  it('rejects invalid compliance status', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.methodology_compliance = 'INVALID' as unknown as
        | 'PASSED'
        | 'FAILED';
    });
  });

  it('rejects negative rules_executed', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.rules_executed = -1;
    });
  });

  it('rejects non-integer rules_executed', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.rules_executed = 21.5;
    });
  });

  it('rejects invalid IPFS URI format', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.report = 'https://example.com/file.json';
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.date).toBe(base.date);
        expect(data.external_id).toBe(base.external_id);
        expect(data.methodology_compliance).toBe('PASSED');
        expect(data.rules_executed).toBe(21);
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

describe('MethodologyComplianceSchema', () => {
  it('validates PASSED', () => {
    expectSchemaValid(MethodologyComplianceSchema, () => 'PASSED');
  });

  it('validates FAILED', () => {
    expectSchemaValid(MethodologyComplianceSchema, () => 'FAILED');
  });

  it('rejects invalid value', () => {
    expectSchemaInvalid(
      MethodologyComplianceSchema as unknown as z.ZodType<string>,
      'INVALID',
      () => undefined,
    );
  });
});
