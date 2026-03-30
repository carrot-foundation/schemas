/**
 * Emitter for MassID Audit example JSON.
 *
 * Produces a complete, AJV-valid MassID Audit document using the
 * canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDateTime } from '../shared.js';

/**
 * Emit a complete MassID Audit example document.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 *
 * @returns {object} A valid MassID Audit IPFS document
 */
export function emitMassIdAuditExample() {
  const story = buildReferenceStory();
  const auditStartedAt = new Date('2024-12-08T11:32:46.000Z');

  const massIdTokenId = story.massID.tokenId;
  const gasIdTokenId = story.gasID.tokenId;
  const externalId = '80011d61-fe40-4aa2-9031-4f2aafad5d42';
  const massIdExternalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';
  const gasIdExternalId = 'd2a7f8e4-9c61-4e35-b8f2-a5c9e7d1b4f6';

  const rulesCommit = '2e9cbbfd397027a03fb1561e431fcc156580459f';
  const baseUrl = `https://github.com/carrot-foundation/methodology-rules/tree/${rulesCommit}/apps/methodologies/bold-carbon/rule-processors/mass-id`;

  const ruleExecutionResults = buildRuleExecutionResults(
    baseUrl,
    rulesCommit,
    auditStartedAt,
  );

  const lastRuleCompletedAt = ruleExecutionResults.reduce((max, rule) => {
    const t = new Date(/** @type {string} */ (rule.execution_completed_at));
    return t > max ? t : max;
  }, auditStartedAt);
  const auditCompletedAt = new Date(lastRuleCompletedAt.getTime() + 50);

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'MassID Audit',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    created_at: formatDateTime(auditCompletedAt),
    external_id: externalId,
    external_url: `https://explore.carrot.eco/document/${externalId}`,
    data: {
      audit_summary: {
        started_at: formatDateTime(auditStartedAt),
        completed_at: formatDateTime(auditCompletedAt),
        result: 'PASSED',
      },
      methodology: {
        external_id: '8a1f5c92-e847-4b6d-9f23-d4e7a8b1c5e9',
        name: story.methodology.name,
        version: 'v1.4.2',
        external_url: `https://explore.carrot.eco/document/${story.methodology.slug}`,
        ipfs_uri:
          'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
      },
      mass_id: {
        external_id: massIdExternalId,
        token_id: massIdTokenId,
        external_url: `https://explore.carrot.eco/document/${massIdExternalId}`,
        ipfs_uri:
          'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      gas_id: {
        external_id: gasIdExternalId,
        token_id: gasIdTokenId,
        external_url: `https://explore.carrot.eco/document/${gasIdExternalId}`,
        ipfs_uri:
          'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm',
        smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      rule_execution_results: ruleExecutionResults,
    },
  };
}

/**
 * Build the full set of rule execution results for the audit.
 *
 * @param {string} baseUrl - Base URL for rule source code
 * @param {string} rulesCommit - Git commit hash for rules
 * @param {Date} auditStartedAt - When the audit started
 * @returns {Array<object>} Rule execution result entries
 */
