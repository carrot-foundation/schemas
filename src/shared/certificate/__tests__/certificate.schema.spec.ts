import { describe, it, expect } from 'vitest';
import {
  WasteClassificationSchema,
  AccreditedParticipantsSchema,
  ParticipantRewardsSchema,
} from '../certificate.schema';
import {
  validWasteClassificationFixture,
  validAccreditedParticipantsFixture,
  validParticipantRewardsFixture,
} from '../../../test-utils';

describe('WasteClassificationSchema', () => {
  it('validates valid waste classification successfully', () => {
    const result = WasteClassificationSchema.safeParse(
      validWasteClassificationFixture,
    );

    expect(result.success).toBe(true);
  });

  it('rejects missing primary_type', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { primary_type, ...withoutPrimaryType } =
      validWasteClassificationFixture;
    const result = WasteClassificationSchema.safeParse(withoutPrimaryType);

    expect(result.success).toBe(false);
  });

  it('rejects missing subtype', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { subtype, ...withoutSubtype } = validWasteClassificationFixture;
    const result = WasteClassificationSchema.safeParse(withoutSubtype);

    expect(result.success).toBe(false);
  });

  it('rejects missing net_weight_kg', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { net_weight_kg, ...withoutNetWeight } =
      validWasteClassificationFixture;
    const result = WasteClassificationSchema.safeParse(withoutNetWeight);

    expect(result.success).toBe(false);
  });

  it('rejects empty primary_type', () => {
    const invalid = {
      ...validWasteClassificationFixture,
      primary_type: '',
    };
    const result = WasteClassificationSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects negative net_weight_kg', () => {
    const invalid = {
      ...validWasteClassificationFixture,
      net_weight_kg: -100,
    };
    const result = WasteClassificationSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = WasteClassificationSchema.safeParse(
      validWasteClassificationFixture,
    );

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.primary_type).toBe(
        validWasteClassificationFixture.primary_type,
      );
      expect(data.subtype).toBe(validWasteClassificationFixture.subtype);
      expect(data.net_weight_kg).toBe(
        validWasteClassificationFixture.net_weight_kg,
      );
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validWasteClassificationFixture,
      extra_field: 'not allowed',
    };
    const result = WasteClassificationSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});

describe('AccreditedParticipantsSchema', () => {
  it('validates valid accredited participants successfully', () => {
    const result = AccreditedParticipantsSchema.safeParse(
      validAccreditedParticipantsFixture,
    );

    expect(result.success).toBe(true);
  });

  it('rejects empty array', () => {
    const result = AccreditedParticipantsSchema.safeParse([]);

    expect(result.success).toBe(false);
  });

  it('rejects missing participant_id', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { participant_id, ...withoutParticipantId } =
      validAccreditedParticipantsFixture[0];
    const invalidArray = [withoutParticipantId];
    const result = AccreditedParticipantsSchema.safeParse(invalidArray);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for participant_id', () => {
    const invalid = [
      {
        ...validAccreditedParticipantsFixture[0],
        participant_id: 'not-a-uuid',
      },
    ];
    const result = AccreditedParticipantsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = AccreditedParticipantsSchema.safeParse(
      validAccreditedParticipantsFixture,
    );

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.length).toBe(2);
      expect(data[0].participant_id).toBe(
        validAccreditedParticipantsFixture[0].participant_id,
      );
    }
  });
});

describe('ParticipantRewardsSchema', () => {
  it('validates valid participant rewards successfully', () => {
    const result = ParticipantRewardsSchema.safeParse(
      validParticipantRewardsFixture,
    );

    expect(result.success).toBe(true);
  });

  it('validates without optional distribution_notes', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { distribution_notes, ...withoutNotes } =
      validParticipantRewardsFixture;
    const result = ParticipantRewardsSchema.safeParse(withoutNotes);

    expect(result.success).toBe(true);
  });

  it('rejects missing distribution_basis', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { distribution_basis, ...withoutBasis } =
      validParticipantRewardsFixture;
    const result = ParticipantRewardsSchema.safeParse(withoutBasis);

    expect(result.success).toBe(false);
  });

  it('rejects missing reward_allocations', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reward_allocations, ...withoutAllocations } =
      validParticipantRewardsFixture;
    const result = ParticipantRewardsSchema.safeParse(withoutAllocations);

    expect(result.success).toBe(false);
  });

  it('rejects empty reward_allocations array', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      reward_allocations: [],
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects distribution_basis longer than 200 characters', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      distribution_basis: 'A'.repeat(201),
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects reward_percentage greater than 100', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      reward_allocations: [
        {
          ...validParticipantRewardsFixture.reward_allocations[0],
          reward_percentage: 150,
        },
      ],
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects reward_percentage less than 0', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      reward_allocations: [
        {
          ...validParticipantRewardsFixture.reward_allocations[0],
          reward_percentage: -10,
        },
      ],
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects effective_percentage greater than 100', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      reward_allocations: [
        {
          ...validParticipantRewardsFixture.reward_allocations[0],
          effective_percentage: 150,
        },
      ],
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = ParticipantRewardsSchema.safeParse(
      validParticipantRewardsFixture,
    );

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.distribution_basis).toBe(
        validParticipantRewardsFixture.distribution_basis,
      );
      expect(data.reward_allocations.length).toBe(2);
    }
  });

  it('rejects additional properties', () => {
    const invalid = {
      ...validParticipantRewardsFixture,
      extra_field: 'not allowed',
    };
    const result = ParticipantRewardsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
