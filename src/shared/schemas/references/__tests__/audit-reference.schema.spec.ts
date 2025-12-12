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
  AuditResultSchema,
} from '../audit-reference.schema';

describe('AuditReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: AuditReferenceSchema,
    base: validAuditReferenceFixture,
    requiredFields: [
      'completed_at',
      'external_id',
      'external_url',
      'result',
      'rules_executed',
      'report_uri',
    ],
    validCases: [
      {
        description: 'validates FAILED compliance status',
        build: () => ({
          ...validAuditReferenceFixture,
          result: 'FAILED' as const,
        }),
      },
    ],
    invalidCases: [
      {
        description: 'rejects invalid date format',
        mutate: (invalid) => {
          invalid.completed_at = '2025/06/24';
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
          invalid.result = 'INVALID' as unknown as 'PASSED' | 'FAILED';
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
          invalid.report_uri = 'https://example.com/file.json';
        },
      },
    ],
    typeCheck: (data, base) => {
      expect(data.completed_at).toBe(base.completed_at);
      expect(data.external_id).toBe(base.external_id);
      expect(data.result).toBe('PASSED');
      expect(data.rules_executed).toBe(21);
    },
  });
});

describe('AuditResultSchema', () => {
  it('validates PASSED', () => {
    expectSchemaValid(AuditResultSchema, () => 'PASSED');
  });

  it('validates FAILED', () => {
    expectSchemaValid(AuditResultSchema, () => 'FAILED');
  });

  it('rejects invalid value', () => {
    expectSchemaInvalid(
      AuditResultSchema as unknown as z.ZodType<string>,
      'INVALID',
      () => undefined,
    );
  });
});
