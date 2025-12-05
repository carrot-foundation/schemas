import type {
  WasteClassification,
  AccreditedParticipants,
  AccreditedParticipant,
  RewardAllocation,
  DistributionNotes,
  ParticipantRewards,
} from '../../shared';

/**
 * Valid waste classification fixture for testing.
 *
 * Represents a complete waste classification that satisfies the waste classification schema.
 * Used in tests to validate waste classification schema parsing and validation.
 */
export const validWasteClassificationFixture: WasteClassification = {
  primary_type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  net_weight_kg: 3000,
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
