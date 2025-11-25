import { z } from 'zod';
import {
  UuidSchema,
  Sha256HashSchema,
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  UnixTimestampSchema,
  MinutesSchema,
} from '../shared/definitions.schema';
import { LocationSchema } from '../shared/entities/location.schema';
import { ParticipantSchema } from '../shared/entities/participant.schema';
import { uniqueBy } from '../shared/helpers.schema';

const MassIDLocalClassificationSchema = z
  .strictObject({
    code: NonEmptyStringSchema.max(20).meta({
      title: 'Classification Code',
      description: 'Local waste classification code',
      examples: ['20 01 01', 'D001', 'EWC-150101', 'IBAMA-A001'],
    }),
    description: NonEmptyStringSchema.max(200).meta({
      title: 'Classification Description',
      description: 'Local waste classification description',
      examples: [
        'Paper and cardboard packaging',
        'Ignitable waste',
        'Paper and cardboard packaging waste',
        'Municipal solid waste - organic fraction',
      ],
    }),
    system: z.enum(['IBAMA']).meta({
      title: 'Classification System',
      description:
        'Classification system name - currently supports IBAMA (Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis)',
      examples: ['IBAMA'],
    }),
  })
  .meta({
    title: 'Local Classification',
    description:
      'Local or regional waste classification codes and descriptions',
  });

export type MassIDLocalClassification = z.infer<
  typeof MassIDLocalClassificationSchema
>;

const MassIDMeasurementUnitSchema = z.enum(['kg', 'ton']).meta({
  title: 'Measurement Unit',
  description: 'Unit of measurement for the waste quantity',
  examples: ['kg', 'ton'],
});

export type MassIDMeasurementUnit = z.infer<typeof MassIDMeasurementUnitSchema>;

const MassIDWastePropertiesSchema = z
  .strictObject({
    type: WasteTypeSchema.meta({
      title: 'Waste Type',
      description: 'Waste material category',
    }),
    subtype: WasteSubtypeSchema.meta({
      title: 'Waste Subtype',
      description: 'Specific subcategory of waste material',
    }),
    local_classification: MassIDLocalClassificationSchema.optional(),
    measurement_unit: MassIDMeasurementUnitSchema,
    net_weight: NonNegativeFloatSchema.meta({
      title: 'Net Weight',
      description:
        'Net weight of the waste batch in the specified measurement unit',
    }),
  })
  .meta({
    title: 'Waste Properties',
    description:
      'Standardized waste material properties and regulatory information',
  });

export type MassIDWasteProperties = z.infer<typeof MassIDWastePropertiesSchema>;

const EventAttributeFormatSchema = z
  .enum(['KILOGRAM', 'DATE', 'CURRENCY', 'PERCENTAGE', 'COORDINATE'])
  .meta({
    title: 'Event Attribute Format',
    description: 'Data format hint for proper display',
    examples: ['KILOGRAM', 'DATE', 'PERCENTAGE'],
  });

export type EventAttributeFormat = z.infer<typeof EventAttributeFormatSchema>;

const EventAttributeSchema = z
  .strictObject({
    name: NonEmptyStringSchema.max(100).meta({
      title: 'Attribute Name',
      description: 'Event attribute name',
      examples: [
        'temperature',
        'humidity',
        'contamination_percentage',
        'quality_grade',
        'batch_number',
        'operator_id',
        'equipment_used',
        'processing_cost',
      ],
    }),
    value: z
      .union([z.string(), z.number(), z.boolean()])
      .optional()
      .meta({
        title: 'Attribute Value',
        description: 'Event attribute value',
        examples: [
          25.5,
          'Grade A',
          true,
          'BATCH-2024-001',
          12.75,
          'Shredder-X200',
          false,
          'OP-456',
        ],
      }),
    preserved_sensitivity: z.boolean().optional().meta({
      title: 'Preserved Sensitivity',
      description:
        'Indicates if the attribute contains sensitive information that was preserved',
    }),
    format: EventAttributeFormatSchema.optional(),
  })
  .meta({
    title: 'Event Attribute',
    description: 'Additional attribute specific to an event',
  });
