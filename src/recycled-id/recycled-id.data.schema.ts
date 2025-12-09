import { z } from 'zod';
import {
  AccreditedParticipantsSchema,
  ParticipantRewardsSchema,
  WasteClassificationSchema,
  MethodologyReferenceSchema,
  AuditReferenceSchema,
  MassIDReferenceSchema,
  LocationSchema,
  WeightKgSchema,
  CreditTypeSchema,
  CreditAmountSchema,
} from '../shared';

const RecycledIDSummarySchema = z
  .strictObject({
    recycled_mass_kg: WeightKgSchema.meta({
      title: 'Recycled Mass Weight',
      description: 'Total weight of materials successfully recycled',
    }),
    credit_type: CreditTypeSchema,
    credit_amount: CreditAmountSchema,
  })
  .meta({
    title: 'RecycledID Summary',
    description: 'Summary information for the RecycledID certificate',
  });

export type RecycledIDSummary = z.infer<typeof RecycledIDSummarySchema>;

export const RecycledIDDataSchema = z
  .strictObject({
    summary: RecycledIDSummarySchema,
    methodology: MethodologyReferenceSchema,
    audit: AuditReferenceSchema,
    mass_id: MassIDReferenceSchema,
    waste_classification: WasteClassificationSchema,
    origin_location: LocationSchema.meta({
      title: 'RecycledID Origin Location',
      description: 'Source waste origin location details',
    }),
    accredited_participants: AccreditedParticipantsSchema,
    participant_rewards: ParticipantRewardsSchema.optional(),
  })
  .meta({
    title: 'RecycledID Data',
    description: 'Complete data structure for RecycledID certificate',
  });

export type RecycledIDData = z.infer<typeof RecycledIDDataSchema>;
