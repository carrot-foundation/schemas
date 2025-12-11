import { describe, expect, it } from 'vitest';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validWasteClassificationFixture,
  validAccreditedParticipantsFixture,
  validParticipantRewardsFixture,
} from '../../../../test-utils';
import {
  WasteClassificationSchema,
  AccreditedParticipantsSchema,
  ParticipantRewardsSchema,
} from '../certificate.schema';

describe('WasteClassificationSchema', () => {
  const schema = WasteClassificationSchema;
  const base = validWasteClassificationFixture;

  it('validates valid waste classification successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('rejects missing primary_type', () => {
    expectSchemaInvalidWithout(schema, base, 'primary_type');
  });

  it('rejects missing subtype', () => {
    expectSchemaInvalidWithout(schema, base, 'subtype');
  });

  it('rejects missing net_weight_kg', () => {
    expectSchemaInvalidWithout(schema, base, 'net_weight_kg');
  });

  it('rejects empty primary_type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.primary_type = '';
    });
  });

  it('rejects negative net_weight_kg', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.net_weight_kg = -100;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.primary_type).toBe(base.primary_type);
        expect(data.subtype).toBe(base.subtype);
        expect(data.net_weight_kg).toBe(base.net_weight_kg);
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

describe('AccreditedParticipantsSchema', () => {
  const schema = AccreditedParticipantsSchema;
  const base = validAccreditedParticipantsFixture;

  it('validates valid accredited participants successfully', () => {
    expectSchemaValid(schema, () => [...base]);
  });

  it('rejects empty array', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.length = 0;
    });
  });

  it('rejects missing participant_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid[0] = {
        ...invalid[0],
      };
      Reflect.deleteProperty(
        invalid[0] as Record<string, unknown>,
        'participant_id',
      );
    });
  });

  it('rejects invalid UUID for participant_id', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid[0] = {
        ...invalid[0],
        participant_id: 'not-a-uuid',
      };
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => [...base],
      (data) => {
        expect(data.length).toBe(2);
        expect(data[0].participant_id).toBe(base[0].participant_id);
      },
    );
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
