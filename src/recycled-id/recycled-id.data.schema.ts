import { z } from 'zod';
import {
  ParticipantRewardsSchema,
  WastePropertiesSchema,
  MethodologyReferenceSchema,
  AuditReferenceSchema,
  MassIDReferenceSchema,
  LocationSchema,
  WeightKgSchema,
  CreditTypeSchema,
  CreditAmountSchema,
  IsoDateTimeSchema,
} from '../shared';

const RecycledIDSummarySchema = z
  .strictObject({
    recycled_mass_kg: WeightKgSchema.meta({
      title: 'Recycled Mass Weight',
      description:
        'Total weight of materials successfully recycled in kilograms (kg)',
    }),
    credit_type: CreditTypeSchema,
    credit_amount: CreditAmountSchema,
    issued_at: IsoDateTimeSchema.meta({
      title: 'Issued At',
      description: 'ISO 8601 timestamp when the certificate was issued',
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
    mass_id: MassIDReferenceSchema,
    waste_properties: WastePropertiesSchema,
    origin_location: LocationSchema.meta({
      title: 'RecycledID Origin Location',
      description: 'Source waste origin location details',
    }),
    participant_rewards: ParticipantRewardsSchema,
  })
  .meta({
    title: 'RecycledID Data',
    description: 'Complete data structure for RecycledID certificate',
  });
export type RecycledIDData = z.infer<typeof RecycledIDDataSchema>;
