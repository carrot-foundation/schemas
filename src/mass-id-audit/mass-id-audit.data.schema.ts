import { z } from 'zod';
import {
  AuditResultSchema,
  AuditRuleExecutionResultsSchema,
  GasIDReferenceSchema,
  IsoDateTimeSchema,
  MassIDReferenceSchema,
  MethodologyReferenceSchema,
} from '../shared';

export const MassIDAuditSummarySchema = z
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
  .superRefine((data, ctx) => {
    const startedAt = new Date(data.started_at).getTime();
    const completedAt = new Date(data.completed_at).getTime();

    if (completedAt < startedAt) {
      ctx.addIssue({
        code: 'custom',
        path: ['completed_at'],
        message: 'completed_at must be greater than or equal to started_at',
      });
    }
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
