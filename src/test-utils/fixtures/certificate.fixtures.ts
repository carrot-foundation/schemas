import type {
  WasteClassification,
  AccreditedParticipants,
  AccreditedParticipant,
  RewardAllocation,
  DistributionNotes,
  ParticipantRewards,
} from '../../shared';

export const validWasteClassification: WasteClassification = {
  primary_type: 'Organic',
  subtype: 'Food, Food Waste and Beverages',
  net_weight_kg: 3000,
};

export const validAccreditedParticipant: AccreditedParticipant = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  name: 'Eco Reciclagem',
  role: 'Recycler',
  accreditation_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  external_url:
    'https://explore.carrot.eco/document/acc-5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
};

export const validAccreditedParticipants: AccreditedParticipants = [
  validAccreditedParticipant,
  {
    participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
    name: 'Enlatados Produção',
    role: 'Waste Generator',
    accreditation_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
    external_url:
      'https://explore.carrot.eco/document/acc-6f520d88-864d-432d-bf9f-5c3166c4818f',
  },
];

export const validRewardAllocation: RewardAllocation = {
  participant_id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
  participant_name: 'Eco Reciclagem',
  role: 'Hauler',
  reward_percentage: 20,
  effective_percentage: 20,
};

export const validRewardAllocationWithDiscount: RewardAllocation = {
  participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
  participant_name: 'Enlatados Produção',
  role: 'Waste Generator',
  reward_percentage: 25,
  large_business_discount_applied: true,
  effective_percentage: 12.5,
};

export const validDistributionNotes: DistributionNotes = {
  large_business_discount_applied:
    '50% reduction applied to participants with >$4M annual revenue',
  redirected_rewards:
    'Discounted rewards from large businesses redirected to accredited NGOs',
};

export const validParticipantRewards: ParticipantRewards = {
  distribution_basis: 'BOLD Carbon (CH₄) methodology rewards calculation',
  reward_allocations: [
    validRewardAllocationWithDiscount,
    validRewardAllocation,
  ],
  distribution_notes: validDistributionNotes,
};