export type EventAttribute = z.infer<typeof EventAttributeSchema>;

const EventAttachmentSchema = z
  .strictObject({
    type: NonEmptyStringSchema.max(50).meta({
      title: 'Attachment Type',
      description: 'Type of supporting attachment',
      examples: [
        'Waste Transfer Note',
        'Certificate of Disposal',
        'Certificate of Final Destination',
        'Quality Assessment Report',
        'Transport Manifest',
        'Processing Receipt',
        'Environmental Permit',
        'Invoice',
      ],
    }),
    document_number: NonEmptyStringSchema.max(50)
      .optional()
      .meta({
        title: 'Document Number',
        description: 'Official document number if applicable',
        examples: [
          'WTN-2024-001234',
          'CD-ENV-456789',
          'INV-2024-QTR1-789',
          'PERMIT-EPA-2024-001',
          'MANIFEST-DOT-567890',
        ],
      }),
    reference: NonEmptyStringSchema.meta({
      title: 'Attachment Reference',
      description:
        'Reference to attachment (IPFS hash, file name, or external URL)',
      examples: [
        'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
        'waste_transfer_note_2024_001.pdf',
        'https://docs.example.com/certificates/disposal_cert_456.pdf',
        'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        'processing_receipt_20240315.jpg',
      ],
    }),
    issue_date: UnixTimestampSchema.optional().meta({
      title: 'Issue Date',
      description:
        'Unix timestamp in milliseconds when the attachment was issued',
      examples: [1710518400000, 1704067200000, 1715270400000],
    }),
    issuer: NonEmptyStringSchema.max(100)
      .optional()
      .meta({
        title: 'Attachment Issuer',
        description: 'Entity that issued the attachment',
        examples: [
          'Environmental Protection Agency',
          'Waste Management Solutions Ltd',
          'Green Recycling Corp',
          'City Waste Authority',
          'EcoProcess Industries',
          'Regional Environmental Office',
        ],
      }),
  })
  .meta({
    title: 'Event Attachment',
    description: 'Supporting event attachment',
  });
export type EventAttachment = z.infer<typeof EventAttachmentSchema>;

const MassIDChainOfCustodyEventSchema = z
  .strictObject({
    event_id: UuidSchema.meta({
      title: 'Event ID',
      description: 'Unique event identifier',
    }),
    event_name: NonEmptyStringSchema.max(50).meta({
      title: 'Event Name',
      description: 'Name of custody or processing event',
      examples: ['Sorting', 'Processing', 'Recycling', 'Weighing'],
    }),
    description: NonEmptyStringSchema.max(200)
      .optional()
      .meta({
        title: 'Event Description',
        description: 'Detailed description of what happened during this event',
        examples: [
          'Waste collected from residential area using collection truck',
          'Material sorted into recyclable and non-recyclable fractions',
          'Plastic waste processed through shredding and washing',
          'Waste transferred to authorized recycling facility',
          'Final disposal at licensed landfill site',
          'Quality inspection and contamination assessment completed',
        ],
      }),
    timestamp: UnixTimestampSchema.meta({
      title: 'Event Timestamp',
      description: 'Unix timestamp in milliseconds when the event occurred',
      examples: [1710518400000, 1704067200000, 1715270400000],
    }),
    participant_id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description: 'Reference to participant in the participants array',
    }),
    location_id_hash: Sha256HashSchema.meta({
      title: 'Location ID Hash',
      description: 'Reference to location in the locations array',
    }),
    weight: NonNegativeFloatSchema.optional().meta({
      title: 'Event Weight',
      description: 'Mass weight after this event',
    }),
    attributes: z.array(EventAttributeSchema).optional().meta({
      title: 'Event Attributes',
      description: 'Additional attributes specific to this event',
    }),
    attachments: z.array(EventAttachmentSchema).optional().meta({
      title: 'Event Attachments',
      description: 'Associated attachments for this event',
    }),
  })
  .meta({
    title: 'Chain of Custody Event',
    description: 'Chain of custody event',
  });

