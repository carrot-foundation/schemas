import { describe, expect, it } from 'vitest';

import {
  BRAZIL_SUBDIVISION_CODES,
  normalizeBrazilSubdivision,
} from '../brazil.data';

describe('normalizeBrazilSubdivision', () => {
  it.each([
    ['RS', 'BR-RS'],
    ['sc', 'BR-SC'],
    ['SP', 'BR-SP'],
  ])('prefixes a bare 2-letter part %s -> %s', (input, expected) => {
    expect(normalizeBrazilSubdivision(input)).toBe(expected);
  });

  it.each([
    ['São Paulo', 'BR-SP'],
    ['sao paulo', 'BR-SP'],
    ['Rio Grande do Sul', 'BR-RS'],
    ['Santa Catarina', 'BR-SC'],
    ['Goiás', 'BR-GO'],
  ])('maps a full state name %s -> %s', (input, expected) => {
    expect(normalizeBrazilSubdivision(input)).toBe(expected);
  });

  it('returns an existing BR-XX code unchanged', () => {
    expect(normalizeBrazilSubdivision('BR-MG')).toBe('BR-MG');
    expect(normalizeBrazilSubdivision('br-mg')).toBe('BR-MG');
  });

  it('produces only valid ISO 3166-2 Brazil subdivision codes', () => {
    expect(BRAZIL_SUBDIVISION_CODES).toContain(
      normalizeBrazilSubdivision('Minas Gerais'),
    );
  });

  it('throws on an unrecognized subdivision', () => {
    expect(() => normalizeBrazilSubdivision('Zug')).toThrow(
      /Cannot normalize Brazilian subdivision/u,
    );
  });
});
