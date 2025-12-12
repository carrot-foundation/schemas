import type {
  WasteProperties,
  AccreditedParticipants,
  AccreditedParticipant,
  RewardAllocation,
  DistributionNotes,
  ParticipantRewards,
} from '../../shared';

/**
 * Minimal waste properties stub for testing.
 *
 * Contains only required fields for waste properties schema validation.
 * Used as a base for creating custom waste properties fixtures in tests.
 */
export const minimalWastePropertiesStub: WasteProperties = {
  type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  net_weight_kg: 3000,
};

/**
 * Valid waste properties fixture for testing.
 *
 * Represents a complete waste properties that satisfies the waste properties schema.
 * Used in tests to validate waste properties schema parsing and validation.
 */
export const validWastePropertiesFixture: WasteProperties = {
  type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  net_weight_kg: 3000,
};

/**
 * Creates a waste properties fixture with optional overrides.
 *
 * @param overrides - Optional partial waste properties to override default values
 * @returns A complete waste properties fixture
 */
export function createWastePropertiesFixture(
  overrides?: Partial<WasteProperties>,
): WasteProperties {
  return {
    ...minimalWastePropertiesStub,
    ...overrides,
  };
}

/**
 * Minimal accredited participant stub for testing.
 *
 * Contains only required fields for accredited participant schema validation.
 * Used as a base for creating custom accredited participant fixtures in tests.
 */
export const minimalAccreditedParticipantStub: AccreditedParticipant = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  name: 'Eco Reciclagem',
  role: 'Recycler',
  accreditation_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  external_url:
    'https://explore.carrot.eco/document/acc-5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
};

/**
 * Valid accredited participant fixture for testing.
 *
 * Represents a complete accredited participant that satisfies the accredited participant schema.
 * Used in tests to validate accredited participant schema parsing and validation.
 */
export const validAccreditedParticipantFixture: AccreditedParticipant = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  name: 'Eco Reciclagem',
  role: 'Recycler',
  accreditation_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  external_url:
    'https://explore.carrot.eco/document/acc-5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
};

/**
 * Creates an accredited participant fixture with optional overrides.
 *
 * @param overrides - Optional partial accredited participant to override default values
 * @returns A complete accredited participant fixture
 */
export function createAccreditedParticipantFixture(
  overrides?: Partial<AccreditedParticipant>,
): AccreditedParticipant {
  return {
    ...minimalAccreditedParticipantStub,
    ...overrides,
  };
}

/**
 * Minimal accredited participants stub for testing.
 *
 * Contains only the minimum required participants (one) for accredited participants schema validation.
 * Used as a base for creating custom accredited participants fixtures in tests.
 */
export const minimalAccreditedParticipantsStub: AccreditedParticipants = [
  minimalAccreditedParticipantStub,
];

/**
 * Valid accredited participants fixture for testing.
 *
 * Represents a complete array of accredited participants that satisfies the accredited participants schema.
 * Used in tests to validate accredited participants schema parsing and validation.
 */
export const validAccreditedParticipantsFixture: AccreditedParticipants = [
  validAccreditedParticipantFixture,
  {
    participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
    name: 'Enlatados Produção',
    role: 'Waste Generator',
    accreditation_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
    external_url:
      'https://explore.carrot.eco/document/acc-6f520d88-864d-432d-bf9f-5c3166c4818f',
  },
];

/**
 * Creates an accredited participants fixture with optional overrides.
 *
 * @param overrides - Optional array of accredited participants to use instead of default
 * @returns A complete accredited participants fixture
 */
export function createAccreditedParticipantsFixture(
  overrides?: AccreditedParticipants,
): AccreditedParticipants {
  return overrides ?? validAccreditedParticipantsFixture;
}

/**
 * Minimal reward allocation stub for testing.
 *
 * Contains only required fields for reward allocation schema validation.
 * Used as a base for creating custom reward allocation fixtures in tests.
 */
