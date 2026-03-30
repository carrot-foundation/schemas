/**
 * Emitter for GasID example JSON.
 *
 * Produces a GasID document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime, formatUnixMilliseconds } from '../shared.js';

/**
 * Emit a GasID example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitGasIDExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const recyclingAt = new Date('2024-12-08T11:32:47.000Z');

  const tokenId = story.gasID.tokenId;
  const massIDTokenId = story.massID.tokenId;
  const externalId = 'd2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6';
  const massIDExternalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';
  const auditExternalId = '80011d61-fe40-4aa2-9031-4f2aafad5d42';
  const methodologyExternalId = '8375027a-a96f-446d-a8cb-c3ee92aea604';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'GasID',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    blockchain: {
      token_id: tokenId,
      smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      chain_id: 80002,
      network_name: 'Amoy',
    },
    created_at: formatDateTime(recyclingAt),
    external_id: externalId,
    external_url: `https://explore.carrot.eco/document/${externalId}`,
    audit_data_hash: 'PLACEHOLDER',
    viewer_reference: {
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
      integrity_hash:
        '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    },
    name: `GasID #${tokenId} \u2022 BOLD Carbon (CH\u2084) \u2022 0.12t CO\u2082e`,
    short_name: `GasID #${tokenId}`,
    description: `This GasID certifies 0.12 metric tons of CO\u2082e emissions prevented through BOLD Carbon (CH\u2084) methodology composting of 3.25 metric tons of organic waste from Bras\u00edlia, Brazil.`,
    image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    background_color: '#1B4332',
    external_links: [
      {
        label: 'Carrot Explorer',
        url: `https://explore.carrot.eco/document/${externalId}`,
        description: 'Complete GasID details and audit trail',
      },
      {
        label: 'Carrot White Paper',
        url: 'https://whitepaper.carrot.eco/',
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
        value: formatUnixMilliseconds(recyclingAt),
        display_type: 'date',
      },
    ],
    data: {
      summary: {
        gas_type: 'Methane (CH\u2084)',
        credit_type: 'Carbon (CH\u2084)',
        credit_amount: 0.123519,
        prevented_co2e_kg: 123.519,
        recycling_date: formatDateTime(recyclingAt),
        issued_at: formatDateTime(recyclingAt),
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
        external_url: `https://explore.carrot.eco/document/${methodologyExternalId}`,
        ipfs_uri:
          'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
      },
      audit: {
        result: 'PASSED',
        rules_executed: 21,
        completed_at: formatDateTime(recyclingAt),
        external_id: auditExternalId,
        external_url: `https://explore.carrot.eco/document/${auditExternalId}`,
        ipfs_uri:
          'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
      },
      mass_id: {
        token_id: massIDTokenId,
        external_id: massIDExternalId,
        external_url: `https://explore.carrot.eco/document/${massIDExternalId}`,
        ipfs_uri:
          'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
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
        formula: 'W * B - W * E',
        method: 'UNFCCC AMS-III.F',
        calculated_at: formatDateTime(recyclingAt),
        values: [
          {
            reference: 'E',
            value: 0.029,
            label: 'Exceeding Emission Coefficient',
          },
          {
            reference: 'B',
            value: 0.067,
            label:
              'Prevented Emissions by Waste Subtype and Emissions Baseline Per Ton',
          },
          {
            reference: 'W',
            value: 3250.5,
            label: 'Waste Weight',
          },
          {
            reference: 'R',
            value: 123.519,
            label: 'Prevented Emissions (CO\u2082e kg)',
          },
        ],
      },
    },
  };
}
