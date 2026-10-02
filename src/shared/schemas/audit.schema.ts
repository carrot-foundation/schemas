import { z } from 'zod';
import { uniqueArrayItems } from '../schema-helpers';
import {
  IsoDateTimeSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  SlugSchema,
  UuidSchema,
} from './primitives';
import { AuditResultSchema } from './references';

export const AuditRuleDefinitionSchema = z
  .strictObject({
    id: UuidSchema.meta({
      title: 'Rule ID',
      description: 'Unique identifier for the audit rule',
    }),
    slug: SlugSchema.meta({
      title: 'Rule Slug',
      description: 'URL-friendly identifier for the rule',
    }),
    application_rule_slug: SlugSchema.meta({
      title: 'Manifest Application Rule Slug',
      description:
        'Exact mass-id application-rule slug in the selected frozen manifest; preserves an explicit source join when the operational slug is a legacy alias',
    }),
    implements_methodology_framework_rules: uniqueArrayItems(SlugSchema)
      .min(1)
      .meta({
        title: 'Implemented Methodology Framework Rules',
        description:
          'Distinct normative rule slugs in the selected framework implemented by this application rule; preserve every association and its source order',
        uniqueItems: true,
        examples: [['example-requirement', 'another-requirement']],
      }),
    name: NonEmptyStringSchema.max(100).meta({
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
          'Illustrative check for duplicate MassID registration before counting a waste mass again',
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
          'https://github.com/example-org/methodology-rules/tree/0000000000000000000000000000000000000000/mass-id/waste-mass-is-unique',
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
      'Versioned definition of a methodology audit rule and its execution order',
  });
export type AuditRuleDefinition = z.infer<typeof AuditRuleDefinitionSchema>;

export const AuditRuleDefinitionsSchema = z
  .array(AuditRuleDefinitionSchema)
  .min(1)
  .superRefine((rules, ctx) => {
    const ruleIds = new Set<string>();
    const ruleSlugs = new Set<string>();
    const executionOrders = new Set<number>();

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      if (ruleIds.has(rule.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate id found: ${rule.id}`,
          path: [i, 'id'],
        });
      } else {
        ruleIds.add(rule.id);
      }

      if (ruleSlugs.has(rule.slug)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate slug found: ${rule.slug}`,
          path: [i, 'slug'],
        });
      } else {
        ruleSlugs.add(rule.slug);
      }

      if (executionOrders.has(rule.execution_order)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate execution_order found: ${rule.execution_order}`,
          path: [i, 'execution_order'],
        });
      } else {
        executionOrders.add(rule.execution_order);
      }
    }

    for (let i = 1; i < rules.length; i++) {
      const previousOrder = rules[i - 1].execution_order;
      const currentOrder = rules[i].execution_order;

      if (currentOrder < previousOrder) {
        ctx.addIssue({
          code: 'custom',
          message: `Rules must be sorted by execution_order. Found order ${currentOrder} after ${previousOrder}`,
          path: [i, 'execution_order'],
        });
      }
    }
  })
  .meta({
    title: 'Audit Rule Definitions',
    description: 'Versioned methodology audit rules, sorted by execution order',
  });
export type AuditRuleDefinitions = z.infer<typeof AuditRuleDefinitionsSchema>;

export const AuditRuleExecutionResultSchema = z
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
    rule_description: z
      .string()
      .min(10)
      .max(500)
      .meta({
        title: 'Rule Description',
        description:
          'Detailed description of what the rule validates and why it is necessary',
        examples: [
          'Illustrative check for duplicate MassID registration before counting a waste mass again',
        ],
      }),
    rule_source_code_url: z
      .url()
      .regex(/^https:\/\/github\.com\/.*$/, 'Must be a GitHub URL')
      .meta({
        title: 'Rule Source Code URL',
        description:
          'GitHub URL pointing to the implementation source code for this rule',
        examples: [
          'https://github.com/example-org/methodology-rules/tree/0000000000000000000000000000000000000000/mass-id/waste-mass-is-unique',
        ],
      }),
    rule_execution_order: PositiveIntegerSchema.meta({
      title: 'Rule Execution Order',
      description: 'Sequential order in which this rule must be executed',
    }),
    execution_id: UuidSchema.meta({
      title: 'Execution ID',
      description:
        'Identifier of the audit run that executed this rule; shared by every rule executed in the same run',
    }),
    execution_started_at: IsoDateTimeSchema.meta({
      title: 'Execution Started At',
      description: 'ISO 8601 timestamp when the rule execution started',
    }),
    execution_completed_at: IsoDateTimeSchema.meta({
      title: 'Execution Completed At',
      description: 'ISO 8601 timestamp when the rule execution completed',
    }),
    result: AuditResultSchema.meta({
      title: 'Rule Execution Result',
      description: 'Result of the rule execution',
    }),
    execution_message: NonEmptyStringSchema.max(2000)
      .optional()
      .meta({
        title: 'Execution Message',
        description:
          'Human-readable message explaining the rule execution result, including details about what was validated or calculated',
        examples: [
          'No other MassIDs with the same attributes were found.',
          'The MassID is not linked to a certificate in this illustrative audit.',
          'Recorded processing dates passed the illustrative project-period rule.',
          'Illustrative rule output recorded 123.519 kg CO₂e for this MassID.',
        ],
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
  .min(1)
  .superRefine((results, ctx) => {
    for (let i = 1; i < results.length; i++) {
      const previousStartedAt = new Date(
        results[i - 1].execution_started_at,
      ).getTime();
      const currentStartedAt = new Date(
        results[i].execution_started_at,
      ).getTime();

      if (currentStartedAt < previousStartedAt) {
        ctx.addIssue({
          code: 'custom',
          message: `Results must be sorted by execution_started_at. Found timestamp ${results[i].execution_started_at} before ${results[i - 1].execution_started_at}`,
          path: [i, 'execution_started_at'],
        });
      }
    }
  })
  .meta({
    title: 'Audit Rule Execution Results',
    description:
      'Detailed results of each audit rule execution, sorted by execution_started_at',
  });
export type AuditRuleExecutionResults = z.infer<
  typeof AuditRuleExecutionResultsSchema
>;
