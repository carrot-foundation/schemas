import { describe, it } from 'vitest';
import { expectSchemaInvalid, expectSchemaValid } from '../../../../test-utils';
import {
  NonNegativeFloatSchema,
  NonNegativeIntegerSchema,
  PercentageSchema,
  UsdcAmountSchema,
} from '../numbers.schema';

describe('NonNegativeFloatSchema', () => {
  it('validates positive floats', () => {
    expectSchemaValid(NonNegativeFloatSchema, () => 1.5);
    expectSchemaValid(NonNegativeFloatSchema, () => 0);
  });

  it('rejects negative values', () => {
    expectSchemaInvalid(NonNegativeFloatSchema, 1, () => -1);
  });
});

describe('NonNegativeIntegerSchema', () => {
  it('validates non-negative integers', () => {
    expectSchemaValid(NonNegativeIntegerSchema, () => 0);
    expectSchemaValid(NonNegativeIntegerSchema, () => 42);
  });

  it('rejects negative integers and floats', () => {
    expectSchemaInvalid(NonNegativeIntegerSchema, 0, () => -1);
    expectSchemaInvalid(NonNegativeIntegerSchema, 0, () => 1.5);
  });
});

describe('PercentageSchema', () => {
  it('validates percentages between 0 and 100', () => {
    expectSchemaValid(PercentageSchema, () => 0);
    expectSchemaValid(PercentageSchema, () => 50);
    expectSchemaValid(PercentageSchema, () => 100);
  });

  it('rejects values outside 0-100 range', () => {
    expectSchemaInvalid(PercentageSchema, 50, () => 150);
    expectSchemaInvalid(PercentageSchema, 50, () => -1);
  });

  it('rejects values below 0', () => {
    expectSchemaInvalid(PercentageSchema, 100, () => -1);
  });
});

describe('UsdcAmountSchema', () => {
  it('validates integer USDC amounts', () => {
    expectSchemaValid(UsdcAmountSchema, () => 100);
    expectSchemaValid(UsdcAmountSchema, () => 0);
    expectSchemaValid(UsdcAmountSchema, () => 123456789);
  });

  it('validates USDC amounts with up to 6 decimal places', () => {
    expectSchemaValid(UsdcAmountSchema, () => 100.123456);
    expectSchemaValid(UsdcAmountSchema, () => 50.5);
    expectSchemaValid(UsdcAmountSchema, () => 0.000001);
  });

  it('rejects USDC amounts with more than 6 decimal places', () => {
    expectSchemaInvalid(UsdcAmountSchema, 100.1234567, () => 100.1234567);
    expectSchemaInvalid(UsdcAmountSchema, 1.12345678, () => 1.12345678);
  });

  it('rejects negative USDC amounts', () => {
    expectSchemaInvalid(UsdcAmountSchema, 0, () => -100);
  });
});
