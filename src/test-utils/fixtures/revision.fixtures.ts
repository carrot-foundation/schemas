import type { MetadataRevision } from '../../shared';

export const verifiedRevisionFixture = {
  previous_uri:
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
  reason: 'Correct the approved metadata references.',
  comparison: 'verified' as const,
  changes: [
    {
      path: '/image',
      operation: 'replace' as const,
      categories: ['image_update' as const, 'reference_update' as const],
      reason: 'Use the approved image document.',
      references: ['https://example.com/evidence/image'],
    },
  ],
} satisfies MetadataRevision;

export const unavailableRevisionFixture = {
  previous_uri: 'ipfs://random-uri',
  reason: 'Migrate metadata to the approved schema.',
  comparison: 'unavailable' as const,
  changes: [
    {
      path: '/schema',
      categories: ['schema_migration' as const],
      reason: 'Declare the approved schema artifact identity.',
    },
  ],
} satisfies MetadataRevision;
