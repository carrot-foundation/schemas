import { z } from 'zod';
import {
  SemanticVersionSchema,
  IsoDateTimeSchema,
  ExternalIdSchema,
  ExternalUrlSchema,
  RecordSchemaTypeSchema,
  Sha256HashSchema,
  IpfsUriSchema,
} from '../primitives';

export const SchemaInfoSchema = z
  .strictObject({
    hash: Sha256HashSchema.meta({
      title: 'Schema Hash',
      description:
        'SHA-256 digest of the canonical JSON Schema object identified by this version and IPFS URI',
    }),
    type: RecordSchemaTypeSchema,
    version: SemanticVersionSchema.meta({
      title: 'Schema Version',
      description: 'Version of the schema, using semantic versioning',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Schema IPFS URI',
      description:
        'IPFS URI of the exact pinned JSON Schema artifact whose version and hash are recorded alongside it',
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
      description: 'Blockchain network where this record is deployed',
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
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Viewer IPFS URI',
      description: 'IPFS URI of the metadata viewer dApp build',
    }),
  })
  .meta({
    title: 'Metadata Viewer Reference',
    description:
      'Immutable reference to the metadata viewer dApp build. The IPFS CID itself is the integrity proof: tampered content resolves to a different CID',
  });
export type ViewerReference = z.infer<typeof ViewerReferenceSchema>;

export const BaseIpfsSchema = z
  .strictObject({
    $schema: z.url('Must be a valid URI').meta({
      title: 'JSON Schema URI',
      description:
        'Versioned URL of the JSON Schema used to validate this record; it must identify the same artifact as schema.ipfs_uri and schema.hash',
      example:
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/v0.0.0-example/schemas/ipfs/mass-id/mass-id.schema.json',
    }),
    schema: SchemaInfoSchema,
    created_at: IsoDateTimeSchema.meta({
      title: 'Created At',
      description:
        'ISO 8601 timestamp when this metadata document was created; it is not the date of the underlying event or methodology publication',
    }),
    external_id: ExternalIdSchema,
    external_url: ExternalUrlSchema,
    viewer_reference: ViewerReferenceSchema.optional(),
    environment: RecordEnvironmentSchema.optional(),
    data: z.record(z.string(), z.unknown()).optional().meta({
      title: 'Custom Data',
      description:
        'Type-specific data payload when defined by a record family; consult that family schema for required fields',
    }),
  })
  .meta({
    title: 'Base IPFS Record',
    description:
      'Base fields for all Carrot IPFS records, providing common structure for any JSON content stored in IPFS',
  });
export type BaseIpfs = z.infer<typeof BaseIpfsSchema>;
