import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
  UuidSchema,
  ParticipantRoleSchema,
  NonEmptyStringSchema,
  PercentageSchema,
} from '../primitives';

export const WastePropertiesSchema = z
  .strictObject({
    type: WasteTypeSchema.meta({
      title: 'Source Waste Type',
      description: 'Type of the source waste',
    }),
    subtype: WasteSubtypeSchema.meta({
      title: 'Source Waste Subtype',
      description: 'Subtype of the source waste',
    }),
    net_weight_kg: WeightKgSchema.meta({
      title: 'Source Waste Net Weight',
      description: 'Net weight of the source waste in kilograms (kg)',
    }),
  })
  .meta({
    title: 'Waste Properties',
    description: 'Properties of the source waste (MassID)',
  });

export type WasteProperties = z.infer<typeof WastePropertiesSchema>;

export const RewardAllocationSchema = z
  .strictObject({
    participant_id: UuidSchema.meta({
      title: 'Participant ID',
      description: 'Unique identifier for the participant receiving the reward',
    }),
    participant_name: NonEmptyStringSchema.max(100).meta({
      title: 'Participant Name',
      description: 'Name of the participant receiving the reward',
      examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Tech Corp'],
    }),
    role: ParticipantRoleSchema.meta({
      title: 'Participant Role',
      description: 'Role of the participant in the supply chain',
    }),
    reward_percentage: PercentageSchema.meta({
      title: 'Reward Percentage',
      description: 'Reward percentage allocated to the participant',
    }),
    large_business_discount_applied: z.boolean().optional().meta({
      title: 'Large Business Discount Applied',
      description: 'Whether the large business discount was applied',
    }),
    effective_percentage: PercentageSchema.meta({
      title: 'Effective Percentage',
      description: 'Effective percentage of the reward after discounts',
    }),
  })
  .meta({
    title: 'Reward Allocation',
    description: 'Reward allocation for a specific participant',
  });

export type RewardAllocation = z.infer<typeof RewardAllocationSchema>;

export const DistributionNotesSchema = z
  .strictObject({
    large_business_discount_applied: NonEmptyStringSchema.optional().meta({
      title: 'Large Business Discount Applied',
      description: 'Description of the large business discount applied',
      examples: [
        '50% reduction applied to participants with >$4M annual revenue',
      ],
    }),
    redirected_rewards: NonEmptyStringSchema.optional().meta({
      title: 'Redirected Rewards',
      description: 'Description of the redirected rewards',
      examples: [
        'Discounted rewards from large businesses redirected to accredited NGOs',
      ],
    }),
  })
  .meta({
    title: 'Distribution Notes',
    description: 'Additional notes about the reward distribution',
  });

export type DistributionNotes = z.infer<typeof DistributionNotesSchema>;

export const ParticipantRewardsSchema = z
  .strictObject({
    distribution_basis: NonEmptyStringSchema.max(200).meta({
      title: 'Distribution Basis',
      description: 'Basis for the rewards distribution',
    }),
    reward_allocations: z.array(RewardAllocationSchema).min(1).meta({
      title: 'Reward Allocations',
      description: 'Rewards percentage allocated to each participant',
    }),
    distribution_notes: DistributionNotesSchema.optional().meta({
      title: 'Distribution Notes',
      description: 'Additional notes about the reward distribution',
    }),
  })
  .meta({
    title: 'Participant Rewards',
    description: 'Rewards distribution to participants',
  });

export type ParticipantRewards = z.infer<typeof ParticipantRewardsSchema>;
