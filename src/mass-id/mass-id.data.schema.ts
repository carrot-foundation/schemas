import { z } from 'zod';
import {
  UuidSchema,
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  NonNegativeFloatSchema,
  IsoTimestampSchema,
  IsoDateSchema,
  HoursSchema,
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

const ContaminationLevelSchema = z
  .enum(['None', 'Low', 'Medium', 'High'])
  .meta({
    title: 'Contamination Level',
    description: 'Level of contamination in the waste batch',
    examples: ['Low', 'Medium', 'None'],
  });

export type ContaminationLevel = z.infer<typeof ContaminationLevelSchema>;

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
    contamination_level: ContaminationLevelSchema.optional(),
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

const EventDocumentSchema = z
  .strictObject({
    type: NonEmptyStringSchema.max(50).meta({
      title: 'Document Type',
      description: 'Type of supporting documentation',
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
      title: 'Document Reference',
      description:
        'Reference to document (IPFS hash, file name, or external URL)',
      examples: [
        'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
        'waste_transfer_note_2024_001.pdf',
        'https://docs.example.com/certificates/disposal_cert_456.pdf',
        'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        'processing_receipt_20240315.jpg',
      ],
    }),
    issue_date: IsoDateSchema.optional().meta({
      title: 'Issue Date',
      description: 'Date the document was issued',
    }),
    issuer: NonEmptyStringSchema.max(100)
      .optional()
      .meta({
        title: 'Document Issuer',
        description: 'Entity that issued the document',
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
    title: 'Event Document',
    description: 'Supporting event document',
  });
export type EventDocumentation = z.infer<typeof EventDocumentSchema>;

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
    timestamp: IsoTimestampSchema.meta({
      title: 'Event Timestamp',
      description: 'ISO 8601 timestamp when the event occurred',
    }),
    participant_id: UuidSchema.meta({
      title: 'Participant ID',
      description: 'Reference to participant in the participants array',
    }),
    location_id: UuidSchema.meta({
      title: 'Location ID',
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
    documentation: z.array(EventDocumentSchema).optional().meta({
      title: 'Event Documentation',
      description: 'Associated documentation for this event',
    }),
    notes: NonEmptyStringSchema.max(500).optional().meta({
      title: 'Event Notes',
      description: 'Additional notes or comments about this event',
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
    total_distance_km: NonNegativeFloatSchema.meta({
      title: 'Total Distance (km)',
      description: 'Total distance traveled across all transport events',
    }),
    total_duration_hours: HoursSchema.meta({
      title: 'Total Duration (hours)',
      description: 'Total time from first to last event in hours',
    }),
  })
  .meta({
    title: 'Chain of Custody',
    description:
      'Complete chain of custody tracking from waste generation to final processing',
  });

export type MassIDChainOfCustody = z.infer<typeof MassIDChainOfCustodySchema>;

const MassIDTransportRouteSchema = z
  .strictObject({
    from_location_id: UuidSchema.meta({
      title: 'From Location ID',
      description: 'Reference to the origin location in the locations array',
    }),
    to_location_id: UuidSchema.meta({
      title: 'To Location ID',
      description:
        'Reference to the destination location in the locations array',
    }),
    distance_km: NonNegativeFloatSchema.meta({
      title: 'Distance (km)',
      description: 'Distance for this route segment in kilometers',
    }),
    transport_method: NonEmptyStringSchema.max(50).meta({
      title: 'Transport Method',
      description: 'Method of transportation for this segment',
      examples: [
        'Truck',
        'Rail',
        'Barge',
        'Container Ship',
        'Conveyor Belt',
        'Pipeline',
        'Walking',
        'Forklift',
      ],
    }),
    duration_hours: HoursSchema.meta({
      title: 'Duration (hours)',
      description: 'Time taken for this route segment in hours',
    }),
  })
  .meta({
    title: 'Transport Route',
    description: 'Transport route segment information',
  });

export type MassIDTransportRoute = z.infer<typeof MassIDTransportRouteSchema>;

const MassIDGeographicDataSchema = z
  .strictObject({
    origin_location_id: UuidSchema.meta({
      title: 'Origin Location ID',
      description: 'Reference to origin location in the locations array',
    }),
    processing_location_ids: z.array(UuidSchema).optional().meta({
      title: 'Processing Location IDs',
      description: 'Locations where the waste was processed or handled',
    }),
    final_destination_id: UuidSchema.meta({
      title: 'Final Destination ID',
      description: 'Reference to final destination in the locations array',
    }),
    transport_routes: z.array(MassIDTransportRouteSchema).meta({
      title: 'Transport Routes',
      description: 'Detailed transport route information',
    }),
  })
  .meta({
    title: 'Geographic Data',
    description:
      'Geographic information about waste origin and processing locations',
  });

export type MassIDGeographicData = z.infer<typeof MassIDGeographicDataSchema>;

export const MassIDDataSchema = z
  .strictObject({
    waste_properties: MassIDWastePropertiesSchema,
    locations: uniqueBy(
      LocationSchema,
      (loc) => loc.id,
      'Location IDs must be unique',
    )
      .min(1)
      .meta({
        title: 'Locations',
        description: 'All locations referenced in this MassID, indexed by ID',
      }),
    participants: uniqueBy(
      ParticipantSchema,
      (p) => p.id,
      'Participant IDs must be unique',
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
      data.participants.map((participant) => participant.id),
    );

    const eventParticipantIds = data.chain_of_custody.events.map(
      (event) => event.participant_id,
    );

    const allEventParticipantsExist = eventParticipantIds.every(
      (participantId) => participantIdSet.has(participantId),
    );

    return allEventParticipantsExist;
  }, 'All participant IDs in chain of custody events must exist in participants array')

  .refine((data) => {
    const locationIdSet = new Set(
      data.locations.map((location) => location.id),
    );

    const eventLocationIds = data.chain_of_custody.events.map(
      (event) => event.location_id,
    );

    const allEventLocationsExist = eventLocationIds.every((locationId) =>
      locationIdSet.has(locationId),
    );

    return allEventLocationsExist;
  }, 'All location IDs in chain of custody events must exist in locations array')
  .meta({
    title: 'MassID Data',
    description:
      'MassID data containing waste tracking and chain of custody information',
  });

export type MassIDData = z.infer<typeof MassIDDataSchema>;
