import { describe, expect, it } from 'vitest';
import { toJSONSchema } from 'zod';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  EvidenceCommitmentSchema,
  MAX_EVIDENCE_ITEMS,
  MAX_EVIDENCE_TYPE_LENGTH,
} from '../evidence-commitment.schema';
import {
  buildEvidenceCommitmentFixture,
  evidenceEncodingFixture,
  validEvidenceCommitmentFixture,
} from '../../../../test-utils/fixtures';

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateJson = ajv.compile(toJSONSchema(EvidenceCommitmentSchema));

const expectBoth = (input: unknown, expected: boolean) => {
  expect(EvidenceCommitmentSchema.safeParse(input).success).toBe(expected);
  expect(validateJson(input)).toBe(expected);
};

const withLeaf = (leaf: Record<string, unknown>) => ({
  ...validEvidenceCommitmentFixture,
  leaves: [{ ...validEvidenceCommitmentFixture.leaves[0], ...leaf }],
});

describe('EvidenceCommitmentSchema', () => {
  it('preserves the exact valid input', () => {
    const result = EvidenceCommitmentSchema.safeParse(
      validEvidenceCommitmentFixture,
    );
    expect(result.data).toEqual(validEvidenceCommitmentFixture);
    expect(validateJson(validEvidenceCommitmentFixture)).toBe(true);
  });

  it.each([[[0]], [[0, 1, 2]]])('accepts indexes %j', (indexes) => {
    expectBoth(buildEvidenceCommitmentFixture(indexes), true);
  });

  // The generated JSON Schema cannot express contiguity, so these hold for Zod only.
  it.each([[[1, 2]], [[0, 2]], [[0, 0]], [[1, 0]]])(
    'rejects indexes %j in Zod',
    (indexes) => {
      expect(
        EvidenceCommitmentSchema.safeParse(
          buildEvidenceCommitmentFixture(indexes),
        ).success,
      ).toBe(false);
    },
  );

  // Contiguity is not at play here: only `minimum: 0` refuses it in the JSON Schema.
  it('rejects a negative index in Zod and in the generated JSON Schema', () => {
    expectBoth(buildEvidenceCommitmentFixture([-1]), false);
  });

  it('rejects a non-integer index', () => {
    expectBoth(withLeaf({ index: 0.5 }), false);
  });

  it('rejects an empty leaves list', () => {
    expectBoth({ ...validEvidenceCommitmentFixture, leaves: [] }, false);
  });

  it('accepts exactly the maximum number of leaves in Zod and in the generated JSON Schema', () => {
    const indexes = Array.from({ length: MAX_EVIDENCE_ITEMS }, (_, i) => i);
    expectBoth(buildEvidenceCommitmentFixture(indexes), true);
  });

  it('rejects one leaf over the maximum in Zod and in the generated JSON Schema', () => {
    const indexes = Array.from({ length: MAX_EVIDENCE_ITEMS + 1 }, (_, i) => i);
    expectBoth(buildEvidenceCommitmentFixture(indexes), false);
  });

  it.each([
    ['uppercase', `0x${'A'.repeat(64)}`],
    ['no 0x prefix', 'a'.repeat(64)],
    ['too short', `0x${'a'.repeat(63)}`],
    ['too long', `0x${'a'.repeat(65)}`],
    ['non-hex', `0x${'g'.repeat(64)}`],
  ])('rejects a root that is %s', (_label, root) => {
    expectBoth({ ...validEvidenceCommitmentFixture, root }, false);
  });

  it('rejects a leaf hash that is not 0x-prefixed lowercase hex', () => {
    expectBoth(withLeaf({ hash: 'a'.repeat(64) }), false);
    expectBoth(withLeaf({ hash: `0x${'A'.repeat(64)}` }), false);
  });

  it.each(['mass-id:document', 'gas-id:event:weighing-1', 'a:b'])(
    'accepts leaf type %s',
    (type) => {
      expectBoth(withLeaf({ type }), true);
    },
  );

  it.each([
    'mass-id',
    'Mass-ID:document',
    'mass-id::document',
    'mass-id:event|weighing',
    'mass-id:',
    ':document',
    'mass id:document',
  ])('rejects leaf type %s', (type) => {
    expectBoth(withLeaf({ type }), false);
  });

  it('accepts a leaf type at the maximum length', () => {
    const type = `a:${'b'.repeat(MAX_EVIDENCE_TYPE_LENGTH - 2)}`;
    expect(type).toHaveLength(MAX_EVIDENCE_TYPE_LENGTH);
    expectBoth(withLeaf({ type }), true);
  });

  it('rejects a leaf type one character over the maximum', () => {
    const type = `a:${'b'.repeat(MAX_EVIDENCE_TYPE_LENGTH - 1)}`;
    expect(type).toHaveLength(MAX_EVIDENCE_TYPE_LENGTH + 1);
    expectBoth(withLeaf({ type }), false);
  });

  it('rejects a wrong format', () => {
    expectBoth(
      {
        ...validEvidenceCommitmentFixture,
        format: 'carrot-evidence-commitment/v2',
      },
      false,
    );
  });

  it('requires encoding', () => {
    expectBoth(
      { ...validEvidenceCommitmentFixture, encoding: undefined },
      false,
    );
  });

  it.each(['canonicalization', 'leaf', 'tree'] as const)(
    'rejects an encoding whose %s differs from the published constant',
    (key) => {
      expectBoth(
        {
          ...validEvidenceCommitmentFixture,
          encoding: { ...evidenceEncodingFixture, [key]: 'other' },
        },
        false,
      );
    },
  );

  it.each(['canonicalization', 'leaf', 'tree'] as const)(
    'requires encoding.%s',
    (key) => {
      const encoding = Object.fromEntries(
        Object.entries(evidenceEncodingFixture).filter(([k]) => k !== key),
      );
      expectBoth({ ...validEvidenceCommitmentFixture, encoding }, false);
    },
  );

  it('rejects unknown keys at the top, in encoding and in a leaf', () => {
    expectBoth({ ...validEvidenceCommitmentFixture, extra: 1 }, false);
    expectBoth(
      {
        ...validEvidenceCommitmentFixture,
        encoding: { ...evidenceEncodingFixture, extra: 1 },
      },
      false,
    );
    expectBoth(withLeaf({ extra: 1 }), false);
  });
});
