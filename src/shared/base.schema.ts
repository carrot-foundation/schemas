import { z } from 'zod';
import {
  keccak256Hash,
  semanticVersion,
  sha256Hash,
  isoTimestamp,
  externalId,
  externalUrl,
  uuid,
  schemaType,
} from './definitions.schema.js';

const schemaInfo = z
  .strictObject({
    hash: keccak256Hash
      .describe(
        'Keccak256 hash of the JSON Schema this record was validated against',
      )
      .meta({
        title: 'Schema Hash',
        examples: [
          'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
          'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
        ],
      }),
    type: schemaType.describe('Type/category of this schema').meta({
      title: 'Schema Type',
      examples: ['MassID', 'RecycledID', 'GasID'],
    }),
    version: semanticVersion
      .describe('Version of the schema, using semantic versioning')
      .meta({
        title: 'Schema Version',
        examples: ['0.1.0', '1.0.0', '2.1.3'],
      }),
  })
  .describe('Schema information')
  .meta({
    title: 'Schema Information',
    examples: [
      {
        hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
        type: 'MassID',
        version: '0.1.0',
      },
    ],
  });

const creator = z
  .strictObject({
    name: z
      .string()
      .describe('Company or individual name that created this record')
      .meta({
        title: 'Creator Name',
        examples: ['Carrot Foundation', 'Eco Solutions Ltd', 'Green Tech Corp'],
      }),
    id: uuid.describe('Unique identifier for the creator').meta({
      title: 'Creator ID',
      examples: [
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ],
    }),
  })
  .describe('Entity that created this record')
  .meta({
    title: 'Creator',
    examples: [
      {
        name: 'Carrot Foundation',
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
    ],
  });

const relationship = z
  .strictObject({
    target_cid: z
      .string()
      .regex(
        /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]+)$/,
        'Must be a valid IPFS Content Identifier (CID)',
      )
      .describe('IPFS Content Identifier (CID) of the referenced record')
      .meta({
        title: 'Target CID',
        examples: [
          'QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
          'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
        ],
      }),
    type: z
      .enum([
        'collection',
        'credit',
        'audit',
        'update',
        'derivation',
        'reference',
      ])
      .describe('Type of relationship to the referenced record')
      .meta({
        title: 'Relationship Type',
        examples: ['collection', 'audit', 'reference'],
      }),
    description: z
      .string()
      .optional()
      .describe('Human-readable description of the relationship')
      .meta({
        title: 'Relationship Description',
        examples: [
          'Related audit report for this MassID',
          'Collection that includes this record',
          'Reference documentation',
        ],
      }),
  })
  .meta({
    title: 'Relationship',
    examples: [
      {
        target_cid: 'QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
        type: 'audit',
        description: 'Related audit report for this MassID',
      },
    ],
  });

const environment = z
  .strictObject({
    blockchain_network: z
      .enum(['mainnet', 'testnet'])
      .describe('Blockchain Network Environment')
      .meta({
        title: 'Blockchain Network',
        examples: ['testnet', 'mainnet'],
      }),
    deployment: z
      .enum(['production', 'development', 'testing'])
      .describe('System environment where this record was generated')
      .meta({
        title: 'Deployment Environment',
        examples: ['development', 'production', 'testing'],
      }),
    data_set_name: z
      .enum(['TEST', 'PROD'])
      .describe('Name of the data set for this record')
      .meta({
        title: 'Data Set Name',
        examples: ['TEST', 'PROD'],
      }),
  })
  .describe('Environment information')
  .meta({
    title: 'Environment',
    examples: [
      {
        blockchain_network: 'testnet',
        deployment: 'development',
        data_set_name: 'TEST',
      },
    ],
  });

export const baseIpfsSchema = z
  .strictObject({
    $schema: z
      .url('Must be a valid URI')
      .describe('URI of the JSON Schema used to validate this record')
      .meta({
        title: 'JSON Schema URI',
        examples: [
          'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
          'https://schemas.carrot.eco/mass-id/v1.0.0/schema.json',
        ],
      }),

    schema: schemaInfo,

    created_at: isoTimestamp
      .describe('ISO 8601 creation timestamp for this record')
      .meta({
        title: 'Created At',
        examples: ['2024-12-05T11:02:47.000Z', '2024-03-15T09:30:00.000Z'],
      }),

    external_id: externalId
      .describe('Off-chain reference ID (UUID from Carrot backend)')
      .meta({
        title: 'External ID',
        examples: [
          'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
          'b2c4e6f8-a1b3-4c5d-9e8f-123456789abc',
        ],
      }),

    external_url: externalUrl.describe('External URL of the content').meta({
      title: 'External URL',
      examples: [
        'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        'https://app.carrot.eco/mass-id/123',
      ],
    }),

    original_content_hash: sha256Hash
      .describe(
        'SHA-256 hash of the original JSON content including private data before schema validation',
      )
      .meta({
        title: 'Original Content Hash',
        examples: [
          '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
          'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        ],
      }),
    content_hash: sha256Hash
      .describe(
        'SHA-256 hash of RFC 8785 canonicalized JSON after schema validation',
      )
      .meta({
        title: 'Content Hash',
        examples: [
          '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
          'f1e2d3c4b5a6978123456789012345678901bcdef234567890abcdef1234567',
        ],
      }),
    creator: creator.optional(),

    relationships: z
      .array(relationship)
      .optional()
      .describe('References to other IPFS records this record relates to')
      .meta({
        title: 'Relationships',
        examples: [
          [
            {
              target_cid: 'QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
              type: 'audit',
              description: 'Related audit report for this MassID',
            },
          ],
        ],
      }),

    environment: environment.optional(),

    data: z
      .record(z.string(), z.unknown())
      .optional()
      .describe("Custom data block that includes the record's data")
      .meta({
        title: 'Custom Data',
        examples: [
          {
            waste_classification: {
              primary_type: 'Organic',
              subtype: 'Food, Food Waste and Beverages',
              net_weight: 3000,
            },
          },
        ],
      }),
  })
  .describe(
    'Base fields for all Carrot IPFS records, providing common structure for any JSON content stored in IPFS',
  )
  .meta({
    title: 'Base IPFS Record',
    examples: [
      {
        $schema:
          'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
        schema: {
          hash: 'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
          type: 'MassID',
          version: '0.1.0',
        },
        created_at: '2024-12-05T11:02:47.000Z',
        external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        external_url:
          'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
        original_content_hash:
          '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
        content_hash:
          '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
        environment: {
          blockchain_network: 'testnet',
          deployment: 'development',
          data_set_name: 'TEST',
        },
      },
    ],
  });

export type BaseIpfsSchema = z.infer<typeof baseIpfsSchema>;
export type SchemaType = z.infer<typeof schemaType>;
export type SchemaInfo = z.infer<typeof schemaInfo>;
export type Creator = z.infer<typeof creator>;
export type Relationship = z.infer<typeof relationship>;
export type Environment = z.infer<typeof environment>;
