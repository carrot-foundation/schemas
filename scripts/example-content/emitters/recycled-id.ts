/**
 * Emitter for RecycledID example JSON.
 *
 * Produces a RecycledID document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import {
  exampleIpfsUri,
  formatDateTime,
  formatUnixMilliseconds,
} from '../shared.js';

/**
 * Emit a RecycledID example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitRecycledIDExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const recyclingAt = new Date('2024-12-08T11:32:47.000Z');
  const auditCompletedAt = new Date('2024-12-08T11:32:48.200Z');
  const issuedAt = new Date('2024-12-08T11:35:47.000Z');

  const tokenId = story.recycledID.tokenId;
  const massIDTokenId = story.massID.tokenId;
  const externalId = '00000000-0000-4000-8000-100000000020';
  const massIDExternalId = '00000000-0000-4000-8000-100000000009';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'RecycledID',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:recycled-id'),
    },
    environment: { ...story.environment },
    blockchain: {
      token_id: tokenId,
      smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      chain_id: 80002,
      network_name: 'Amoy',
    },
    created_at: formatDateTime(issuedAt),
    external_id: externalId,
    external_url: `https://registry.example.com/document/${externalId}`,
    audit_data_hash: 'PLACEHOLDER',
    viewer_reference: {
      ipfs_uri: exampleIpfsUri('viewer:build'),
    },
    name: `RecycledID #${tokenId} \u2022 BOLD Recycling \u2022 3.25t Recycled`,
    short_name: `RecycledID #${tokenId}`,
    description: `This RecycledID certifies 3.25 metric tons of organic waste successfully recycled through BOLD Recycling methodology from Bras\u00edlia, Brazil, producing high-quality compost and organic fertilizer.`,
    image: exampleIpfsUri('image:recycled-id'),
    background_color: '#2D5016',
    external_links: [
      {
        label: 'Carrot Registry',
        url: `https://registry.example.com/document/${externalId}`,
        description: 'Complete RecycledID details and audit trail',
      },
      {
        label: 'Source MassID',
        url: `https://registry.example.com/document/${massIDExternalId}`,
        description: 'Illustrative source waste record for this RecycledID',
      },
    ],
    attributes: [
      {
        trait_type: 'Methodology',
        value: 'AMS-III.F. | BOLD Recycling Credit',
      },
      {
        trait_type: 'Recycled Weight (kg)',
        value: 3250.5,
        display_type: 'number',
      },
      { trait_type: 'Credit Amount', value: 3, display_type: 'number' },
      { trait_type: 'Credit Type', value: 'Biowaste' },
      { trait_type: 'Source Waste Type', value: 'Organic' },
      {
        trait_type: 'Source Weight (kg)',
        value: 3250.5,
        display_type: 'number',
      },
      { trait_type: 'Origin City', value: 'Bras\u00edlia' },
      { trait_type: 'Origin Country Subdivision', value: 'BR-DF' },
      { trait_type: 'MassID', value: `#${massIDTokenId}` },
      {
        trait_type: 'MassID Recycling Date',
        value: formatUnixMilliseconds(recyclingAt),
        display_type: 'date',
      },
      {
        trait_type: 'Recycling Date',
        value: formatUnixMilliseconds(recyclingAt),
        display_type: 'date',
      },
      {
        trait_type: 'Certificate Issuance Date',
        value: formatUnixMilliseconds(issuedAt),
        display_type: 'date',
      },
    ],
    data: {
      credit: {
        slug: 'biowaste',
        symbol: 'C-BIOW',
        chain_id: 80002,
        smart_contract_address: '0xfedcba0987654321fedcba0987654321fedcba09',
      },
      summary: {
        recycled_mass_kg: 3250.5,
        credit_type: 'Biowaste',
        credit_amount: 3,
        recycling_date: formatDateTime(recyclingAt),
        issued_at: formatDateTime(issuedAt),
      },
      methodology: {
        external_id: '00000000-0000-4000-8000-100000000021',
        name: 'AMS-III.F. | BOLD Recycling Credit',
        version: '1.2.0',
        external_url:
          'https://registry.example.com/document/00000000-0000-4000-8000-100000000021',
        ipfs_uri: exampleIpfsUri('doc:methodology-recycling'),
      },
      audit: {
        completed_at: formatDateTime(auditCompletedAt),
        external_id: '00000000-0000-4000-8000-100000000022',
        external_url:
          'https://registry.example.com/document/00000000-0000-4000-8000-100000000022',
        result: 'PASSED',
        rules_executed: 18,
        ipfs_uri: exampleIpfsUri('doc:audit-recycling'),
      },
      mass_id: {
        external_id: massIDExternalId,
        token_id: massIDTokenId,
        external_url: `https://registry.example.com/document/${massIDExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:mass-id'),
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        chain_id: 80002,
      },
      waste_properties: {
        type: 'Organic',
        subtype: 'Food, Food Waste and Beverages',
        weight_kg: 3250.5,
      },
      origin_location: {
        id_hash:
          '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
        city: 'Bras\u00edlia',
        subdivision_code: 'BR-DF',
        country_code: 'BR',
        coordinates: { latitude: -15.8, longitude: -48.1 },
        responsible_participant_id_hash:
          'a1b2c3d4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcd',
      },
    },
  };
}
