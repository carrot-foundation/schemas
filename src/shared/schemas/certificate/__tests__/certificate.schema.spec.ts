import { describe, expect, it } from 'vitest';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validWastePropertiesFixture,
  validParticipantRewardsFixture,
} from '../../../../test-utils';
import {
  WastePropertiesSchema,
  ParticipantRewardsSchema,
} from '../certificate.schema';

describe('WastePropertiesSchema', () => {
  const schema = WastePropertiesSchema;
  const base = validWastePropertiesFixture;

  it('validates valid waste properties successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('rejects missing type', () => {
    expectSchemaInvalidWithout(schema, base, 'type');
  });

  it('rejects missing subtype', () => {
    expectSchemaInvalidWithout(schema, base, 'subtype');
  });

  it('rejects missing weight_kg', () => {
    expectSchemaInvalidWithout(schema, base, 'weight_kg');
  });

  it('rejects empty type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.type = '' as unknown as (typeof invalid)['type'];
    });
  });

  it('rejects negative weight_kg', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.weight_kg = -100;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.type).toBe(base.type);
        expect(data.subtype).toBe(base.subtype);
        expect(data.weight_kg).toBe(base.weight_kg);
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

describe('ParticipantRewardsSchema', () => {
  const schema = ParticipantRewardsSchema;
  const base = validParticipantRewardsFixture;

  it('validates valid participant rewards successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('validates without optional distribution_notes', () => {
    expectSchemaValid(schema, () => {
      const withoutNotes = structuredClone(base);
      Reflect.deleteProperty(
        withoutNotes as Record<string, unknown>,
        'distribution_notes',
      );
      return withoutNotes;
    });
  });

  it('rejects missing distribution_basis', () => {
    expectSchemaInvalidWithout(schema, base, 'distribution_basis');
  });

  it('rejects missing reward_allocations', () => {
    expectSchemaInvalidWithout(schema, base, 'reward_allocations');
  });

  it('rejects empty reward_allocations array', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.reward_allocations = [];
    });
  });

  it('rejects distribution_basis longer than 200 characters', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.distribution_basis = 'A'.repeat(201);
    });
  });

  it('rejects reward_percentage greater than 100', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.reward_allocations = [
        {
          ...invalid.reward_allocations[0],
          reward_percentage: 150,
        },
      ];
    });
  });

  it('rejects reward_percentage less than 0', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.reward_allocations = [
        {
          ...invalid.reward_allocations[0],
          reward_percentage: -10,
        },
      ];
    });
  });

  it('rejects effective_percentage greater than 100', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.reward_allocations = [
        {
          ...invalid.reward_allocations[0],
          effective_percentage: 150,
        },
      ];
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.distribution_basis).toBe(base.distribution_basis);
        expect(data.reward_allocations.length).toBe(2);
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
