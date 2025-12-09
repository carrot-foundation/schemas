import { z } from 'zod';
import {
  AuditRuleExecutionResultsSchema,
  GasIDReferenceSchema,
  IsoDateSchema,
  MassIDReferenceSchema,
  MethodologyComplianceSchema,
  MethodologyReferenceSchema,
  NonNegativeIntegerSchema,
} from '../shared';

const MassIdAuditSummarySchema = z
  .strictObject({
    audit_date: IsoDateSchema.meta({
      title: 'Audit Date',
      description: 'Date when the audit was completed',
    }),
    methodology_compliance: MethodologyComplianceSchema.meta({
      title: 'Methodology Compliance',
      description: 'Overall outcome of the audit process',
    }),
    total_rules_executed: NonNegativeIntegerSchema.meta({
      title: 'Total Rules Executed',
      description: 'Total number of audit rules executed',
    }),
    passed_rules: NonNegativeIntegerSchema.meta({
      title: 'Passed Rules Count',
      description: 'Number of rules that passed verification',
    }),
    failed_rules: NonNegativeIntegerSchema.meta({
      title: 'Failed Rules Count',
      description: 'Number of rules that failed verification',
    }),
  })
  .meta({
    title: 'Audit Summary',
    description: 'Summary of audit execution results',
  });

export type MassIdAuditSummary = z.infer<typeof MassIdAuditSummarySchema>;

export const MassIdAuditDataSchema = z
  .strictObject({
    methodology: MethodologyReferenceSchema,
    mass_id: MassIDReferenceSchema,
    gas_id: GasIDReferenceSchema,
    audit_summary: MassIdAuditSummarySchema,
    rules_execution_results: AuditRuleExecutionResultsSchema,
  })
  .meta({
    title: 'MassID Audit Data',
    description: 'Complete data structure for MassID Audit records',
  });

export type MassIdAuditData = z.infer<typeof MassIdAuditDataSchema>;
