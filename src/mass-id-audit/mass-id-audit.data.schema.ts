import { z } from 'zod';
import {
  AuditResultSchema,
  AuditRuleExecutionResultsSchema,
  GasIDReferenceSchema,
  IsoDateTimeSchema,
  MassIDReferenceSchema,
  MethodologyReferenceSchema,
} from '../shared';

const MassIDAuditSummarySchema = z
  .strictObject({
    started_at: IsoDateTimeSchema.meta({
      title: 'Audit Start Timestamp',
      description: 'ISO 8601 timestamp when the audit was started',
    }),
    completed_at: IsoDateTimeSchema.meta({
      title: 'Audit Completion Timestamp',
      description: 'ISO 8601 timestamp when the audit was completed',
    }),
    result: AuditResultSchema.meta({
      title: 'Audit Result',
      description: 'Overall outcome of the audit process',
    }),
  })
  .meta({
    title: 'Audit Summary',
    description: 'Summary of audit execution results',
  });
export type MassIDAuditSummary = z.infer<typeof MassIDAuditSummarySchema>;

export const MassIDAuditDataSchema = z
  .strictObject({
    methodology: MethodologyReferenceSchema,
    mass_id: MassIDReferenceSchema,
    gas_id: GasIDReferenceSchema,
    audit_summary: MassIDAuditSummarySchema,
    rule_execution_results: AuditRuleExecutionResultsSchema,
  })
  .meta({
    title: 'MassID Audit Data',
    description: 'Complete data structure for MassID Audit records',
  });
export type MassIDAuditData = z.infer<typeof MassIDAuditDataSchema>;
