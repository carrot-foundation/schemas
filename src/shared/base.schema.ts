import { z } from 'zod';
import {
  Keccak256HashSchema,
  SemanticVersionSchema,
  Sha256HashSchema,
  IsoTimestampSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  RecordSchemaTypeSchema,
  IpfsUriSchema,
  RecordRelationshipTypeSchema,
} from './definitions.schema';

const SchemaHashSchema = z
  .union([
    Keccak256HashSchema,
    z
      .string()
      .regex(
        /^0x[a-fA-F0-9]{64}$/,
        'Must be a Keccak256 hash as 0x-prefixed hex string',
      ),
  ])
  .meta({
    title: 'Schema Hash',
    description:
      'Keccak256 hash of the JSON Schema this record was validated against',
    examples: [
      'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
      '0xac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
    ],
  });

const SchemaInfoSchema = z
  .strictObject({
    hash: SchemaHashSchema,
    type: RecordSchemaTypeSchema.meta({
      title: 'Schema Type',
      description: 'Type/category of this schema',
    }),
    version: SemanticVersionSchema.meta({
      title: 'Schema Version',
      description: 'Version of the schema, using semantic versioning',
    }),
  })
  .meta({
    title: 'Schema Information',
  });

export type SchemaInfo = z.infer<typeof SchemaInfoSchema>;

const RecordRelationshipSchema = z
  .strictObject({
    target_uri: IpfsUriSchema.meta({
      title: 'Target IPFS URI',
      description: 'Target IPFS URI of the referenced record',
    }),
    type: RecordRelationshipTypeSchema.meta({
      title: 'Relationship Type',
      description: 'Type of relationship to the referenced record',
    }),
    description: z
      .string()
      .optional()
      .meta({
        title: 'Relationship Description',
        description: 'Human-readable description of the relationship',
        examples: [
          'This record supersedes the previous version',
          'Related carbon credit batch',
          'Source document for this verification',
          'Child record derived from this parent',
          'Updated version of original record',
        ],
      }),
  })
  .meta({
    title: 'Relationship',
    description: 'Relationship to another IPFS record',
  });

export type RecordRelationship = z.infer<typeof RecordRelationshipSchema>;

export const RecordEnvironmentSchema = z
  .strictObject({
    blockchain_network: z.enum(['mainnet', 'testnet']).meta({
      title: 'Blockchain Network',
      description: 'Blockchain Network Environment',
    }),
    deployment: z.enum(['production', 'development', 'testing']).meta({
      title: 'Deployment Environment',
      description: 'System environment where this record was generated',
    }),
    data_set_name: z.enum(['TEST', 'PROD']).meta({
      title: 'Data Set Name',
      description: 'Name of the data set for this record',
    }),
  })
  .meta({
    title: 'Environment',
    description: 'Environment information',
  });

export type RecordEnvironment = z.infer<typeof RecordEnvironmentSchema>;

export const BaseIpfsSchema = z
  .strictObject({
    $schema: z.url('Must be a valid URI').meta({
      title: 'JSON Schema URI',
      description: 'URI of the JSON Schema used to validate this record',
      example:
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/ipfs/shared/base/base.schema.json',
    }),
    schema: SchemaInfoSchema,
    created_at: IsoTimestampSchema.meta({
      title: 'Created At',
      description: 'ISO 8601 creation timestamp for this record',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'External ID',
      description: 'Off-chain reference ID (UUID from Carrot backend)',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'External URL',
      description: 'External URL of the content',
    }),
    original_content_hash: Sha256HashSchema.meta({
      title: 'Original Content Hash',
      description:
        'SHA-256 hash of the original JSON content including private data before schema validation',
    }),
    content_hash: Sha256HashSchema.meta({
      title: 'Content Hash',
      description:
        'SHA-256 hash of RFC 8785 canonicalized JSON after schema validation',
    }),
    relationships: z.array(RecordRelationshipSchema).optional().meta({
      title: 'Relationships',
      description: 'References to other IPFS records this record relates to',
    }),
    environment: RecordEnvironmentSchema.optional(),
    data: z.record(z.string(), z.unknown()).optional().meta({
      title: 'Custom Data',
      description: "Custom data block that includes the record's data",
    }),
  })
  .meta({
    title: 'Base IPFS Record',
    description:
      'Base fields for all Carrot IPFS records, providing common structure for any JSON content stored in IPFS',
  });

export type BaseIpfs = z.infer<typeof BaseIpfsSchema>;
