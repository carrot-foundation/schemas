/**
 * Emitter for Methodology example JSON.
 *
 * Produces a Methodology document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { formatDate, formatDateTime } from '../shared.js';

/**
 * Emit a Methodology example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitMethodologyExample() {
  const story = buildReferenceStory();
  const createdAt = new Date('2025-08-15T14:09:00.000Z');

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Methodology',
      version: 'PLACEHOLDER',
      ipfs_uri:
        'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    },
    environment: { ...story.environment },
    created_at: formatDateTime(createdAt),
    external_id: '8375027a-a96f-446d-a8cb-c3ee92aea604',
    external_url:
      'https://explore.carrot.eco/document/8375027a-a96f-446d-a8cb-c3ee92aea604',
    data: {
      name: story.methodology.name,
      short_name: 'BOLD Carbon (CH\u2084)',
      slug: story.methodology.slug,
      version: story.methodology.version,
      description:
        'The BOLD (Breakthrough in Organics Landfill Diversion) Carbon methodology establishes the verification process for confirming prevented methane emissions from aerobic composting of organic waste at small-scale, professional composting facilities and distribution of rewards to supply chain contributors.',
      revision_date: formatDate(createdAt),
      publication_date: formatDate(createdAt),
      methodology_pdf:
        'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
      mass_id_audit_rules: buildMassIdAuditRules(),
    },
  };
}

/** The full set of BOLD Carbon mass-ID audit rules. */
function buildMassIdAuditRules() {
  const rulesCommit = '2e9cbbfd397027a03fb1561e431fcc156580459f';
  const baseUrl = `https://github.com/carrot-foundation/methodology-rules/tree/${rulesCommit}/apps/methodologies/bold-carbon/rule-processors/mass-id`;

  const definitions: Array<{
    slug: string;
    name: string;
    description: string;
    dirName?: string;
  }> = [
    {
      slug: 'waste-mass-is-unique',
      name: 'Waste Mass is Unique',
      description:
        'Validates that each MassID is unique within the system to prevent duplicate entries and double counting',
    },
    {
      slug: 'no-conflicting-gas-id-or-credit',
      name: 'No Conflicting GasID or Credit',
      description:
        'Verifies that the MassID has not been previously registered in other carbon certificates or carbon credits to prevent double issuance',
    },
    {
      slug: 'project-period-limit',
      name: 'Project Period Limit',
      description:
        'Confirms that the MassID processing occurred within the valid project timeframe as defined by methodology guidelines',
    },
    {
      slug: 'participant-accreditations',
      dirName: 'participant-accreditations-and-verifications-requirements',
      name: 'Participant Accreditations & Verifications Requirements',
      description:
        'Checks if all participating entities have valid accreditations and permissions',
    },
    {
      slug: 'mass-id-qualifications',
      name: 'MassID Qualifications',
      description:
        'Validates the proper categorization and definition of the organic waste mass',
    },
    {
      slug: 'regional-waste-classification',
      name: 'Regional Waste Classification',
      description:
        'Ensures the waste is properly classified according to Brazilian ABNT NBR 10004 standards and local municipal regulations',
    },
    {
      slug: 'geolocation-and-address-precision',
      name: 'Geolocation and Address Precision',
      description:
        'Verifies the accuracy of geographical coordinates for waste collection and processing locations within 10-meter precision',
    },
    {
      slug: 'waste-origin-identification',
      name: 'Waste Origin Identification',
      description:
        'Validates the documented source and origin point of the organic waste with complete chain of custody documentation',
    },
    {
      slug: 'hauler-identification',
      name: 'Hauler Identification',
      description:
        'Confirms the identity, ANTT registration, and environmental credentials of the waste transportation company',
    },
    {
      slug: 'vehicle-identification',
      name: 'Vehicle Identification',
      description:
        'Verifies the registration, inspection certificates, and environmental compliance of vehicles used in waste transportation',
    },
    {
      slug: 'driver-identification',
      name: 'Driver Identification',
      description:
        "Validates the identity, CNH (driver's license), and proper licensing of the waste transport driver",
    },
    {
      slug: 'transport-manifest-data',
      name: 'Transport Manifest Data',
      description:
        'Checks the completeness and accuracy of MTR (Waste Transport Manifest) documentation and digital signatures',
    },
    {
      slug: 'processor-identification',
      name: 'Processor Identification',
      description:
        'Validates the identity, environmental licensing, and ISO 14001 certification of the waste processing facility',
    },
    {
      slug: 'recycler-identification',
      name: 'Recycler Identification',
      description:
        'Confirms the identity, CETESB licensing, and operational credentials of the composting facility operator',
    },
    {
      slug: 'weighing',
      name: 'Weighing',
      description:
        'Verifies the accurate measurement using INMETRO-certified scales and recording of waste MassID quantities with traceability',
    },
    {
      slug: 'drop-off-at-recycler',
      name: 'Drop-off at Recycler',
      description:
        'Validates the proper reception, inspection, and documentation of waste material at the composting facility with photographic evidence',
    },
    {
      slug: 'mass-id-sorting',
      name: 'MassID Sorting',
      description:
        'Confirms the proper segregation, contamination analysis, and classification of organic waste materials according to composting requirements',
    },
    {
      slug: 'composting-cycle-timeframe',
      name: 'Composting Cycle Timeframe',
      description:
        'Validates that the composting process follows required duration and conditions',
    },
    {
      slug: 'recycling-manifest-data',
      name: 'Recycling Manifest Data',
      description:
        'Verifies the completion and accuracy of final recycling documentation and outcomes',
    },
    {
      slug: 'project-boundary',
      name: 'Project Boundary',
      description:
        'Validate if the MassID is in accordance with the project boundary, we only output the value',
    },
    {
      slug: 'prevented-emissions',
      name: 'Prevented CO\u2082e',
      description:
        'Calculate the prevented CO\u2082e emissions based on methane emission factors and the processed organic waste mass',
    },
  ];

  return definitions.map((rule, index) => ({
    description: rule.description,
    source_code_url: `${baseUrl}/${rule.dirName ?? rule.slug}`,
    execution_order: index + 1,
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    slug: rule.slug,
    name: rule.name,
  }));
}
