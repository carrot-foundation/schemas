import { z } from 'zod';
import {
  Keccak256HashSchema,
  SemanticVersionSchema,
  Sha256HashSchema,
  IsoTimestampSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  UuidSchema,
  SchemaTypeSchema,
} from './definitions.schema.js';

const SchemaInfoSchema = z
  .strictObject({
    hash: Keccak256HashSchema.meta({
      title: 'Schema Hash',
      description:
        'Keccak256 hash of the JSON Schema this record was validated against',
    }),
    type: SchemaTypeSchema.meta({
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

const CreatorSchema = z
  .strictObject({
    name: z.string().meta({
      title: 'Creator Name',
      description: 'Company or individual name that created this record',
    }),
    id: UuidSchema.meta({
      title: 'Creator ID',
      description: 'Unique identifier for the creator',
    }),
  })
  .meta({
    title: 'Creator',
    description: 'Entity that created this record',
  });

const RelationshipSchema = z
  .strictObject({
    target_cid: z
      .string()
      .regex(
        /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]+)$/,
        'Must be a valid IPFS Content Identifier (CID)',
      )
      .meta({
        title: 'Target CID',
        description: 'IPFS Content Identifier (CID) of the referenced record',
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
      .meta({
        title: 'Relationship Type',
        description: 'Type of relationship to the referenced record',
      }),
    description: z.string().optional().meta({
      title: 'Relationship Description',
      description: 'Human-readable description of the relationship',
    }),
  })
  .meta({
    title: 'Relationship',
    description: 'Relationship to another IPFS record',
  });

const EnvironmentSchema = z
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

export const BaseIpfsSchema = z
  .strictObject({
    $schema: z.url('Must be a valid URI').meta({
      title: 'JSON Schema URI',
      description: 'URI of the JSON Schema used to validate this record',
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
    creator: CreatorSchema.optional(),

    relationships: z
      .array(RelationshipSchema)
      .optional()
      .meta({
        title: 'Relationships',
        description: 'References to other IPFS records this record relates to',
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

    environment: EnvironmentSchema.optional(),

    data: z
      .record(z.string(), z.unknown())
      .optional()
      .meta({
        title: 'Custom Data',
        description: "Custom data block that includes the record's data",
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
  .meta({
    title: 'Base IPFS Record',
    description:
      'Base fields for all Carrot IPFS records, providing common structure for any JSON content stored in IPFS',
  });

export type BaseIpfsSchemaType = z.infer<typeof BaseIpfsSchema>;
export type SchemaTypeType = z.infer<typeof SchemaTypeSchema>;
export type SchemaInfoType = z.infer<typeof SchemaInfoSchema>;
export type CreatorType = z.infer<typeof CreatorSchema>;
export type RelationshipObjectType = z.infer<typeof RelationshipSchema>;
export type EnvironmentType = z.infer<typeof EnvironmentSchema>;
