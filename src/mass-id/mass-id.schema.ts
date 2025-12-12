import { z } from 'zod';
import { MassIDDataSchema, type MassIDEvent } from './mass-id.data.schema';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
} from '../shared';
import { MassIDAttributesSchema } from './mass-id.attributes';

type PickUpEvent = Extract<MassIDEvent, { event_name: 'Pick-up' }>;
type WeighingEvent = Extract<MassIDEvent, { event_name: 'Weighing' }>;
type DropOffEvent = Extract<MassIDEvent, { event_name: 'Drop-off' }>;
type RecyclingEvent = Extract<MassIDEvent, { event_name: 'Recycling' }>;

const isPickUpEvent = (event: MassIDEvent): event is PickUpEvent =>
  event.event_name === 'Pick-up';

const isWeighingEvent = (event: MassIDEvent): event is WeighingEvent =>
  event.event_name === 'Weighing';

const isDropOffEvent = (event: MassIDEvent): event is DropOffEvent =>
  event.event_name === 'Drop-off';

const isRecyclingEvent = (event: MassIDEvent): event is RecyclingEvent =>
  event.event_name === 'Recycling';

export const MassIDIpfsSchemaMeta = {
  title: 'MassID NFT IPFS Record',
  description:
    'Complete MassID NFT IPFS record including fixed attributes and detailed waste tracking data',
  $id: buildSchemaUrl('mass-id/mass-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const MassIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('MassID').meta({
      title: 'MassID Schema Type',
      description: 'MassID NFT schema type',
    }),
  }),
  attributes: MassIDAttributesSchema,
  data: MassIDDataSchema,
})
  .superRefine((record, ctx) => {
    const { data, attributes } = record;

    const findAttribute = (traitType: string) => {
      const index = attributes.findIndex(
        (attribute) => attribute.trait_type === traitType,
      );

      return {
        attribute: index >= 0 ? attributes[index] : undefined,
        index,
      };
    };

    const assertAttributeMatches = (
      traitType: string,
      expectedValue: unknown,
      sourceDescription: string,
    ) => {
      const { attribute, index } = findAttribute(traitType);

      if (expectedValue === undefined || expectedValue === null) {
        if (attribute) {
          ctx.addIssue({
            code: 'custom',
            path: ['attributes', index],
            message: `${traitType} attribute must be omitted when ${sourceDescription} is not provided`,
          });
        }
        return;
      }

      if (!attribute) {
        ctx.addIssue({
          code: 'custom',
          path: ['attributes'],
          message: `${traitType} attribute must be present and match ${sourceDescription}`,
        });
        return;
      }

      if (attribute.value !== expectedValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['attributes', index, 'value'],
          message: `${traitType} attribute must equal ${sourceDescription}`,
        });
      }
    };

    const assertTimestampAttributeMatches = (
      traitType: string,
      isoTimestamp: string | undefined,
      sourceDescription: string,
    ) => {
      if (!isoTimestamp) {
        assertAttributeMatches(traitType, undefined, sourceDescription);
        return;
      }

      const timestamp = Date.parse(isoTimestamp);

      if (Number.isNaN(timestamp)) {
        return;
      }

      assertAttributeMatches(traitType, timestamp, sourceDescription);
    };

    assertAttributeMatches(
      'Waste Type',
      data.waste_properties.type,
      'waste_properties.type',
    );
    assertAttributeMatches(
      'Waste Subtype',
      data.waste_properties.subtype,
      'waste_properties.subtype',
    );
    assertAttributeMatches(
      'Weight (kg)',
      data.waste_properties.net_weight,
      'waste_properties.net_weight',
    );

    assertAttributeMatches(
      'Local Waste Classification ID',
      data.waste_properties.local_classification?.code,
      'waste_properties.local_classification.code',
    );

    const pickUpEvent = data.events.find(isPickUpEvent);

    const pickUpLocation = pickUpEvent
      ? data.locations.find(
          (location) => location.id_hash === pickUpEvent.location_id_hash,
        )
      : undefined;

    assertAttributeMatches(
      'Origin City',
      pickUpLocation?.city,
      'Pick-up event location.city',
    );
    assertTimestampAttributeMatches(
      'Pick-up Date',
      pickUpEvent?.timestamp,
      'Pick-up event timestamp',
    );
    assertAttributeMatches(
      'Pick-up Vehicle Type',
      pickUpEvent?.data?.vehicle_type,
      'Pick-up event vehicle_type',
    );

    const dropOffEvent = data.events.find(isDropOffEvent);
    assertTimestampAttributeMatches(
      'Drop-off Date',
      dropOffEvent?.timestamp,
      'Drop-off event timestamp',
    );

    const recyclingEvent = data.events.find(isRecyclingEvent);
    assertTimestampAttributeMatches(
      'Recycling Date',
      recyclingEvent?.timestamp,
      'Recycling event timestamp',
    );

    const weighingEvent = data.events.find(isWeighingEvent);
    assertAttributeMatches(
      'Weighing Capture Method',
      weighingEvent?.data?.weighing_capture_method,
      'Weighing event weighing_capture_method',
    );
    assertAttributeMatches(
      'Scale Type',
      weighingEvent?.data?.scale_type,
      'Weighing event scale_type',
    );

    const recyclingManifest = data.attachments?.find(
      (attachment) =>
        attachment.type === 'Recycling Manifest' && attachment.document_number,
    );
    assertAttributeMatches(
      'Recycling Manifest Number',
      recyclingManifest?.document_number,
      'Recycling Manifest attachment document_number',
    );

    const transportManifest = data.attachments?.find(
      (attachment) =>
        attachment.type === 'Transport Manifest' && attachment.document_number,
    );
    assertAttributeMatches(
      'Transport Manifest Number',
      transportManifest?.document_number,
      'Transport Manifest attachment document_number',
    );
  })
  .meta(MassIDIpfsSchemaMeta);

export type MassIDIpfs = z.infer<typeof MassIDIpfsSchema>;
