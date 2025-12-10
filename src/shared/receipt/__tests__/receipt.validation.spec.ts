import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import {
  createAttributeMap,
  validateAttributeValue,
  validateAttributesForItems,
  validateCountMatches,
  validateDateAttribute,
  validateSummaryListMatchesData,
  validateTotalMatches,
} from '../receipt.validation';

function createCtx() {
  const issues: z.core.$ZodIssue[] = [];
  const ctx = {
    addIssue: (issue: z.core.$ZodIssue) => issues.push(issue),
  } as unknown as z.RefinementCtx;

  return { issues, ctx };
}

describe('receipt.validation helpers', () => {
  it('builds attribute map', () => {
    const map = createAttributeMap([
      { trait_type: 'A', value: 1 },
      { trait_type: 'B', value: 2 },
    ]);

    expect(map.get('A')?.value).toBe(1);
    expect(map.get('B')?.value).toBe(2);
  });

  it('detects summary values missing in data and vice versa', () => {
    const { issues, ctx } = createCtx();

    validateSummaryListMatchesData({
      ctx,
      summaryValues: ['alpha', 'bravo'],
      dataValues: ['alpha', 'charlie'],
      summaryPath: ['summary', 'values'],
      missingFromDataMessage: (value) => `missing ${value}`,
      missingFromSummaryMessage: (value) => `extra ${value}`,
    });

    expect(issues).toHaveLength(2);
    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(['missing bravo', 'extra charlie']),
    );
  });

  it('accepts matching summary and data values', () => {
    const { issues, ctx } = createCtx();

    validateSummaryListMatchesData({
      ctx,
      summaryValues: ['alpha', 'bravo'],
      dataValues: ['alpha', 'bravo'],
      summaryPath: ['summary', 'values'],
      missingFromDataMessage: 'missing',
      missingFromSummaryMessage: 'extra',
    });

    expect(issues).toHaveLength(0);
  });

  it('uses string messages for summary mismatches', () => {
    const { issues, ctx } = createCtx();

    validateSummaryListMatchesData({
      ctx,
      summaryValues: ['alpha'],
      dataValues: ['bravo'],
      summaryPath: ['summary', 'values'],
      missingFromDataMessage: 'missing',
      missingFromSummaryMessage: 'extra',
    });

    expect(issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining(['missing', 'extra']),
    );
  });

  it('validates totals match', () => {
    const { issues, ctx } = createCtx();

    validateTotalMatches({
      ctx,
      actualTotal: 10,
      expectedTotal: 10,
      path: ['summary', 'total'],
      message: 'totals differ',
    });

    expect(issues).toHaveLength(0);
  });

  it('detects mismatched totals', () => {
    const { issues, ctx } = createCtx();

    validateTotalMatches({
      ctx,
      actualTotal: 9,
      expectedTotal: 10,
      path: ['summary', 'total'],
      message: 'totals differ',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('totals differ');
  });

  it('validates count matches', () => {
    const { issues, ctx } = createCtx();

    validateCountMatches({
      ctx,
      actualCount: 2,
      expectedCount: 2,
      path: ['summary', 'count'],
      message: 'count mismatch',
    });

    expect(issues).toHaveLength(0);
  });

  it('detects mismatched counts', () => {
    const { issues, ctx } = createCtx();

    validateCountMatches({
      ctx,
      actualCount: 1,
      expectedCount: 2,
      path: ['summary', 'count'],
      message: 'count mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].path).toEqual(['summary', 'count']);
  });

  it('detects missing attribute', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([
      { trait_type: 'present', value: 1 },
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'missing',
      expectedValue: 2,
      missingMessage: 'missing',
      mismatchMessage: 'mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('missing');
  });

  it('detects mismatched attribute value', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([
      { trait_type: 'present', value: 1 },
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'present',
      expectedValue: 2,
      missingMessage: 'missing',
      mismatchMessage: 'mismatch',
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('mismatch');
  });

  it('accepts matching attribute value', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([
      { trait_type: 'present', value: 1 },
    ]);

    validateAttributeValue({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'present',
      expectedValue: 1,
      missingMessage: 'missing',
      mismatchMessage: 'mismatch',
    });

    expect(issues).toHaveLength(0);
  });

  it('detects missing date attribute', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([{ trait_type: 'other', value: 0 }]);

    validateDateAttribute({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'Date',
      dateValue: '2025-01-01',
      missingMessage: 'missing date',
      invalidDateMessage: 'invalid date',
      mismatchMessage: 'mismatch date',
      datePath: ['data', 'date'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('missing date');
  });

  it('detects invalid date value', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([{ trait_type: 'Date', value: 0 }]);

    validateDateAttribute({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'Date',
      dateValue: 'invalid-date',
      missingMessage: 'missing date',
      invalidDateMessage: 'invalid date',
      mismatchMessage: 'mismatch date',
      datePath: ['data', 'date'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('invalid date');
  });

  it('uses attribute path when date path is not provided', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([{ trait_type: 'Date', value: 0 }]);

    validateDateAttribute({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'Date',
      dateValue: 'invalid-date',
      missingMessage: 'missing date',
      invalidDateMessage: 'invalid date',
      mismatchMessage: 'mismatch date',
    });

    expect(issues[0].path).toEqual(['attributes']);
  });

  it('detects mismatched date attribute value', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([{ trait_type: 'Date', value: 0 }]);

    validateDateAttribute({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'Date',
      dateValue: '2025-01-01',
      missingMessage: 'missing date',
      invalidDateMessage: 'invalid date',
      mismatchMessage: 'mismatch date',
      datePath: ['data', 'date'],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('mismatch date');
  });

  it('accepts matching date attribute', () => {
    const { issues, ctx } = createCtx();
    const attributes = createAttributeMap([
      { trait_type: 'Date', value: Date.parse('2025-01-01T00:00:00.000Z') },
    ]);

    validateDateAttribute({
      ctx,
      attributeByTraitType: attributes,
      traitType: 'Date',
      dateValue: '2025-01-01',
      missingMessage: 'missing date',
      invalidDateMessage: 'invalid date',
      mismatchMessage: 'mismatch date',
    });

    expect(issues).toHaveLength(0);
  });

  it('detects missing item attribute', () => {
    const { issues, ctx } = createCtx();
    const attributeByTraitType = createAttributeMap([
      { trait_type: 'alpha', value: 1 },
    ]);
    const items = [
      { trait: 'alpha', value: 1 },
      { trait: 'bravo', value: 2 },
    ];

    validateAttributesForItems({
      ctx,
      attributeByTraitType,
      items,
      traitSelector: (item) => item.trait,
      valueSelector: (item) => item.value,
      missingMessage: (trait) => `missing ${trait}`,
      mismatchMessage: (trait) => `mismatch ${trait}`,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('missing bravo');
  });

  it('detects mismatched item attribute value', () => {
    const { issues, ctx } = createCtx();
    const attributeByTraitType = createAttributeMap([
      { trait_type: 'alpha', value: 1 },
      { trait_type: 'bravo', value: 3 },
    ]);
    const items = [
      { trait: 'alpha', value: 1 },
      { trait: 'bravo', value: 2 },
    ];

    validateAttributesForItems({
      ctx,
      attributeByTraitType,
      items,
      traitSelector: (item) => item.trait,
      valueSelector: (item) => item.value,
      missingMessage: (trait) => `missing ${trait}`,
      mismatchMessage: (trait) => `mismatch ${trait}`,
    });

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe('mismatch bravo');
  });

  it('accepts matching item attributes', () => {
    const { issues, ctx } = createCtx();
    const attributeByTraitType = createAttributeMap([
      { trait_type: 'alpha', value: 1 },
      { trait_type: 'bravo', value: 2 },
    ]);
    const items = [
      { trait: 'alpha', value: 1 },
      { trait: 'bravo', value: 2 },
    ];

    validateAttributesForItems({
      ctx,
      attributeByTraitType,
      items,
      traitSelector: (item) => item.trait,
      valueSelector: (item) => item.value,
      missingMessage: (trait) => `missing ${trait}`,
      mismatchMessage: (trait) => `mismatch ${trait}`,
    });

    expect(issues).toHaveLength(0);
  });
});
