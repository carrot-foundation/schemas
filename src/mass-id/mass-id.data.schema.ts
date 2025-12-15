import { z } from 'zod';
import {
  UuidSchema,
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  WeightKgSchema,
  IsoDateTimeSchema,
  LocationSchema,
  ParticipantSchema,
  uniqueBy,
  Sha256HashSchema,
  IbamaWasteClassificationSchema,
  VehicleTypeSchema,
  ScaleTypeSchema,
  WeighingCaptureMethodSchema,
  ContainerTypeSchema,
} from '../shared';

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
  });
export type MassIDLocalClassification = z.infer<
  typeof MassIDLocalClassificationSchema
>;

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
    net_weight_kg: WeightKgSchema.meta({
      title: 'Net Weight',
      description: 'Net weight of the waste batch in kilograms (kg)',
      examples: [3000],
    }),
  })
  .meta({
    title: 'Waste Properties',
    description:
      'Waste material classification, regulatory codes, and net weight for the tracked batch',
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
        description:
          'Official regulatory document number issued by authorities, when applicable',
        examples: ['2353', '12345'],
      }),
    issued_at: IsoDateTimeSchema.optional().meta({
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
    timestamp: IsoDateTimeSchema.meta({
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
      description: `Type of event, indicating this is a ${eventName} event`,
      examples: [eventName],
    }),
  }).meta({
    title: `${eventName} Event`,
    description,
  });

const PickUpEventSchema = buildMassIDEventSchema(
  'Pick-up',
  'Waste collected from the origin location',
).safeExtend({
  data: z
    .strictObject({
      vehicle_type: VehicleTypeSchema.optional().meta({
        description: 'Type of vehicle used for pick-up operations',
      }),
      weight_kg: WeightKgSchema.optional().meta({
        title: 'Pick-up Waste Weight',
        description:
          'Weight of waste collected at the origin location, measured in kilograms (kg)',
      }),
    })
    .optional()
    .meta({
      title: 'Pick-up Event Data',
      description: 'Data associated with the pick-up event',
    }),
});

const WeighingEventSchema = buildMassIDEventSchema(
  'Weighing',
  'Waste weighed at a facility',
).safeExtend({
  data: z
    .strictObject({
      weighing_capture_method: WeighingCaptureMethodSchema.optional(),
      scale_type: ScaleTypeSchema.optional(),
      container_type: ContainerTypeSchema.optional().meta({
        description:
          'Type of container or vehicle holding the waste material during the weighing operation',
      }),
      vehicle_type: VehicleTypeSchema.optional().meta({
        description: 'Type of vehicle used during weighing',
      }),
      container_capacity_kg: WeightKgSchema.optional().meta({
        title: 'Container Capacity',
        description: 'Maximum container capacity in kilograms (kg)',
      }),
      gross_weight_kg: WeightKgSchema.optional().meta({
        title: 'Gross Weight',
        description:
          'Total weight including vehicle/container before tare in kilograms (kg)',
      }),
      tare_kg: WeightKgSchema.optional().meta({
        title: 'Tare Weight',
        description:
          'Weight of the empty vehicle or container in kilograms (kg)',
      }),
    })
    .optional()
    .meta({
      title: 'Weighing Event Data',
      description:
        'Weighing operational details including capture method, scale type, container or vehicle information, and weight measurements',
    }),
});

const DropOffEventSchema = buildMassIDEventSchema(
  'Drop-off',
  'Waste delivered to the destination location',
);

const SortingEventSchema = buildMassIDEventSchema(
  'Sorting',
  'Sorting or segregation of waste materials',
).safeExtend({
  data: z
    .strictObject({
      initial_weight_kg: WeightKgSchema.optional().meta({
        title: 'Initial Weight',
        description:
          'Weight of the material entering the sorting process in kilograms (kg)',
      }),
      deducted_weight_kg: WeightKgSchema.optional().meta({
        title: 'Deducted Weight',
        description:
          'Weight removed during sorting (e.g., contaminants or moisture) in kilograms (kg)',
      }),
    })
    .optional()
    .meta({
      title: 'Sorting Event Data',
      description:
        'Weight measurements for sorting operations: initial weight entering the process and weight deducted (contaminants, moisture, etc.)',
    }),
});

const RecyclingEventSchema = buildMassIDEventSchema(
  'Recycling',
  'Waste processing or recycling completion event, marking the final transformation of waste material',
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
      'Chronological sequence of waste lifecycle events: Pick-up, Weighing, Drop-off, Sorting, and Recycling operations',
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
        description:
          'Geographic locations involved in the waste chain of custody, including origin, processing, and destination sites',
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
          'Supply chain participants involved in waste management operations. Roles include Waste Generator, Hauler, Processor, Recycler, Network Integrator, Methodology Author, Methodology Developer, Network, and Community Impact Pool',
      }),
    events: MassIDEventsSchema,
    attachments: z.array(MassIDAttachmentSchema).optional().meta({
      title: 'Attachments',
      description:
        'Official regulatory documents linked to specific chain of custody events via event_id. Document types include Transport Manifest and Recycling Manifest',
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
