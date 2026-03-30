import { z } from 'zod';
import {
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
      title: 'Recycled Weight',
      description:
        'Total weight of materials successfully recycled in kilograms (kg)',
    }),
    credit_type: CreditTypeSchema,
    credit_amount: CreditAmountSchema,
    recycling_date: IsoDateTimeSchema.meta({
      title: 'Recycling Date',
      description:
        'ISO 8601 timestamp when the recycling occurred (when the environmental gain was achieved)',
    }),
    issued_at: IsoDateTimeSchema.meta({
      title: 'Issued At',
      description: 'ISO 8601 timestamp when the certificate was issued',
    }),
  })
  .meta({
    title: 'RecycledID Summary',
    description:
      'Key metrics for the RecycledID certificate including recycled weight, credit details, and issuance timestamps',
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
      description:
        'Geographic location where the source waste was originally collected',
    }),
  })
  .meta({
    title: 'RecycledID Data',
    description:
      'Complete RecycledID certificate data including summary metrics, methodology reference, audit trail, source MassID, waste properties, and origin location',
  });
export type RecycledIDData = z.infer<typeof RecycledIDDataSchema>;
