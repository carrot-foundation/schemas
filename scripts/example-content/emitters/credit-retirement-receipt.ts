/**
 * Emitter for Credit Retirement Receipt example JSON.
 *
 * Produces a Credit Retirement Receipt document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime, formatUnixMs } from '../shared.js';

/**
 * Emit a Credit Retirement Receipt example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version,
 * audit_data_hash) use placeholders that update-examples.js will overwrite.
 */
export function emitCreditRetirementReceiptExample() {
  const story = buildReferenceStory();

  const purchaseTokenId = story.purchaseReceipt.tokenId;
  const retirementTokenId = story.retirementReceipt.tokenId;
  const massIDTokenId = story.massID.tokenId;

  const retiredAt = new Date('2025-02-03T12:45:30.000Z');
  const externalId = 'b2c3d4e5-f6a7-4c89-8a01-234567890abc';
  const purchaseExternalId = 'f1a2b3c4-d5e6-4789-9012-34567890abcd';
  const massIDExternalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'CreditRetirementReceipt',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
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
    external_url: `https://explore.carrot.eco/document/${externalId}`,
    viewer_reference: {
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
      integrity_hash:
        '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    },
    name: `Credit Retirement Receipt #${retirementTokenId} \u2022 3.0 Credits Retired`,
    short_name: `Retirement Receipt #${retirementTokenId}`,
    description: `Permanent proof of credit retirement: 3.0 credits (${story.credit.symbol} and C-BIOW) retired by EcoTech Solutions Inc. on behalf of beneficiary Climate Action Corp, from 3 certificates across 2 collections.`,
    image: 'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    background_color: '#1B4332',
    external_links: [
      {
        label: 'View on Carrot Explorer',
        url: `https://explore.carrot.eco/document/${externalId}`,
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
        value: 'Climate Action Corp',
      },
      {
        trait_type: 'Retirement Date',
        value: formatUnixMs(retiredAt),
        display_type: 'date',
      },
      {
        trait_type: 'Certificates Retired',
        value: 3,
        display_type: 'number',
      },
      {
        trait_type: 'Purchase Date',
        value: formatUnixMs(retiredAt),
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
        beneficiary_id: 'c3d4e5f6-a7b8-4d12-8b56-789012cdef01',
        identity: {
          name: 'Climate Action Corp',
          external_id: 'd4e5f6a7-b8c9-4e23-8c67-890123def012',
          external_url:
            'https://explore.carrot.eco/participant/climate-action-corp-78901',
        },
      },
      credit_holder: {
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      collections: [
        {
          slug: story.collection.slug,
          external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
          name: story.collection.name,
          external_url: `https://explore.carrot.eco/collection/${story.collection.slug}`,
          ipfs_uri:
            'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
        },
        {
          slug: 'bold-brazil',
          external_id: 'e710790f-5909-4a54-ab89-6a59819472ee',
          name: 'BOLD Brazil',
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
            'https://explore.carrot.eco/credit/e710790f-5909-4a54-ab89-6a59819472ee',
          ipfs_uri:
            'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm',
          smart_contract_address: '0xfedcba0987654321fedcba0987654321fedcba09',
        },
      ],
      certificates: [
        {
          token_id: story.gasID.tokenId,
          type: 'GasID',
          external_id: 'd2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6',
          external_url:
            'https://explore.carrot.eco/document/d2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6',
          ipfs_uri:
            'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
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
              external_id: '8f2c3445-ef89-4de7-8d95-7c814d5c8af9',
              external_url:
                'https://explore.carrot.eco/credit-retirement/credit-retired-456-c-carb',
            },
          ],
          mass_id: {
            external_id: massIDExternalId,
            token_id: massIDTokenId,
            external_url: `https://explore.carrot.eco/document/${massIDExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
        {
          token_id: story.recycledID.tokenId,
          type: 'RecycledID',
          external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d489',
          external_url:
            'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d489',
          ipfs_uri:
            'ipfs://bafybeihhrm5vm5ye6wucyo2qwphlapb4ic5lfdn4e5ytw53hzfkzsbizae',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
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
              external_id: 'a1b2c3d4-e5f6-4a90-8b34-567890abcedf',
              external_url:
                'https://explore.carrot.eco/credit-retirement/credit-retired-789-c-biow',
            },
          ],
          mass_id: {
            token_id: massIDTokenId,
            external_id: massIDExternalId,
            external_url: `https://explore.carrot.eco/document/${massIDExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
        {
          token_id: '890',
          type: 'RecycledID',
          external_id: '0f1e2d3c-4b5a-4d78-8c12-3456789abcde',
          external_url:
            'https://explore.carrot.eco/document/0f1e2d3c-4b5a-4d78-8c12-3456789abcde',
          ipfs_uri:
            'ipfs://bafybeihhrm5vm5ye6wucyo2qwphlapb4ic5lfdn4e5ytw53hzfkzsbizae',
          smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
          total_amount: 8,
          collections: [
            {
              slug: 'bold-brazil',
              retired_amount: 1,
            },
          ],
          credits_retired: [
            {
              credit_symbol: 'C-BIOW',
              credit_slug: 'biowaste',
              amount: 1,
              external_id: 'b2c3d4e5-f6a7-4b01-8c45-678901bcdef1',
              external_url:
                'https://explore.carrot.eco/credit-retirement/credit-retired-890-c-biow',
            },
          ],
          mass_id: {
            token_id: massIDTokenId,
            external_id: massIDExternalId,
            external_url: `https://explore.carrot.eco/document/${massIDExternalId}`,
            ipfs_uri:
              'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
            smart_contract_address:
              '0x1234567890abcdef1234567890abcdef12345678',
          },
        },
      ],
      purchase_receipt: {
        token_id: purchaseTokenId,
        external_id: purchaseExternalId,
        external_url: `https://explore.carrot.eco/document/${purchaseExternalId}`,
        ipfs_uri:
          'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      },
    },
    audit_data_hash: 'PLACEHOLDER',
  };
}
