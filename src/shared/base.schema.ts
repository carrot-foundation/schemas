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
  .object({
    hash: keccak256Hash.describe(
      'Keccak256 hash of the JSON Schema this record was validated against',
    ),
    type: schemaType.describe('Type/category of this schema'),
    version: semanticVersion.describe(
      'Version of the schema, using semantic versioning',
    ),
  })
  .strict()
  .describe('Schema information');

const creator = z
  .object({
    name: z
      .string()
      .describe('Company or individual name that created this record'),
    id: uuid.describe('Unique identifier for the creator'),
  })
  .strict()
  .describe('Entity that created this record');

const relationship = z
  .object({
    target_cid: z
      .string()
      .regex(
        /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]+)$/,
        'Must be a valid IPFS Content Identifier (CID)',
      )
      .describe('IPFS Content Identifier (CID) of the referenced record'),
    type: z
      .enum([
        'collection',
        'credit',
        'audit',
        'update',
        'derivation',
        'reference',
      ])
      .describe('Type of relationship to the referenced record'),
    description: z
      .string()
      .optional()
      .describe('Human-readable description of the relationship'),
  })
  .strict();

const environment = z
  .object({
    blockchain_network: z
      .enum(['mainnet', 'testnet'])
      .describe('Blockchain Network Environment'),
    deployment: z
      .enum(['production', 'development', 'testing'])
      .describe('System environment where this record was generated'),
    data_set_name: z
      .enum(['TEST', 'PROD'])
      .describe('Name of the data set for this record'),
  })
  .strict()
  .describe('Environment information');

export const baseIpfsSchema = z
  .object({
    $schema: z
      .url('Must be a valid URI')
      .describe('URI of the JSON Schema used to validate this record')
      .refine(
        (url) =>
          url.includes('carrot-foundation/schemas') ||
          url.includes('carrot.eco'),
        'Schema URI should reference an official Carrot schema',
      ),

    schema: schemaInfo,

    created_at: isoTimestamp.describe(
      'ISO 8601 creation timestamp for this record',
    ),

    external_id: externalId.describe(
      'Off-chain reference ID (UUID from Carrot backend)',
    ),

    external_url: externalUrl.describe('External URL of the content'),

    original_content_hash: sha256Hash.describe(
      'SHA-256 hash of the original JSON content including private data before schema validation',
    ),
    content_hash: sha256Hash.describe(
      'SHA-256 hash of RFC 8785 canonicalized JSON after schema validation',
    ),
    creator: creator.optional(),

    relationships: z
      .array(relationship)
      .optional()
      .refine(
        (relationships) =>
          relationships === undefined || relationships.length <= 50,
        'Maximum 50 relationships allowed per record',
      )
      .describe('References to other IPFS records this record relates to'),

    environment: environment.optional(),

    data: z
      .record(z.string(), z.unknown())
      .optional()
      .describe("Custom data block that includes the record's data"),
  })
  .describe(
    'Base fields for all Carrot IPFS records, providing common structure for any JSON content stored in IPFS',
  )

  .refine((data) => {
    const schemaUrl = String(data.$schema).toLowerCase();
    const typeValue = data.schema.type;

    const rules = [
      { pattern: /(?:^|\/)mass-id-audit(?:\/|$)/i, type: 'MassID Audit' },
      { pattern: /(?:^|\/)recycled-id(?:\/|$)/i, type: 'RecycledID' },
      { pattern: /(?:^|\/)mass-id(?:\/|$)/i, type: 'MassID' },
      { pattern: /(?:^|\/)gas-id(?:\/|$)/i, type: 'GasID' },
    ];

    const matchedRule = rules.find((rule) => rule.pattern.test(schemaUrl));

    if (matchedRule) {
      return typeValue === matchedRule.type;
    }

    return true;
  }, 'Schema type must match the schema URL')

  .refine((data) => {
    const createdDate = new Date(data.created_at);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    return createdDate <= fiveMinutesFromNow;
  }, 'Creation timestamp cannot be in the future');

export type BaseIpfsSchema = z.infer<typeof baseIpfsSchema>;
export type SchemaType = z.infer<typeof schemaType>;
export type SchemaInfo = z.infer<typeof schemaInfo>;
export type Creator = z.infer<typeof creator>;
export type Relationship = z.infer<typeof relationship>;
export type Environment = z.infer<typeof environment>;
