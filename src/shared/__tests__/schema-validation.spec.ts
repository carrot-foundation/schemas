import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  validateAttributeValue,
  validateCertificateCollectionSlugs,
  validateCollectionsHaveRetiredAmounts,
  validateCreditSlugExists,
  validateCreditSymbolExists,
  validateDateTimeAttribute,
  validateFormattedName,
  validateNumericAttributeValue,
  validateRetirementReceiptRequirement,
  validateTokenIdInName,
} from '../schema-validation';
import { createValidationContext } from '../../test-utils/zod-refinement-context';

describe('validateCertificateCollectionSlugs', () => {
  it('adds issue when certificate collection slug does not exist in collections', () => {
    const { ctx, issues } = createValidationContext();
    const validCollectionSlugs = new Set(['collection-1', 'collection-2']);

    validateCertificateCollectionSlugs({
      ctx,
      certificateCollections: [{ slug: 'unknown-collection' }],
      validCollectionSlugs,
      certificateIndex: 0,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'certificate.collections[].slug must match a collection slug in collections',
    );
    expect(issues[0]?.path).toEqual([
      'certificates',
      0,
      'collections',
      0,
      'slug',
    ]);
  });

  it('does not add issue when all slugs exist in collections', () => {
    const { ctx, issues } = createValidationContext();
    const validCollectionSlugs = new Set(['collection-1', 'collection-2']);

    validateCertificateCollectionSlugs({
      ctx,
      certificateCollections: [
        { slug: 'collection-1' },
        { slug: 'collection-2' },
      ],
      validCollectionSlugs,
      certificateIndex: 0,
    });

    expect(issues).toHaveLength(0);
  });

  it('adds issue for each invalid slug', () => {
    const { ctx, issues } = createValidationContext();
    const validCollectionSlugs = new Set(['collection-1']);

    validateCertificateCollectionSlugs({
      ctx,
      certificateCollections: [
        { slug: 'collection-1' },
        { slug: 'invalid-1' },
        { slug: 'invalid-2' },
      ],
      validCollectionSlugs,
      certificateIndex: 0,
    });

    expect(issues).toHaveLength(2);
    expect(issues[0]?.path).toEqual([
      'certificates',
      0,
      'collections',
      1,
      'slug',
    ]);
    expect(issues[1]?.path).toEqual([
      'certificates',
      0,
      'collections',
      2,
      'slug',
    ]);
  });

  it('uses custom message when provided', () => {
    const { ctx, issues } = createValidationContext();
    const validCollectionSlugs = new Set(['collection-1']);

    validateCertificateCollectionSlugs({
      ctx,
      certificateCollections: [{ slug: 'invalid' }],
      validCollectionSlugs,
      certificateIndex: 0,
      message: 'Custom error message',
    });

    expect(issues[0]?.message).toBe('Custom error message');
  });
});

describe('validateRetirementReceiptRequirement', () => {
  it('adds issue when retirement_receipt is present but totalRetiredAmount is 0', () => {
    const { ctx, issues } = createValidationContext();

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: true,
      totalRetiredAmount: 0,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'retirement_receipt is present but no certificate has retired_amount greater than 0',
    );
    expect(issues[0]?.path).toEqual(['retirement_receipt']);
  });

  it('adds issue when retirement_receipt is not present but totalRetiredAmount > 0', () => {
    const { ctx, issues } = createValidationContext();

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: false,
      totalRetiredAmount: 10,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'certificates with retired amounts > 0 require retirement_receipt',
    );
    expect(issues[0]?.path).toEqual(['retirement_receipt']);
  });

  it('does not add issue when retirement_receipt is present and totalRetiredAmount > 0', () => {
    const { ctx, issues } = createValidationContext();

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: true,
      totalRetiredAmount: 10,
    });

    expect(issues).toHaveLength(0);
  });

  it('does not add issue when retirement_receipt is not present and totalRetiredAmount is 0', () => {
    const { ctx, issues } = createValidationContext();

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: false,
      totalRetiredAmount: 0,
    });

    expect(issues).toHaveLength(0);
  });

  it('uses custom messages when provided', () => {
    const { ctx, issues } = createValidationContext();

    validateRetirementReceiptRequirement({
      ctx,
      hasRetirementReceipt: true,
      totalRetiredAmount: 0,
      messageWhenPresentButNoRetired: 'Custom message 1',
    });

    expect(issues[0]?.message).toBe('Custom message 1');
  });
});

