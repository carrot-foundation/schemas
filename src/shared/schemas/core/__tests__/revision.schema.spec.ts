import { describe, expect, it } from 'vitest';
import { toJSONSchema } from 'zod';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { MetadataRevisionSchema } from '../revision.schema';
import {
  verifiedRevisionFixture,
  unavailableRevisionFixture,
} from '../../../../test-utils/fixtures';

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateJson = ajv.compile(toJSONSchema(MetadataRevisionSchema));

describe('metadata revision publication contract', () => {
  it.each([verifiedRevisionFixture, unavailableRevisionFixture])(
    'preserves the exact revision input for $comparison comparison',
    (input) => {
      const result = MetadataRevisionSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
      expect(validateJson(input)).toBe(true);
    },
  );

  it('preserves literal legacy predecessor and the same Unicode reason for event readback', () => {
    const input = {
      ...unavailableRevisionFixture,
      previous_uri: ' ipfs://random-uri ',
      reason: ' Correção aprovada do metadado. ',
    };
    expect(MetadataRevisionSchema.safeParse(input).data).toEqual(input);
    expect(validateJson(input)).toBe(true);
  });

  it.each(['https://', 'http://%', 'https:///', 'https://?', 'http://#'])(
    'rejects malformed HTTP supporting reference %s in source and generated validators',
    (reference) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [
          { ...verifiedRevisionFixture.changes[0], references: [reference] },
        ],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
      expect(validateJson(input)).toBe(false);
    },
  );

  it.each(['HTTP://example.com/evidence', 'Https://example.com/evidence'])(
    'preserves public URI scheme casing exactly for %s',
    (reference) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [
          { ...verifiedRevisionFixture.changes[0], references: [reference] },
        ],
      };
      expect(MetadataRevisionSchema.safeParse(input).data).toEqual(input);
      expect(validateJson(input)).toBe(true);
    },
  );

  it.each(['add', 'replace', 'remove'])(
    'requires verified %s operation without inventing old/new values',
    (operation) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [{ ...verifiedRevisionFixture.changes[0], operation }],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(true);
      expect(validateJson(input)).toBe(true);
    },
  );

  it.each([
    '/data/a~1b/m~0n',
    '/data/~01',
    '/attributes',
    '/data/array/0',
    '/',
  ])('accepts exact non-root JSON Pointer %s', (path) => {
    const input = {
      ...verifiedRevisionFixture,
      changes: [{ ...verifiedRevisionFixture.changes[0], path }],
    };
    expect(MetadataRevisionSchema.safeParse(input).data).toEqual(input);
    expect(validateJson(input)).toBe(true);
  });

  it.each([
    '',
    'image',
    '#/image',
    '/data/~',
    '/data/~2',
    '/revision',
    '/revision/reason',
    '/data/~0~',
  ])(
    'rejects invalid or self-referential field path %s in both validators',
    (path) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [{ ...verifiedRevisionFixture.changes[0], path }],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
      expect(validateJson(input)).toBe(false);
    },
  );

  it.each([
    { ...verifiedRevisionFixture, comparison: undefined },
    { ...verifiedRevisionFixture, comparison: 'declared' },
    { ...verifiedRevisionFixture, previous_uri: '' },
    { ...verifiedRevisionFixture, previous_uri: 'x'.repeat(4097) },
    { ...verifiedRevisionFixture, reason: '' },
    { ...verifiedRevisionFixture, reason: '  \t\n' },
    { ...verifiedRevisionFixture, reason: 'x'.repeat(501) },
    { ...verifiedRevisionFixture, reason: '\uD800' },
    { ...verifiedRevisionFixture, reason: '\uDC00' },
    { ...verifiedRevisionFixture, changes: [] },
    { ...verifiedRevisionFixture, change_types: ['image_update'] },
    { ...verifiedRevisionFixture, changed_fields: ['/image'] },
    { ...verifiedRevisionFixture, transaction_hash: 'future-transaction' },
    { ...verifiedRevisionFixture, executed_at: '2026-01-01T00:00:00Z' },
    { ...verifiedRevisionFixture, history: [] },
    { ...verifiedRevisionFixture, operator: 'synthetic-operator' },
  ])('rejects incomplete or redundant revision input %#', (input) => {
    expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
    expect(validateJson(input)).toBe(false);
  });

  it.each([
    { operation: undefined },
    { operation: 'unknown' },
    { operation: null },
    { categories: [] },
    { categories: ['scientific_change'] },
    { categories: Array.from({ length: 6 }, () => 'image_update') },
    { reason: ' ' },
    { reason: 'x'.repeat(501) },
    { path: '/' + 'x'.repeat(2048) },
    { references: [] },
    { references: ['ipfs://random-uri'] },
    { references: ['file:///private/evidence'] },
    { references: ['javascript:alert(1)'] },
    { references: ['https://example.com/' + 'x'.repeat(4096)] },
    {
      references: Array.from(
        { length: 11 },
        (_, i) => `https://example.com/evidence/${i}`,
      ),
    },
    { old_value: 'old' },
    { new_value: 'new' },
    { signers: [] },
  ])(
    'rejects unverified operations or invalid field-level evidence %#',
    (change) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [{ ...verifiedRevisionFixture.changes[0], ...change }],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
      expect(validateJson(input)).toBe(false);
    },
  );

  it.each(['add', 'replace', 'remove', null])(
    'rejects operation %s when predecessor comparison is unavailable',
    (operation) => {
      const input = {
        ...unavailableRevisionFixture,
        changes: [{ ...unavailableRevisionFixture.changes[0], operation }],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
      expect(validateJson(input)).toBe(false);
    },
  );

  it('accepts bounded array replacement and all approved categories without item identity claims', () => {
    const input = {
      ...verifiedRevisionFixture,
      reason: 'x'.repeat(500),
      previous_uri: 'x'.repeat(4096),
      changes: [
        {
          path: '/attributes',
          operation: 'replace',
          reason: 'x'.repeat(500),
          categories: [
            'schema_migration',
            'image_update',
            'metadata_correction',
            'reference_update',
            'rollback',
          ],
          references: [
            verifiedRevisionFixture.previous_uri,
            'https://example.com/evidence',
          ],
        },
      ],
    };
    expect(MetadataRevisionSchema.safeParse(input).data).toEqual(input);
    expect(validateJson(input)).toBe(true);
  });

  it.each(['漢'.repeat(500), '😀'.repeat(250), 'Correção aprovada.'])(
    'preserves well-formed Unicode within the shared 1500-byte event reason bound %#',
    (reason) => {
      const input = { ...unavailableRevisionFixture, reason };
      expect(MetadataRevisionSchema.safeParse(input).data).toEqual(input);
      expect(new TextEncoder().encode(reason).length).toBeLessThanOrEqual(1500);
      expect(validateJson(input)).toBe(true);
    },
  );

  it('rejects an astral reason beyond 500 UTF-16 units even within JSON Schema character limit', () => {
    expect(
      MetadataRevisionSchema.safeParse({
        ...unavailableRevisionFixture,
        reason: '😀'.repeat(251),
      }).success,
    ).toBe(false);
  });

  it('enforces bounded unique field paths without silently truncating a revision', () => {
    const input = {
      ...unavailableRevisionFixture,
      changes: Array.from({ length: 256 }, (_, i) => ({
        ...unavailableRevisionFixture.changes[0],
        path: `/data/field_${i}`,
      })),
    };
    expect(MetadataRevisionSchema.safeParse(input).success).toBe(true);
    expect(validateJson(input)).toBe(true);
    const overLimit = {
      ...input,
      changes: [...input.changes, { ...input.changes[0], path: '/data/extra' }],
    };
    expect(MetadataRevisionSchema.safeParse(overLimit).success).toBe(false);
    expect(validateJson(overLimit)).toBe(false);
    const duplicate = {
      ...input,
      changes: [input.changes[0], input.changes[0]],
    };
    expect(MetadataRevisionSchema.safeParse(duplicate).success).toBe(false);
  });

  it.each([
    { categories: ['image_update', 'image_update'] },
    {
      references: [
        'https://example.com/evidence',
        'https://example.com/evidence',
      ],
    },
  ])(
    'rejects duplicate field category or supporting reference %#',
    (change) => {
      const input = {
        ...verifiedRevisionFixture,
        changes: [{ ...verifiedRevisionFixture.changes[0], ...change }],
      };
      expect(MetadataRevisionSchema.safeParse(input).success).toBe(false);
    },
  );
});
