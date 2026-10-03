import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  SemanticVersionSchema,
  MethodologyNameSchema,
} from '../primitives';

export const MethodologyReferenceSchema = z
  .strictObject({
    external_id: ExternalIdSchema.meta({
      title: 'Methodology External ID',
      description: 'Unique identifier for the methodology',
    }),
    name: MethodologyNameSchema,
    version: SemanticVersionSchema.meta({
      title: 'Methodology Version',
      description: 'Version of the methodology',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Methodology External URL',
      description: 'URL to view the methodology on Carrot Registry',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Methodology IPFS URI',
      description:
        'IPFS URI of the version-specific Methodology JSON document; that document links to its PDF',
    }),
  })
  .meta({
    title: 'Methodology Reference',
    description:
      'Reference to the exact version of a Methodology JSON document used by this record',
  });
export type MethodologyReference = z.infer<typeof MethodologyReferenceSchema>;