describe('validateCollectionsHaveRetiredAmounts', () => {
  it('adds issue when collection has zero retired total', () => {
    const { ctx, issues } = createValidationContext();
    const retiredTotalsBySlug = new Map<string, number>([
      ['collection-1', 10],
      ['collection-2', 0],
    ]);

    validateCollectionsHaveRetiredAmounts({
      ctx,
      collections: [
        { slug: 'collection-1' },
        { slug: 'collection-2' },
        { slug: 'collection-3' },
      ],
      retiredTotalsBySlug,
    });

    expect(issues).toHaveLength(2);
    expect(issues[0]?.message).toBe(
      'collection must be referenced by at least one certificate with retired amounts > 0',
    );
    expect(issues[0]?.path).toEqual(['collections', 1, 'slug']);
    expect(issues[1]?.path).toEqual(['collections', 2, 'slug']);
  });

  it('does not add issue when all collections have retired amounts > 0', () => {
    const { ctx, issues } = createValidationContext();
    const retiredTotalsBySlug = new Map<string, number>([
      ['collection-1', 10],
      ['collection-2', 5],
    ]);

    validateCollectionsHaveRetiredAmounts({
      ctx,
      collections: [{ slug: 'collection-1' }, { slug: 'collection-2' }],
      retiredTotalsBySlug,
    });

    expect(issues).toHaveLength(0);
  });

  it('uses custom message when provided', () => {
    const { ctx, issues } = createValidationContext();
    const retiredTotalsBySlug = new Map<string, number>([['collection-1', 0]]);

    validateCollectionsHaveRetiredAmounts({
      ctx,
      collections: [{ slug: 'collection-1' }],
      retiredTotalsBySlug,
      message: 'Custom error message',
    });

    expect(issues[0]?.message).toBe('Custom error message');
  });
});

describe('validateCreditSlugExists', () => {
  it('adds issue when credit slug does not exist in valid slugs', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSlugs = new Set(['credit-1', 'credit-2']);

    validateCreditSlugExists({
      ctx,
      creditSlug: 'unknown-credit',
      validCreditSlugs,
      path: ['certificates', 0, 'credit_slug'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'credit_slug must match a credit slug in credits',
    );
    expect(issues[0]?.path).toEqual(['certificates', 0, 'credit_slug']);
  });

  it('does not add issue when credit slug exists in valid slugs', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSlugs = new Set(['credit-1', 'credit-2']);

    validateCreditSlugExists({
      ctx,
      creditSlug: 'credit-1',
      validCreditSlugs,
      path: ['certificates', 0, 'credit_slug'],
    });

    expect(issues).toHaveLength(0);
  });

  it('uses custom message when provided', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSlugs = new Set(['credit-1']);

    validateCreditSlugExists({
      ctx,
      creditSlug: 'invalid',
      validCreditSlugs,
      path: ['test'],
      message: 'Custom error message',
    });

    expect(issues[0]?.message).toBe('Custom error message');
  });
});

describe('validateCreditSymbolExists', () => {
  it('adds issue when credit symbol does not exist in valid symbols', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSymbols = new Set(['C-CARB.CH4', 'C-BIOW']);

    validateCreditSymbolExists({
      ctx,
      creditSymbol: 'UNKNOWN',
      validCreditSymbols,
      path: ['certificates', 0, 'credit_symbol'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'credit_symbol must match a credit symbol in credits',
    );
    expect(issues[0]?.path).toEqual(['certificates', 0, 'credit_symbol']);
  });

  it('does not add issue when credit symbol exists in valid symbols', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSymbols = new Set(['C-CARB.CH4', 'C-BIOW']);

    validateCreditSymbolExists({
      ctx,
      creditSymbol: 'C-CARB.CH4',
      validCreditSymbols,
      path: ['certificates', 0, 'credit_symbol'],
    });

    expect(issues).toHaveLength(0);
  });

  it('uses custom message when provided', () => {
    const { ctx, issues } = createValidationContext();
    const validCreditSymbols = new Set(['C-CARB.CH4']);

    validateCreditSymbolExists({
      ctx,
      creditSymbol: 'INVALID',
      validCreditSymbols,
      path: ['test'],
      message: 'Custom error message',
    });

    expect(issues[0]?.message).toBe('Custom error message');
  });
});

