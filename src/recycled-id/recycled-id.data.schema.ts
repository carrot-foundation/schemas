import { z } from 'zod';
import {
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  WeightKgSchema,
} from '../shared/definitions.schema';
import { LocationSchema } from '../shared/entities/location.schema';
import {
  WasteClassificationSchema,
  AccreditedParticipantsSchema,
  ParticipantRewardsSchema,
} from '../shared/certificate/certificate.schema';
import {
  MethodologyReferenceSchema,
  AuditReferenceSchema,
  MassIdReferenceSchema,
} from '../shared/references';

const RecycledIDSummarySchema = z
  .strictObject({
    recycled_mass_kg: WeightKgSchema.meta({
      title: 'Recycled Mass Weight',
      description: 'Total weight of materials successfully recycled',
    }),
    credit_type: NonEmptyStringSchema.meta({
      title: 'Credit Type',
      description: 'Type of credit issued',
      examples: ['Carrot Organic (C-BIOW)', 'Recycling Credit'],
    }),
    credit_amount: NonNegativeFloatSchema.meta({
      title: 'Credit Amount',
      description: 'Amount of credits issued',
    }),
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
    mass_id: MassIdReferenceSchema,
    waste_classification: WasteClassificationSchema,
    origin_location: LocationSchema.meta({
      title: 'Source Waste Origin Location',
      description: 'Location of the waste origin',
    }),
    accredited_participants: AccreditedParticipantsSchema,
    participant_rewards: ParticipantRewardsSchema.optional(),
  })
  .meta({
    title: 'RecycledID Data',
    description: 'Complete data structure for RecycledID certificate',
  });

export type RecycledIDData = z.infer<typeof RecycledIDDataSchema>;
