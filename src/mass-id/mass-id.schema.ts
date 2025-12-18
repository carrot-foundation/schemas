import { z } from 'zod';
import { MassIDDataSchema, type MassIDEvent } from './mass-id.data.schema';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  NftIpfsSchema,
  MassIDNameSchema,
  MassIDShortNameSchema,
  createAttributeMap,
  validateAttributeValue,
  validateDateTimeAttribute,
  validateTokenIdInName,
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
    'Complete MassID NFT IPFS record schema defining waste tracking metadata, chain of custody events, and NFT display attributes',
  $id: buildSchemaUrl('mass-id/mass-id.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const MassIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('MassID').meta({
      title: 'MassID Schema Type',
      description: 'Schema type identifier for this record',
    }),
  }),
  name: MassIDNameSchema,
  short_name: MassIDShortNameSchema,
  attributes: MassIDAttributesSchema,
  data: MassIDDataSchema,
})
  .superRefine((record, ctx) => {
    validateTokenIdInName({
      ctx,
      name: record.name,
      tokenId: record.blockchain.token_id,
      pattern: /^MassID #(\d+)/,
      path: ['name'],
    });

    validateTokenIdInName({
      ctx,
      name: record.short_name,
      tokenId: record.blockchain.token_id,
      pattern: /^MassID #(\d+)/,
      path: ['short_name'],
      message: `Short name token_id must match blockchain.token_id: ${record.blockchain.token_id}`,
    });

    const { data, attributes } = record;
    const attributeByTraitType = createAttributeMap(attributes);

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Waste Type',
      expectedValue: data.waste_properties.type,
      missingMessage:
        'Waste Type attribute must be present and match waste_properties.type',
      mismatchMessage: 'Waste Type attribute must equal waste_properties.type',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Waste Subtype',
      expectedValue: data.waste_properties.subtype,
      missingMessage:
        'Waste Subtype attribute must be present and match waste_properties.subtype',
      mismatchMessage:
        'Waste Subtype attribute must equal waste_properties.subtype',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Weight (kg)',
      expectedValue: data.waste_properties.weight_kg,
      missingMessage:
        'Weight (kg) attribute must be present and match waste_properties.weight_kg',
      mismatchMessage:
        'Weight (kg) attribute must equal waste_properties.weight_kg',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Local Waste Classification ID',
      expectedValue: data.waste_properties.local_classification?.code,
      missingMessage:
        'Local Waste Classification ID attribute must be omitted when waste_properties.local_classification.code is not provided',
      mismatchMessage:
        'Local Waste Classification ID attribute must equal waste_properties.local_classification.code',
    });

    const pickUpEvent = data.events.find(isPickUpEvent);
    const pickUpLocation = pickUpEvent
      ? data.locations.find(
          (location) => location.id_hash === pickUpEvent.location_id_hash,
        )
      : undefined;

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Origin City',
      expectedValue: pickUpLocation?.city,
      missingMessage:
        'Origin City attribute must be omitted when Pick-up event location.city is not provided',
      mismatchMessage:
        'Origin City attribute must equal Pick-up event location.city',
    });

    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Date',
      dateTimeValue: pickUpEvent?.timestamp,
      missingMessage:
        'Pick-up Date attribute must be omitted when Pick-up event timestamp is not provided',
      invalidDateMessage:
        'Pick-up event timestamp must be a valid ISO 8601 date-time string',
      mismatchMessage:
        'Pick-up Date attribute must equal Pick-up event timestamp',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Pick-up Vehicle Type',
      expectedValue: pickUpEvent?.data?.vehicle_type,
      missingMessage:
        'Pick-up Vehicle Type attribute must be omitted when Pick-up event vehicle_type is not provided',
      mismatchMessage:
        'Pick-up Vehicle Type attribute must equal Pick-up event vehicle_type',
    });

    const dropOffEvent = data.events.find(isDropOffEvent);
    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Drop-off Date',
      dateTimeValue: dropOffEvent?.timestamp,
      missingMessage:
        'Drop-off Date attribute must be omitted when Drop-off event timestamp is not provided',
      invalidDateMessage:
        'Drop-off event timestamp must be a valid ISO 8601 date-time string',
      mismatchMessage:
        'Drop-off Date attribute must equal Drop-off event timestamp',
    });

    const recyclingEvent = data.events.find(isRecyclingEvent);
    validateDateTimeAttribute({
      ctx,
      attributeByTraitType,
      traitType: 'Recycling Date',
      dateTimeValue: recyclingEvent?.timestamp,
      missingMessage:
        'Recycling Date attribute must be omitted when Recycling event timestamp is not provided',
      invalidDateMessage:
        'Recycling event timestamp must be a valid ISO 8601 date-time string',
      mismatchMessage:
        'Recycling Date attribute must equal Recycling event timestamp',
    });

    const weighingEvent = data.events.find(isWeighingEvent);
    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Weighing Capture Method',
      expectedValue: weighingEvent?.data?.weighing_capture_method,
      missingMessage:
        'Weighing Capture Method attribute must be omitted when Weighing event weighing_capture_method is not provided',
      mismatchMessage:
        'Weighing Capture Method attribute must equal Weighing event weighing_capture_method',
    });

    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Scale Type',
      expectedValue: weighingEvent?.data?.scale_type,
      missingMessage:
        'Scale Type attribute must be omitted when Weighing event scale_type is not provided',
      mismatchMessage:
        'Scale Type attribute must equal Weighing event scale_type',
    });

    const recyclingManifest = data.attachments?.find(
      (attachment) =>
        attachment.type === 'Recycling Manifest' && attachment.document_number,
    );
    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Recycling Manifest Number',
      expectedValue: recyclingManifest?.document_number,
      missingMessage: recyclingManifest?.document_number
        ? 'Recycling Manifest Number attribute must be present and match Recycling Manifest attachment document_number'
        : 'Recycling Manifest Number attribute must be omitted when Recycling Manifest attachment document_number is not provided',
      mismatchMessage:
        'Recycling Manifest Number attribute must equal Recycling Manifest attachment document_number',
    });

    const transportManifest = data.attachments?.find(
      (attachment) =>
        attachment.type === 'Transport Manifest' && attachment.document_number,
    );
    validateAttributeValue({
      ctx,
      attributeByTraitType,
      traitType: 'Transport Manifest Number',
      expectedValue: transportManifest?.document_number,
      missingMessage: transportManifest?.document_number
        ? 'Transport Manifest Number attribute must be present and match Transport Manifest attachment document_number'
        : 'Transport Manifest Number attribute must be omitted when Transport Manifest attachment document_number is not provided',
      mismatchMessage:
        'Transport Manifest Number attribute must equal Transport Manifest attachment document_number',
    });
  })
  .meta(MassIDIpfsSchemaMeta);

export type MassIDIpfs = z.infer<typeof MassIDIpfsSchema>;
