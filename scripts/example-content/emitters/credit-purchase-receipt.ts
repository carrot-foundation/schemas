/**
 * Emitter for Credit Purchase Receipt example JSON.
 *
 * Produces a Credit Purchase Receipt document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import {
  exampleIpfsUri,
  formatDateTime,
  formatUnixMilliseconds,
} from '../shared.js';

/**
 * Emit a Credit Purchase Receipt example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitCreditPurchaseReceiptExample(): Record<string, unknown> {
  const story = buildReferenceStory();

  const purchaseTokenId = story.purchaseReceipt.tokenId;
  const retirementTokenId = story.retirementReceipt.tokenId;
  const massIDTokenId = story.massID.tokenId;

  const purchasedAt = new Date('2025-02-03T12:45:30.000Z');
  const externalId = '00000000-0000-4000-8000-100000000019';
  const massIDExternalId = '00000000-0000-4000-8000-100000000009';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'CreditPurchaseReceipt',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:credit-purchase-receipt'),
    },
    environment: { ...story.environment },
    blockchain: {
      token_id: purchaseTokenId,
      smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      chain_id: 80002,
      network_name: 'Amoy',
    },
    created_at: formatDateTime(purchasedAt),
    external_id: externalId,
    external_url: `https://registry.example.com/document/${externalId}`,
    audit_data_hash: 'PLACEHOLDER',
    viewer_reference: {
      ipfs_uri: exampleIpfsUri('viewer:build'),
    },
    name: `Credit Purchase Receipt #${purchaseTokenId} \u2022 8.5 Credits Purchased`,
    short_name: `Purchase Receipt #${purchaseTokenId}`,
    description: `Receipt for purchasing 8.5 credits (${story.credit.symbol} and C-BIOW) across 3 certificates, with 3.0 credits retired immediately on behalf of Example Beneficiary Ltd.. Credits delivered to Example Buyer Ltd.`,
    image: exampleIpfsUri('image:purchase-receipt'),
    background_color: '#2D5A27',
    external_links: [
      {
        label: 'View on Carrot Registry',
        url: `https://registry.example.com/document/${externalId}`,
        description: 'Complete purchase details and audit trail',
      },
    ],
    attributes: [
      {
        trait_type: story.credit.symbol,
        value: 3,
        display_type: 'number',
      },
      {
        trait_type: 'C-BIOW',
        value: 5.5,
        display_type: 'number',
      },
      {
        trait_type: 'Total Credits Purchased',
        value: 8.5,
        display_type: 'number',
      },
      {
        trait_type: 'Total Amount (USDC)',
        value: 710.59,
        display_type: 'number',
      },
      {
        trait_type: 'Certificates Purchased',
        value: 3,
        display_type: 'number',
      },
      {
        trait_type: 'Buyer',
        value: 'Example Buyer Ltd.',
      },
      {
        trait_type: 'Purchase Date',
        value: formatUnixMilliseconds(purchasedAt),
        display_type: 'date',
      },
      {
        trait_type: 'Retirement Date',
        value: formatUnixMilliseconds(purchasedAt),
        display_type: 'date',
      },
      {
        trait_type: 'Retirement Receipt',
        value: `#${retirementTokenId}`,
      },
    ],
    data: {
      summary: {
        total_amount_usdc: 710.59,
        total_credits: 8.5,
        total_certificates: 3,
        purchased_at: formatDateTime(purchasedAt),
      },
      buyer: {
        id_hash:
          '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
        identity: {
          name: 'Example Buyer Ltd.',
          external_id: '00000000-0000-4000-8000-600000000001',
          external_url:
            'https://registry.example.com/participant/example-buyer',
        },
      },
      collections: [
        {
          slug: story.collection.slug,
          name: story.collection.name,
          external_id: '00000000-0000-4000-8000-100000000006',
          external_url: `https://registry.example.com/collection/${story.collection.slug}`,
          ipfs_uri: exampleIpfsUri('doc:collection-one'),
        },
        {
          slug: 'example-collection-two',
          name: 'Example Collection Two',
          external_id: '00000000-0000-4000-8000-400000000002',
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
          type: 'GasID',
          token_id: '700001',
          total_amount: 10,
          purchased_amount: 3,
          credit_slug: story.credit.slug,
          external_id: '00000000-0000-4000-8000-200000000001',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000001',
          ipfs_uri: exampleIpfsUri('doc:gas-id:receipt-1'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          collections: [
            {
              slug: story.collection.slug,
              purchased_amount: 3,
              retired_amount: 1.5,
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
          type: 'RecycledID',
          token_id: '700002',
          total_amount: 6,
          purchased_amount: 2,
          credit_slug: 'biowaste',
          external_id: '00000000-0000-4000-8000-200000000002',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000002',
          ipfs_uri: exampleIpfsUri('doc:recycled-id:receipt-1'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          collections: [
            {
              slug: story.collection.slug,
              purchased_amount: 2,
              retired_amount: 0.5,
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
          type: 'RecycledID',
          token_id: '700003',
          total_amount: 8,
          purchased_amount: 3.5,
          credit_slug: 'biowaste',
          external_id: '00000000-0000-4000-8000-200000000003',
          external_url:
            'https://registry.example.com/document/00000000-0000-4000-8000-200000000003',
          ipfs_uri: exampleIpfsUri('doc:recycled-id:receipt-2'),
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          chain_id: 80002,
          collections: [
            {
              slug: 'example-collection-two',
              purchased_amount: 3.5,
              retired_amount: 1,
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
      retirement_receipt: {
        token_id: retirementTokenId,
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
        chain_id: 80002,
      },
    },
  };
}
