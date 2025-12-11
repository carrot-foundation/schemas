import { z } from 'zod';

export const NonNegativeFloatSchema = z
  .number()
  .min(0)
  .meta({
    title: 'Non-Negative Float',
    description: 'Floating-point number that is zero or positive',
    examples: [0, 45.2, 72.5],
  });
export type NonNegativeFloat = z.infer<typeof NonNegativeFloatSchema>;

export const WeightKgSchema = NonNegativeFloatSchema.meta({
  title: 'Weight (kg)',
  description: 'Weight measurement in kilograms',
  examples: [3000, 1500, 500],
});
export type WeightKg = z.infer<typeof WeightKgSchema>;

export const PercentageSchema = NonNegativeFloatSchema.max(100).meta({
  title: 'Percentage',
  description: 'Percentage value between 0 and 100',
  examples: [50, 75.5, 100],
});
export type Percentage = z.infer<typeof PercentageSchema>;

export const NonNegativeIntegerSchema = z
  .number()
  .int()
  .min(0)
  .meta({
    title: 'Non-Negative Integer',
    description: 'Integer value that is zero or positive',
    examples: [0, 123, 4126],
  });
export type NonNegativeInteger = z.infer<typeof NonNegativeIntegerSchema>;

export const PositiveIntegerSchema = z
  .number()
  .int()
  .min(1)
  .meta({
    title: 'Positive Integer',
    description: 'Integer value that is greater than zero',
    examples: [1, 123, 456],
  });
export type PositiveInteger = z.infer<typeof PositiveIntegerSchema>;

export const CreditAmountSchema = NonNegativeFloatSchema.meta({
  title: 'Credit Amount',
  description: 'Amount of credits issued',
});
export type CreditAmount = z.infer<typeof CreditAmountSchema>;

export const HoursSchema = z
  .number()
  .min(0)
  .multipleOf(0.1)
  .meta({
    title: 'Hours',
    description: 'Time duration in hours with 0.1 hour precision',
    examples: [72.5, 24, 168.5],
  });
export type Hours = z.infer<typeof HoursSchema>;

export const MinutesSchema = NonNegativeIntegerSchema.meta({
  title: 'Minutes',
  description: 'Time duration in minutes',
  examples: [4350, 1440, 10110],
});
export type Minutes = z.infer<typeof MinutesSchema>;
