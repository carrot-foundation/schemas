import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  IsoDateTimeSchema,
  NonNegativeIntegerSchema,
} from '../primitives';

export const AuditResultSchema = z.enum(['PASSED', 'FAILED']).meta({
  title: 'Audit Result',
  description: 'Result of audit execution',
  examples: ['PASSED', 'FAILED'],
});

export type AuditResult = z.infer<typeof AuditResultSchema>;

export const AuditReferenceSchema = z
  .strictObject({
    completed_at: IsoDateTimeSchema.meta({
      title: 'Audit Completion Timestamp',
      description: 'ISO 8601 timestamp when the audit was completed',
    }),
    external_id: ExternalIdSchema.meta({
      title: 'Audit External ID',
      description: 'Unique identifier for the audit',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'Audit External URL',
      description: 'URL to view the audit on Carrot Explorer',
    }),
    result: AuditResultSchema.meta({
      title: 'Audit Result',
      description: 'Result of audit execution',
    }),
    rules_executed: NonNegativeIntegerSchema.meta({
      title: 'Rules Executed',
      description: 'Number of rules executed during the audit',
    }),
    ipfs_uri: IpfsUriSchema.meta({
      title: 'Audit Report',
      description: 'IPFS URI of the audit report',
    }),
  })
  .meta({
    title: 'Audit Reference',
    description: 'Reference to an audit record',
  });
export type AuditReference = z.infer<typeof AuditReferenceSchema>;
