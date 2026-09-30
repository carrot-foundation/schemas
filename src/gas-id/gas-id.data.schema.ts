import { z } from 'zod';
import {
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  WeightKgSchema,
  IsoDateTimeSchema,
  LocationSchema,
  WastePropertiesSchema,
  MethodologyReferenceSchema,
  AuditReferenceSchema,
  MassIDReferenceSchema,
  CreditTypeSchema,
  CreditAmountSchema,
  GasTypeSchema,
  CreditIdentifierSchema,
} from '../shared';

const GasIDSummarySchema = z
  .strictObject({
    gas_type: GasTypeSchema,
    credit_type: CreditTypeSchema,
    credit_amount: CreditAmountSchema,
    prevented_co2e_kg: WeightKgSchema.meta({
      title: 'Prevented Emissions (CO₂e)',
      description: 'CO₂e weight of the prevented emissions in kilograms (kg)',
    }),
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
    title: 'GasID Summary',
    description:
      'Key metrics for the GasID certificate including gas type, credit details, prevented emissions, and issuance timestamps',
  });
export type GasIDSummary = z.infer<typeof GasIDSummarySchema>;

const CalculationValueSchema = z
  .strictObject({
    reference: NonEmptyStringSchema.max(3).meta({
      title: 'Calculation Reference',
      description: 'Reference symbol used in the calculation formula',
      examples: ['R'],
    }),
    value: NonNegativeFloatSchema.meta({
      title: 'Calculation Value',
      description: 'Recorded numeric value for this calculation entry',
    }),
    unit: NonEmptyStringSchema.max(50).meta({
      title: 'Calculation Unit',
      description:
        'Unit of this specific value, taken from its calculation source. The emitted prevented-emissions result R is measured in kg CO₂e; other parameters require their own verified units.',
      examples: ['kg CO₂e'],
    }),
    label: NonEmptyStringSchema.max(100).meta({
      title: 'Calculation Label',
      description: 'Human-readable label for this calculation value',
      examples: ['Prevented Emissions (CO₂e kg)'],
    }),
  })
  .meta({
    title: 'Calculation Value',
    description:
      'Named parameter or computed result used in the prevented emissions formula',
  });
export type CalculationValue = z.infer<typeof CalculationValueSchema>;

const PreventedEmissionsCalculationSchema = z
  .strictObject({
    formula: NonEmptyStringSchema.max(100).meta({
      title: 'Calculation Formula',
      description: 'Formula used to calculate the prevented emissions',
      examples: ['R = recorded result'],
    }),
    method: NonEmptyStringSchema.max(100).meta({
      title: 'Calculation Method',
      description:
        'Identifier of the calculation rule that produced these values; do not claim direct implementation of an external methodology without evidence',
      examples: ['Illustrative calculation rule'],
    }),
    calculated_at: IsoDateTimeSchema.meta({
      title: 'Calculated At',
      description:
        'ISO 8601 timestamp recorded for the calculation execution; not a fallback for issuance or recycling time',
    }),
    values: z.array(CalculationValueSchema).min(1).meta({
      title: 'Calculation Values',
      description:
        'Values recorded for the prevented emissions calculation, including any retained input parameters and result. Each entry identifies its reference, numeric value, unit, and label.',
    }),
  })
  .meta({
    title: 'Prevented Emissions Calculation',
    description:
      'Recorded prevented-emissions result and any source-backed calculation parameters, with a unit per entry and an execution timestamp',
  });
export type PreventedEmissionsCalculation = z.infer<
  typeof PreventedEmissionsCalculationSchema
>;

export const GasIDDataSchema = z
  .strictObject({
    summary: GasIDSummarySchema,
    credit: CreditIdentifierSchema,
    methodology: MethodologyReferenceSchema,
    audit: AuditReferenceSchema,
    mass_id: MassIDReferenceSchema,
    waste_properties: WastePropertiesSchema,
    origin_location: LocationSchema.meta({
      title: 'Source Waste Origin Location',
      description:
        'Geographic location where the source waste was originally collected',
    }),
    prevented_emissions_calculation: PreventedEmissionsCalculationSchema,
  })
  .meta({
    title: 'GasID Data',
    description:
      'Complete GasID certificate data including summary metrics, methodology reference, audit trail, source MassID, waste properties, origin location, and emissions calculation',
  });
export type GasIDData = z.infer<typeof GasIDDataSchema>;
