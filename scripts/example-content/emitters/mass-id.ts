/**
 * Emitter for MassID example JSON.
 *
 * Produces a MassID document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime, formatUnixMilliseconds } from '../shared.js';

/**
 * Emit a MassID example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitMassIDExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const createdAt = new Date('2024-12-05T11:02:47.000Z');
  const weighingAt = new Date('2024-12-05T13:02:47.000Z');
  const dropOffAt = new Date('2024-12-05T14:02:47.000Z');
  const sortingAt = new Date('2024-12-05T15:02:47.000Z');
  const recyclingAt = new Date('2024-12-08T11:32:47.000Z');

  const externalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';
  const tokenId = story.massID.tokenId;

  const participantHashes = {
    wasteGenerator:
      'a1b2c3d4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcd',
    processorRecycler:
      'b2c3d4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcdef',
    networkIntegrator:
      'd4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcdefabcd',
    hauler: 'f6789012345678901234567890abcdefabcdefabcdefabcdefabcdefabcdefab',
  };

  const locationHashes = {
    pickup: '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    processingFacility:
      '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
    networkIntegrator:
      'c3d4e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcdefab',
    hauler: 'e5f6789012345678901234567890abcdefabcdefabcdefabcdefabcdefabcdef',
  };

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'MassID',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    blockchain: {
      token_id: tokenId,
      smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      chain_id: 80002,
      network_name: 'Amoy',
    },
    viewer_reference: {
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
      integrity_hash:
        '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    },
    created_at: formatDateTime(createdAt),
    external_id: externalId,
    external_url: `https://explore.carrot.eco/document/${externalId}`,
    name: `MassID #${tokenId} \u2022 Organic \u2022 3.25t`,
    short_name: `MassID #${tokenId}`,
    description: `This MassID represents 3.25 metric tons of organic food waste from Bras\u00edlia, Brazil, tracked through complete chain of custody from pick-up to composting.`,
    image: 'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
    animation_url:
      'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    background_color: '#2D5A27',
    external_links: [
      {
        label: 'Carrot Explorer',
        url: `https://explore.carrot.eco/document/${externalId}`,
        description: 'Complete chain of custody and audit trail',
      },
      {
        label: 'Carrot White Paper',
        url: 'https://whitepaper.carrot.eco',
        description: 'Carrot Foundation technical white paper',
      },
    ],
    attributes: [
      { trait_type: 'Waste Type', value: 'Organic' },
      {
        trait_type: 'Waste Subtype',
        value: 'Food, Food Waste and Beverages',
      },
      { trait_type: 'Weight (kg)', value: 3250.5, display_type: 'number' },
      { trait_type: 'Origin City', value: 'Bras\u00edlia' },
      { trait_type: 'Origin Country Subdivision', value: 'BR-DF' },
      { trait_type: 'Pick-up Vehicle Type', value: 'Truck' },
      { trait_type: 'Recycling Method', value: 'Composting' },
      { trait_type: 'Local Waste Classification ID', value: '04 02 20' },
      { trait_type: 'Recycling Manifest Number', value: '2353' },
      { trait_type: 'Transport Manifest Number', value: '4126' },
      { trait_type: 'Weighing Capture Method', value: 'Digital' },
      {
        trait_type: 'Scale Type',
        value: 'Weighbridge (Truck Scale)',
      },
      {
        trait_type: 'Pick-up Date',
        value: formatUnixMilliseconds(createdAt),
        display_type: 'date',
      },
      {
        trait_type: 'Drop-off Date',
        value: formatUnixMilliseconds(dropOffAt),
        display_type: 'date',
      },
      {
        trait_type: 'Recycling Date',
        value: formatUnixMilliseconds(recyclingAt),
        display_type: 'date',
      },
    ],
    audit_data_hash: 'PLACEHOLDER',
    data: {
      waste_properties: {
        type: 'Organic',
        subtype: 'Food, Food Waste and Beverages',
        local_classification: {
          code: '04 02 20',
          system: 'Ibama',
        },
        weight_kg: 3250.5,
      },
      locations: [
        {
          id_hash: locationHashes.pickup,
          city: 'Bras\u00edlia',
          subdivision_code: 'BR-DF',
          country_code: 'BR',
          coordinates: { latitude: -15.8, longitude: -48.1 },
          responsible_participant_id_hash: participantHashes.wasteGenerator,
        },
        {
          id_hash: locationHashes.processingFacility,
          city: 'Bras\u00edlia',
          subdivision_code: 'BR-DF',
          country_code: 'BR',
          coordinates: { latitude: -15.8, longitude: -47.6 },
          responsible_participant_id_hash: participantHashes.processorRecycler,
        },
        {
          id_hash: locationHashes.networkIntegrator,
          city: 'S\u00e3o Paulo',
          subdivision_code: 'BR-SP',
          country_code: 'BR',
          coordinates: { latitude: -23.5, longitude: -46.6 },
          responsible_participant_id_hash: participantHashes.networkIntegrator,
        },
        {
          id_hash: locationHashes.hauler,
          city: 'Planaltina',
          subdivision_code: 'BR-GO',
          country_code: 'BR',
          coordinates: { latitude: -15.6, longitude: -47.7 },
          responsible_participant_id_hash: participantHashes.hauler,
        },
      ],
      participants: [
        {
          id_hash: participantHashes.wasteGenerator,
          roles: ['Waste Generator'],
        },
        {
          id_hash: participantHashes.processorRecycler,
          roles: ['Processor', 'Recycler'],
        },
        {
          id_hash: participantHashes.networkIntegrator,
          roles: ['Network Integrator'],
        },
        {
          id_hash: participantHashes.hauler,
          roles: ['Hauler'],
        },
      ],
      events: [
        {
          event_id: '8f799606-4ed5-49ce-8310-83b0c56ac01e',
          event_name: 'Pick-up',
          timestamp: formatDateTime(createdAt),
          participant_id_hash: participantHashes.wasteGenerator,
          location_id_hash: locationHashes.pickup,
          data: {
            vehicle_type: 'Truck',
            weight_kg: 3250.5,
          },
        },
        {
          event_id: '591eb414-a678-486d-982c-3c25f3cb52de',
          event_name: 'Weighing',
          timestamp: formatDateTime(weighingAt),
          participant_id_hash: participantHashes.processorRecycler,
          location_id_hash: locationHashes.processingFacility,
          data: {
            weighing_capture_method: 'Digital',
            scale_type: 'Weighbridge (Truck Scale)',
            container_type: 'Truck',
            vehicle_type: 'Truck',
            container_capacity_kg: 12000,
            gross_weight_kg: 6750.5,
            tare_kg: 3500,
          },
        },
        {
          event_id: '5d4b0723-b3a6-4659-8d80-d74f5e842af7',
          event_name: 'Drop-off',
          timestamp: formatDateTime(dropOffAt),
          participant_id_hash: participantHashes.processorRecycler,
          location_id_hash: locationHashes.processingFacility,
        },
        {
          event_id: 'ca509646-e35a-47b5-aff7-39595125effe',
          event_name: 'Sorting',
          timestamp: formatDateTime(sortingAt),
          participant_id_hash: participantHashes.processorRecycler,
          location_id_hash: locationHashes.processingFacility,
          data: {
            initial_weight_kg: 3250.5,
            deducted_weight_kg: 125.25,
          },
        },
        {
          event_id: 'b544695f-c3ba-4b97-9b24-c13dd32e4db8',
          event_name: 'Recycling',
          timestamp: formatDateTime(recyclingAt),
          participant_id_hash: participantHashes.processorRecycler,
          location_id_hash: locationHashes.processingFacility,
        },
      ],
      attachments: [
        {
          event_id: '5d4b0723-b3a6-4659-8d80-d74f5e842af7',
          type: 'Transport Manifest',
          document_number: '4126',
          issued_at: formatDateTime(dropOffAt),
        },
        {
          event_id: 'b544695f-c3ba-4b97-9b24-c13dd32e4db8',
          type: 'Recycling Manifest',
          document_number: '2353',
          issued_at: formatDateTime(recyclingAt),
        },
      ],
    },
  };
}
