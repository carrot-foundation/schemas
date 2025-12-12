import type {
  AuditRuleDefinition,
  AuditRuleDefinitions,
  AuditRuleExecutionResult,
  AuditRuleExecutionResults,
} from '../../shared';

/**
 * Minimal audit rule definition stub for testing.
 *
 * Contains only required fields for audit rule definition schema validation.
 * Used as a base for creating custom audit rule definition fixtures in tests.
 */
export const minimalAuditRuleDefinitionStub: AuditRuleDefinition = {
  id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  slug: 'waste-mass-unique',
  name: 'Waste Mass is Unique',
  description: 'Validates that each MassID is unique within the system',
  source_code_url:
    'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
  execution_order: 1,
};

/**
 * Valid audit rule definition fixture for testing.
 *
 * Represents a complete audit rule definition that satisfies the audit rule definition schema.
 * Used in tests to validate audit rule definition schema parsing and validation.
 */
export const validAuditRuleDefinitionFixture: AuditRuleDefinition = {
  id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  slug: 'waste-mass-unique',
  name: 'Waste Mass is Unique',
  description:
    'Validates that each MassID is unique within the system to prevent duplicate entries',
  source_code_url:
    'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
  execution_order: 1,
};

/**
 * Creates an audit rule definition fixture with optional overrides.
 *
 * @param overrides - Optional partial audit rule definition to override default values
 * @returns A complete audit rule definition fixture
 */
export function createAuditRuleDefinitionFixture(
  overrides?: Partial<AuditRuleDefinition>,
): AuditRuleDefinition {
  return {
    ...minimalAuditRuleDefinitionStub,
    ...overrides,
  };
}

/**
 * Valid audit rule definitions fixture for testing.
 *
 * Represents a complete array of audit rule definitions sorted by execution order.
 * Used in tests to validate audit rule definitions schema parsing and validation.
 */
export const validAuditRuleDefinitionsFixture: AuditRuleDefinitions = [
  {
    id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
    slug: 'waste-mass-unique',
    name: 'Waste Mass is Unique',
    description:
      'Validates that each MassID is unique within the system to prevent duplicate entries',
    source_code_url:
      'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
    execution_order: 1,
  },
  {
    id: 'b2c3d4e5-f6a7-4901-9345-678901bcdefa',
    slug: 'no-conflicting-gas-id',
    name: 'No Conflicting GasID or Credit',
    description:
      'Ensures no conflicting GasID or Credit exists for the same waste batch',
    source_code_url:
      'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/no-conflicting-gas-id.js',
    execution_order: 2,
  },
  {
    id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab',
    slug: 'methodology-compliance',
    name: 'Methodology Compliance Check',
    description:
      'Verifies that the waste processing follows the approved methodology guidelines',
    source_code_url:
      'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/methodology-compliance.js',
    execution_order: 3,
  },
];

/**
 * Minimal audit rule execution result stub for testing.
 *
 * Contains only required fields for audit rule execution result schema validation.
 * Used as a base for creating custom audit rule execution result fixtures in tests.
 */
export const minimalAuditRuleExecutionResultStub: AuditRuleExecutionResult = {
  rule_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  rule_slug: 'waste-mass-unique',
  rule_name: 'Waste Mass is Unique',
  rule_description:
    'Validates that each MassID is unique within the system to prevent duplicate entries',
  rule_source_code_url:
    'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
  rule_execution_order: 1,
  execution_id: 'e1f2a3b4-c5d6-4901-8345-678901defabc',
  execution_started_at: '2024-12-05T11:02:47.000Z',
  execution_completed_at: '2024-12-05T11:02:48.000Z',
  result: 'PASSED',
  rule_processor_checksum: 'sha256:abc123def456',
  rule_source_code_version: '1.0.0',
};

/**
 * Valid audit rule execution result fixture for testing.
 *
 * Represents a complete audit rule execution result that satisfies the audit rule execution result schema.
 * Used in tests to validate audit rule execution result schema parsing and validation.
 */
export const validAuditRuleExecutionResultFixture: AuditRuleExecutionResult = {
  rule_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  rule_slug: 'waste-mass-unique',
  rule_name: 'Waste Mass is Unique',
  rule_description:
    'Validates that each MassID is unique within the system to prevent duplicate entries',
  rule_source_code_url:
    'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
  rule_execution_order: 1,
  execution_id: 'e1f2a3b4-c5d6-4901-8345-678901defabc',
  execution_started_at: '2024-12-05T11:02:47.000Z',
  execution_completed_at: '2024-12-05T11:02:48.000Z',
  result: 'PASSED',
  rule_processor_checksum: 'sha256:abc123def456',
  rule_source_code_version: '1.0.0',
};

/**
 * Creates an audit rule execution result fixture with optional overrides.
 *
 * @param overrides - Optional partial audit rule execution result to override default values
 * @returns A complete audit rule execution result fixture
 */
export function createAuditRuleExecutionResultFixture(
  overrides?: Partial<AuditRuleExecutionResult>,
): AuditRuleExecutionResult {
  return {
    ...minimalAuditRuleExecutionResultStub,
    ...overrides,
  };
}

/**
 * Valid audit rule execution results fixture for testing.
 *
 * Represents a complete array of audit rule execution results sorted by execution_started_at.
 * Used in tests to validate audit rule execution results schema parsing and validation.
 */
export const validAuditRuleExecutionResultsFixture: AuditRuleExecutionResults =
  [
    {
      rule_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
      rule_slug: 'waste-mass-unique',
      rule_name: 'Waste Mass is Unique',
      rule_description:
        'Validates that each MassID is unique within the system to prevent duplicate entries',
      rule_source_code_url:
        'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/waste-mass-unique.js',
      rule_execution_order: 1,
      execution_id: 'e1f2a3b4-c5d6-4901-8345-678901defabc',
      execution_started_at: '2024-12-05T11:02:47.000Z',
      execution_completed_at: '2024-12-05T11:02:48.000Z',
      result: 'PASSED',
      rule_processor_checksum: 'sha256:abc123def456',
      rule_source_code_version: '1.0.0',
    },
    {
      rule_id: 'b2c3d4e5-f6a7-4901-9345-678901bcdefa',
      rule_slug: 'no-conflicting-gas-id',
      rule_name: 'No Conflicting GasID or Credit',
      rule_description:
        'Ensures no conflicting GasID or Credit exists for the same waste batch',
      rule_source_code_url:
        'https://github.com/carrot-foundation/methodologies/blob/main/bold-carbon/rules/no-conflicting-gas-id.js',
      rule_execution_order: 2,
      execution_id: 'f2a3b4c5-d6e7-4902-8456-789012efabce',
      execution_started_at: '2024-12-05T11:02:49.000Z',
      execution_completed_at: '2024-12-05T11:02:50.000Z',
      result: 'PASSED',
      rule_processor_checksum: 'sha256:def456ghi789',
      rule_source_code_version: '1.0.0',
    },
  ];
