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
  .object({
    code: nonEmptyString.max(20).describe('Local waste classification code'),
    description: nonEmptyString
      .max(200)
      .describe('Local waste classification description'),
    system: nonEmptyString
      .max(50)
      .describe(
        'Classification system name (e.g., "Ibama Waste Code", "European Waste Catalogue", "US EPA Codes")',
      ),
  })
  .strict()
  .describe('Local or regional waste classification codes and descriptions');

const measurementUnit = z
  .enum(['kg', 'ton'])
  .describe('Unit of measurement for the waste quantity');

const contaminationLevel = z
  .enum(['None', 'Low', 'Medium', 'High'])
  .describe('Level of contamination in the waste batch');

const wasteClassification = z
  .object({
    primary_type: wasteType.describe('Primary waste material category'),
    subtype: wasteSubtype.describe('Specific subcategory of waste material'),
    local_classification: localClassification.optional(),
    measurement_unit: measurementUnit,
    net_weight: nonNegativeFloat.describe(
      'Net weight of the waste batch in the specified measurement unit',
    ),
    contamination_level: contaminationLevel.optional(),
  })
  .strict()
  .describe(
    'Standardized waste material classification and regulatory information',
  );

const eventAttributeFormat = z
  .enum(['KILOGRAM', 'DATE', 'CURRENCY', 'PERCENTAGE', 'COORDINATE'])
  .describe('Data format hint for proper display');

const eventAttribute = z
  .object({
    name: nonEmptyString.max(100).describe('Event attribute name'),
    value: z
      .union([z.string(), z.number(), z.boolean()])
      .describe('Event attribute value'),
    format: eventAttributeFormat.optional(),
  })
  .strict();

const eventDocumentation = z
  .object({
    type: nonEmptyString.max(50).describe('Type of supporting documentation'),
    document_number: nonEmptyString
      .max(50)
      .optional()
      .describe('Official document number if applicable'),
    reference: nonEmptyString.describe(
      'Reference to document (IPFS hash, file name, or external URL)',
    ),
    issue_date: isoDate.optional().describe('Date the document was issued'),
    issuer: nonEmptyString
      .max(100)
      .optional()
      .describe('Entity that issued the document'),
  })
  .strict();

const chainOfCustodyEvent = z
  .object({
    event_id: uuid.describe('Unique event identifier'),
    event_name: nonEmptyString
      .max(50)
      .describe('Name of custody or processing event'),
    description: nonEmptyString
      .max(200)
      .describe('Detailed description of what happened during this event'),
    timestamp: isoTimestamp.describe(
      'ISO 8601 timestamp when the event occurred',
    ),
    participant_id: uuid.describe(
      'Reference to participant in the participants array',
    ),
    location_id: uuid.describe('Reference to location in the locations array'),
    weight: nonNegativeFloat
      .optional()
      .describe('Mass weight after this event'),
    attributes: z
      .array(eventAttribute)
      .optional()
      .describe('Additional attributes specific to this event'),
    documentation: z
      .array(eventDocumentation)
      .optional()
      .describe('Associated documentation for this event'),
    notes: nonEmptyString
      .max(500)
      .optional()
      .describe('Additional notes or comments about this event'),
  })
  .strict()
  .describe('Chain of custody event');

const chainOfCustody = z
  .object({
    events: z
      .array(chainOfCustodyEvent)
      .min(1)
      .describe(
        'Chronological sequence of custody transfer and processing events',
      ),
    total_distance_km: nonNegativeFloat.describe(
      'Total distance traveled across all transport events',
    ),
    total_duration_hours: hours.describe(
      'Total time from first to last event in hours',
    ),
  })
  .strict()
  .describe(
    'Complete chain of custody tracking from waste generation to final processing',
  );

const transportRoute = z
  .object({
    from_location_id: uuid.describe(
      'Reference to the origin location in the locations array',
    ),
    to_location_id: uuid.describe(
      'Reference to the destination location in the locations array',
    ),
    distance_km: nonNegativeFloat.describe(
      'Distance for this route segment in kilometers',
    ),
    transport_method: nonEmptyString
      .max(50)
      .describe('Method of transportation for this segment'),
    duration_hours: hours.describe(
      'Time taken for this route segment in hours',
    ),
  })
  .strict()
  .describe('Transport route segment information');

const geographicData = z
  .object({
    origin_location_id: uuid.describe(
      'Reference to origin location in the locations array',
    ),
    processing_location_ids: z
      .array(uuid)
      .optional()
      .describe('Locations where the waste was processed or handled'),
    final_destination_id: uuid.describe(
      'Reference to final destination in the locations array',
    ),
    transport_routes: z
      .array(transportRoute)
      .describe('Detailed transport route information'),
  })
  .strict()
  .describe(
    'Geographic information about waste origin and processing locations',
  );

export const massIDDataSchema = z
  .object({
    waste_classification: wasteClassification,
    locations: z
      .array(locationSchema)
      .min(1)
      .refine((locations) => {
        const ids = locations.map((loc) => loc.id);
        return ids.length === new Set(ids).size;
      }, 'Location IDs must be unique')
      .describe('All locations referenced in this MassID, indexed by ID'),
    participants: z
      .array(participantSchema)
      .min(1)
      .refine((participants) => {
        const ids = participants.map((p) => p.id);
        return ids.length === new Set(ids).size;
      }, 'Participant IDs must be unique')
      .describe('All participants referenced in this MassID, indexed by ID'),
    chain_of_custody: chainOfCustody,
    geographic_data: geographicData,
  })
  .strict()
  .describe(
    'MassID data containing waste tracking and chain of custody information',
  )
  .refine((data) => {
    const participantIds = new Set(data.participants.map((p) => p.id));
    const eventParticipantIds = data.chain_of_custody.events.map(
      (e) => e.participant_id,
    );
    return eventParticipantIds.every((id) => participantIds.has(id));
  }, 'All participant IDs in chain of custody events must exist in participants array')
  .refine((data) => {
    const locationIds = new Set(data.locations.map((l) => l.id));
    const eventLocationIds = data.chain_of_custody.events.map(
      (e) => e.location_id,
    );
    return eventLocationIds.every((id) => locationIds.has(id));
  }, 'All location IDs in chain of custody events must exist in locations array')
  .refine((data) => {
    const locationIds = new Set(data.locations.map((l) => l.id));
    const geo = data.geographic_data;

    const referencedIds = [
      geo.origin_location_id,
      geo.final_destination_id,
      ...(geo.processing_location_ids || []),
    ];

    return referencedIds.every((id) => locationIds.has(id));
  }, 'All location IDs in geographic data must exist in locations array')
  .refine((data) => {
    const locationIds = new Set(data.locations.map((l) => l.id));
    const routeLocationIds = data.geographic_data.transport_routes.flatMap(
      (route) => [route.from_location_id, route.to_location_id],
    );

    return routeLocationIds.every((id) => locationIds.has(id));
  }, 'All location IDs in transport routes must exist in locations array')
  .refine((data) => {
    const participantIds = new Set(data.participants.map((p) => p.id));
    const responsibleParticipantIds = data.locations.map(
      (l) => l.responsible_participant_id,
    );

    return responsibleParticipantIds.every((id) => participantIds.has(id));
  }, 'All responsible participant IDs in locations must exist in participants array');

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
