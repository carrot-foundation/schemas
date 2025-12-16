import { z } from 'zod';
import {
  AuditResultSchema,
  AuditRuleExecutionResultsSchema,
  GasIDReferenceSchema,
  IsoDateTimeSchema,
  MassIDReferenceSchema,
  MethodologyReferenceSchema,
  RecycledIDReferenceSchema,
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
    gas_id: GasIDReferenceSchema.optional(),
    recycled_id: RecycledIDReferenceSchema.optional(),
    audit_summary: MassIDAuditSummarySchema,
    rule_execution_results: AuditRuleExecutionResultsSchema,
  })
  .superRefine((data, ctx) => {
    const hasGasId = !!data.gas_id;
    const hasRecycledId = !!data.recycled_id;

    if (!hasGasId && !hasRecycledId) {
      ctx.addIssue({
        code: 'custom',
        path: ['gas_id'],
        message: 'Either gas_id or recycled_id must be provided',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['recycled_id'],
        message: 'Either gas_id or recycled_id must be provided',
      });
    }

    if (hasGasId && hasRecycledId) {
      ctx.addIssue({
        code: 'custom',
        path: ['gas_id'],
        message: 'gas_id and recycled_id are mutually exclusive',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['recycled_id'],
        message: 'gas_id and recycled_id are mutually exclusive',
      });
    }
  })
  .meta({
    title: 'MassID Audit Data',
    description:
      'Complete data structure for MassID Audit records. Must include exactly one of gas_id or recycled_id.',
  });
export type MassIDAuditData = z.infer<typeof MassIDAuditDataSchema>;
