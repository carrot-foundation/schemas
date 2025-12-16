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
  title: 'Weight',
  description: 'Weight measurement in kilograms (kg)',
  examples: [500.35, 3000],
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

export const UsdcAmountSchema = NonNegativeFloatSchema.refine(
  (value) => {
    const multiplied = value * 1_000_000;
    return (
      Number.isInteger(multiplied) ||
      Math.abs(multiplied - Math.round(multiplied)) < 1e-9
    );
  },
  {
    message: 'USDC amount must have at most 6 decimal places',
  },
).meta({
  title: 'USDC Amount',
  description: 'USDC amount with maximum 6 decimal places precision',
  examples: [0, 100.5, 1000.123456, 50000.12],
});
export type UsdcAmount = z.infer<typeof UsdcAmountSchema>;
