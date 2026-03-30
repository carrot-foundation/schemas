/**
 * Emitter for Collection example JSON.
 *
 * Produces a Collection document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime } from '../shared.js';

/**
 * Emit a Collection example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitCollectionExample() {
  const story = buildReferenceStory();

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Collection',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    created_at: formatDateTime(new Date('2024-12-05T14:30:00.000Z')),
    external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
    external_url: `https://explore.carrot.eco/collection/${story.collection.slug}`,
    name: story.collection.name,
    slug: story.collection.slug,
    image: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    description:
      'Cold Start is a limited-edition collection created for early supporters of BOLD - Breakthrough in Organic Landfill Diversion. This purchase contributes to reducing global waste and promoting circularity, with funds distributed via smart contract to local recycling operations and communities.',
  };
}
