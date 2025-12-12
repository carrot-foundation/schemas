import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validAuditRuleDefinitionFixture,
  validAuditRuleDefinitionsFixture,
  validAuditRuleExecutionResultFixture,
  validAuditRuleExecutionResultsFixture,
} from '../../../test-utils';
import {
  AuditRuleDefinitionSchema,
  AuditRuleDefinitionsSchema,
  AuditRuleExecutionResultSchema,
  AuditRuleExecutionResultsSchema,
} from '../audit.schema';

describe('AuditRuleDefinitionSchema', () => {
  const schema = AuditRuleDefinitionSchema;
  const base = validAuditRuleDefinitionFixture;

  it('validates valid audit rule definition successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it.each([
    {
      field: 'id',
      description: 'rejects missing id',
    },
    {
      field: 'slug',
      description: 'rejects missing slug',
    },
    {
      field: 'name',
      description: 'rejects missing name',
    },
    {
      field: 'description',
      description: 'rejects missing description',
    },
    {
      field: 'source_code_url',
      description: 'rejects missing source_code_url',
    },
    {
      field: 'execution_order',
      description: 'rejects missing execution_order',
    },
  ])('$description', ({ field }) => {
    expectSchemaInvalidWithout(schema, base, field as keyof typeof base);
  });

  it.each([
    {
      description: 'rejects invalid UUID for id',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.id = 'not-a-uuid';
      },
    },
    {
      description: 'rejects invalid slug for slug',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.slug = 'Invalid Slug!';
      },
    },
    {
      description: 'rejects empty name',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.name = '';
      },
    },
    {
      description: 'rejects name exceeding max length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.name = 'a'.repeat(101);
      },
    },
    {
      description: 'rejects description shorter than minimum',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.description = 'short';
      },
    },
    {
      description: 'rejects description exceeding max length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.description = 'a'.repeat(501);
      },
    },
    {
      description: 'rejects non-GitHub URL for source_code_url',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.source_code_url = 'https://example.com/not-github';
      },
    },
    {
      description: 'rejects non-URL string for source_code_url',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.source_code_url = 'not-a-url';
      },
    },
    {
      description: 'rejects non-positive execution_order',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_order = 0;
      },
    },
    {
      description: 'rejects negative execution_order',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_order = -1;
      },
    },
    {
      description: 'rejects non-integer execution_order',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_order = 1.5;
      },
    },
    {
      description: 'rejects additional properties',
      mutate: (invalid: z.input<typeof schema>) => {
        (
          invalid as z.input<typeof schema> & { extra_field?: string }
        ).extra_field = 'not allowed';
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
        expect(data.id).toBe(base.id);
        expect(data.slug).toBe(base.slug);
        expect(data.name).toBe(base.name);
        expect(data.description).toBe(base.description);
        expect(data.source_code_url).toBe(base.source_code_url);
        expect(data.execution_order).toBe(base.execution_order);
      },
    );
  });
});

