/**
 * Emitter for Credit example JSON.
 *
 * Produces a Credit document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { exampleIpfsUri, formatDateTime } from '../shared.js';

/**
 * Emit a Credit example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitCreditExample(): Record<string, unknown> {
  const story = buildReferenceStory();

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Credit',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:credit'),
    },
    environment: { ...story.environment },
    created_at: formatDateTime(new Date('2024-12-05T14:30:00.000Z')),
    external_id: '00000000-0000-4000-8000-100000000016',
    external_url:
      'https://registry.example.com/credit/00000000-0000-4000-8000-100000000016',
    symbol: story.credit.symbol,
    slug: story.credit.slug,
    name: 'Example Carbon Credit',
    blockchain: {
      chain_id: 80002,
      smart_contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    interop: { erc1046: true },
    decimals: 6,
    image: exampleIpfsUri('image:credit-carbon'),
    description:
      'Illustrative carbon credit metadata for a fictional ERC-20 contract. Its name, symbol, decimals, and network must match the deployed contract before any real document is generated.',
  };
}
