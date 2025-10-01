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
} from '../shared/definitions.schema.js';
import { LocationSchema } from '../shared/entities/location.schema.js';
import { ParticipantSchema } from '../shared/entities/participant.schema.js';
import { uniqueBy } from '../shared/helpers.schema.js';

export type {
  LocationSchemaType,
  CoordinatesType,
  PrecisionLevelType,
} from '../shared/entities/location.schema';

export type { ParticipantSchemaType } from '../shared/entities/participant.schema';

const LocalClassificationSchema = z
  .strictObject({
    code: NonEmptyStringSchema.max(20).meta({
      title: 'Classification Code',
      description: 'Local waste classification code',
    }),
    description: NonEmptyStringSchema.max(200).meta({
      title: 'Classification Description',
      description: 'Local waste classification description',
    }),
    system: NonEmptyStringSchema.max(50).meta({
      title: 'Classification System',
      description:
        'Classification system name (e.g., "Ibama Waste Code", "European Waste Catalogue", "US EPA Codes")',
    }),
  })
  .meta({
    title: 'Local Classification',
    description:
      'Local or regional waste classification codes and descriptions',
  });

const MeasurementUnitSchema = z.enum(['kg', 'ton']).meta({
  title: 'Measurement Unit',
  description: 'Unit of measurement for the waste quantity',
  examples: ['kg', 'ton'],
});

const ContaminationLevelSchema = z
  .enum(['None', 'Low', 'Medium', 'High'])
  .meta({
    title: 'Contamination Level',
    description: 'Level of contamination in the waste batch',
    examples: ['Low', 'Medium', 'None'],
  });

const WasteClassificationSchema = z
  .strictObject({
    primary_type: WasteTypeSchema.meta({
      title: 'Primary Waste Type',
      description: 'Primary waste material category',
    }),
    subtype: WasteSubtypeSchema.meta({
      title: 'Waste Subtype',
      description: 'Specific subcategory of waste material',
    }),
    local_classification: LocalClassificationSchema.optional(),
    measurement_unit: MeasurementUnitSchema,
    net_weight: NonNegativeFloatSchema.meta({
      title: 'Net Weight',
      description:
        'Net weight of the waste batch in the specified measurement unit',
    }),
    contamination_level: ContaminationLevelSchema.optional(),
  })
  .meta({
    title: 'Waste Classification',
    description:
      'Standardized waste material classification and regulatory information',
  });

const EventAttributeFormatSchema = z
  .enum(['KILOGRAM', 'DATE', 'CURRENCY', 'PERCENTAGE', 'COORDINATE'])
  .meta({
    title: 'Event Attribute Format',
    description: 'Data format hint for proper display',
    examples: ['KILOGRAM', 'DATE', 'PERCENTAGE'],
  });

const EventAttributeSchema = z
  .strictObject({
    name: NonEmptyStringSchema.max(100).meta({
      title: 'Attribute Name',
      description: 'Event attribute name',
    }),
    value: z.union([z.string(), z.number(), z.boolean()]).meta({
      title: 'Attribute Value',
      description: 'Event attribute value',
    }),
    format: EventAttributeFormatSchema.optional(),
  })
  .meta({
    title: 'Event Attribute',
    description: 'Additional attribute specific to an event',
  });

const EventDocumentationSchema = z
  .strictObject({
    type: NonEmptyStringSchema.max(50).meta({
      title: 'Document Type',
      description: 'Type of supporting documentation',
    }),
    document_number: NonEmptyStringSchema.max(50).optional().meta({
      title: 'Document Number',
      description: 'Official document number if applicable',
    }),
    reference: NonEmptyStringSchema.meta({
      title: 'Document Reference',
      description:
        'Reference to document (IPFS hash, file name, or external URL)',
    }),
    issue_date: IsoDateSchema.optional().meta({
      title: 'Issue Date',
      description: 'Date the document was issued',
    }),
    issuer: NonEmptyStringSchema.max(100).optional().meta({
      title: 'Document Issuer',
      description: 'Entity that issued the document',
    }),
  })
  .meta({
    title: 'Event Documentation',
    description: 'Supporting documentation for an event',
  });

