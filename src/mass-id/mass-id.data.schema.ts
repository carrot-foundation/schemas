import { z } from 'zod';
import {
  UuidSchema,
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  WeightKgSchema,
  IsoTimestampSchema,
  LocationSchema,
  ParticipantSchema,
  uniqueBy,
} from '../shared';
import { Sha256HashSchema } from '../shared/schemas/primitives';

export const IbamaWasteClassificationSchema = z
  .string()
  .regex(/^\d{2} \d{2} \d{2}\*?$/, 'Invalid Ibama code format')
  .meta({
    title: 'Ibama Classification Code',
    description:
      'Ibama waste classification code in the format NN NN NN with required spaces and optional trailing *',
    examples: ['20 01 01', '20 01 01*', '04 02 20'],
  });

const MassIDLocalClassificationSchema = z
  .strictObject({
    code: IbamaWasteClassificationSchema,
    system: z.literal('Ibama').meta({
      title: 'Classification System',
      description: 'Authority or standard providing the classification code',
      examples: ['Ibama'],
    }),
  })
  .meta({
    title: 'Local Classification',
    description: 'Regulatory classification reference for the waste material',
    examples: [{ code: '04 02 20', system: 'Ibama' }],
  });

export type IbamaWasteClassification = z.infer<
  typeof IbamaWasteClassificationSchema
>;

export type MassIDLocalClassification = z.infer<
  typeof MassIDLocalClassificationSchema
>;

const MassIDWastePropertiesSchema = z
  .strictObject({
    type: WasteTypeSchema.meta({
      title: 'Waste Type',
      description: 'Waste material category',
      examples: ['Organic'],
    }),
    subtype: WasteSubtypeSchema.meta({
      title: 'Waste Subtype',
      description: 'Specific subcategory of waste material',
      examples: ['Food, Food Waste and Beverages'],
    }),
    local_classification: MassIDLocalClassificationSchema.optional(),
    net_weight: WeightKgSchema.meta({
      title: 'Net Weight (kg)',
      description: 'Net weight of the waste batch in kilograms (kg)',
      examples: [3000],
    }),
  })
  .meta({
    title: 'Waste Properties',
    description:
      'Standardized waste material properties and regulatory information',
  });

export type MassIDWasteProperties = z.infer<typeof MassIDWastePropertiesSchema>;

const MassIDAttachmentTypeSchema = z
  .enum(['Recycling Manifest', 'Transport Manifest'])
  .meta({
    title: 'Attachment Type',
    description: 'Type of supporting attachment linked to a MassID event',
    examples: ['Recycling Manifest', 'Transport Manifest'],
  });

export type MassIDAttachmentType = z.infer<typeof MassIDAttachmentTypeSchema>;

const MassIDAttachmentSchema = z
  .strictObject({
    type: MassIDAttachmentTypeSchema,
    document_number: NonEmptyStringSchema.max(50)
      .optional()
      .meta({
        title: 'Document Number',
        description: 'Official document number if applicable',
        examples: ['2353', '12345'],
      }),
    issued_at: IsoTimestampSchema.optional().meta({
      title: 'Issued At',
      description: 'ISO 8601 timestamp when the attachment was issued',
    }),
    event_id: UuidSchema.meta({
      title: 'Event ID',
      description: 'Identifier of the event this attachment belongs to',
    }),
  })
  .meta({
    title: 'MassID Attachment',
    description:
      'Attachment associated with a specific MassID event, linked by event_id',
  });

export type MassIDAttachment = z.infer<typeof MassIDAttachmentSchema>;

