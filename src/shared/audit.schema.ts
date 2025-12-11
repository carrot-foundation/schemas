import { z } from 'zod';
import {
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  SlugSchema,
  UuidSchema,
} from './definitions.schema';
import { MethodologyComplianceSchema } from './references/audit-reference.schema';

export const AuditRuleDefinitionSchema = z
  .strictObject({
    rule_id: UuidSchema.meta({
      title: 'Rule ID',
      description: 'Unique identifier for the audit rule',
    }),
    rule_slug: SlugSchema.meta({
      title: 'Rule Slug',
      description: 'URL-friendly identifier for the rule',
    }),
    rule_name: NonEmptyStringSchema.max(100).meta({
      title: 'Rule Name',
      description: 'Human-readable name of the rule',
      examples: ['Waste Mass is Unique', 'No Conflicting GasID or Credit'],
    }),
    description: z
      .string()
      .min(10)
      .max(500)
      .meta({
        title: 'Rule Description',
        description:
          'Detailed description of what the rule validates and why it is necessary',
        examples: [
          'Validates that each MassID is unique within the system to prevent duplicate entries',
        ],
      }),
    source_code_url: z
      .url()
      .regex(/^https:\/\/github\.com\/.*$/, 'Must be a GitHub URL')
      .meta({
        title: 'Rule Source Code URL',
        description:
          'GitHub URL pointing to the implementation source code for this rule',
        examples: [
          'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
        ],
      }),
    execution_order: PositiveIntegerSchema.meta({
      title: 'Rule Execution Order',
      description: 'Sequential order in which this rule must be executed',
    }),
  })
  .meta({
    title: 'Audit Rule Definition',
    description:
      'Definition of an audit rule that must be executed for methodology compliance',
  });

export type AuditRuleDefinition = z.infer<typeof AuditRuleDefinitionSchema>;

export const AuditRuleDefinitionsSchema = z
  .array(AuditRuleDefinitionSchema)
  .min(1)
  .meta({
    title: 'Audit Rule Definitions',
    description:
      'List of audit rules that must be executed to check methodology compliance',
  });

export type AuditRuleDefinitions = z.infer<typeof AuditRuleDefinitionsSchema>;

export const AuditRuleExecutionResultSchema = z
  .strictObject({
    rule_name: NonEmptyStringSchema.meta({
      title: 'Rule Name',
      description: 'Human-readable name of the audit rule',
    }),
    rule_id: UuidSchema.meta({
      title: 'Rule ID',
      description: 'Unique identifier for the rule',
    }),
    rule_slug: SlugSchema.meta({
      title: 'Rule Slug',
      description: 'URL-friendly identifier for the rule',
    }),
    execution_order: PositiveIntegerSchema.meta({
      title: 'Rule Execution Order',
      description: 'Sequential order in which this rule was executed',
    }),
    result: MethodologyComplianceSchema.meta({
      title: 'Rule Execution Result',
      description: 'Result of the rule execution',
    }),
    description: z.string().min(1).max(2000).meta({
      title: 'Rule Description',
      description: 'Detailed description of what this rule validates',
    }),
    rule_processor_checksum: NonEmptyStringSchema.max(200).meta({
      title: 'Rule Processor Checksum',
      description: 'Checksum for rule processor integrity verification',
    }),
    rule_source_code_version: NonEmptyStringSchema.max(200).meta({
      title: 'Rule Source Code Version',
      description: 'Version identifier for the rule source code',
    }),
  })
  .meta({
    title: 'Audit Rule Execution Result',
    description: 'Detailed result of an audit rule execution',
  });

export type AuditRuleExecutionResult = z.infer<
  typeof AuditRuleExecutionResultSchema
>;

export const AuditRuleExecutionResultsSchema = z
  .array(AuditRuleExecutionResultSchema)
  .meta({
    title: 'Audit Rule Execution Results',
    description: 'Detailed results of each audit rule execution',
  });

export type AuditRuleExecutionResults = z.infer<
  typeof AuditRuleExecutionResultsSchema
>;