export const minimalRewardAllocationStub: RewardAllocation = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  participant_name: 'Eco Reciclagem',
  role: 'Hauler',
  reward_percentage: 20,
  effective_percentage: 20,
};

/**
 * Valid reward allocation fixture for testing.
 *
 * Represents a complete reward allocation that satisfies the reward allocation schema.
 * Used in tests to validate reward allocation schema parsing and validation.
 */
export const validRewardAllocationFixture: RewardAllocation = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  participant_name: 'Eco Reciclagem',
  role: 'Hauler',
  reward_percentage: 20,
  effective_percentage: 20,
};

/**
 * Creates a reward allocation fixture with optional overrides.
 *
 * @param overrides - Optional partial reward allocation to override default values
 * @returns A complete reward allocation fixture
 */
export function createRewardAllocationFixture(
  overrides?: Partial<RewardAllocation>,
): RewardAllocation {
  return {
    ...minimalRewardAllocationStub,
    ...overrides,
  };
}

/**
 * Valid reward allocation fixture with discount for testing.
 *
 * Represents a complete reward allocation with large business discount that satisfies the reward allocation schema.
 * Used in tests to validate reward allocation schema parsing and validation with discount scenarios.
 */
export const validRewardAllocationWithDiscountFixture: RewardAllocation = {
  participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
  participant_name: 'Enlatados Produção',
  role: 'Waste Generator',
  reward_percentage: 25,
  large_business_discount_applied: true,
  effective_percentage: 12.5,
};

/**
 * Minimal distribution notes stub for testing.
 *
 * Contains only required fields for distribution notes schema validation.
 * Since all fields are optional, this is an empty object.
 * Used as a base for creating custom distribution notes fixtures in tests.
 */
export const minimalDistributionNotesStub: DistributionNotes = {};

/**
 * Valid distribution notes fixture for testing.
 *
 * Represents a complete distribution notes object that satisfies the distribution notes schema.
 * Used in tests to validate distribution notes schema parsing and validation.
 */
export const validDistributionNotesFixture: DistributionNotes = {
  large_business_discount_applied:
    '50% reduction applied to participants with >$4M annual revenue',
  redirected_rewards:
    'Discounted rewards from large businesses redirected to accredited NGOs',
};

/**
 * Creates a distribution notes fixture with optional overrides.
 *
 * @param overrides - Optional partial distribution notes to override default values
 * @returns A complete distribution notes fixture
 */
export function createDistributionNotesFixture(
  overrides?: Partial<DistributionNotes>,
): DistributionNotes {
  return {
    ...minimalDistributionNotesStub,
    ...overrides,
  };
}

/**
 * Minimal participant rewards stub for testing.
 *
 * Contains only required fields for participant rewards schema validation.
 * Used as a base for creating custom participant rewards fixtures in tests.
 */
export const minimalParticipantRewardsStub: ParticipantRewards = {
  distribution_basis: 'BOLD Carbon (CH₄) methodology rewards calculation',
  reward_allocations: [minimalRewardAllocationStub],
};

/**
 * Valid participant rewards fixture for testing.
 *
 * Represents a complete participant rewards object that satisfies the participant rewards schema.
 * Used in tests to validate participant rewards schema parsing and validation.
 */
export const validParticipantRewardsFixture: ParticipantRewards = {
  distribution_basis: 'BOLD Carbon (CH₄) methodology rewards calculation',
  reward_allocations: [
    validRewardAllocationWithDiscountFixture,
    validRewardAllocationFixture,
  ],
  distribution_notes: validDistributionNotesFixture,
};

/**
 * Creates a participant rewards fixture with optional overrides.
 *
 * @param overrides - Optional partial participant rewards to override default values
 * @returns A complete participant rewards fixture
 */
export function createParticipantRewardsFixture(
  overrides?: Partial<ParticipantRewards>,
): ParticipantRewards {
  return {
    ...minimalParticipantRewardsStub,
    ...overrides,
  };
}