const MassIDBaseEventSchema = z
  .strictObject({
    event_id: UuidSchema.meta({
      title: 'Event ID',
      description: 'Unique event identifier',
    }),
    description: NonEmptyStringSchema.max(200)
      .optional()
      .meta({
        title: 'Event Description',
        description: 'Detailed description of what happened during this event',
        examples: [
          'Waste collected from residential area using collection truck',
          'Material sorted into recyclable and non-recyclable fractions',
          'Waste transferred to authorized recycling facility',
        ],
      }),
    timestamp: IsoTimestampSchema.meta({
      title: 'Event Timestamp',
      description: 'ISO 8601 timestamp when the event occurred',
    }),
    participant_id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description: 'Reference to participant in the participants array',
    }),
    location_id_hash: Sha256HashSchema.meta({
      title: 'Location ID Hash',
      description: 'Reference to location in the locations array',
    }),
    weight: WeightKgSchema.optional().meta({
      title: 'Event Weight (kg)',
      description: 'Mass weight after this event in kilograms (kg)',
    }),
  })
  .meta({
    title: 'MassID Base Event',
    description: 'Base MassID event definition shared across event types',
  });

const buildMassIDEventSchema = <TEventName extends string>(
  eventName: TEventName,
  description: string,
) =>
  MassIDBaseEventSchema.safeExtend({
    event_name: z.literal(eventName).meta({
      title: 'Event Name',
      description: `${eventName} event discriminator`,
      examples: [eventName],
    }),
  }).meta({
    title: `${eventName} Event`,
    description,
  });

const PickUpEventSchema = buildMassIDEventSchema(
  'Pick-up',
  'Waste picked up from the origin location',
).safeExtend({
  data: z
    .strictObject({
      vehicle_type: NonEmptyStringSchema.max(50)
        .optional()
        .meta({
          title: 'Vehicle Type',
          description: 'Type of vehicle used for pick-up operations',
          examples: ['Truck', 'Van', 'Compactor'],
        }),
    })
    .optional()
    .meta({
      title: 'Pick-up Event Data',
      description: 'Vehicle information associated with the pick-up event',
    }),
});

const WeighingEventSchema = buildMassIDEventSchema(
  'Weighing',
  'Waste weighed at a facility',
).safeExtend({
  data: z
    .strictObject({
      weighing_capture_method: NonEmptyStringSchema.max(100)
        .optional()
        .meta({
          title: 'Weighing Capture Method',
          description: 'Method used to capture the weight measurement',
          examples: [
            'Digital scale integration',
            'Manual entry',
            'Automated capture via IoT scale',
          ],
        }),
      scale_type: NonEmptyStringSchema.max(50)
        .optional()
        .meta({
          title: 'Scale Type',
          description: 'Type of scale used to weigh the load',
          examples: ['Weighbridge (Truck Scale)', 'Axle scale'],
        }),
      container_type: NonEmptyStringSchema.max(50)
        .optional()
        .meta({
          title: 'Container Type',
          description: 'Type of container holding the waste during weighing',
          examples: ['Roll-off container', 'Front loader bin'],
        }),
      vehicle_type: NonEmptyStringSchema.max(50)
        .optional()
        .meta({
          title: 'Vehicle Type',
          description: 'Type of vehicle used during weighing',
          examples: ['Truck', 'Trailer'],
        }),
      container_capacity: WeightKgSchema.optional().meta({
        title: 'Container Capacity (kg)',
        description: 'Maximum container capacity in kilograms',
        examples: [12000],
      }),
      gross_weight: WeightKgSchema.optional().meta({
        title: 'Gross Weight (kg)',
        description: 'Total weight including vehicle/container before tare',
        examples: [9500],
      }),
      tare: WeightKgSchema.optional().meta({
        title: 'Tare Weight (kg)',
        description: 'Weight of the empty vehicle or container',
        examples: [3500],
      }),
    })
    .optional()
    .meta({
      title: 'Weighing Event Data',
      description:
        'Weighing operational details including capture method, equipment, and weights',
    }),
});

const DropOffEventSchema = buildMassIDEventSchema(
  'Drop-off',
  'Waste delivered to a destination location',
);

