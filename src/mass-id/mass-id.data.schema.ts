import { z } from 'zod';
import {
  uuid,
  wasteType,
  wasteSubtype,
  nonEmptyString,
  nonNegativeFloat,
  isoTimestamp,
  isoDate,
  hours,
} from '../shared/definitions.schema.js';
import { locationSchema } from '../shared/entities/location.schema.js';
import { participantSchema } from '../shared/entities/participant.schema.js';

export type {
  LocationSchema,
  Coordinates,
  PrecisionLevel,
} from '../shared/entities/location.schema';

export type { ParticipantSchema } from '../shared/entities/participant.schema';

const localClassification = z
  .strictObject({
    code: nonEmptyString
      .max(20)
      .describe('Local waste classification code')
      .meta({
        title: 'Classification Code',
        examples: ['04 02 20', 'EWC-150106', 'US-D001'],
      }),
    description: nonEmptyString
      .max(200)
      .describe('Local waste classification description')
      .meta({
        title: 'Classification Description',
        examples: [
          'Lodos do tratamento local de efluentes não abrangidas em 04 02 19',
          'Mixed plastics packaging',
          'Ignitable waste',
        ],
      }),
    system: nonEmptyString
      .max(50)
      .describe(
        'Classification system name (e.g., "Ibama Waste Code", "European Waste Catalogue", "US EPA Codes")',
      )
      .meta({
        title: 'Classification System',
        examples: [
          'Ibama Waste Code',
          'European Waste Catalogue',
          'US EPA Codes',
        ],
      }),
  })
  .describe('Local or regional waste classification codes and descriptions')
  .meta({
    title: 'Local Classification',
    examples: [
      {
        code: '04 02 20',
        description:
          'Lodos do tratamento local de efluentes não abrangidas em 04 02 19',
        system: 'Ibama Waste Code',
      },
    ],
  });

const measurementUnit = z
  .enum(['kg', 'ton'])
  .describe('Unit of measurement for the waste quantity')
  .meta({
    title: 'Measurement Unit',
    examples: ['kg', 'ton'],
  });

const contaminationLevel = z
  .enum(['None', 'Low', 'Medium', 'High'])
  .describe('Level of contamination in the waste batch')
  .meta({
    title: 'Contamination Level',
    examples: ['Low', 'Medium', 'None'],
  });