export type MassIDChainOfCustodyEvent = z.infer<
  typeof MassIDChainOfCustodyEventSchema
>;

const MassIDChainOfCustodySchema = z
  .strictObject({
    events: z.array(MassIDChainOfCustodyEventSchema).min(1).meta({
      title: 'Custody Events',
      description:
        'Chronological sequence of custody transfer and processing events',
    }),
    total_duration_minutes: MinutesSchema.meta({
      title: 'Total Duration (minutes)',
      description: 'Total time from first to last event in minutes',
    }),
  })
  .meta({
    title: 'Chain of Custody',
    description:
      'Complete chain of custody tracking from waste generation to final processing',
  });

export type MassIDChainOfCustody = z.infer<typeof MassIDChainOfCustodySchema>;

const MassIDGeographicDataSchema = z
  .strictObject({
    from_location_id_hash: Sha256HashSchema.meta({
      title: 'From Location ID Hash',
      description:
        'Reference hash of the location where the waste started movement',
    }),
    to_location_id_hash: Sha256HashSchema.meta({
      title: 'To Location ID Hash',
      description:
        'Reference hash of the location where the waste ended movement',
    }),
    first_reported_timestamp: UnixTimestampSchema.meta({
      title: 'First Reported Timestamp',
      description:
        'Unix timestamp in milliseconds when the waste was first reported/collected at the origin location',
      examples: [1710518400000, 1704067200000, 1715270400000],
    }),
    last_reported_timestamp: UnixTimestampSchema.meta({
      title: 'Last Reported Timestamp',
      description:
        'Unix timestamp in milliseconds when the waste was last reported/processed at the destination location',
      examples: [1710604800000, 1704153600000, 1715356800000],
    }),
  })
  .refine((data) => {
    return data.first_reported_timestamp <= data.last_reported_timestamp;
  }, 'first_reported_timestamp must be before or equal to last_reported_timestamp')
  .meta({
    title: 'Geographic Data',
    description:
      'Simplified geographic information tracking waste movement from origin to destination with temporal bounds',
  });

export type MassIDGeographicData = z.infer<typeof MassIDGeographicDataSchema>;

export const MassIDDataSchema = z
  .strictObject({
    waste_properties: MassIDWastePropertiesSchema,
    locations: uniqueBy(
      LocationSchema,
      (loc) => loc.id_hash,
      'Location ID hashes must be unique',
    )
      .min(1)
      .meta({
        title: 'Locations',
        description: 'All locations referenced in this MassID, indexed by ID',
      }),
    participants: uniqueBy(
      ParticipantSchema,
      (p) => p.id_hash,
      'Participant ID hashes must be unique',
    )
      .min(1)
      .meta({
        title: 'Participants',
        description:
          'All participants referenced in this MassID, indexed by ID',
      }),
    chain_of_custody: MassIDChainOfCustodySchema,
    geographic_data: MassIDGeographicDataSchema,
  })
  .refine((data) => {
    const participantIdSet = new Set(
      data.participants.map((participant) => participant.id_hash),
    );

    const eventParticipantIds = data.chain_of_custody.events.map(
      (event) => event.participant_id_hash,
    );

    const allEventParticipantsExist = eventParticipantIds.every(
      (participantId) => participantIdSet.has(participantId),
    );

    return allEventParticipantsExist;
  }, 'All participant ID hashes in chain of custody events must exist in participants array')

  .refine((data) => {
    const locationIdSet = new Set(
      data.locations.map((location) => location.id_hash),
    );

    const eventLocationIds = data.chain_of_custody.events.map(
      (event) => event.location_id_hash,
    );

    const allEventLocationsExist = eventLocationIds.every((locationId) =>
      locationIdSet.has(locationId),
    );

    return allEventLocationsExist;
  }, 'All location ID hashes in chain of custody events must exist in locations array')
  .meta({
    title: 'MassID Data',
    description:
      'MassID data containing waste tracking and chain of custody information',
  });

export type MassIDData = z.infer<typeof MassIDDataSchema>;
