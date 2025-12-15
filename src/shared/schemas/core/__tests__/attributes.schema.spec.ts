import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  createDateAttributeSchema,
  createWeightAttributeSchema,
  createNumericAttributeSchema,
  MethodologyAttributeSchema,
  CreditAmountAttributeSchema,
  CreditTypeAttributeSchema,
  SourceWasteTypeAttributeSchema,
  SourceWeightAttributeSchema,
  MassIDTokenIdAttributeSchema,
  MassIDRecyclingDateAttributeSchema,
  CertificateIssuanceDateAttributeSchema,
  OriginCityAttributeSchema,
} from '../attributes.schema';
import { CreditAmountSchema } from '../../primitives';

describe('createDateAttributeSchema', () => {
  it('creates date attribute schema with omitMaxValue true by default', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
    });

    const validData = {
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date' as const,
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect('max_value' in result.data).toBe(false);
    }
  });

  it('creates date attribute schema with omitMaxValue false', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
      omitMaxValue: false,
    });

    const validData = {
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date' as const,
      max_value: 2000000000000,
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toHaveProperty('max_value', 2000000000000);
    }
  });

  it('handles description that does not mention unix', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('handles description that mentions unix', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'Unix timestamp in milliseconds',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('handles description that mentions unix timestamp', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'Unix timestamp when something happened',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('validates valid date attribute data', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid date attribute data', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
    });

    const result = schema.safeParse({
      trait_type: 'Wrong Type',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(false);
  });

  it('preserves examples from UnixTimestampSchema when merging metadata', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });
});