const SortingEventSchema = buildMassIDEventSchema(
  'Sorting',
  'Sorting or segregation of waste materials',
).safeExtend({
  data: z
    .strictObject({
      initial_weight: WeightKgSchema.optional().meta({
        title: 'Initial Weight (kg)',
        description:
          'Weight of the material entering the sorting process in kilograms',
        examples: [5000],
      }),
      deducted_weight: WeightKgSchema.optional().meta({
        title: 'Deducted Weight (kg)',
        description:
          'Weight removed during sorting (e.g., contaminants or moisture) in kilograms',
        examples: [250],
      }),
    })
    .optional()
    .meta({
      title: 'Sorting Event Data',
      description:
        'Weights associated with sorting, including initial and deducted amounts',
    }),
});

const RecyclingEventSchema = buildMassIDEventSchema(
  'Recycling',
  'Waste processed or recycled at the destination',
);

const MassIDEventSchema = z
  .discriminatedUnion('event_name', [
    PickUpEventSchema,
    WeighingEventSchema,
    DropOffEventSchema,
    SortingEventSchema,
    RecyclingEventSchema,
  ])
  .meta({
    title: 'MassID Event',
    description:
      'Lifecycle event describing custody, processing, documentation, or recycling steps',
  });

export type MassIDEvent = z.infer<typeof MassIDEventSchema>;

const MassIDEventsSchema = z
  .array(MassIDEventSchema)
  .min(1)
  .superRefine((events, ctx) => {
    events.forEach((event, index) => {
      if (index === 0) {
        return;
      }

      const previousEvent = events[index - 1];

      if (event.timestamp < previousEvent.timestamp) {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'timestamp'],
          message: 'Events must be ordered by timestamp',
        });
      }
    });
  })
  .meta({
    title: 'MassID Events',
    description:
      'Chronological sequence of custody transfer, processing, and recycling events',
  });

export type MassIDEvents = z.infer<typeof MassIDEventsSchema>;

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
      (participant) => participant.id_hash,
      'Participant ID hashes must be unique',
    )
      .min(1)
      .meta({
        title: 'Participants',
        description:
          'All participants referenced in this MassID, indexed by ID',
      }),
    events: MassIDEventsSchema,
    attachments: z.array(MassIDAttachmentSchema).optional().meta({
      title: 'Attachments',
      description:
        'Supporting documents associated with events, linked by event_id',
    }),
  })
  .refine((data) => {
    const participantIdSet = new Set(
      data.participants.map((participant) => participant.id_hash),
    );

    const eventParticipantIds = data.events.map(
      (event) => event.participant_id_hash,
    );

    const allEventParticipantsExist = eventParticipantIds.every(
      (participantId) => participantIdSet.has(participantId),
    );

    return allEventParticipantsExist;
  }, 'All participant ID hashes in events must exist in participants array')

  .refine((data) => {
    const locationIdSet = new Set(
      data.locations.map((location) => location.id_hash),
    );

    const eventLocationIds = data.events.map((event) => event.location_id_hash);

    const allEventLocationsExist = eventLocationIds.every((locationId) =>
      locationIdSet.has(locationId),
    );

    return allEventLocationsExist;
  }, 'All location ID hashes in events must exist in locations array')
  .refine((data) => {
    if (!data.attachments || data.attachments.length === 0) {
      return true;
    }

    const eventIdSet = new Set(data.events.map((event) => event.event_id));

    return data.attachments.every((attachment) =>
      eventIdSet.has(attachment.event_id),
    );
  }, 'All attachments must reference an existing event by event_id')
  .refine((data) => {
    const participantIdSet = new Set(
      data.participants.map((participant) => participant.id_hash),
    );

    return data.locations.every((location) =>
      participantIdSet.has(location.responsible_participant_id_hash),
    );
  }, 'All responsible participant ID hashes in locations must exist in participants array')
  .meta({
    title: 'MassID Data',
    description:
      'MassID data containing waste tracking events and supporting information',
  });

export type MassIDData = z.infer<typeof MassIDDataSchema>;
