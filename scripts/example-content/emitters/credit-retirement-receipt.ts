/**
 * Emitter for Credit Retirement Receipt example JSON.
 *
 * Produces a Credit Retirement Receipt document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import {
  exampleIpfsUri,
  formatDateTime,
  formatUnixMilliseconds,
} from '../shared.js';

/**
 * Emit a Credit Retirement Receipt example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitCreditRetirementReceiptExample(): Record<string, unknown> {
  const story = buildReferenceStory();

  const purchaseTokenId = story.purchaseReceipt.tokenId;
  const retirementTokenId = story.retirementReceipt.tokenId;
  const massIDTokenId = story.massID.tokenId;

  const retiredAt = new Date('2025-02-03T12:45:30.000Z');
  const externalId = '00000000-0000-4000-8000-100000000011';
  const purchaseExternalId = '00000000-0000-4000-8000-100000000019';
  const massIDExternalId = '00000000-0000-4000-8000-100000000009';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'CreditRetirementReceipt',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:credit-retirement-receipt'),
    },
    environment: { ...story.environment },
    blockchain: {
      token_id: retirementTokenId,
      smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      chain_id: 80002,
      network_name: 'Amoy',
    },
    created_at: formatDateTime(retiredAt),
    external_id: externalId,
    external_url: `https://registry.example.com/document/${externalId}`,
    viewer_reference: {
      ipfs_uri: exampleIpfsUri('viewer:build'),
    },
    name: `Credit Retirement Receipt #${retirementTokenId} \u2022 3.0 Credits Retired`,
    short_name: `Retirement Receipt #${retirementTokenId}`,
    description: `Permanent proof of credit retirement: 3.0 credits (${story.credit.symbol} and C-BIOW) retired by Example Buyer Ltd. on behalf of beneficiary Example Beneficiary Ltd., from 3 certificates across 2 collections.`,
    image: exampleIpfsUri('image:retirement-receipt'),
    background_color: '#1B4332',
    external_links: [
      {
        label: 'View on Carrot Registry',
        url: `https://registry.example.com/document/${externalId}`,
        description: 'Complete retirement details and audit trail',
      },
    ],
    attributes: [
      {
        trait_type: story.credit.symbol,
        value: 1.5,
        display_type: 'number',
      },
      {
        trait_type: 'C-BIOW',
        value: 1.5,
        display_type: 'number',
      },
      {
        trait_type: 'Total Credits Retired',
        value: 3,
        display_type: 'number',
      },
      {
        trait_type: 'Beneficiary',
        value: 'Example Beneficiary Ltd.',
      },
      {
        trait_type: 'Retirement Date',
        value: formatUnixMilliseconds(retiredAt),
        display_type: 'date',
      },
      {
        trait_type: 'Certificates Retired',
        value: 3,
        display_type: 'number',
      },
      {
        trait_type: 'Purchase Date',
        value: formatUnixMilliseconds(retiredAt),
        display_type: 'date',
      },
      {
        trait_type: 'Purchase Receipt',
        value: `#${purchaseTokenId}`,
      },
    ],
    data: {
      summary: {
        total_credits_retired: 3,
        total_certificates: 3,
        retired_at: formatDateTime(retiredAt),
      },
      beneficiary: {
        id_hash:
          '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
        identity: {
          name: 'Example Beneficiary Ltd.',
          external_id: '00000000-0000-4000-8000-100000000017',
          external_url:
            'https://registry.example.com/participant/example-beneficiary',
        },
      },
      credit_holder: {
        id_hash:
          '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      collections: [
        {
          slug: story.collection.slug,
          external_id: '00000000-0000-4000-8000-100000000006',
          name: story.collection.name,
          external_url: `https://registry.example.com/collection/${story.collection.slug}`,
          ipfs_uri: exampleIpfsUri('doc:collection-one'),
        },
        {
          slug: 'example-collection-two',
          external_id: '00000000-0000-4000-8000-400000000002',
          name: 'Example Collection Two',
          external_url:
            'https://registry.example.com/collection/example-collection-two',
          ipfs_uri: exampleIpfsUri('doc:collection-two'),
        },
      ],
      credits: [
        {
          slug: story.credit.slug,
          symbol: story.credit.symbol,
          external_id: '00000000-0000-4000-8000-100000000016',
          external_url:
            'https://registry.example.com/credit/00000000-0000-4000-8000-100000000016',
          ipfs_uri: exampleIpfsUri('doc:credit-carbon'),
          smart_contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
          chain_id: 80002,
        },
        {
          slug: 'biowaste',
          symbol: 'C-BIOW',
          external_id: '00000000-0000-4000-8000-100000000018',
          external_url:
            'https://registry.example.com/credit/00000000-0000-4000-8000-100000000018',
          ipfs_uri: exampleIpfsUri('doc:credit-biowaste'),
          smart_contract_address: '0xfedcba0987654321fedcba0987654321fedcba09',
          chain_id: 80002,
        },
      ],
      certificates: [
        {
          token_id: '700001',
          type: 'GasID',
          external_id: '00000000-0000-4000-8000-200000000001',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000001',
          ipfs_uri: exampleIpfsUri('doc:gas-id:receipt-1'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          total_amount: 10,
          collections: [
            {
              slug: story.collection.slug,
              retired_amount: 1.5,
            },
          ],
          credits_retired: [
            {
              credit_symbol: story.credit.symbol,
              credit_slug: story.credit.slug,
              amount: 1.5,
              external_id: '00000000-0000-4000-8000-700000000001',
              external_url:
                'https://registry.example.com/credit-retirement/credit-retired-456-c-carb',
            },
          ],
          mass_id: {
            external_id: massIDExternalId,
            token_id: massIDTokenId,
            external_url: `https://registry.example.com/document/${massIDExternalId}`,
            ipfs_uri: exampleIpfsUri('doc:mass-id'),
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
            chain_id: 80002,
          },
        },
        {
          token_id: '700002',
          type: 'RecycledID',
          external_id: '00000000-0000-4000-8000-200000000002',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000002',
          ipfs_uri: exampleIpfsUri('doc:recycled-id:receipt-1'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          total_amount: 6,
          collections: [
            {
              slug: story.collection.slug,
              retired_amount: 0.5,
            },
          ],
          credits_retired: [
            {
              credit_symbol: 'C-BIOW',
              credit_slug: 'biowaste',
              amount: 0.5,
              external_id: '00000000-0000-4000-8000-700000000002',
              external_url:
                'https://registry.example.com/credit-retirement/credit-retired-789-c-biow',
            },
          ],
          mass_id: {
            token_id: massIDTokenId,
            external_id: massIDExternalId,
            external_url: `https://registry.example.com/document/${massIDExternalId}`,
            ipfs_uri: exampleIpfsUri('doc:mass-id'),
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
            chain_id: 80002,
          },
        },
        {
          token_id: '700003',
          type: 'RecycledID',
          external_id: '00000000-0000-4000-8000-200000000003',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000003',
          ipfs_uri: exampleIpfsUri('doc:recycled-id:receipt-2'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          total_amount: 8,
          collections: [
            {
              slug: 'example-collection-two',
              retired_amount: 1,
            },
          ],
          credits_retired: [
            {
              credit_symbol: 'C-BIOW',
              credit_slug: 'biowaste',
              amount: 1,
              external_id: '00000000-0000-4000-8000-700000000003',
              external_url:
                'https://registry.example.com/credit-retirement/credit-retired-890-c-biow',
            },
          ],
          mass_id: {
            token_id: massIDTokenId,
            external_id: massIDExternalId,
            external_url: `https://registry.example.com/document/${massIDExternalId}`,
            ipfs_uri: exampleIpfsUri('doc:mass-id'),
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
            chain_id: 80002,
          },
        },
      ],
      purchase_receipt: {
        token_id: purchaseTokenId,
        external_id: purchaseExternalId,
        external_url: `https://registry.example.com/document/${purchaseExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:purchase-receipt'),
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
        chain_id: 80002,
      },
    },
    audit_data_hash: 'PLACEHOLDER',
  };
}
