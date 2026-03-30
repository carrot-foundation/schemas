/**
 * Emitter for Credit Purchase Receipt example JSON.
 *
 * Produces a complete, AJV-valid Credit Purchase Receipt document using the
 * canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime, formatUnixMs } from '../shared.js';

/**
 * Emit a complete Credit Purchase Receipt example document.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 *
 * @returns {object} A valid Credit Purchase Receipt IPFS document
 */
export function emitCreditPurchaseReceiptExample() {
  const story = buildReferenceStory();

  const purchaseTokenId = story.purchaseReceipt.tokenId;
  const retirementTokenId = story.retirementReceipt.tokenId;
  const massIdTokenId = story.massID.tokenId;

  const purchasedAt = new Date('2025-02-03T12:45:30.000Z');
  const externalId = 'f1a2b3c4-d5e6-4789-9012-34567890abcd';
  const retirementExternalId = 'b2c3d4e5-f6a7-4c89-8a01-234567890abc';
  const massIdExternalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'CreditPurchaseReceipt',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
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
    external_url: `https://explore.carrot.eco/document/${externalId}`,
    audit_data_hash: 'PLACEHOLDER',
    viewer_reference: {
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
      integrity_hash:
        '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    },
    name: `Credit Purchase Receipt #${purchaseTokenId} \u2022 8.5 Credits Purchased`,
    short_name: `Purchase Receipt #${purchaseTokenId}`,
    description: `Receipt for purchasing 8.5 credits (${story.credit.symbol} and C-BIOW) across 3 certificates, with 3.0 credits retired immediately on behalf of Climate Action Corp. Credits delivered to EcoTech Solutions Inc.`,
    image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    background_color: '#2D5A27',
    external_links: [
      {
        label: 'View on Carrot Explorer',
        url: `https://explore.carrot.eco/document/${externalId}`,
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
        value: 'EcoTech Solutions Inc.',
      },
      {
        trait_type: 'Purchase Date',
        value: formatUnixMs(purchasedAt),
        display_type: 'date',
      },
      {
        trait_type: 'Retirement Date',
        value: formatUnixMs(purchasedAt),
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
        id: 'b5c6d7e8-f901-4a23-9b45-6789012cdef3',
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
        identity: {
          name: 'EcoTech Solutions Inc.',
          external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
          external_url:
            'https://explore.carrot.eco/participant/ecotech-solutions-inc-12345',
        },
      },
      collections: [
        {
          slug: story.collection.slug,
          name: story.collection.name,
          external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
          external_url: `https://explore.carrot.eco/collection/${story.collection.slug}`,
          ipfs_uri:
            'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
        },
        {
          slug: 'bold-brazil',
          name: 'BOLD Brazil',
          external_id: 'e710790f-5909-4a54-ab89-6a59819472ee',
          external_url: 'https://explore.carrot.eco/collection/bold-brazil',
          ipfs_uri:
            'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
        },
      ],
      credits: [
        {
          slug: story.credit.slug,
          symbol: story.credit.symbol,
          external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
          external_url:
            'https://explore.carrot.eco/credit/8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
          ipfs_uri:
            'ipfs://bafybeibwzifubdt5epaz43pj4gk7t2r4e6uah6vuvtbtmq5r2mwyrc6yha',
          smart_contract_address: '0xabcdef1234567890abcdef1234567890abcdef12',
        },
        {
          slug: 'biowaste',
          symbol: 'C-BIOW',
          external_id: 'e710790f-5909-4a54-ab89-6a59819472ee',
          external_url:
            'https://explore.carrot.eco/credit/9f3c4556-fg90-5ef8-9e06-8d925e6d9bg0',
          ipfs_uri:
            'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm',
          smart_contract_address: '0xfedcba0987654321fedcba0987654321fedcba09',
        },
      ],
      certificates: [
        {
          type: 'GasID',
          token_id: story.gasID.tokenId,
          total_amount: 10,
          credit_slug: story.credit.slug,
          external_id: 'd2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6',
          external_url:
            'https://explore.carrot.eco/document/d2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6',
          ipfs_uri:
            'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          collections: [
            {
              slug: story.collection.slug,
              purchased_amount: 3,
              retired_amount: 1.5,
            },
          ],
          mass_id: {
            token_id: massIdTokenId,
            external_id: massIdExternalId,
            external_url: `https://explore.carrot.eco/document/${massIdExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
        {
          type: 'RecycledID',
          token_id: story.recycledID.tokenId,
          total_amount: 6,
          credit_slug: 'biowaste',
          external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d489',
          external_url:
            'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d489',
          ipfs_uri:
            'ipfs://bafybeihhrm5vm5ye6wucyo2qwphlapb4ic5lfdn4e5ytw53hzfkzsbizae',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          collections: [
            {
              slug: story.collection.slug,
              purchased_amount: 2,
              retired_amount: 0.5,
            },
          ],
          mass_id: {
            token_id: massIdTokenId,
            external_id: massIdExternalId,
            external_url: `https://explore.carrot.eco/document/${massIdExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
        {
          type: 'RecycledID',
          token_id: '890',
          total_amount: 8,
          credit_slug: 'biowaste',
          external_id: '0f1e2d3c-4b5a-4d78-8c12-3456789abcde',
          external_url:
            'https://explore.carrot.eco/document/0f1e2d3c-4b5a-4d78-8c12-3456789abcde',
          ipfs_uri:
            'ipfs://bafybeihhrm5vm5ye6wucyo2qwphlapb4ic5lfdn4e5ytw53hzfkzsbizae',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          collections: [
            {
              slug: 'bold-brazil',
              purchased_amount: 3.5,
              retired_amount: 1,
            },
          ],
          mass_id: {
            token_id: massIdTokenId,
            external_id: massIdExternalId,
            external_url: `https://explore.carrot.eco/document/${massIdExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
      ],
      retirement_receipt: {
        token_id: retirementTokenId,
        external_id: retirementExternalId,
        external_url: `https://explore.carrot.eco/document/${retirementExternalId}`,
        ipfs_uri:
          'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      },
    },
  };
}
