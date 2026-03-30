/**
 * Emitter for Credit example JSON.
 *
 * Produces a Credit document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime } from '../shared.js';

/**
 * Emit a Credit example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 *
 * @returns {object} A Credit IPFS document (requires post-processing for AJV validity)
 */
export function emitCreditExample() {
  const story = buildReferenceStory();

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Credit',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    created_at: formatDateTime(new Date('2024-12-05T14:30:00.000Z')),
    external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
    external_url: `https://explore.carrot.eco/credit/carrot-carbon`,
    symbol: story.credit.symbol,
    slug: story.credit.slug,
    name: story.credit.name,
    decimals: 18,
    image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    description:
      'Carrot Carbon (C-CARB.CH4) represents verified prevented emissions from organic waste composting projects. Each token equals one metric ton of CO₂ equivalent (CO₂e) prevented from entering the atmosphere through sustainable waste management practices. These credits are generated through the BOLD Carbon methodology and provide transparent, traceable environmental impact.',
  };
}
