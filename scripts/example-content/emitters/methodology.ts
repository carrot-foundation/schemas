/**
 * Emitter for Methodology example JSON.
 *
 * Produces a Methodology document which, after post-processing,
 * becomes AJV-valid. Uses the canonical reference story for shared identifiers.
 */

import { buildReferenceStory } from '../reference-story.js';
import { exampleIpfsUri, formatDate, formatDateTime } from '../shared.js';

/**
 * Emit a Methodology example document with placeholders.
 *
 * Fields managed by post-processing ($schema, schema.hash, schema.version)
 * use placeholders that update-examples.js will overwrite.
 */
export function emitMethodologyExample(): Record<string, unknown> {
  const story = buildReferenceStory();
  const createdAt = new Date('2024-02-02T14:09:00.000Z');

  return {
    $schema: 'PLACEHOLDER',
    schema: {
      hash: 'PLACEHOLDER',
      type: 'Methodology',
      version: 'PLACEHOLDER',
      ipfs_uri: exampleIpfsUri('schema:methodology'),
    },
    environment: { ...story.environment },
    created_at: formatDateTime(createdAt),
    external_id: '00000000-0000-4000-8000-100000000005',
    external_url:
      'https://registry.example.com/document/00000000-0000-4000-8000-100000000005',
    image: exampleIpfsUri('image:methodology-carbon'),
    data: {
      name: story.methodology.name,
      short_name: 'BOLD Carbon (CH\u2084)',
      slug: story.methodology.slug,
      version: story.methodology.version,
      description:
        'Illustrative, non-production BOLD Carbon methodology record. Its example version and dates are fictional and do not establish the publication or revision history of any official methodology document.',
      revision_date: formatDate(new Date('2024-02-01T00:00:00.000Z')),
      publication_date: formatDate(new Date('2024-01-01T00:00:00.000Z')),
      methodology_pdf: exampleIpfsUri('pdf:methodology-carbon'),
      mass_id_audit_rules: buildMassIdAuditRules(),
    },
  };
}

/** The full set of BOLD Carbon mass-ID audit rules. */
function buildMassIdAuditRules(): Record<string, unknown>[] {
  const rulesCommit = '0000000000000000000000000000000000000000';
  const baseUrl = `https://github.com/example-org/methodology-rules/tree/${rulesCommit}/apps/methodologies/bold-carbon/rule-processors/mass-id`;

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
        'Illustrative check for duplicate MassID registration before counting a waste mass again',
    },
    {
      slug: 'no-conflicting-gas-id-or-credit',
      name: 'No Conflicting GasID or Credit',
      description:
        'Illustrative check for conflicting certificate or credit records linked to the same MassID',
    },
    {
      slug: 'project-period-limit',
      name: 'Project Period Limit',
      description:
        'Illustrative check of recorded processing dates against the versioned project period rule',
    },
    {
      slug: 'participant-accreditations',
      dirName: 'participant-accreditations-and-verifications-requirements',
      name: 'Participant Accreditations & Verifications Requirements',
      description:
        'Illustrative check of participant accreditations against the versioned rule requirements',
    },
    {
      slug: 'mass-id-qualifications',
      name: 'MassID Qualifications',
      description:
        'Illustrative check of waste mass category and qualification inputs',
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
    },
    {
      slug: 'recycling-manifest-data',
      name: 'Recycling Manifest Data',
      description: 'Illustrative check of recorded recycling manifest data',
    },
    {
      slug: 'project-boundary',
      name: 'Project Boundary',
      description:
        'Illustrative check of recorded MassID data against the project boundary rule',
    },
    {
      slug: 'prevented-emissions',
      name: 'Prevented CO\u2082e',
      description:
        'Illustrative check of the prevented emissions result produced by the versioned rule',
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