function buildRuleExecutionResults(baseUrl, rulesCommit, auditStartedAt) {
  /** @type {Array<{slug: string; name: string; description: string; dirName?: string; message?: string; checksum: string; executionId: string}>} */
  const definitions = [
    {
      slug: 'waste-mass-is-unique',
      name: 'Waste Mass is Unique',
      description:
        'Validates that each MassID is unique within the system to prevent duplicate entries and double counting',
      message: 'No other MassIDs with the same attributes were found.',
      checksum: '06230ee263852c67332b50c3ea12ceb7',
      executionId: 'b7708f8b-ef9d-4e79-8b7e-fe1acbc63866',
    },
    {
      slug: 'no-conflicting-gas-id-or-credit',
      name: 'No Conflicting GasID or Credit',
      description:
        'Verifies that the MassID has not been previously registered in other carbon certificates or carbon credits to prevent double issuance',
      message: 'The MassID is not linked to a valid MassID Certificate',
      checksum: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
      executionId: 'f17c73ed-5f0b-4d81-90fd-10c629112da2',
    },
    {
      slug: 'project-period-limit',
      name: 'Project Period Limit',
      description:
        'Confirms that the MassID processing occurred within the valid project timeframe as defined by methodology guidelines',
      message:
        'The "Recycled" event occurred on or after the first day of the previous year, in UTC time.',
      checksum: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
      executionId: '84ad7f66-70fb-4737-bac3-834a50a82578',
    },
    {
      slug: 'participant-accreditations',
      dirName: 'participant-accreditations-and-verifications-requirements',
      name: 'Participant Accreditations & Verifications Requirements',
      description:
        'Checks if all participating entities have valid accreditations and permissions',
      message:
        'All participant accreditations-and-verifications are active and approved.',
      checksum: 'e014fc2e2c85aba826ad8b079f9f8bd7',
      executionId: '9eb0e3f4-6f7d-4820-b3f2-83d314a48dea',
    },
    {
      slug: 'mass-id-qualifications',
      name: 'MassID Qualifications',
      description:
        'Validates the proper categorization and definition of the organic waste mass',
      message:
        'The document category, measurement unit, subtype, type, and value are correctly defined.',
      checksum: '2f21946ad5ffe903cfcec58aeedc06f8',
      executionId: '0d56dc15-b502-4ad9-b0b6-721ac1ecf9c2',
    },
    {
      slug: 'regional-waste-classification',
      name: 'Regional Waste Classification',
      description:
        'Ensures the waste is properly classified according to Brazilian ABNT NBR 10004 standards and local municipal regulations',
      checksum: 'f6a7b8c9d0e123456789abcdef012345',
      executionId: '547ab47d-313a-4124-a15c-b63663c59e4b',
    },
    {
      slug: 'geolocation-and-address-precision',
      name: 'Geolocation and Address Precision',
      description:
        'Verifies the accuracy of geographical coordinates for waste collection and processing locations within 10-meter precision',
      checksum: 'a7b8c9d0e1f23456789abcdef0123456',
      executionId: 'e12f4fcd-2690-484c-b9eb-add72db613e9',
    },
    {
      slug: 'waste-origin-identification',
      name: 'Waste Origin Identification',
      description:
        'Validates the documented source and origin point of the organic waste with complete chain of custody documentation',
      checksum: 'b8c9d0e1f2a3456789abcdef01234567',
      executionId: '4dcf8498-85af-4cbf-ab9c-e9fbdc11c942',
    },
    {
      slug: 'hauler-identification',
      name: 'Hauler Identification',
      description:
        'Confirms the identity, ANTT registration, and environmental credentials of the waste transportation company',
      checksum: 'c9d0e1f2a3b456789abcdef012345678',
      executionId: 'b1d07bbb-c158-453d-88ec-6a0bcb860196',
    },
    {
      slug: 'vehicle-identification',
      name: 'Vehicle Identification',
      description:
        'Verifies the registration, inspection certificates, and environmental compliance of vehicles used in waste transportation',
      checksum: 'd0e1f2a3b4c56789abcdef0123456789',
      executionId: '9ac0195e-bbbc-44e7-976e-776f2f282e80',
    },
    {
      slug: 'driver-identification',
      name: 'Driver Identification',
      description:
        "Validates the identity, CNH (driver's license), and proper licensing of the waste transport driver",
      checksum: 'e1f2a3b4c5d6789abcdef01234567890',
      executionId: '8ed8e48f-f749-46dc-ab4b-b509dfdada1d',
    },
    {
      slug: 'transport-manifest-data',
      name: 'Transport Manifest Data',
      description:
        'Checks the completeness and accuracy of MTR (Waste Transport Manifest) documentation and digital signatures',
      checksum: 'f2a3b4c5d6e789abcdef012345678901',
      executionId: '74ce0927-cde8-4b27-bbb3-e16bcf749896',
    },
    {
      slug: 'processor-identification',
      name: 'Processor Identification',
      description:
        'Validates the identity, environmental licensing, and ISO 14001 certification of the waste processing facility',
      checksum: 'a3b4c5d6e7f89abcdef0123456789012',
      executionId: '3d865091-b639-41f5-b36e-48ed9214b1e0',
    },
    {
      slug: 'recycler-identification',
      name: 'Recycler Identification',
      description:
        'Confirms the identity, CETESB licensing, and operational credentials of the composting facility operator',
      checksum: 'b4c5d6e7f8a9abcdef0123456789013a',
      executionId: '229a046b-b9d4-4471-bf6f-82c7a26cd4f3',
    },
    {
      slug: 'weighing',
      name: 'Weighing',
      description:
        'Verifies the accurate measurement using INMETRO-certified scales and recording of waste MassID quantities with traceability',
      checksum: 'c5d6e7f8a9b0bcdef012345678901234',
      executionId: '6a3e3f28-32a4-4811-beb9-c3ab0dbc63df',
    },
    {
      slug: 'drop-off-at-recycler',
      name: 'Drop-off at Recycler',
      description:
        'Validates the proper reception, inspection, and documentation of waste material at the composting facility with photographic evidence',
      checksum: 'd6e7f8a9b0c1cdef0123456789012345',
      executionId: '1cd41078-6c09-46f7-8032-9ddc98c42ab4',
    },
    {
      slug: 'mass-id-sorting',
      name: 'MassID Sorting',
      description:
        'Confirms the proper segregation, contamination analysis, and classification of organic waste materials according to composting requirements',
      checksum: 'e7f8a9b0c1d2def01234567890123456',
      executionId: '0412bd25-58b6-4349-b882-a775eb418b16',
    },
    {
      slug: 'composting-cycle-timeframe',
      name: 'Composting Cycle Timeframe',
      description:
        'Validates that the composting process follows required duration and conditions',
      message:
        'The time between the "Drop-off" and "Recycled" events is 90 days, within the valid range (60-180 days).',
      checksum: '425813869ab97f3ad2dec3a904abca7b',
      executionId: '26482345-0ce3-4e7c-a0bd-6d8cf6004ec1',
    },
    {
      slug: 'recycling-manifest-data',
      name: 'Recycling Manifest Data',
      description:
        'Verifies the completion and accuracy of final recycling documentation and outcomes',
      message:
        'The CDF attachment (No. 47214/24), issued on 2024-02-09, with a value of 0kg, was provided.',
      checksum: '3447e06d0f84861e46ab3ee2dd76e594',
      executionId: '6964440e-9fed-4db8-a3e5-bf32e8e22b17',
    },
    {
      slug: 'project-boundary',
      name: 'Project Boundary',
      description:
        'Validate if the MassID is in accordance with the project boundary, we only output the value',
      message:
        'The distance between the first "Pick-up" and last "Drop-off" is 0.438km.',
      checksum: '8107054159f5b58217ff189ab4f9a279',
      executionId: '3859a3d1-b864-483e-a25f-86a363d43e54',
    },
    {
      slug: 'prevented-emissions',
      name: 'Prevented CO\u2082e',
      description:
        'Calculate the prevented CO\u2082e emissions based on methane emission factors and the processed organic waste mass',
      message:
        'The prevented emissions were calculated as 419.93 kg CO\u2082e using the formula (1 - 0.029) x 0.067 x 6454.8 = 419.93',
      checksum: 'e99cd5ed5dd5dd74d85fec73c886b295',
      executionId: '17d88045-564b-48ca-aa76-beb12c94681c',
    },
  ];

  return definitions.map((rule, index) => {
    const order = index + 1;
    const startMs = auditStartedAt.getTime() + order * 100;
    const endMs = startMs + 50;

    /** @type {Record<string, unknown>} */
    const entry = {
      rule_name: rule.name,
      rule_slug: rule.slug,
      rule_id: `00000000-0000-4000-8000-${String(order).padStart(12, '0')}`,
      result: 'PASSED',
    };

    if (rule.message) {
      entry.execution_message = rule.message;
    }

    entry.rule_processor_checksum = rule.checksum;
    const versionOverrides = {
      'no-conflicting-gas-id-or-credit':
        'v2.1.3-9f0e1a2b-d3e4-5f67-8901-23456789abcd',
      'project-period-limit': 'v2.1.3-a0f1e2a3-e4f5-6789-0123-456789abcdef',
    };
    entry.rule_source_code_version = versionOverrides[rule.slug] || rulesCommit;
    entry.rule_description = rule.description;
    entry.rule_execution_order = order;
    entry.rule_source_code_url = `${baseUrl}/${rule.dirName ?? rule.slug}`;
    entry.execution_id = rule.executionId;
    entry.execution_started_at = new Date(startMs).toISOString();
    entry.execution_completed_at = new Date(endMs).toISOString();

    return entry;
  });
}
