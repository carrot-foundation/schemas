import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateSchema,
  NonNegativeIntegerSchema,
} from '../definitions.schema';

export const MethodologyComplianceSchema = z.enum(['PASSED', 'FAILED']).meta({
  title: 'Methodology Compliance',
  description: 'Result of methodology compliance check',
  examples: ['PASSED', 'FAILED'],
});

export type MethodologyCompliance = z.infer<typeof MethodologyComplianceSchema>;

export const AuditReferenceSchema = z
  .strictObject({
    date: IsoDateSchema.meta({
      title: 'Audit Date',
      description: 'Date when the audit was completed',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Audit External ID',
      description: 'Unique identifier for the audit',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Audit External URL',
      description: 'URL to view the audit on Carrot Explorer',
    }),
    methodology_compliance: MethodologyComplianceSchema.meta({
      title: 'Methodology Compliance',
      description: 'Result of methodology compliance check',
    }),
    rules_executed: NonNegativeIntegerSchema.meta({
      title: 'Rules Executed',
      description: 'Number of rules executed during the audit',
    }),
    report: IpfsUriSchema.meta({
      title: 'Audit Report',
      description: 'IPFS URI of the audit report',
    }),
  })
  .meta({
    title: 'Audit Reference',
    description: 'Reference to an audit record',
  });

export type AuditReference = z.infer<typeof AuditReferenceSchema>;
