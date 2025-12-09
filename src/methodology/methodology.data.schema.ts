import { z } from 'zod';
import {
  AuditRuleDefinitionsSchema,
  IpfsUriSchema,
  IsoDateSchema,
  MethodologyNameSchema,
  NonEmptyStringSchema,
  SemanticVersionSchema,
  SlugSchema,
} from '../shared';

export const MethodologyDataSchema = z
  .strictObject({
    name: MethodologyNameSchema.meta({
      title: 'Methodology Name',
      description: 'Full official name of the methodology',
    }),
    short_name: NonEmptyStringSchema.max(50).meta({
      title: 'Methodology Short Name',
      description: 'Abbreviated name for UI display and references',
      examples: ['BOLD Carbon', 'BOLD Recycling'],
    }),
    slug: SlugSchema.meta({
      title: 'Methodology Slug',
      description: 'URL-friendly identifier for the methodology',
      examples: ['bold-carbon-ch4', 'bold-recycling'],
    }),
    version: SemanticVersionSchema.meta({
      title: 'Methodology Version',
      description: 'Version of the methodology',
    }),
    description: z.string().min(50).max(2000).meta({
      title: 'Methodology Description',
      description:
        'Comprehensive methodology description including purpose, scope, and implementation approach',
    }),
    revision_date: IsoDateSchema.meta({
      title: 'Revision Date',
      description: 'ISO 8601 date of the last revision to this methodology',
    }),
    publication_date: IsoDateSchema.meta({
      title: 'Publication Date',
      description:
        'ISO 8601 date of the original publication of this methodology',
    }),
    methodology_pdf: IpfsUriSchema.meta({
      title: 'Methodology PDF',
      description: 'IPFS URI pointing to the complete methodology PDF document',
    }),
    mass_id_audit_rules: AuditRuleDefinitionsSchema.meta({
      title: 'MassID Audit Rules',
      description:
        'Audit rules that must be executed to check MassID compliance with the methodology',
    }),
  })
  .meta({
    title: 'Methodology Data',
    description: 'Methodology-specific data including audit rules',
  });

export type MethodologyData = z.infer<typeof MethodologyDataSchema>;