describe('validateTokenIdInName', () => {
  it('adds issue when token_id does not match pattern', () => {
    const { ctx, issues } = createValidationContext();
    const pattern = /^MassID #(\d+)/;

    validateTokenIdInName({
      ctx,
      name: 'Invalid Name Format',
      tokenId: '123',
      pattern,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Name token_id must match blockchain.token_id: 123',
    );
    expect(issues[0]?.path).toEqual(['name']);
  });

  it('adds issue when token_id in name does not match expected token_id', () => {
    const { ctx, issues } = createValidationContext();
    const pattern = /^MassID #(\d+)/;

    validateTokenIdInName({
      ctx,
      name: 'MassID #999 • Organic • 3.0t',
      tokenId: '123',
      pattern,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Name token_id must match blockchain.token_id: 123',
    );
    expect(issues[0]?.path).toEqual(['name']);
  });

  it('does not add issue when token_id matches', () => {
    const { ctx, issues } = createValidationContext();
    const pattern = /^MassID #(\d+)/;

    validateTokenIdInName({
      ctx,
      name: 'MassID #123 • Organic • 3.0t',
      tokenId: '123',
      pattern,
      path: ['name'],
    });

    expect(issues).toHaveLength(0);
  });

  it('uses custom message when provided', () => {
    const { ctx, issues } = createValidationContext();
    const pattern = /^MassID #(\d+)/;

    validateTokenIdInName({
      ctx,
      name: 'Invalid',
      tokenId: '123',
      pattern,
      path: ['name'],
      message: 'Custom error message',
    });

    expect(issues[0]?.message).toBe('Custom error message');
  });

  it('works with different patterns', () => {
    const { ctx, issues } = createValidationContext();
    const gasIdPattern = /^GasID #(\d+)/;

    validateTokenIdInName({
      ctx,
      name: 'GasID #456 • BOLD Carbon (CH₄) • 0.86t CO₂e',
      tokenId: '456',
      pattern: gasIdPattern,
      path: ['name'],
    });

    expect(issues).toHaveLength(0);
  });
});

describe('validateFormattedName', () => {
  it('adds issue when name does not match schema format', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z
      .string()
      .regex(/^MassID #\d+ • .+ • .+t$/, 'Name must match format');

    validateFormattedName({
      ctx,
      name: 'Invalid Name Format',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Name must match format');
    expect(issues[0]?.path).toEqual(['name']);
  });

  it('does not add issue when name matches schema format', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z
      .string()
      .regex(/^MassID #\d+ • .+ • .+t$/, 'Name must match format');

    validateFormattedName({
      ctx,
      name: 'MassID #123 • Organic • 3.0t',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(0);
  });

  it('uses first error message from schema validation', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z
      .string()
      .min(10, 'Name too short')
      .regex(/^MassID #\d+/, 'Must start with MassID #');

    validateFormattedName({
      ctx,
      name: 'Short',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Name too short');
  });

  it('handles multiple validation errors by using first one', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z
      .string()
      .regex(/^MassID #\d+/, 'Must start with MassID #')
      .regex(/t$/, 'Must end with t');

    validateFormattedName({
      ctx,
      name: 'Invalid',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Must start with MassID #');
  });

  it('uses schema error message when available', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z.string().min(100, 'Name must be at least 100 characters');

    validateFormattedName({
      ctx,
      name: 'Short',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Name must be at least 100 characters');
  });

  it('uses fallback message when schema error has no message', () => {
    const { ctx, issues } = createValidationContext();
    const schema = z.string().refine(() => false, {
      message: undefined as unknown as string,
    });

    validateFormattedName({
      ctx,
      name: 'Test',
      schema,
      path: ['name'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBeDefined();
  });
});

describe('validateAttributeValue', () => {
  it('adds issue when attribute is missing', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Other Attribute', { trait_type: 'Other Attribute', value: 'test' }],
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Missing Attribute',
      expectedValue: 'expected',
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Attribute must match expected value',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Attribute must be present');
    expect(issues[0]?.path).toEqual(['attributes']);
  });

  it('adds issue when attribute value does not match expected value', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Test Attribute', { trait_type: 'Test Attribute', value: 'wrong' }],
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Test Attribute',
      expectedValue: 'expected',
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Attribute must match expected value',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Attribute must match expected value');
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });

  it('does not add issue when expectedValue is null and attribute does not exist', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Other', { trait_type: 'Other', value: 'value' }],
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Missing',
      expectedValue: null,
      missingMessage: 'Attribute should not be present',
      mismatchMessage: 'Should not reach here',
    });

    expect(issues).toHaveLength(0);
  });

  it('adds issue when expectedValue is null and attribute exists', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Test Attribute', { trait_type: 'Test Attribute', value: 'value' }],
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Test Attribute',
      expectedValue: null,
      missingMessage: 'Attribute should not be present',
      mismatchMessage: 'Should not reach here',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Attribute should not be present');
    expect(issues[0]?.path).toEqual(['attributes', 0]);
  });

  it('uses custom path when provided', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map();

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Missing',
      expectedValue: 'expected',
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Attribute must match',
      path: ['custom', 'path'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.path).toEqual(['custom', 'path']);
  });

  it('uses fallback path when attributeIndex < 0 in value mismatch case', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Test', { trait_type: 'Test', value: 'wrong' }],
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Test',
      expectedValue: 'expected',
      missingMessage: 'Should not reach here',
      mismatchMessage: 'Value mismatch',
      path: ['fallback', 'path'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Value mismatch');
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });
});

describe('validateDateTimeAttribute', () => {
  it('adds issue when attribute is missing but dateTimeValue is provided', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map();

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: '2024-01-01T12:00:00.000Z',
      missingMessage: 'Pick-up Date attribute is required',
      invalidDateMessage: 'Invalid date',
      mismatchMessage: 'Date mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe('Pick-up Date attribute is required');
    expect(issues[0]?.path).toEqual(['attributes']);
  });

  it('adds issue when attribute exists but dateTimeValue is undefined', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'Pick-up Date',
        {
          trait_type: 'Pick-up Date',
          value: 1704110400000,
        },
      ],
    ]);

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: undefined,
      missingMessage:
        'Pick-up Date attribute must be omitted when timestamp is not provided',
      invalidDateMessage: 'Invalid date',
      mismatchMessage: 'Date mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Pick-up Date attribute must be omitted when timestamp is not provided',
    );
  });

  it('adds issue when dateTimeValue is invalid ISO string', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'Pick-up Date',
        {
          trait_type: 'Pick-up Date',
          value: 1704110400000,
        },
      ],
    ]);

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: 'invalid-date',
      missingMessage: 'Attribute is required',
      invalidDateMessage: 'Timestamp must be a valid ISO 8601 date-time string',
      mismatchMessage: 'Date mismatch',
      dateTimePath: ['data', 'events', 0, 'timestamp'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Timestamp must be a valid ISO 8601 date-time string',
    );
    expect(issues[0]?.path).toEqual(['data', 'events', 0, 'timestamp']);
  });

  it('adds issue when attribute value does not match parsed timestamp', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'Pick-up Date',
        {
          trait_type: 'Pick-up Date',
          value: 9999999999999,
        },
      ],
    ]);

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: '2024-01-01T12:00:00.000Z',
      missingMessage: 'Attribute is required',
      invalidDateMessage: 'Invalid date',
      mismatchMessage: 'Pick-up Date attribute must equal event timestamp',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Pick-up Date attribute must equal event timestamp',
    );
    expect(issues[0]?.path).toEqual(['attributes']);
  });

  it('does not add issue when attribute value matches parsed timestamp', () => {
    const { ctx, issues } = createValidationContext();
    const dateTimeValue = '2024-01-01T12:00:00.000Z';
    const expectedTimestamp = Date.parse(dateTimeValue);
    const attributeByTraitType = new Map([
      [
        'Pick-up Date',
        {
          trait_type: 'Pick-up Date',
          value: expectedTimestamp,
        },
      ],
    ]);

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue,
      missingMessage: 'Attribute is required',
      invalidDateMessage: 'Invalid date',
      mismatchMessage: 'Date mismatch',
    });

    expect(issues).toHaveLength(0);
  });

  it('does not add issue when both attribute and dateTimeValue are undefined', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map();

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: undefined,
      missingMessage: 'Attribute is required',
      invalidDateMessage: 'Invalid date',
      mismatchMessage: 'Date mismatch',
    });

    expect(issues).toHaveLength(0);
  });
});

