import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  createDateAttributeSchema,
  createWeightAttributeSchema,
  createNumericAttributeSchema,
  createOrderedAttributesSchema,
} from '../attributes.helpers';
import { NftAttributeSchema } from '../nft.schema';

describe('createDateAttributeSchema', () => {
  it('creates schema with omitMaxValue true by default', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date attribute',
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
    });

    expect(result.success).toBe(true);
  });

  it('creates schema with omitMaxValue false', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'A test date attribute',
      omitMaxValue: false,
    });

    const result = schema.safeParse({
      trait_type: 'Test Date',
      value: 1704067200000,
      display_type: 'date',
      max_value: 100,
    });

    expect(result.success).toBe(true);
  });

  it('appends unix timestamp note when description does not mention unix', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'When the event occurred',
    });
    const meta = z.globalRegistry.get(schema);
    expect((meta as { description: string }).description).toContain(
      'Unix timestamp in milliseconds',
    );
  });

  it('does not duplicate unix timestamp note when description already mentions it', () => {
    const schema = createDateAttributeSchema({
      traitType: 'Test Date',
      title: 'Test Date',
      description: 'Unix timestamp in milliseconds for the event',
    });
    const meta = z.globalRegistry.get(schema);
    const desc = (meta as { description: string }).description;
    const count = (desc.match(/Unix timestamp/g) ?? []).length;
    expect(count).toBe(1);
  });
});

describe('createWeightAttributeSchema', () => {
  it('creates a valid weight attribute schema', () => {
    const schema = createWeightAttributeSchema({
      traitType: 'Test Weight (kg)',
      title: 'Test Weight',
      description: 'Weight in kg',
    });

    const result = schema.safeParse({
      trait_type: 'Test Weight (kg)',
      value: 100.5,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });
});

describe('createNumericAttributeSchema', () => {
  it('creates a valid numeric attribute schema', () => {
    const schema = createNumericAttributeSchema({
      traitType: 'Test Value',
      title: 'Test Value',
      description: 'A numeric value',
      valueSchema: z.number().min(0),
    });

    const result = schema.safeParse({
      trait_type: 'Test Value',
      value: 42,
      display_type: 'number',
    });

    expect(result.success).toBe(true);
  });
});

describe('createOrderedAttributesSchema', () => {
  const attrA = NftAttributeSchema.safeExtend({
    trait_type: z.literal('A'),
    value: z.literal('a'),
  });

  const attrB = NftAttributeSchema.safeExtend({
    trait_type: z.literal('B'),
    value: z.literal('b'),
  });

  const attrC = NftAttributeSchema.safeExtend({
    trait_type: z.literal('C'),
    value: z.literal('c'),
  });

  it('handles empty schemas array', () => {
    const schema = createOrderedAttributesSchema({
      required: [],
      title: 'Empty',
      description: 'No attributes',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
    });

    const result = schema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('handles single schema without union', () => {
    const schema = createOrderedAttributesSchema({
      required: [attrA],
      title: 'Single',
      description: 'One attribute',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
      requiredTraitTypes: ['A'],
    });

    const result = schema.safeParse([{ trait_type: 'A', value: 'a' }]);
    expect(result.success).toBe(true);
  });

  it('validates required and optional attributes', () => {
    const schema = createOrderedAttributesSchema({
      required: [attrA],
      optional: [attrB],
      title: 'Mixed',
      description: 'Mixed attributes',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
      requiredTraitTypes: ['A'],
      optionalTraitTypes: ['B'],
    });

    const valid = schema.safeParse([{ trait_type: 'A', value: 'a' }]);
    expect(valid.success).toBe(true);

    const withOptional = schema.safeParse([
      { trait_type: 'A', value: 'a' },
      { trait_type: 'B', value: 'b' },
    ]);
    expect(withOptional.success).toBe(true);
  });

  it('rejects missing required attributes', () => {
    const schema = createOrderedAttributesSchema({
      required: [attrA, attrB],
      title: 'Required',
      description: 'Both required',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
      requiredTraitTypes: ['A', 'B'],
    });

    const result = schema.safeParse([{ trait_type: 'A', value: 'a' }]);
    expect(result.success).toBe(false);
  });

  it('respects explicit maxItems', () => {
    const schema = createOrderedAttributesSchema({
      required: [attrA],
      optional: [attrB, attrC],
      title: 'MaxItems',
      description: 'Limited',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
      requiredTraitTypes: ['A'],
      optionalTraitTypes: ['B', 'C'],
      maxItems: 2,
    });

    const tooMany = schema.safeParse([
      { trait_type: 'A', value: 'a' },
      { trait_type: 'B', value: 'b' },
      { trait_type: 'C', value: 'c' },
    ]);
    expect(tooMany.success).toBe(false);
  });

  it('falls back to extracting trait types when not explicitly provided', () => {
    const unknownSchema = z.strictObject({
      trait_type: z.string(),
      value: z.string(),
    });

    const schema = createOrderedAttributesSchema({
      required: [unknownSchema],
      title: 'Fallback',
      description: 'Fallback test',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
    });

    const result = schema.safeParse([{ trait_type: 'anything', value: 'v' }]);
    expect(result.success).toBe(true);
  });

  it('extracts trait type from meta title ending with Attribute', () => {
    const schemaWithMeta = z
      .strictObject({
        trait_type: z.string(),
        value: z.string(),
      })
      .meta({ title: 'Test Value Attribute', description: 'Test' });

    const schema = createOrderedAttributesSchema({
      required: [schemaWithMeta],
      title: 'Meta Extraction',
      description: 'Uses meta title',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
    });

    const meta = z.globalRegistry.get(schema);
    const desc = (meta as { description: string }).description;
    expect(desc).toContain('Test Value');
  });

  it('ignores meta title with short inferred name', () => {
    const shortTitleSchema = z
      .strictObject({
        trait_type: z.string(),
        value: z.string(),
      })
      .meta({ title: 'AB Attribute', description: 'Too short' });

    const schema = createOrderedAttributesSchema({
      required: [shortTitleSchema],
      title: 'Short Title',
      description: 'Short inferred name',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
    });

    const result = schema.safeParse([{ trait_type: 'x', value: 'v' }]);
    expect(result.success).toBe(true);
  });

  it('handles schema without shape in trait type extraction', () => {
    const plainSchema = z.string().meta({ title: 'Plain Schema' });

    const schema = createOrderedAttributesSchema({
      required: [plainSchema],
      title: 'No Shape',
      description: 'Schema without shape',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
    });

    const result = schema.safeParse(['test']);
    expect(result.success).toBe(true);
  });

  it('skips optional attributes enumeration for dynamic descriptions', () => {
    const schema = createOrderedAttributesSchema({
      required: [attrA],
      optional: [attrB],
      title: 'Dynamic',
      description: 'Dynamic attributes are per-credit',
      uniqueBySelector: (attr: unknown) =>
        (attr as { trait_type: string }).trait_type,
      requiredTraitTypes: ['A'],
      optionalTraitTypes: ['B'],
    });

    const meta = z.globalRegistry.get(schema);
    const desc = (meta as { description: string }).description;
    expect(desc).not.toContain('Optional attributes');
  });
});
