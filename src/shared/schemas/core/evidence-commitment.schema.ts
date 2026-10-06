import { z } from 'zod';

export const EVIDENCE_COMMITMENT_FORMAT = 'carrot-evidence-commitment/v1';

// Mirrors the limits of the producer's schema, so the public contract accepts exactly what it emits.
export const MAX_EVIDENCE_ITEMS = 10_000;
export const MAX_EVIDENCE_TYPE_LENGTH = 256;

// Published verbatim in every commitment so a verifier needs nothing but the JSON.
export const EVIDENCE_ENCODING = {
  canonicalization: 'RFC 8785 (JCS)',
  leaf: '"0x" + sha256(JCS(["carrot-evidence-leaf/v1", type, salt, content]))',
  tree: 'OpenZeppelin StandardMerkleTree, one bytes32 value per leaf, sorted leaves',
} as const;

const EvidenceHashSchema = z.string().regex(/^0x[a-f0-9]{64}$/, {
  error: 'Must be a 32-byte lowercase hex string with 0x prefix',
});

const EvidenceEncodingSchema = z
  .strictObject({
    canonicalization: z.literal(EVIDENCE_ENCODING.canonicalization).meta({
      title: 'Canonicalization',
      description: 'JSON canonicalization applied before hashing each leaf',
    }),
    leaf: z.literal(EVIDENCE_ENCODING.leaf).meta({
      title: 'Leaf Encoding',
      description: 'Formula that derives each leaf hash from its evidence item',
    }),
    tree: z.literal(EVIDENCE_ENCODING.tree).meta({
      title: 'Tree Encoding',
      description: 'Merkle tree construction that produces the root',
    }),
  })
  .meta({
    title: 'Evidence Encoding',
    description:
      'Constants that describe how leaf hashes and the Merkle root are computed, so a verifier can recompute them from the JSON alone',
  });

const EvidenceCommitmentLeafSchema = z
  .strictObject({
    index: z
      .number()
      .int()
      .nonnegative()
      .meta({
        title: 'Leaf Index',
        description: 'Position of the leaf in the commitment, starting at 0',
        examples: [0, 1, 20],
      }),
    type: z
      .string()
      .max(MAX_EVIDENCE_TYPE_LENGTH)
      .regex(/^[a-z0-9-]+(:[a-z0-9-]+)+$/, {
        error:
          'Must be colon-separated lowercase alphanumeric segments, such as mass-id:document',
      })
      .meta({
        title: 'Leaf Type',
        description:
          'Kind of evidence item, as colon-separated lowercase segments',
        examples: ['mass-id:document', 'mass-id:actor:methodology-platform'],
      }),
    hash: EvidenceHashSchema.meta({
      title: 'Leaf Hash',
      description: 'Salted hash of the evidence item, with 0x prefix',
      examples: [
        '0x5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a5d0a',
      ],
    }),
  })
  .meta({
    title: 'Evidence Commitment Leaf',
    description: 'One committed evidence item: its position, kind and hash',
  });
export type EvidenceCommitmentLeaf = z.infer<
  typeof EvidenceCommitmentLeafSchema
>;

export const EvidenceCommitmentSchema = z
  .strictObject({
    format: z.literal(EVIDENCE_COMMITMENT_FORMAT).meta({
      title: 'Commitment Format',
      description: 'Version tag of the evidence commitment format',
    }),
    encoding: EvidenceEncodingSchema,
    root: EvidenceHashSchema.meta({
      title: 'Evidence Root',
      description: 'Merkle root over all leaf hashes, with 0x prefix',
      examples: [
        '0x3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e3b1e',
      ],
    }),
    leaves: z
      .array(EvidenceCommitmentLeafSchema)
      .min(1)
      .max(MAX_EVIDENCE_ITEMS)
      .refine((leaves) => leaves.every((leaf, i) => leaf.index === i), {
        error: 'Leaf indexes must be unique and contiguous from 0',
      })
      .meta({
        title: 'Evidence Leaves',
        description:
          'Committed evidence items in index order. Carries hashes only, never content. Indexes are unique, contiguous from 0, and equal to the array position.',
      }),
  })
  .meta({
    title: 'Evidence Commitment',
    description:
      'Commitment to the private evidence record behind this token: a Merkle root plus the hash of each leaf. It carries no evidence content',
  });
export type EvidenceCommitment = z.infer<typeof EvidenceCommitmentSchema>;
