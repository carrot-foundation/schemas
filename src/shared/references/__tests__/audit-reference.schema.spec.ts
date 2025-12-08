import { describe, it, expect } from 'vitest';
import {
  AuditReferenceSchema,
  MethodologyComplianceSchema,
} from '../audit-reference.schema';
import { validAuditReferenceFixture } from '../../../test-utils';

describe('AuditReferenceSchema', () => {
  it('validates valid audit reference successfully', () => {
    const result = AuditReferenceSchema.safeParse(validAuditReferenceFixture);

    expect(result.success).toBe(true);
  });

  it('validates FAILED compliance status', () => {
    const failedAudit = {
      ...validAuditReferenceFixture,
      methodology_compliance: 'FAILED' as const,
    };
    const result = AuditReferenceSchema.safeParse(failedAudit);

    expect(result.success).toBe(true);
  });

  it('rejects missing date', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { date, ...withoutDate } = validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutDate);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_id, ...withoutExternalId } = validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutExternalId);

    expect(result.success).toBe(false);
  });

  it('rejects missing external_url', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external_url, ...withoutExternalUrl } = validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutExternalUrl);

    expect(result.success).toBe(false);
  });

  it('rejects missing methodology_compliance', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { methodology_compliance, ...withoutCompliance } =
      validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutCompliance);

    expect(result.success).toBe(false);
  });

  it('rejects missing rules_executed', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rules_executed, ...withoutRulesExecuted } =
      validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutRulesExecuted);

    expect(result.success).toBe(false);
  });

  it('rejects missing report', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { report, ...withoutReport } = validAuditReferenceFixture;
    const result = AuditReferenceSchema.safeParse(withoutReport);

    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      date: '2025/06/24',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for external_id', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      external_id: 'not-a-uuid',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for external_url', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      external_url: 'not-a-url',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid compliance status', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      methodology_compliance: 'INVALID' as unknown as 'PASSED' | 'FAILED',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects negative rules_executed', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      rules_executed: -1,
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects non-integer rules_executed', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      rules_executed: 21.5,
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects invalid IPFS URI format', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      report: 'https://example.com/file.json',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = AuditReferenceSchema.safeParse(validAuditReferenceFixture);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.date).toBe(validAuditReferenceFixture.date);
      expect(data.external_id).toBe(validAuditReferenceFixture.external_id);
      expect(data.methodology_compliance).toBe('PASSED');
      expect(data.rules_executed).toBe(21);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validAuditReferenceFixture,
      extra_field: 'not allowed',
    };
    const result = AuditReferenceSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});

describe('MethodologyComplianceSchema', () => {
  it('validates PASSED', () => {
    const result = MethodologyComplianceSchema.safeParse('PASSED');

    expect(result.success).toBe(true);
  });

  it('validates FAILED', () => {
    const result = MethodologyComplianceSchema.safeParse('FAILED');

    expect(result.success).toBe(true);
  });

  it('rejects invalid value', () => {
    const result = MethodologyComplianceSchema.safeParse('INVALID');

    expect(result.success).toBe(false);
  });
});
