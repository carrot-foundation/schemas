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
      description: 'URL to view the methodology on Carrot Explorer',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Methodology IPFS URI',
      description: 'IPFS URI to the methodology record',
    }),
  })
  .meta({
    title: 'Methodology Reference',
    description: 'Reference to a methodology record',
  });
export type MethodologyReference = z.infer<typeof MethodologyReferenceSchema>;
