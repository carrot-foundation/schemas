import { z } from 'zod';
import { uniqueArrayItems, uniqueBy } from '../../schema-helpers';
import {
  ExternalUrlSchema,
  IpfsUriSchema,
  NonEmptyStringSchema,
} from '../primitives';

export const RevisionCategorySchema = z
  .enum([
    'schema_migration',
    'image_update',
    'metadata_correction',
    'reference_update',
    'rollback',
  ])
  .meta({
    title: 'Revision Category',
    description:
      'Explanation category for an individual field change; it does not authorize scientific fact changes without approved provenance',
    examples: ['schema_migration', 'reference_update'],
  });
export type RevisionCategory = z.infer<typeof RevisionCategorySchema>;

export const RevisionOperationSchema = z
  .enum(['add', 'replace', 'remove'])
  .meta({
    title: 'Verified Revision Operation',
    description:
      'Operation derived from actual predecessor and candidate comparison: absent to present, changed existing value, or present to absent',
    examples: ['replace', 'remove'],
  });
export type RevisionOperation = z.infer<typeof RevisionOperationSchema>;

export const RevisionPathSchema = NonEmptyStringSchema.max(2048)
  .regex(
    /^(?!\/revision(?:\/|$))\/(?:[^~]|~[01])*$/,
    'Must be a non-root JSON Pointer outside the revision subtree, with valid ~0 and ~1 escapes',
  )
  .meta({
    title: 'Changed Field Path',
    description:
      'RFC 6901 JSON Pointer excluding the root revision subtree; removals resolve against the predecessor. Array indices do not establish item identity',
    examples: ['/image', '/data/a~1b/m~0n', '/attributes'],
  });
export type RevisionPath = z.infer<typeof RevisionPathSchema>;

const RevisionReasonSchema = NonEmptyStringSchema.max(500)
  .regex(/\S/, 'Reason must contain non-whitespace text')
  .regex(/^[^\uD800-\uDFFF]*$/u, 'Reason must contain well-formed Unicode')
  .meta({
    title: 'Revision Reason',
    description:
      'Approved human explanation, at most 500 UTF-16 units with well-formed Unicode; preserved verbatim without trimming or normalization',
    examples: [
      'Use the approved image document.',
      'Correct the metadata references.',
    ],
  });

export const RevisionReferenceSchema = z
  .union([
    IpfsUriSchema.max(4096),
    ExternalUrlSchema.max(4096).regex(
      /^https?:\/\//,
      'Must be a public HTTP(S) URL',
    ),
  ])
  .meta({
    title: 'Revision Supporting Reference',
    description:
      'Public supporting evidence actually available for this field change, expressed as a valid IPFS document URI or HTTP(S) URL',
    examples: ['https://example.com/evidence/correction'],
  });
export type RevisionReference = z.infer<typeof RevisionReferenceSchema>;

export const RevisionChangeSchema = z
  .strictObject({
    path: RevisionPathSchema,
    categories: uniqueArrayItems(RevisionCategorySchema)
      .min(1)
      .max(5)
      .meta({
        title: 'Field Change Categories',
        description:
          'One or more distinct approved categories explaining this field',
        uniqueItems: true,
        examples: [['image_update', 'reference_update']],
      }),
    reason: RevisionReasonSchema,
    references: uniqueArrayItems(RevisionReferenceSchema)
      .min(1)
      .max(10)
      .optional()
      .meta({
        title: 'Field Change Supporting References',
        description:
          'Distinct public evidence references when real supporting information exists; omit rather than fabricate evidence',
        uniqueItems: true,
        examples: [['https://example.com/evidence/correction']],
      }),
  })
  .meta({
    title: 'Declared Revision Change',
    description:
      'Field-level explanation without an operation when predecessor comparison is unavailable; no copied old or new values',
  });
export type RevisionChange = z.infer<typeof RevisionChangeSchema>;

export const VerifiedRevisionChangeSchema = RevisionChangeSchema.safeExtend({
  operation: RevisionOperationSchema,
}).meta({
  title: 'Verified Revision Change',
  description:
    'Field-level explanation with an operation asserted from actual before/after comparison; readers may independently verify it',
});
export type VerifiedRevisionChange = z.infer<
  typeof VerifiedRevisionChangeSchema
>;

const RevisionBaseSchema = z.strictObject({
  previous_uri: NonEmptyStringSchema.max(4096).meta({
    title: 'Exact Predecessor URI',
    description:
      'Literal predecessor pointer, preserved without normalization; legacy invalid or stub strings are allowed and are not asserted to be valid CIDs',
    examples: ['ipfs://random-uri'],
  }),
  reason: RevisionReasonSchema.meta({
    title: 'Overall Revision Reason',
    description:
      'Approved summary reused verbatim as the token update event reason and compared during readback; no inferred or fabricated explanation',
  }),
});

export const MetadataRevisionSchema = z
  .discriminatedUnion('comparison', [
    RevisionBaseSchema.safeExtend({
      comparison: z.literal('verified').meta({
        title: 'Verified Predecessor Comparison',
        description:
          'Producer asserts actual predecessor/candidate comparison; schema validity alone does not prove the comparison',
      }),
      changes: uniqueBy(VerifiedRevisionChangeSchema, (change) => change.path)
        .min(1)
        .max(256)
        .meta({
          title: 'Verified Field Changes',
          description:
            'Distinct field paths derived from before/after documents excluding revision itself; all operations are required and no entries are truncated',
        }),
    }),
    RevisionBaseSchema.safeExtend({
      comparison: z.literal('unavailable').meta({
        title: 'Unavailable Predecessor Comparison',
        description:
          'Predecessor cannot be compared, including a legacy stub; changes retain declared explanations and must not contain operations',
      }),
      changes: uniqueBy(RevisionChangeSchema, (change) => change.path)
        .min(1)
        .max(256)
        .meta({
          title: 'Declared Field Changes',
          description:
            'Distinct declared field paths and approved explanations without an invented operation or old value',
        }),
    }),
  ])
  .meta({
    title: 'Metadata Revision',
    description:
      'Common revision block required by new update publication paths and absent on initial publication; producer context and independent readback establish publication and comparison facts',
  });
export type MetadataRevision = z.infer<typeof MetadataRevisionSchema>;
