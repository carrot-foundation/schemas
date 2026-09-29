/**
 * Emitter for GasID example JSON.
 *
 * Produces a GasID document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import {
  exampleIpfsUri,
  formatDateTime,
  formatUnixMilliseconds,
} from '../shared.js';

/**
 * Emit a GasID example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitGasIDExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const recyclingAt = new Date('2024-12-08T11:32:47.000Z');
  const auditCompletedAt = new Date('2024-12-08T11:32:48.200Z');
  const calculationAt = new Date('2024-12-08T11:34:47.000Z');
  const issuedAt = new Date('2024-12-08T11:35:47.000Z');

  const tokenId = story.gasID.tokenId;
  const massIDTokenId = story.massID.tokenId;
  const externalId = '00000000-0000-4000-8000-100000000015';
  const massIDExternalId = '00000000-0000-4000-8000-100000000009';
  const auditExternalId = '00000000-0000-4000-8000-100000000004';
  const methodologyExternalId = '00000000-0000-4000-8000-100000000005';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'GasID',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:gas-id'),
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
    name: `GasID #${tokenId} \u2022 BOLD Carbon (CH\u2084) \u2022 0.12t CO\u2082e`,
    short_name: `GasID #${tokenId}`,
    description: `This GasID certifies 0.12 metric tons of CO\u2082e emissions prevented through BOLD Carbon (CH\u2084) methodology composting of 3.25 metric tons of organic waste from Bras\u00edlia, Brazil.`,
    image: exampleIpfsUri('image:gas-id'),
    background_color: '#1B4332',
    external_links: [
      {
        label: 'Carrot Registry',
        url: `https://registry.example.com/document/${externalId}`,
        description: 'Complete GasID details and audit trail',
      },
      {
        label: 'Carrot White Paper',
        url: 'https://whitepaper.example.com/',
        description: 'Carrot ecosystem overview and technical foundation',
      },
    ],
    attributes: [
      {
        trait_type: 'Methodology',
        value: story.methodology.name,
      },
      { trait_type: 'Gas Type', value: 'Methane (CH\u2084)' },
      {
        trait_type: 'CO\u2082e Prevented (kg)',
        value: 123.519,
        display_type: 'number',
      },
      {
        trait_type: 'Credit Amount',
        value: 0.123519,
        display_type: 'number',
      },
      { trait_type: 'Credit Type', value: 'Carbon (CH\u2084)' },
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
        slug: 'carbon-ch4',
        symbol: 'C-CARB.CH4',
        chain_id: 80002,
        smart_contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
      summary: {
        gas_type: 'Methane (CH\u2084)',
        credit_type: 'Carbon (CH\u2084)',
        credit_amount: 0.123519,
        prevented_co2e_kg: 123.519,
        recycling_date: formatDateTime(recyclingAt),
        issued_at: formatDateTime(issuedAt),
      },
      waste_properties: {
        type: 'Organic',
        subtype: 'Food, Food Waste and Beverages',
        weight_kg: 3250.5,
      },
      methodology: {
        name: story.methodology.name,
        version: story.methodology.version,
        external_id: methodologyExternalId,
        external_url: `https://registry.example.com/document/${methodologyExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:methodology-carbon'),
      },
      audit: {
        result: 'PASSED',
        rules_executed: 21,
        completed_at: formatDateTime(auditCompletedAt),
        external_id: auditExternalId,
        external_url: `https://registry.example.com/document/${auditExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:audit-carbon'),
      },
      mass_id: {
        token_id: massIDTokenId,
        external_id: massIDExternalId,
        external_url: `https://registry.example.com/document/${massIDExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:mass-id'),
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        chain_id: 80002,
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
      prevented_emissions_calculation: {
        formula: 'R = recorded result',
        method: 'Illustrative calculation rule',
        calculated_at: formatDateTime(calculationAt),
        values: [
          {
            reference: 'R',
            value: 123.519,
            unit: 'kg CO₂e',
            label: 'Prevented Emissions (CO\u2082e kg)',
          },
        ],
      },
    },
  };
}
