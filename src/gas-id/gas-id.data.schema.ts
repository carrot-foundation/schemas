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
      examples: ['E', 'B', 'W', 'R'],
    }),
    value: NonNegativeFloatSchema.meta({
      title: 'Calculation Value',
      description: 'Numeric value for this calculation parameter',
    }),
    label: NonEmptyStringSchema.max(100).meta({
      title: 'Calculation Label',
      description: 'Human-readable label for this calculation value',
      examples: [
        'Exceeding Emission Coefficient',
        'Prevented Emissions by Waste Subtype and Emissions Baseline Per Ton',
        'Waste Weight',
        'Prevented Emissions (CO₂e kg)',
      ],
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
      examples: ['W * B - W * E'],
    }),
    method: NonEmptyStringSchema.max(100).meta({
      title: 'Calculation Method',
      description: 'Method used to calculate the prevented emissions',
      examples: ['UNFCCC AMS-III.F'],
    }),
    calculated_at: IsoDateTimeSchema.meta({
      title: 'Calculated At',
      description: 'ISO 8601 timestamp when the calculation was performed',
    }),
    values: z.array(CalculationValueSchema).min(1).meta({
      title: 'Calculation Values',
      description:
        'Input parameters and computed result used in the prevented emissions formula',
    }),
  })
  .meta({
    title: 'Prevented Emissions Calculation',
    description:
      'Methodology-based calculation of prevented CO₂e emissions, including formula, method, input values, and computation timestamp',
  });
export type PreventedEmissionsCalculation = z.infer<
  typeof PreventedEmissionsCalculationSchema
>;

export const GasIDDataSchema = z
  .strictObject({
    summary: GasIDSummarySchema,
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