const wasteClassification = z
  .strictObject({
    primary_type: wasteType.describe('Primary waste material category').meta({
      title: 'Primary Waste Type',
      examples: ['Organic', 'Plastic', 'Metal'],
    }),
    subtype: wasteSubtype
      .describe('Specific subcategory of waste material')
      .meta({
        title: 'Waste Subtype',
        examples: [
          'Food, Food Waste and Beverages',
          'PET Bottles',
          'Aluminum Cans',
        ],
      }),
    local_classification: localClassification.optional(),
    measurement_unit: measurementUnit,
    net_weight: nonNegativeFloat
      .describe(
        'Net weight of the waste batch in the specified measurement unit',
      )
      .meta({
        title: 'Net Weight',
        examples: [3000, 1500, 2.5],
      }),
    contamination_level: contaminationLevel.optional(),
  })
  .describe(
    'Standardized waste material classification and regulatory information',
  )
  .meta({
    title: 'Waste Classification',
    examples: [
      {
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
    ],
  });

const eventAttributeFormat = z
  .enum(['KILOGRAM', 'DATE', 'CURRENCY', 'PERCENTAGE', 'COORDINATE'])
  .describe('Data format hint for proper display')
  .meta({
    title: 'Event Attribute Format',
    examples: ['KILOGRAM', 'DATE', 'PERCENTAGE'],
  });

const eventAttribute = z
  .strictObject({
    name: nonEmptyString
      .max(100)
      .describe('Event attribute name')
      .meta({
        title: 'Attribute Name',
        examples: ['Vehicle Type', 'Driver Identifier', 'Document Type'],
      }),
    value: z
      .union([z.string(), z.number(), z.boolean()])
      .describe('Event attribute value')
      .meta({
        title: 'Attribute Value',
        examples: ['Truck', '645eb901-bc17-497f-b53b-9bdd619ae2ec', 'MTR'],
      }),
    format: eventAttributeFormat.optional(),
  })
  .meta({
    title: 'Event Attribute',
    examples: [
      {
        name: 'Vehicle Type',
        value: 'Truck',
      },
      {
        name: 'Gross Weight',
        value: 22700,
        format: 'KILOGRAM',
      },
    ],
  });

const eventDocumentation = z
  .strictObject({
    type: nonEmptyString
      .max(50)
      .describe('Type of supporting documentation')
      .meta({
        title: 'Document Type',
        examples: [
          'Transport Manifest',
          'Recycling Certificate',
          'Waste Transfer Note',
        ],
      }),
    document_number: nonEmptyString
      .max(50)
      .optional()
      .describe('Official document number if applicable')
      .meta({
        title: 'Document Number',
        examples: ['MTR-4126', 'CDF-2353', 'WTN-789'],
      }),
    reference: nonEmptyString
      .describe('Reference to document (IPFS hash, file name, or external URL)')
      .meta({
        title: 'Document Reference',
        examples: [
          'transport-manifest.pdf',
          'recycling-manifest.pdf',
          'QmDocument123',
        ],
      }),
    issue_date: isoDate
      .optional()
      .describe('Date the document was issued')
      .meta({
        title: 'Issue Date',
        examples: ['2024-02-10', '2024-03-10', '2024-12-05'],
      }),
    issuer: nonEmptyString
      .max(100)
      .optional()
      .describe('Entity that issued the document')
      .meta({
        title: 'Document Issuer',
        examples: [
          'Eco Reciclagem',
          'Environmental Authority',
          'Transport Company',
        ],
      }),
  })
  .meta({
    title: 'Event Documentation',
    examples: [
      {
        type: 'Transport Manifest',
        document_number: 'MTR-4126',
        reference: 'transport-manifest.pdf',
        issue_date: '2024-02-10',
      },
      {
        type: 'Recycling Certificate',
        document_number: 'CDF-2353',
        reference: 'recycling-manifest.pdf',
        issue_date: '2024-03-10',
      },
    ],
  });

const chainOfCustodyEvent = z
  .strictObject({
    event_id: uuid.describe('Unique event identifier').meta({
      title: 'Event ID',
      examples: [
        '8f799606-4ed5-49ce-8310-83b0c56ac01e',
        '9f6c6855-0a6b-4989-a3fc-1a8a38f919ec',
        '591eb414-a678-486d-982c-3c25f3cb52de',
      ],
    }),
    event_name: nonEmptyString
      .max(50)
      .describe('Name of custody or processing event')
      .meta({
        title: 'Event Name',
        examples: ['Pick-up', 'Transport', 'Weighing', 'Recycling'],
      }),
    description: nonEmptyString
      .max(200)
      .describe('Detailed description of what happened during this event')
      .meta({
        title: 'Event Description',
        examples: [
          'Waste picked up by hauler Eco Reciclagem at Enlatados Produção',
          'Waste transported to recycling facility',
          'Composting process completed',
        ],
      }),
    timestamp: isoTimestamp
      .describe('ISO 8601 timestamp when the event occurred')
      .meta({
        title: 'Event Timestamp',
        examples: ['2024-12-05T11:02:47.000Z', '2025-02-22T10:35:12.000Z'],
      }),
    participant_id: uuid
      .describe('Reference to participant in the participants array')
      .meta({
        title: 'Participant ID',
        examples: [
          '6f520d88-864d-432d-bf9f-5c3166c4818f',
          '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
        ],
      }),
    location_id: uuid
      .describe('Reference to location in the locations array')
      .meta({
        title: 'Location ID',
        examples: [
          'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
          'd01217a9-9d21-4f16-8908-0fea6750953e',
        ],
      }),
    weight: nonNegativeFloat
      .optional()
      .describe('Mass weight after this event')
      .meta({
        title: 'Event Weight',
        examples: [3000, 2950, 2800],
      }),
    attributes: z
      .array(eventAttribute)
      .optional()
      .describe('Additional attributes specific to this event')
      .meta({
        title: 'Event Attributes',
        examples: [
          [
            { name: 'Vehicle Type', value: 'Truck' },
            {
              name: 'Driver Identifier',
              value: '645eb901-bc17-497f-b53b-9bdd619ae2ec',
            },
          ],
        ],
      }),
    documentation: z
      .array(eventDocumentation)
      .optional()
      .describe('Associated documentation for this event')
      .meta({
        title: 'Event Documentation',
        examples: [
          [
            {
              type: 'Transport Manifest',
              document_number: 'MTR-4126',
              reference: 'transport-manifest.pdf',
              issue_date: '2024-02-10',
            },
          ],
        ],
      }),
    notes: nonEmptyString
      .max(500)
      .optional()
      .describe('Additional notes or comments about this event')
      .meta({
        title: 'Event Notes',
        examples: [
          'Weather conditions were optimal for transport',
          'Minor delay due to traffic',
          'Processing completed ahead of schedule',
        ],
      }),
  })
  .describe('Chain of custody event')
  .meta({
    title: 'Chain of Custody Event',
    examples: [
      {
        event_id: '8f799606-4ed5-49ce-8310-83b0c56ac01e',
        event_name: 'Pick-up',
        description:
          'Waste picked up by hauler Eco Reciclagem at Enlatados Produção',
        timestamp: '2024-12-05T11:02:47.000Z',
        participant_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
        location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
        attributes: [
          { name: 'Vehicle Type', value: 'Truck' },
          {
            name: 'Driver Identifier',
            value: '645eb901-bc17-497f-b53b-9bdd619ae2ec',
          },
        ],
      },
    ],
  });

const chainOfCustody = z
  .strictObject({
    events: z
      .array(chainOfCustodyEvent)
      .min(1)
      .describe(
        'Chronological sequence of custody transfer and processing events',
      )
      .meta({
        title: 'Custody Events',
        examples: [
          [
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
        ],
      }),
    total_distance_km: nonNegativeFloat
      .describe('Total distance traveled across all transport events')
      .meta({
        title: 'Total Distance (km)',
        examples: [45.2, 123.5, 89.7],
      }),
    total_duration_hours: hours
      .describe('Total time from first to last event in hours')
      .meta({
        title: 'Total Duration (hours)',
        examples: [72.5, 168.0, 96.3],
      }),
  })
  .describe(
    'Complete chain of custody tracking from waste generation to final processing',
  )
  .meta({
    title: 'Chain of Custody',
    examples: [
      {
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
    ],
  });

const transportRoute = z
  .strictObject({
    from_location_id: uuid
      .describe('Reference to the origin location in the locations array')
      .meta({
        title: 'From Location ID',
        examples: [
          'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
          'd01217a9-9d21-4f16-8908-0fea6750953e',
        ],
      }),
    to_location_id: uuid
      .describe('Reference to the destination location in the locations array')
      .meta({
        title: 'To Location ID',
        examples: [
          'd01217a9-9d21-4f16-8908-0fea6750953e',
          'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        ],
      }),
    distance_km: nonNegativeFloat
      .describe('Distance for this route segment in kilometers')
      .meta({
        title: 'Distance (km)',
        examples: [45.2, 123.5, 89.7],
      }),
    transport_method: nonEmptyString
      .max(50)
      .describe('Method of transportation for this segment')
      .meta({
        title: 'Transport Method',
        examples: ['Truck', 'Rail', 'Ship'],
      }),
    duration_hours: hours
      .describe('Time taken for this route segment in hours')
      .meta({
        title: 'Duration (hours)',
        examples: [72.5, 24.0, 48.5],
      }),
  })
  .describe('Transport route segment information')
  .meta({
    title: 'Transport Route',
    examples: [
      {
        from_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
        to_location_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
        distance_km: 45.2,
        transport_method: 'Truck',
        duration_hours: 72.5,
      },
    ],
  });

const geographicData = z
  .strictObject({
    origin_location_id: uuid
      .describe('Reference to origin location in the locations array')
      .meta({
        title: 'Origin Location ID',
        examples: [
          'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
          'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        ],
      }),
    processing_location_ids: z
      .array(uuid)
      .optional()
      .describe('Locations where the waste was processed or handled')
      .meta({
        title: 'Processing Location IDs',
        examples: [
          ['d01217a9-9d21-4f16-8908-0fea6750953e'],
          [
            'b2c3d4e5-f6a7-8901-bcde-f23456789012',
            'c3d4e5f6-a7b8-9012-cdef-345678901234',
          ],
        ],
      }),
    final_destination_id: uuid
      .describe('Reference to final destination in the locations array')
      .meta({
        title: 'Final Destination ID',
        examples: [
          'd01217a9-9d21-4f16-8908-0fea6750953e',
          'e4f5a6b7-c8d9-0123-def4-56789012345a',
        ],
      }),
    transport_routes: z
      .array(transportRoute)
      .describe('Detailed transport route information')
      .meta({
        title: 'Transport Routes',
        examples: [
          [
            {
              from_location_id: 'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
              to_location_id: 'd01217a9-9d21-4f16-8908-0fea6750953e',
              distance_km: 45.2,
              transport_method: 'Truck',
              duration_hours: 72.5,
            },
          ],
        ],
      }),
  })
  .describe(
    'Geographic information about waste origin and processing locations',
  )
  .meta({
    title: 'Geographic Data',
    examples: [
      {
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
    ],
  });

export const massIDDataSchema = z
  .strictObject({
    waste_classification: wasteClassification,
    locations: z
      .array(locationSchema)
      .min(1)
      .refine((locations) => {
        const ids = locations.map((loc) => loc.id);
        return ids.length === new Set(ids).size;
      }, 'Location IDs must be unique')
      .describe('All locations referenced in this MassID, indexed by ID')
      .meta({
        title: 'Locations',
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
    participants: z
      .array(participantSchema)
      .min(1)
      .refine((participants) => {
        const ids = participants.map((p) => p.id);
        return ids.length === new Set(ids).size;
      }, 'Participant IDs must be unique')
      .describe('All participants referenced in this MassID, indexed by ID')
      .meta({
        title: 'Participants',
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
    chain_of_custody: chainOfCustody,
    geographic_data: geographicData,
  })
  .describe(
    'MassID data containing waste tracking and chain of custody information',
  )
  .meta({
    title: 'MassID Data',
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

export type MassIDDataSchema = z.infer<typeof massIDDataSchema>;
export type WasteClassification = z.infer<typeof wasteClassification>;
export type LocalClassification = z.infer<typeof localClassification>;
export type ChainOfCustody = z.infer<typeof chainOfCustody>;
export type ChainOfCustodyEvent = z.infer<typeof chainOfCustodyEvent>;
export type EventAttribute = z.infer<typeof eventAttribute>;
export type EventDocumentation = z.infer<typeof eventDocumentation>;
export type GeographicData = z.infer<typeof geographicData>;
export type TransportRoute = z.infer<typeof transportRoute>;
export type MeasurementUnit = z.infer<typeof measurementUnit>;
export type ContaminationLevel = z.infer<typeof contaminationLevel>;
export type EventAttributeFormat = z.infer<typeof eventAttributeFormat>;
