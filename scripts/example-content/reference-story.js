/**
 * Canonical reference story for schema examples.
 *
 * This is the single source of truth for all cross-schema identifiers.
 * Each emitter reads from this object so that linked token_id values,
 * slugs, names, and other shared facts stay aligned without duplication.
 */

import { NON_PRODUCTION_MARKER } from './shared.js';

/**
 * Build the reference story containing all shared identifiers and metadata
 * used across schema example generators.
 *
 * @returns {object} The canonical reference story
 */
export function buildReferenceStory() {
  return {
    environment: {
      ...NON_PRODUCTION_MARKER,
    },
    methodology: {
      name: 'AMS-III.F. | BOLD Carbon (CH\u2084) - SSC',
      version: '1.0.1',
      slug: 'bold-carbon-ch4',
    },
    collection: {
      name: 'BOLD Cold Start - Carazinho',
      slug: 'bold-cold-start-carazinho',
    },
    credit: {
      name: 'Carrot Carbon (CH\u2084)',
      slug: 'carbon-methane',
      symbol: 'C-CARB.CH4',
    },
    massID: {
      tokenId: '100001',
    },
    gasID: {
      tokenId: '200001',
    },
    recycledID: {
      tokenId: '300001',
    },
    audit: {
      tokenId: '400001',
    },
    purchaseReceipt: {
      tokenId: '500001',
    },
    retirementReceipt: {
      tokenId: '600001',
    },
  };
}
