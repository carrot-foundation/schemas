import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
  ParticipantRoleSchema,
  NonEmptyStringSchema,
  PercentageSchema,
  Sha256HashSchema,
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

export const RewardDiscountTypeSchema = z
  .enum(['large_business', 'supply_chain_digitization'])
  .meta({
    title: 'Discount Type',
    description: 'Type of discount applied to the reward allocation',
    examples: ['large_business', 'supply_chain_digitization'],
  });
export type RewardDiscountType = z.infer<typeof RewardDiscountTypeSchema>;

export const RewardDiscountSchema = z
  .strictObject({
    type: RewardDiscountTypeSchema.meta({
      title: 'Discount Type',
      description: 'Type of discount applied',
    }),
    percentage: PercentageSchema.meta({
      title: 'Discount Percentage',
      description: 'Percentage reduction applied (e.g., 50 for 50% discount)',
      examples: [25, 50],
    }),
    reason: NonEmptyStringSchema.max(200).meta({
      title: 'Discount Reason',
      description: 'Human-readable explanation of why the discount was applied',
      examples: [
        'Waste Generator not identified - Supply Chain Digitization Incentive',
        'Large business with >$4M annual revenue',
        'Brazil Tax Authority Group I Large Business classification',
      ],
    }),
  })
  .meta({
    title: 'Discount',
    description: 'Discount applied to a reward allocation',
  });
export type RewardDiscount = z.infer<typeof RewardDiscountSchema>;

export const RewardAllocationSchema = z
  .strictObject({
    participant_id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description:
        'SHA-256 hash of the unique identifier for the participant receiving the reward',
    }),
    role: ParticipantRoleSchema.meta({
      title: 'Participant Role',
      description: 'Role of the participant in the supply chain',
    }),
    reward_percentage: PercentageSchema.meta({
      title: 'Reward Percentage',
      description: 'Reward percentage allocated to the participant',
    }),
    discounts: z.array(RewardDiscountSchema).optional().meta({
      title: 'Discounts',
      description: "Discounts applied to this participant's reward allocation",
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
    discounts_applied: z
      .array(NonEmptyStringSchema.max(200))
      .optional()
      .meta({
        title: 'Discounts Applied',
        description: 'Descriptions of discounts applied to the distribution',
        examples: [
          [
            '50% reduction applied to Waste Generator participants with >$4M annual revenue',
            '25% Supply Chain Digitization Incentive applied to logistics providers due to unidentified Waste Generator',
          ],
        ],
      }),
    redirected_rewards: NonEmptyStringSchema.max(300)
      .optional()
      .meta({
        title: 'Redirected Rewards',
        description:
          'Description of rewards redirected to community pools or other recipients',
        examples: [
          'Discounted rewards from large businesses redirected to the Community Impact Pool managed by Carrot Foundation',
        ],
      }),
    special_circumstances: z
      .array(NonEmptyStringSchema.max(200))
      .optional()
      .meta({
        title: 'Special Circumstances',
        description: 'Any special circumstances affecting the distribution',
        examples: [
          'Country-specific threshold applied: Brazil Tax Authority Group I Large Business classification',
        ],
      }),
  })
  .meta({
    title: 'Distribution Notes',
    description:
      'Additional notes about the reward distribution, discounts, and special circumstances',
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