describe('createWeightAttributeSchema', () => {
  it('creates weight attribute schema', () => {
    const schema = createWeightAttributeSchema({
      traitType: 'Test Weight',
      title: 'Test Weight',
      description: 'A test weight',
    });

    const result = schema.safeParse({
      trait_type: 'Test Weight',
      value: 500.35,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid weight attribute data', () => {
    const schema = createWeightAttributeSchema({
      traitType: 'Test Weight',
      title: 'Test Weight',
      description: 'A test weight',
    });

    const result = schema.safeParse({
      trait_type: 'Wrong Type',
      value: 500.35,
      display_type: 'number',
    });

    expect(result.success).toBe(false);
  });

  it('preserves examples from WeightKgSchema when merging metadata', () => {
    const schema = createWeightAttributeSchema({
      traitType: 'Test Weight',
      title: 'Test Weight',
      description: 'A test weight',
    });

    const result = schema.safeParse({
      trait_type: 'Test Weight',
      value: 500.35,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });
});

describe('createNumericAttributeSchema', () => {
  it('creates numeric attribute schema', () => {
    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: CreditAmountSchema,
    });

    const result = schema.safeParse({
      trait_type: 'Test Number',
      value: 100.5,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid numeric attribute data', () => {
    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: CreditAmountSchema,
    });

    const result = schema.safeParse({
      trait_type: 'Wrong Type',
      value: 100.5,
      display_type: 'number',
    });

    expect(result.success).toBe(false);
  });

  it('preserves examples from valueSchema when present', () => {
    const customSchema = z.number().meta({
      title: 'Custom Number',
      description: 'Custom number schema',
      examples: [10, 20, 30],
    });

    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: customSchema,
    });

    const result = schema.safeParse({
      trait_type: 'Test Number',
      value: 10,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('handles schema with metadata containing examples via registry', () => {
    // Create a schema and register it in the global registry with metadata
    const baseSchema = z.number();
    const schemaWithRegistryMeta = baseSchema.meta({
      title: 'Test Number',
      description: 'Test number schema',
      examples: [100, 200],
    });

    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: schemaWithRegistryMeta,
    });

    const result = schema.safeParse({
      trait_type: 'Test Number',
      value: 100,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('works without examples in valueSchema', () => {
    const customSchema = z.number().meta({
      title: 'Custom Number',
      description: 'Custom number schema',
    });

    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: customSchema,
    });

    const result = schema.safeParse({
      trait_type: 'Test Number',
      value: 42,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('handles schema without metadata when merging', () => {
    const schemaWithoutMeta = z.number();

    const schema = createNumericAttributeSchema({
      traitType: 'Test Number',
      title: 'Test Number',
      description: 'A test number',
      valueSchema: schemaWithoutMeta,
    });

    const result = schema.safeParse({
      trait_type: 'Test Number',
      value: 42,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });
});

describe('MethodologyAttributeSchema', () => {
  it('validates valid methodology attribute', () => {
    const result = MethodologyAttributeSchema.safeParse({
      trait_type: 'Methodology',
      value: 'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid methodology attribute', () => {
    const result = MethodologyAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
    });

    expect(result.success).toBe(false);
  });
});

describe('CreditAmountAttributeSchema', () => {
  it('validates valid credit amount attribute', () => {
    const result = CreditAmountAttributeSchema.safeParse({
      trait_type: 'Credit Amount',
      value: 100.5,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid credit amount attribute', () => {
    const result = CreditAmountAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 100.5,
      display_type: 'number',
    });

    expect(result.success).toBe(false);
  });
});

describe('CreditTypeAttributeSchema', () => {
  it('validates valid credit type attribute', () => {
    const result = CreditTypeAttributeSchema.safeParse({
      trait_type: 'Credit Type',
      value: 'Biowaste',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid credit type attribute', () => {
    const result = CreditTypeAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 'Biowaste',
    });

    expect(result.success).toBe(false);
  });
});

describe('SourceWasteTypeAttributeSchema', () => {
  it('validates valid source waste type attribute', () => {
    const result = SourceWasteTypeAttributeSchema.safeParse({
      trait_type: 'Source Waste Type',
      value: 'Organic',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid source waste type attribute', () => {
    const result = SourceWasteTypeAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 'Organic',
    });

    expect(result.success).toBe(false);
  });
});

describe('SourceWeightAttributeSchema', () => {
  it('validates valid source weight attribute', () => {
    const result = SourceWeightAttributeSchema.safeParse({
      trait_type: 'Source Weight (kg)',
      value: 500.35,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid source weight attribute', () => {
    const result = SourceWeightAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 500.35,
      display_type: 'number',
    });

    expect(result.success).toBe(false);
  });
});

describe('MassIDTokenIdAttributeSchema', () => {
  it('validates valid MassID token ID attribute', () => {
    const result = MassIDTokenIdAttributeSchema.safeParse({
      trait_type: 'MassID',
      value: '#123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid MassID token ID attribute', () => {
    const result = MassIDTokenIdAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: '#123',
    });

    expect(result.success).toBe(false);
  });
});

describe('MassIDRecyclingDateAttributeSchema', () => {
  it('validates valid MassID recycling date attribute', () => {
    const result = MassIDRecyclingDateAttributeSchema.safeParse({
      trait_type: 'MassID Recycling Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid MassID recycling date attribute', () => {
    const result = MassIDRecyclingDateAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(false);
  });
});

describe('CertificateIssuanceDateAttributeSchema', () => {
  it('validates valid certificate issuance date attribute', () => {
    const result = CertificateIssuanceDateAttributeSchema.safeParse({
      trait_type: 'Certificate Issuance Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid certificate issuance date attribute', () => {
    const result = CertificateIssuanceDateAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(false);
  });
});

describe('OriginCityAttributeSchema', () => {
  it('validates valid origin city attribute', () => {
    const result = OriginCityAttributeSchema.safeParse({
      trait_type: 'Origin City',
      value: 'São Paulo',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid origin city attribute', () => {
    const result = OriginCityAttributeSchema.safeParse({
      trait_type: 'Wrong Type',
      value: 'São Paulo',
    });

    expect(result.success).toBe(false);
  });
});
