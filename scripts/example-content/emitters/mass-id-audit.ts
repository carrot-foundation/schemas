/**
 * Emitter for MassID Audit example JSON.
 *
 * Produces a MassID Audit document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { exampleIpfsUri, formatDateTime } from '../shared.js';

interface RuleExecutionResult {
  rule_name: string;
  rule_slug: string;
  rule_id: string;
  result: string;
  execution_message?: string;
  rule_processor_checksum: string;
  rule_source_code_version: string;
  rule_description: string;
  rule_execution_order: number;
  rule_source_code_url: string;
  execution_id: string;
  execution_started_at: string;
  execution_completed_at: string;
}

/**
 * Emit a MassID Audit example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitMassIDAuditExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const auditStartedAt = new Date('2024-12-08T11:32:46.000Z');

  const massIDTokenId = story.massID.tokenId;
  const externalId = '00000000-0000-4000-8000-100000000004';
  const massIDExternalId = '00000000-0000-4000-8000-100000000009';

  const rulesCommit = '0000000000000000000000000000000000000000';
  const baseUrl = `https://github.com/example-org/methodology-rules/tree/${rulesCommit}/apps/methodologies/bold-carbon/rule-processors/mass-id`;

  const ruleExecutionResults = buildRuleExecutionResults(
    baseUrl,
    rulesCommit,
    auditStartedAt,
  );

  const lastRuleCompletedAt = ruleExecutionResults.reduce((max, rule) => {
    const t = new Date(rule.execution_completed_at);
    return t > max ? t : max;
  }, auditStartedAt);
  const auditCompletedAt = new Date(lastRuleCompletedAt.getTime() + 50);

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'MassID Audit',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:mass-id-audit'),
    },
    environment: { ...story.environment },
    created_at: formatDateTime(auditCompletedAt),
    external_id: externalId,
    external_url: `https://registry.example.com/document/${externalId}`,
    data: {
      audit_summary: {
        started_at: formatDateTime(auditStartedAt),
        completed_at: formatDateTime(auditCompletedAt),
        result: 'PASSED',
      },
      methodology: {
        external_id: '00000000-0000-4000-8000-100000000005',
        name: story.methodology.name,
        version: story.methodology.version,
        external_url:
          'https://registry.example.com/document/00000000-0000-4000-8000-100000000005',
        ipfs_uri: exampleIpfsUri('doc:methodology-carbon'),
      },
      mass_id: {
        external_id: massIDExternalId,
        token_id: massIDTokenId,
        external_url: `https://registry.example.com/document/${massIDExternalId}`,
        ipfs_uri: exampleIpfsUri('doc:mass-id'),
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        chain_id: 80002,
      },
      rule_execution_results: ruleExecutionResults,
    },
  };
}

/** Build the full set of rule execution results for the audit. */
function buildRuleExecutionResults(
  baseUrl: string,
  rulesCommit: string,
  auditStartedAt: Date,
): RuleExecutionResult[] {
  const AUDIT_RUN_EXECUTION_ID = '00000000-0000-4000-8000-100000000013';

  const definitions: Array<{
    slug: string;
    name: string;
    description: string;
    dirName?: string;
    message?: string;
  }> = [
    {
      slug: 'waste-mass-is-unique',
      name: 'Waste Mass is Unique',
      description:
        'Illustrative check for duplicate MassID registration before counting a waste mass again',
      message: 'No other MassIDs with the same attributes were found.',
    },
    {
      slug: 'no-conflicting-gas-id-or-credit',
      name: 'No Conflicting GasID or Credit',
      description:
        'Illustrative check for conflicting certificate or credit records linked to the same MassID',
      message: 'The MassID is not linked to a valid MassID Certificate',
    },
    {
      slug: 'project-period-limit',
      name: 'Project Period Limit',
      description:
        'Illustrative check of recorded processing dates against the versioned project period rule',
      message:
        'Recorded recycling date passed the illustrative project-period rule.',
    },
    {
      slug: 'participant-accreditations',
      dirName: 'participant-accreditations-and-verifications-requirements',
      name: 'Participant Accreditations & Verifications Requirements',
      description:
        'Illustrative check of participant accreditations against the versioned rule requirements',
      message:
        'All participant accreditations-and-verifications are active and approved.',
    },
    {
      slug: 'mass-id-qualifications',
      name: 'MassID Qualifications',
      description:
        'Illustrative check of waste mass category and qualification inputs',
      message:
        'The document category, measurement unit, subtype, type, and value are correctly defined.',
    },
    {
      slug: 'regional-waste-classification',
      name: 'Regional Waste Classification',
      description:
        'Illustrative check of regional waste classification data required by the versioned rule',
    },
    {
      slug: 'geolocation-and-address-precision',
      name: 'Geolocation and Address Precision',
      description:
        'Illustrative check of available location evidence against the versioned geolocation rule',
    },
    {
      slug: 'waste-origin-identification',
      name: 'Waste Origin Identification',
      description:
        'Illustrative check of recorded waste origin and custody evidence',
    },
    {
      slug: 'hauler-identification',
      name: 'Hauler Identification',
      description: 'Illustrative check of required hauler identification data',
    },
    {
      slug: 'vehicle-identification',
      name: 'Vehicle Identification',
      description: 'Illustrative check of required transport vehicle data',
    },
    {
      slug: 'driver-identification',
      name: 'Driver Identification',
      description: 'Illustrative check of required transport driver data',
    },
    {
      slug: 'transport-manifest-data',
      name: 'Transport Manifest Data',
      description: 'Illustrative check of recorded transport manifest data',
    },
    {
      slug: 'processor-identification',
      name: 'Processor Identification',
      description: 'Illustrative check of required waste processor data',
    },
    {
      slug: 'recycler-identification',
      name: 'Recycler Identification',
      description: 'Illustrative check of required recycler data',
    },
    {
      slug: 'weighing',
      name: 'Weighing',
      description: 'Illustrative check of recorded weighing evidence',
    },
    {
      slug: 'drop-off-at-recycler',
      name: 'Drop-off at Recycler',
      description: 'Illustrative check of recorded waste drop-off evidence',
    },
    {
      slug: 'mass-id-sorting',
      name: 'MassID Sorting',
      description: 'Illustrative check of recorded sorting activity',
    },
    {
      slug: 'composting-cycle-timeframe',
      name: 'Composting Cycle Timeframe',
      description:
        'Illustrative check of recorded cycle dates against the versioned timeframe rule',
      message:
        'Recorded processing dates passed the illustrative cycle-timeframe rule.',
    },
    {
      slug: 'recycling-manifest-data',
      name: 'Recycling Manifest Data',
      description: 'Illustrative check of recorded recycling manifest data',
      message:
        'An illustrative recycling manifest was recorded for this MassID.',
    },
    {
      slug: 'project-boundary',
      name: 'Project Boundary',
      description:
        'Illustrative check of recorded MassID data against the project boundary rule',
      message:
        'Recorded locations passed the illustrative project-boundary rule.',
    },
    {
      slug: 'prevented-emissions',
      name: 'Prevented CO\u2082e',
      description:
        'Illustrative check of the prevented emissions result produced by the versioned rule',
      message:
        'Illustrative rule output recorded 123.519 kg CO\u2082e for this MassID.',
    },
  ];

  return definitions.map((rule, index) => {
    const order = index + 1;
    const startMs = auditStartedAt.getTime() + order * 100;
    const endMs = startMs + 50;

    const entry: RuleExecutionResult = {
      rule_name: rule.name,
      rule_slug: rule.slug,
      rule_id: `00000000-0000-4000-8000-${String(order).padStart(12, '0')}`,
      result: 'PASSED',
      ...(rule.message ? { execution_message: rule.message } : {}),
      rule_processor_checksum: order.toString(16).padStart(32, '0'),
      rule_source_code_version: rulesCommit,
      rule_description: rule.description,
      rule_execution_order: order,
      rule_source_code_url: `${baseUrl}/${rule.dirName ?? rule.slug}`,
      execution_id: AUDIT_RUN_EXECUTION_ID,
      execution_started_at: new Date(startMs).toISOString(),
      execution_completed_at: new Date(endMs).toISOString(),
    };

    return entry;
  });
}
