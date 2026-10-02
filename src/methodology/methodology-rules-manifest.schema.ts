import { z } from 'zod';
import {
  IpfsUriSchema,
  NonEmptyStringSchema,
  SemanticVersionSchema,
  Sha256HashSchema,
  SlugSchema,
} from '../shared';

export const MethodologyManifestSelectionSchema = z
  .strictObject({
    slug: SlugSchema.meta({
      title: 'Manifest Selection Slug',
      description: 'Exact framework or application key in the frozen manifest',
    }),
    version: SemanticVersionSchema.meta({
      title: 'Manifest Selection Version',
      description:
        'Exact version of the selected framework or application in the frozen manifest; independent of operational Methodology and processor versions',
    }),
  })
  .meta({
    title: 'Methodology Manifest Selection',
    description:
      'A framework or application selected from immutable manifest bytes',
  });
export type MethodologyManifestSelection = z.infer<
  typeof MethodologyManifestSelectionSchema
>;

export const MethodologyRulesManifestSchema = z
  .strictObject({
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Rules Manifest IPFS URI',
      description:
        'Complete immutable IPFS locator of the original received methodology-rules manifest bytes, including any file path',
    }),
    sha256: Sha256HashSchema.meta({
      title: 'Rules Manifest SHA-256',
      description:
        'SHA-256 of the original received manifest bytes, not a regeneration or reformatted projection',
    }),
    source_commit: NonEmptyStringSchema.regex(
      /^[a-f0-9]{40}$/,
      'Must be a full 40-character lowercase hexadecimal source commit',
    ).meta({
      title: 'Rules Manifest Source Commit',
      description:
        'Full sourceCommit declared by the immutable manifest; independent of the processor source-code version',
      examples: ['0000000000000000000000000000000000000000'],
    }),
    framework: MethodologyManifestSelectionSchema.meta({
      title: 'Methodology Framework Selection',
      description:
        'Framework key and version selected from the frozen manifest',
    }),
    application: MethodologyManifestSelectionSchema.meta({
      title: 'Methodology Application Selection',
      description:
        'Application key and version within the selected framework; the producer verifies membership and versions against the frozen manifest',
    }),
  })
  .meta({
    title: 'Methodology Rules Manifest',
    description:
      'Immutable source identity and independent framework/application selectors for this derived Methodology snapshot',
  });
export type MethodologyRulesManifest = z.infer<
  typeof MethodologyRulesManifestSchema
>;
