/**
 * Emitter for Collection example JSON.
 *
 * Produces a Collection document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { exampleIpfsUri, formatDateTime } from '../shared.js';

/**
 * Emit a Collection example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitCollectionExample(): Record<string, unknown> {
  const story = buildReferenceStory();

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Collection',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:collection'),
    },
    environment: { ...story.environment },
    created_at: formatDateTime(new Date('2024-12-05T14:30:00.000Z')),
    external_id: '00000000-0000-4000-8000-100000000006',
    external_url: `https://registry.example.com/collection/${story.collection.slug}`,
    name: story.collection.name,
    slug: story.collection.slug,
    image: exampleIpfsUri('image:collection-one'),
    description:
      'Illustrative collection grouping credit purchases and retirements for an example campaign. The collection document describes the grouping and points to a separate image asset; its URI is what receipt collection references cite.',
  };
}
