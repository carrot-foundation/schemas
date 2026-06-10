import { describe, expect, it } from 'vitest';

import {
  CreditTokenSlugSchema,
  CreditTokenSymbolSchema,
} from '../enums.schema';

describe('CreditTokenSlugSchema', () => {
  it('accepts canonical credit token slugs', () => {
    expect(CreditTokenSlugSchema.parse('carbon-ch4')).toBe('carbon-ch4');
    expect(CreditTokenSlugSchema.parse('biowaste')).toBe('biowaste');
  });

  it('rejects the legacy methane slug', () => {
    const legacyMethaneSlug = ['carbon', 'methane'].join('-');
    const result = CreditTokenSlugSchema.safeParse(legacyMethaneSlug);

    expect(result.success).toBe(false);
  });
});

describe('CreditTokenSymbolSchema', () => {
  it('keeps canonical credit token symbols unchanged', () => {
    expect(CreditTokenSymbolSchema.parse('C-CARB.CH4')).toBe('C-CARB.CH4');
    expect(CreditTokenSymbolSchema.parse('C-BIOW')).toBe('C-BIOW');
  });
});
