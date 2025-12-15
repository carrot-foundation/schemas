import { describe, expect, it } from 'vitest';
import {
  validateCertificateCollectionSlugs,
  validateCollectionsHaveRetiredAmounts,
  validateCreditSlugExists,
  validateCreditSymbolExists,
  validateRetirementReceiptRequirement,
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
