import { describe, expect, it } from 'vitest';

import {
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