describe('validateNumericAttributeValue', () => {
  it('adds issue when attribute is missing', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Other Attribute', { trait_type: 'Other Attribute', value: 100 }],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'CO₂e Prevented (kg)',
      expectedValue: 50.5,
      epsilon: 0.01,
      missingMessage:
        'CO₂e Prevented (kg) attribute must be present and match data.summary.prevented_co2e_kg',
      mismatchMessage:
        'CO₂e Prevented (kg) attribute must equal data.summary.prevented_co2e_kg',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'CO₂e Prevented (kg) attribute must be present and match data.summary.prevented_co2e_kg',
    );
    expect(issues[0]?.path).toEqual(['attributes']);
  });

  it('adds issue when attribute value is not a number', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'CO₂e Prevented (kg)',
        { trait_type: 'CO₂e Prevented (kg)', value: 'not-a-number' },
      ],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'CO₂e Prevented (kg)',
      expectedValue: 50.5,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Value mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'CO₂e Prevented (kg) attribute value must be a number',
    );
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });

  it('adds issue when attribute value does not match expected value within epsilon', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'CO₂e Prevented (kg)',
        { trait_type: 'CO₂e Prevented (kg)', value: 100 },
      ],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'CO₂e Prevented (kg)',
      expectedValue: 50.5,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage:
        'CO₂e Prevented (kg) attribute must equal data.summary.prevented_co2e_kg',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'CO₂e Prevented (kg) attribute must equal data.summary.prevented_co2e_kg',
    );
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });

  it('does not add issue when attribute value matches expected value within epsilon', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'CO₂e Prevented (kg)',
        { trait_type: 'CO₂e Prevented (kg)', value: 50.5 },
      ],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'CO₂e Prevented (kg)',
      expectedValue: 50.5,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Value mismatch',
    });

    expect(issues).toHaveLength(0);
  });

  it('does not add issue when values are nearly equal within epsilon', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      [
        'Recycled Weight (kg)',
        { trait_type: 'Recycled Weight (kg)', value: 50.505 },
      ],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Recycled Weight (kg)',
      expectedValue: 50.5,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Value mismatch',
    });

    expect(issues).toHaveLength(0);
  });

  it('handles attribute with null value as non-number', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Test Attribute', { trait_type: 'Test Attribute', value: null }],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Test Attribute',
      expectedValue: 100,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Value mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Test Attribute attribute value must be a number',
    );
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });

  it('handles attribute with undefined value as non-number', () => {
    const { ctx, issues } = createValidationContext();
    const attributeByTraitType = new Map([
      ['Test Attribute', { trait_type: 'Test Attribute', value: undefined }],
    ]);

    validateNumericAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Test Attribute',
      expectedValue: 100,
      epsilon: 0.01,
      missingMessage: 'Attribute must be present',
      mismatchMessage: 'Value mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toBe(
      'Test Attribute attribute value must be a number',
    );
    expect(issues[0]?.path).toEqual(['attributes', 0, 'value']);
  });
});
