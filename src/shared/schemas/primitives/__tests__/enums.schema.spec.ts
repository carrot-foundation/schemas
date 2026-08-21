import { describe, expect, it } from 'vitest';

import {
  CollectionNameSchema,
  CollectionSlugSchema,
  CreditTokenSlugSchema,
  CreditTokenSymbolSchema,
} from '../enums.schema';

describe('CreditTokenSlugSchema', () => {
  it('accepts canonical credit token slugs', () => {
    expect(CreditTokenSlugSchema.safeParse('carbon-ch4')).toEqual({
      success: true,
      data: 'carbon-ch4',
    });
    expect(CreditTokenSlugSchema.safeParse('biowaste')).toEqual({
      success: true,
      data: 'biowaste',
    });
  });

  it('rejects the legacy methane slug', () => {
    const result = CreditTokenSlugSchema.safeParse('carbon-methane');

    expect(result.success).toBe(false);
  });
});

describe('CreditTokenSymbolSchema', () => {
  it('keeps canonical credit token symbols unchanged', () => {
    expect(CreditTokenSymbolSchema.safeParse('C-CARB.CH4')).toEqual({
      success: true,
      data: 'C-CARB.CH4',
    });
    expect(CreditTokenSymbolSchema.safeParse('C-BIOW')).toEqual({
      success: true,
      data: 'C-BIOW',
    });
  });

  it('rejects a non-canonical credit token symbol', () => {
    const result = CreditTokenSymbolSchema.safeParse('C-CARB.METHANE');

    expect(result.success).toBe(false);
  });
});

describe('CollectionSlugSchema', () => {
  it('accepts a well-formed slug not present in any fixed list', () => {
    expect(CollectionSlugSchema.safeParse('bold-cold-start-araucaria')).toEqual(
      {
        success: true,
        data: 'bold-cold-start-araucaria',
      },
    );
    expect(CollectionSlugSchema.safeParse('bold-cold-start-papagaios')).toEqual(
      {
        success: true,
        data: 'bold-cold-start-papagaios',
      },
    );
  });

  it('rejects a slug with uppercase letters', () => {
    const result = CollectionSlugSchema.safeParse('Bold Brazil');

    expect(result.success).toBe(false);
  });

  it('rejects a slug with underscores', () => {
    const result = CollectionSlugSchema.safeParse('bold_brazil');

    expect(result.success).toBe(false);
  });

  it('rejects a slug longer than 100 characters', () => {
    const result = CollectionSlugSchema.safeParse('a'.repeat(101));

    expect(result.success).toBe(false);
  });
});

describe('CollectionNameSchema', () => {
  it('accepts a well-formed display name with diacritics', () => {
    expect(
      CollectionNameSchema.safeParse('BOLD Cold Start - Araucária'),
    ).toEqual({
      success: true,
      data: 'BOLD Cold Start - Araucária',
    });
  });

  it('rejects an empty name', () => {
    const result = CollectionNameSchema.safeParse('');

    expect(result.success).toBe(false);
  });

  it('rejects a name longer than 100 characters', () => {
    const result = CollectionNameSchema.safeParse('a'.repeat(101));

    expect(result.success).toBe(false);
  });
});
