import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaValid,
  validAuditReferenceFixture,
} from '../../../../test-utils';
import { runReferenceSchemaTests } from './reference.test-helpers';
import {
  AuditReferenceSchema,
  MethodologyComplianceSchema,
} from '../audit-reference.schema';

describe('AuditReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: AuditReferenceSchema,
    base: validAuditReferenceFixture,
    requiredFields: [
      'date',
      'external_id',
      'external_url',
      'methodology_compliance',
      'rules_executed',
      'report',
    ],
    validCases: [
      {
        description: 'validates FAILED compliance status',
        build: () => ({
          ...validAuditReferenceFixture,
          methodology_compliance: 'FAILED' as const,
        }),
      },
    ],
    invalidCases: [
      {
        description: 'rejects invalid date format',
        mutate: (invalid) => {
          invalid.date = '2025/06/24';
        },
      },
      {
        description: 'rejects invalid UUID for external_id',
        mutate: (invalid) => {
          invalid.external_id = 'not-a-uuid';
        },
      },
      {
        description: 'rejects invalid URL for external_url',
        mutate: (invalid) => {
          invalid.external_url = 'not-a-url';
        },
      },
      {
        description: 'rejects invalid compliance status',
        mutate: (invalid) => {
          invalid.methodology_compliance = 'INVALID' as unknown as
            | 'PASSED'
            | 'FAILED';
        },
      },
      {
        description: 'rejects negative rules_executed',
        mutate: (invalid) => {
          invalid.rules_executed = -1;
        },
      },
      {
        description: 'rejects non-integer rules_executed',
        mutate: (invalid) => {
          invalid.rules_executed = 21.5;
        },
      },
      {
        description: 'rejects invalid IPFS URI format',
        mutate: (invalid) => {
          invalid.report = 'https://example.com/file.json';
        },
      },
    ],
    typeCheck: (data, base) => {
      expect(data.date).toBe(base.date);
      expect(data.external_id).toBe(base.external_id);
      expect(data.methodology_compliance).toBe('PASSED');
      expect(data.rules_executed).toBe(21);
    },
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