describe('AuditRuleDefinitionsSchema', () => {
  const schema = AuditRuleDefinitionsSchema;
  const base = validAuditRuleDefinitionsFixture;

  it('validates valid sorted audit rule definitions successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('validates single rule definition successfully', () => {
    expectSchemaValid(schema, () => [base[0]]);
  });

  it('rejects empty array', () => {
    const result = schema.safeParse([]);

    expect(result.success).toBe(false);
  });

  it('rejects duplicate id', () => {
    const invalid = structuredClone(base);
    invalid[1] = {
      ...invalid[1],
      id: invalid[0].id,
    };

    expectIssuesContain(schema, () => invalid, [
      `Duplicate id found: ${invalid[0].id}`,
    ]);
  });

  it('rejects duplicate slug', () => {
    const invalid = structuredClone(base);
    invalid[1] = {
      ...invalid[1],
      slug: invalid[0].slug,
    };

    expectIssuesContain(schema, () => invalid, [
      `Duplicate slug found: ${invalid[0].slug}`,
    ]);
  });

  it('rejects duplicate execution_order', () => {
    const invalid = structuredClone(base);
    invalid[1] = {
      ...invalid[1],
      execution_order: invalid[0].execution_order,
    };

    expectIssuesContain(schema, () => invalid, [
      `Duplicate execution_order found: ${invalid[0].execution_order}`,
    ]);
  });

  it('rejects unsorted array by execution_order', () => {
    const invalid = structuredClone(base);
    invalid[0] = {
      ...invalid[0],
      execution_order: 3,
    };
    invalid[1] = {
      ...invalid[1],
      execution_order: 1,
    };
    invalid[2] = {
      ...invalid[2],
      execution_order: 2,
    };

    expectIssuesContain(schema, () => invalid, [
      'Rules must be sorted by execution_order. Found order 1 after 3',
    ]);
  });

  it('rejects array with out-of-order execution_order', () => {
    const invalid = [
      {
        ...base[0],
        execution_order: 2,
      },
      {
        ...base[1],
        execution_order: 1,
      },
    ];

    expectIssuesContain(schema, () => invalid, [
      'Rules must be sorted by execution_order. Found order 1 after 2',
    ]);
  });

  it('rejects array with equal execution_order values', () => {
    const invalid = [
      {
        ...base[0],
        execution_order: 1,
      },
      {
        ...base[1],
        execution_order: 1,
        id: 'b2c3d4e5-f6a7-4901-9345-678901bcdefg',
        slug: 'different-slug',
      },
    ];

    expectIssuesContain(schema, () => invalid, [
      'Duplicate execution_order found: 1',
    ]);
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data).toHaveLength(3);
        expect(data[0].id).toBe(base[0].id);
        expect(data[1].id).toBe(base[1].id);
        expect(data[2].id).toBe(base[2].id);
      },
    );
  });
});

describe('AuditRuleExecutionResultSchema', () => {
  const schema = AuditRuleExecutionResultSchema;
  const base = validAuditRuleExecutionResultFixture;

  it('validates valid audit rule execution result successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it.each([
    {
      field: 'rule_id',
      description: 'rejects missing rule_id',
    },
    {
      field: 'rule_slug',
      description: 'rejects missing rule_slug',
    },
    {
      field: 'rule_name',
      description: 'rejects missing rule_name',
    },
    {
      field: 'rule_description',
      description: 'rejects missing rule_description',
    },
    {
      field: 'rule_source_code_url',
      description: 'rejects missing rule_source_code_url',
    },
    {
      field: 'rule_execution_order',
      description: 'rejects missing rule_execution_order',
    },
    {
      field: 'execution_id',
      description: 'rejects missing execution_id',
    },
    {
      field: 'execution_started_at',
      description: 'rejects missing execution_started_at',
    },
    {
      field: 'execution_completed_at',
      description: 'rejects missing execution_completed_at',
    },
    {
      field: 'result',
      description: 'rejects missing result',
    },
    {
      field: 'rule_processor_checksum',
      description: 'rejects missing rule_processor_checksum',
    },
    {
      field: 'rule_source_code_version',
      description: 'rejects missing rule_source_code_version',
    },
  ])('$description', ({ field }) => {
    expectSchemaInvalidWithout(schema, base, field as keyof typeof base);
  });

  it.each([
    {
      description: 'rejects invalid UUID for rule_id',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_id = 'not-a-uuid';
      },
    },
    {
      description: 'rejects invalid slug for rule_slug',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_slug = 'Invalid Slug!';
      },
    },
    {
      description: 'rejects empty rule_name',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_name = '';
      },
    },
    {
      description: 'rejects invalid UUID for execution_id',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_id = 'not-a-uuid';
      },
    },
    {
      description: 'rejects invalid ISO datetime for execution_started_at',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_started_at = 'not-a-datetime';
      },
    },
    {
      description: 'rejects invalid ISO datetime for execution_completed_at',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.execution_completed_at = 'not-a-datetime';
      },
    },
    {
      description: 'rejects non-positive rule_execution_order',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_execution_order = 0;
      },
    },
    {
      description: 'rejects negative rule_execution_order',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_execution_order = -1;
      },
    },
    {
      description: 'rejects invalid audit result',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.result = 'INVALID' as unknown as 'PASSED' | 'FAILED';
      },
    },
    {
      description: 'rejects empty rule_description',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_description = '';
      },
    },
    {
      description: 'rejects rule_description shorter than minimum',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_description = 'short';
      },
    },
    {
      description: 'rejects rule_description exceeding max length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_description = 'a'.repeat(501);
      },
    },
    {
      description: 'rejects non-GitHub URL for rule_source_code_url',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_source_code_url = 'https://example.com/not-github';
      },
    },
    {
      description: 'rejects empty rule_processor_checksum',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_processor_checksum = '';
      },
    },
    {
      description: 'rejects rule_processor_checksum exceeding max length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_processor_checksum = 'a'.repeat(201);
      },
    },
    {
      description: 'rejects empty rule_source_code_version',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_source_code_version = '';
      },
    },
    {
      description: 'rejects rule_source_code_version exceeding max length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.rule_source_code_version = 'a'.repeat(201);
      },
    },
    {
      description: 'rejects additional properties',
      mutate: (invalid: z.input<typeof schema>) => {
        (
          invalid as z.input<typeof schema> & { extra_field?: string }
        ).extra_field = 'not allowed';
      },
    },
  ])('$description', ({ mutate }) => {
    expectSchemaInvalid(schema, base, mutate);
  });

  it('validates PASSED result', () => {
    expectSchemaValid(schema, () => ({
      ...base,
      result: 'PASSED' as const,
    }));
  });

  it('validates FAILED result', () => {
    expectSchemaValid(schema, () => ({
      ...base,
      result: 'FAILED' as const,
    }));
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.rule_id).toBe(base.rule_id);
        expect(data.rule_slug).toBe(base.rule_slug);
        expect(data.rule_name).toBe(base.rule_name);
        expect(data.rule_description).toBe(base.rule_description);
        expect(data.rule_source_code_url).toBe(base.rule_source_code_url);
        expect(data.rule_execution_order).toBe(base.rule_execution_order);
        expect(data.execution_id).toBe(base.execution_id);
        expect(data.execution_started_at).toBe(base.execution_started_at);
        expect(data.execution_completed_at).toBe(base.execution_completed_at);
        expect(data.result).toBe(base.result);
        expect(data.rule_processor_checksum).toBe(base.rule_processor_checksum);
        expect(data.rule_source_code_version).toBe(
          base.rule_source_code_version,
        );
      },
    );
  });
});