const ChainOfCustodyEventSchema = z
  .strictObject({
    event_id: UuidSchema.meta({
      title: 'Event ID',
      description: 'Unique event identifier',
    }),
    event_name: NonEmptyStringSchema.max(50).meta({
      title: 'Event Name',
      description: 'Name of custody or processing event',
    }),
    description: NonEmptyStringSchema.max(200).meta({
      title: 'Event Description',
      description: 'Detailed description of what happened during this event',
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
    documentation: z.array(EventDocumentationSchema).optional().meta({
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

const ChainOfCustodySchema = z
  .strictObject({
    events: z.array(ChainOfCustodyEventSchema).min(1).meta({
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

const TransportRouteSchema = z
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

const GeographicDataSchema = z
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
    transport_routes: z.array(TransportRouteSchema).meta({
      title: 'Transport Routes',
      description: 'Detailed transport route information',
    }),
  })
  .meta({
    title: 'Geographic Data',
    description:
      'Geographic information about waste origin and processing locations',
  });

export const MassIDDataSchema = z
  .strictObject({
    waste_classification: WasteClassificationSchema,
    locations: uniqueBy(
      LocationSchema,
      (loc) => loc.id,
      'Location IDs must be unique',
    )
      .min(1)
      .meta({
        title: 'Locations',
        description: 'All locations referenced in this MassID, indexed by ID',
        examples: [
          [
            {
              id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
              municipality: 'Macapá',
              administrative_division: 'Amapá',
              administrative_division_code: 'BR-AP',
              country: 'Brazil',
              country_code: 'BR',
              facility_type: 'Waste Generation',
              coordinates: {
                latitude: -0.02,
                longitude: -51.06,
                precision_level: 'city',
              },
              responsible_participant_id:
                '6f520d88-864d-432d-bf9f-5c3166c4818f',
            },
          ],
        ],
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
        examples: [
          [
            {
              id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
              name: 'Enlatados Produção',
              roles: ['Waste Generator'],
            },
            {
              id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
              name: 'Eco Reciclagem',
              roles: ['Hauler', 'Recycler'],
            },
          ],
        ],
      }),
    chain_of_custody: ChainOfCustodySchema,
    geographic_data: GeographicDataSchema,
  })
  .meta({
    title: 'MassID Data',
    description:
      'MassID data containing waste tracking and chain of custody information',
    examples: [
      {
        waste_classification: {
          primary_type: 'Organic',
          subtype: 'Food, Food Waste and Beverages',
          local_classification: {
            code: '04 02 20',
            description:
              'Lodos do tratamento local de efluentes não abrangidas em 04 02 19',
            system: 'Ibama Waste Code',
          },
          measurement_unit: 'kg',
          net_weight: 3000,
          contamination_level: 'Low',
        },
        locations: [
          {
            id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
            municipality: 'Macapá',
            administrative_division: 'Amapá',
            administrative_division_code: 'BR-AP',
            country: 'Brazil',
            country_code: 'BR',
            facility_type: 'Waste Generation',
            coordinates: {
              latitude: -0.02,
              longitude: -51.06,
              precision_level: 'city',
            },
            responsible_participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
          },
        ],
        participants: [
          {
            id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
            name: 'Enlatados Produção',
            roles: ['Waste Generator'],
          },
        ],
        chain_of_custody: {
          events: [
            {
              event_id: '8f799606-4ed5-49ce-8310-83b0c56ac01e',
              event_name: 'Pick-up',
              description:
                'Waste picked up by hauler Eco Reciclagem at Enlatados Produção',
              timestamp: '2024-12-05T11:02:47.000Z',
              participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
              location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
            },
          ],
          total_distance_km: 45.2,
          total_duration_hours: 72.5,
        },
        geographic_data: {
          origin_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
          processing_location_ids: ['d01217a9-9d21-4f16-8908-0fea6750953e'],
          final_destination_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
          transport_routes: [
            {
              from_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
              to_location_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
              distance_km: 45.2,
              transport_method: 'Truck',
              duration_hours: 72.5,
            },
          ],
        },
      },
    ],
  });

export type MassIDDataSchemaType = z.infer<typeof MassIDDataSchema>;
export type WasteClassificationType = z.infer<typeof WasteClassificationSchema>;
export type LocalClassificationType = z.infer<typeof LocalClassificationSchema>;
export type ChainOfCustodyType = z.infer<typeof ChainOfCustodySchema>;
export type ChainOfCustodyEventType = z.infer<typeof ChainOfCustodyEventSchema>;
export type EventAttributeType = z.infer<typeof EventAttributeSchema>;
export type EventDocumentationType = z.infer<typeof EventDocumentationSchema>;
export type GeographicDataType = z.infer<typeof GeographicDataSchema>;
export type TransportRouteType = z.infer<typeof TransportRouteSchema>;
export type MeasurementUnitType = z.infer<typeof MeasurementUnitSchema>;
export type ContaminationLevelType = z.infer<typeof ContaminationLevelSchema>;
export type EventAttributeFormatType = z.infer<
  typeof EventAttributeFormatSchema
>;
