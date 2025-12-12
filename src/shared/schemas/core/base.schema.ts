import { z } from 'zod';
import {
  SemanticVersionSchema,
  IsoTimestampSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  RecordSchemaTypeSchema,
  Sha256HashSchema,
  IpfsUriSchema,
  IpfsCidSchema,
} from '../primitives';

export const SchemaInfoSchema = z
  .strictObject({
    hash: Sha256HashSchema.meta({
      title: 'Schema Hash',
      description:
        'SHA-256 hash of the JSON Schema this record was validated against',
    }),
    type: RecordSchemaTypeSchema,
    version: SemanticVersionSchema.meta({
      title: 'Schema Version',
      description: 'Version of the schema, using semantic versioning',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Schema IPFS URI',
      description:
        'IPFS URI for this JSON Schema when the primary schema URI is unavailable',
    }),
  })
  .meta({
    title: 'Schema Information',
    description: 'Information about the schema used to validate this record',
  });
export type SchemaInfo = z.infer<typeof SchemaInfoSchema>;

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
    title: 'Record Environment',
    description: 'Environment information for the record',
  });
export type RecordEnvironment = z.infer<typeof RecordEnvironmentSchema>;

export const ViewerReferenceSchema = z
  .strictObject({
    ipfs_cid: IpfsCidSchema.meta({
      title: 'Viewer IPFS CID',
      description: 'IPFS CID of the metadata viewer dApp build',
    }),
    integrity_hash: Sha256HashSchema.meta({
      title: 'Viewer Integrity Hash',
      description:
        'SHA-256 hash of the published viewer bundle to verify integrity',
    }),
  })
  .meta({
    title: 'Metadata Viewer Reference',
    description:
      'References to the metadata viewer dApp, including immutable and latest entry points',
  });
export type ViewerReference = z.infer<typeof ViewerReferenceSchema>;

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
    external_id: ExternalIdSchema,
    external_url: ExternalUrlSchema,
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
    viewer_reference: ViewerReferenceSchema.optional(),
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