describe('AuditRuleExecutionResultsSchema', () => {
  const schema = AuditRuleExecutionResultsSchema;
  const base = validAuditRuleExecutionResultsFixture;

  it('validates valid audit rule execution results successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects empty array', () => {
    const result = schema.safeParse([]);

    expect(result.success).toBe(false);
  });

  it('validates single execution result', () => {
    expectSchemaValid(schema, () => [base[0]]);
  });

  it('rejects duplicate execution_id', () => {
    const invalid = structuredClone(base);
    invalid[1] = {
      ...invalid[1],
      execution_id: invalid[0].execution_id,
    };

    expectIssuesContain(schema, () => invalid, [
      `Duplicate execution_id found: ${invalid[0].execution_id}`,
    ]);
  });

  it('rejects unsorted array by execution_started_at', () => {
    const invalid = structuredClone(base);
    invalid[0] = {
      ...invalid[0],
      execution_started_at: '2024-12-05T11:02:50.000Z',
    };
    invalid[1] = {
      ...invalid[1],
      execution_started_at: '2024-12-05T11:02:47.000Z',
    };

    expectIssuesContain(schema, () => invalid, [
      'Results must be sorted by execution_started_at. Found timestamp 2024-12-05T11:02:47.000Z before 2024-12-05T11:02:50.000Z',
    ]);
  });

  it('rejects array with invalid execution result', () => {
    const invalid = [
      ...base,
      {
        ...base[0],
        rule_id: 'invalid-uuid',
        execution_id: 'g3h4i5j6-k7l8-4903-1567-890123fabcde',
      },
    ];

    const result = schema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data).toHaveLength(2);
        expect(data[0].rule_id).toBe(base[0].rule_id);
        expect(data[1].rule_id).toBe(base[1].rule_id);
        expect(data[0].execution_id).toBe(base[0].execution_id);
        expect(data[1].execution_id).toBe(base[1].execution_id);
      },
    );
  });
});
