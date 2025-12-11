import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { canonicalizeForHash, hashCanonicalJson, hashObject } from '../hash';

describe('hash utilities', () => {
  it('canonicalizes object keys deterministically', () => {
    const input = { b: 1, a: 2, c: { d: 4, a: 3 } };

    const canonical = canonicalizeForHash(input);

    expect(canonical).toBe('{"a":2,"b":1,"c":{"a":3,"d":4}}');
  });

  it('canonicalizes arrays and nested objects consistently', () => {
    const input = [{ z: 'last', a: 'first' }, 3, [2, 1]];

    const canonical = canonicalizeForHash(input);

    expect(canonical).toBe('[{"a":"first","z":"last"},3,[2,1]]');
  });

  it('produces the same hash for objects that only differ in key order', () => {
    const valueA = { b: 1, a: 2 };
    const valueB = { a: 2, b: 1 };

    expect(hashObject(valueA)).toBe(hashObject(valueB));
  });

  it('canonicalizes primitives directly (string, boolean, null)', () => {
    expect(canonicalizeForHash('hello')).toBe('"hello"');
    expect(canonicalizeForHash(true)).toBe('true');
    expect(canonicalizeForHash(null)).toBe('null');
  });

  it('hashes canonical JSON with SHA-256', () => {
    const canonical = '{"a":1,"b":2}';
    const expected = createHash('sha256')
      .update(canonical, 'utf8')
      .digest('hex');

    expect(hashCanonicalJson(canonical)).toBe(expected);
  });

  it('throws on non-finite numbers', () => {
    expect(() => canonicalizeForHash(Number.POSITIVE_INFINITY)).toThrow(
      /not serializable|not allowed/i,
    );
    expect(() => canonicalizeForHash(Number.NaN)).toThrow(
      /not serializable|not allowed/i,
    );
  });

  it('throws on unsupported types', () => {
    expect(() => canonicalizeForHash(() => null)).toThrow(/not serializable/i);
    expect(() => canonicalizeForHash(Symbol('x'))).toThrow(/not serializable/i);
  });
});
