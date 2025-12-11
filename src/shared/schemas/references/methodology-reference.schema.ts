import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  SemanticVersionSchema,
  NonEmptyStringSchema,
} from '../definitions.schema';

export const MethodologyReferenceSchema = z
  .strictObject({
    external_id: ExternalIdSchema.meta({
      title: 'Methodology External ID',
      description: 'Unique identifier for the methodology',
    }),
    name: NonEmptyStringSchema.min(5)
      .max(150)
      .meta({
        title: 'Methodology Name',
        description: 'Human-readable name of the methodology',
        examples: ['BOLD Carbon (CH₄)', 'BOLD Recycling'],
      }),
    version: SemanticVersionSchema.meta({
      title: 'Methodology Version',
      description: 'Version of the methodology',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Methodology External URL',
      description: 'URL to view the methodology on Carrot Explorer',
    }),
    uri: IpfsUriSchema.optional().meta({
      title: 'Methodology IPFS URI',
      description: 'IPFS URI to the methodology record',
    }),
  })
  .meta({
    title: 'Methodology Reference',
    description: 'Reference to a methodology record',
  });

export type MethodologyReference = z.infer<typeof MethodologyReferenceSchema>;
