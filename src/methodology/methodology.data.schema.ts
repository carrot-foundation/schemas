import { z } from 'zod';
import {
  AuditRuleDefinitionsSchema,
  IpfsUriSchema,
  IsoDateSchema,
  MethodologyNameSchema,
  MethodologyShortNameSchema,
  MethodologySlugSchema,
  SemanticVersionSchema,
} from '../shared';
import { MethodologyRulesManifestSchema } from './methodology-rules-manifest.schema';

export const MethodologyDataSchema = z
  .strictObject({
    name: MethodologyNameSchema,
    short_name: MethodologyShortNameSchema,
    slug: MethodologySlugSchema,
    version: SemanticVersionSchema.meta({
      title: 'Methodology Version',
      description:
        'Operational Methodology entity revision; independent of manifest format, framework, application and executed processor versions',
    }),
    description: z.string().min(50).max(2000).meta({
      title: 'Methodology Description',
      description:
        'Comprehensive methodology description including purpose, scope, and implementation approach',
    }),
    revision_date: IsoDateSchema.meta({
      title: 'Revision Date',
      description:
        'Official ISO 8601 revision date of the methodology version represented by this document; source it from the versioned publication, not database creation time',
    }),
    publication_date: IsoDateSchema.meta({
      title: 'Publication Date',
      description:
        'ISO 8601 date of the first official publication of this methodology family, independent of the represented version; source it from official publication history',
    }),
    methodology_pdf: IpfsUriSchema.meta({
      title: 'Methodology PDF',
      description: 'IPFS URI pointing to the complete methodology PDF document',
    }),
    rules_manifest: MethodologyRulesManifestSchema,
    mass_id_audit_rules: AuditRuleDefinitionsSchema.meta({
      title: 'MassID Audit Rules',
      description:
        'Audit rules that must be executed to check MassID compliance with the methodology',
    }),
  })
  .meta({
    title: 'Methodology Data',
    description:
      'Methodology definition including name, version, documentation, and audit rules',
  });
export type MethodologyData = z.infer<typeof MethodologyDataSchema>;
