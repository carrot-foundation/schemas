import type { EvidenceCommitment } from '../../shared';

export const EVIDENCE_COMMITMENT_FORMAT_FIXTURE =
  'carrot-evidence-commitment/v1' as const;

export const evidenceEncodingFixture = {
  canonicalization: 'RFC 8785 (JCS)',
  leaf: '"0x" + sha256(JCS(["carrot-evidence-leaf/v1", type, salt, content]))',
  tree: 'OpenZeppelin StandardMerkleTree, one bytes32 value per leaf, sorted leaves',
} as const;

/**
 * Builds an evidence commitment with one leaf per given index, in the given order.
 * Hashes are synthetic and derived from the position so each leaf stays distinct.
 */
export const buildEvidenceCommitmentFixture = (
  indexes: readonly number[],
): EvidenceCommitment => ({
  format: EVIDENCE_COMMITMENT_FORMAT_FIXTURE,
  encoding: { ...evidenceEncodingFixture },
  root: `0x${'3b'.repeat(32)}`,
  leaves: indexes.map((index) => ({
    index,
    type: 'mass-id:document',
    hash: `0x${Math.abs(index).toString(16).padStart(64, '0')}`,
  })),
});

/**
 * Valid evidence commitment fixture with synthetic hashes.
 * Mirrors the shape the tokenization pipeline publishes in NFT metadata.
 */
export const validEvidenceCommitmentFixture: EvidenceCommitment = {
  format: EVIDENCE_COMMITMENT_FORMAT_FIXTURE,
  encoding: { ...evidenceEncodingFixture },
  root: `0x${'3b1e'.repeat(16)}`,
  leaves: [
    {
      index: 0,
      type: 'mass-id:document',
      hash: `0x${'5d0a'.repeat(16)}`,
    },
    {
      index: 1,
      type: 'mass-id:actor:methodology-platform',
      hash: `0x${'91c4'.repeat(16)}`,
    },
    {
      index: 2,
      type: 'mass-id:full-record',
      hash: `0x${'0f6e'.repeat(16)}`,
    },
  ],
};
