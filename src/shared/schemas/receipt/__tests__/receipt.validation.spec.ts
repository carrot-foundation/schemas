import { describe, it, expect } from 'vitest';

import {
  createAttributeMap,
  validateAttributeValue,
  validateAttributesForItems,
  validateCountMatches,
  validateDateAttribute,
  validateSummaryListMatchesData,
  validateTotalMatches,
} from '../receipt.validation';
import { createValidationContext } from './receipt.test-helpers';

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
    const { issues, ctx } = createValidationContext();

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
    const { issues, ctx } = createValidationContext();

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
    const { issues, ctx } = createValidationContext();

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

  it.each([
    {
      name: 'validates totals match',
      actualTotal: 10,
      expectedTotal: 10,
      expectedIssues: 0,
    },
    {
      name: 'detects mismatched totals',
      actualTotal: 9,
      expectedTotal: 10,
      expectedIssues: 1,
      message: 'totals differ',
    },
  ])('$name', ({ actualTotal, expectedTotal, expectedIssues, message }) => {
    const { issues, ctx } = createValidationContext();

    validateTotalMatches({
      ctx,
      actualTotal,
      expectedTotal,
      path: ['summary', 'total'],
      message: message ?? 'totals differ',
    });

    expect(issues).toHaveLength(expectedIssues);
    if (message) {
      expect(issues[0].message).toBe(message);
    }
  });

  it.each([
    {
      name: 'validates count matches',
      actualCount: 2,
      expectedCount: 2,
      expectedIssues: 0,
    },
    {
      name: 'detects mismatched counts',
      actualCount: 1,
      expectedCount: 2,
      expectedIssues: 1,
      expectedPath: ['summary', 'count'],
    },
  ])(
    '$name',
    ({ actualCount, expectedCount, expectedIssues, expectedPath }) => {
      const { issues, ctx } = createValidationContext();

      validateCountMatches({
        ctx,
        actualCount,
        expectedCount,
        path: ['summary', 'count'],
        message: 'count mismatch',
      });

      expect(issues).toHaveLength(expectedIssues);
      if (expectedPath) {
        expect(issues[0].path).toEqual(expectedPath);
      }
    },
  );

  describe('validateAttributeValue', () => {
    it.each([
      {
        name: 'detects missing attribute',
        attributes: createAttributeMap([{ trait_type: 'present', value: 1 }]),
        traitType: 'missing',
        expectedValue: 2,
        expectedMessages: ['missing'],
      },
      {
        name: 'detects mismatched attribute value',
        attributes: createAttributeMap([{ trait_type: 'present', value: 1 }]),
        traitType: 'present',
        expectedValue: 2,
        expectedMessages: ['mismatch'],
      },
      {
        name: 'accepts matching attribute value',
        attributes: createAttributeMap([{ trait_type: 'present', value: 1 }]),
        traitType: 'present',
        expectedValue: 1,
        expectedMessages: [],
      },
    ])(
      '$name',
      ({ attributes, traitType, expectedValue, expectedMessages }) => {
        const { issues, ctx } = createValidationContext();

        validateAttributeValue({
          ctx,
          attributeByTraitType: attributes,
          traitType,
          expectedValue,
          missingMessage: 'missing',
          mismatchMessage: 'mismatch',
        });

        expect(issues).toHaveLength(expectedMessages.length);
        if (expectedMessages.length > 0) {
          expect(issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining(expectedMessages),
          );
        }
      },
    );
  });

  describe('validateDateAttribute', () => {
    it.each([
      {
        name: 'detects missing date attribute',
        attributes: createAttributeMap([{ trait_type: 'other', value: 0 }]),
        dateValue: '2025-01-01',
        expectedMessages: ['missing date'],
        expectedPath: ['attributes'],
      },
      {
        name: 'detects invalid date value',
        attributes: createAttributeMap([{ trait_type: 'Date', value: 0 }]),
        dateValue: 'invalid-date',
        expectedMessages: ['invalid date'],
        expectedPath: ['data', 'date'],
      },
      {
        name: 'uses attribute path when date path is not provided',
        attributes: createAttributeMap([{ trait_type: 'Date', value: 0 }]),
        dateValue: 'invalid-date',
        expectedMessages: ['invalid date'],
        expectedPath: ['attributes'],
        omitDatePath: true,
      },
      {
        name: 'detects mismatched date attribute value',
        attributes: createAttributeMap([{ trait_type: 'Date', value: 0 }]),
        dateValue: '2025-01-01',
        expectedMessages: ['mismatch date'],
        expectedPath: ['attributes'],
      },
      {
        name: 'accepts matching date attribute',
        attributes: createAttributeMap([
          {
            trait_type: 'Date',
            value: Date.parse('2025-01-01T00:00:00.000Z'),
          },
        ]),
        dateValue: '2025-01-01',
        expectedMessages: [],
      },
    ])(
      '$name',
      ({
        attributes,
        dateValue,
        expectedMessages,
        expectedPath,
        omitDatePath,
      }) => {
        const { issues, ctx } = createValidationContext();

        validateDateAttribute({
          ctx,
          attributeByTraitType: attributes,
          traitType: 'Date',
          dateValue,
          missingMessage: 'missing date',
          invalidDateMessage: 'invalid date',
          mismatchMessage: 'mismatch date',
          datePath: omitDatePath ? undefined : ['data', 'date'],
        });

        expect(issues).toHaveLength(expectedMessages.length);
        if (expectedMessages.length > 0) {
          expect(issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining(expectedMessages),
          );
        }
        if (expectedPath) {
          expect(issues[0].path).toEqual(expectedPath);
        }
      },
    );
  });

  describe('validateAttributesForItems', () => {
    it.each([
      {
        name: 'detects missing item attribute',
        attributeByTraitType: createAttributeMap([
          { trait_type: 'alpha', value: 1 },
        ]),
        items: [
          { trait: 'alpha', value: 1 },
          { trait: 'bravo', value: 2 },
        ],
        expectedMessages: ['missing bravo'],
      },
      {
        name: 'detects mismatched item attribute value',
        attributeByTraitType: createAttributeMap([
          { trait_type: 'alpha', value: 1 },
          { trait_type: 'bravo', value: 3 },
        ]),
        items: [
          { trait: 'alpha', value: 1 },
          { trait: 'bravo', value: 2 },
        ],
        expectedMessages: ['mismatch bravo'],
      },
      {
        name: 'accepts matching item attributes',
        attributeByTraitType: createAttributeMap([
          { trait_type: 'alpha', value: 1 },
          { trait_type: 'bravo', value: 2 },
        ]),
        items: [
          { trait: 'alpha', value: 1 },
          { trait: 'bravo', value: 2 },
        ],
        expectedMessages: [],
      },
    ])('$name', ({ attributeByTraitType, items, expectedMessages }) => {
      const { issues, ctx } = createValidationContext();

      validateAttributesForItems({
        ctx,
        attributeByTraitType,
        items,
        traitSelector: (item) => item.trait,
        valueSelector: (item) => item.value,
        missingMessage: (trait) => `missing ${trait}`,
        mismatchMessage: (trait) => `mismatch ${trait}`,
      });

      expect(issues).toHaveLength(expectedMessages.length);
      if (expectedMessages.length > 0) {
        expect(issues.map((issue) => issue.message)).toEqual(
          expect.arrayContaining(expectedMessages),
        );
      }
    });
  });
});
