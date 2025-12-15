import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  OriginCityAttributeSchema,
  NftAttributeSchema,
  IbamaWasteClassificationSchema,
  VehicleTypeSchema,
  ScaleTypeSchema,
  WeighingCaptureMethodSchema,
  createDateAttributeSchema,
  createWeightAttributeSchema,
  createOrderedAttributesSchema,
} from '../shared';

const MassIDAttributeWasteTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Waste Type Attribute',
  description: 'Primary waste material category',
});
export type MassIDAttributeWasteType = z.infer<
  typeof MassIDAttributeWasteTypeSchema
>;

const MassIDAttributeWasteSubtypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Waste Subtype'),
  value: WasteSubtypeSchema,
}).meta({
  title: 'Waste Subtype Attribute',
  description:
    'Regulatory or operational waste subtype (e.g., Food, Food Waste and Beverages)',
});
export type MassIDAttributeWasteSubtype = z.infer<
  typeof MassIDAttributeWasteSubtypeSchema
>;

const MassIDAttributeWeightSchema = createWeightAttributeSchema({
  traitType: 'Weight (kg)',
  title: 'Weight',
  description: 'Net batch weight in kilograms (kg) for this MassID',
});
export type MassIDAttributeWeight = z.infer<typeof MassIDAttributeWeightSchema>;

const MassIDAttributeOriginCitySchema = OriginCityAttributeSchema;
export type MassIDAttributeOriginCity = z.infer<
  typeof MassIDAttributeOriginCitySchema
>;

const MassIDAttributePickUpVehicleTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Pick-up Vehicle Type'),
  value: VehicleTypeSchema.meta({
    title: 'Pick-up Vehicle Type',
    description: 'Type of vehicle used for waste pick-up operations',
  }),
}).meta({
  title: 'Pick-up Vehicle Type Attribute',
  description:
    'Type of vehicle used to transport waste from the origin location during pick-up',
});
export type MassIDAttributePickUpVehicleType = z.infer<
  typeof MassIDAttributePickUpVehicleTypeSchema
>;

const MassIDAttributeRecyclingMethodSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Recycling Method'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Recycling Method',
    description: 'Method used for recycling or processing the waste',
    examples: ['Composting', 'Mechanical Recycling', 'Anaerobic Digestion'],
  }),
}).meta({
  title: 'Recycling Method Attribute',
  description:
    'Processing or recycling method applied to transform the waste material',
});

export type MassIDAttributeRecyclingMethod = z.infer<
  typeof MassIDAttributeRecyclingMethodSchema
>;

const MassIDAttributeLocalWasteClassificationIdSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Local Waste Classification ID'),
    value: IbamaWasteClassificationSchema,
  }).meta({
    title: 'Local Waste Classification ID Attribute',
    description:
      'Regulatory waste classification code in Ibama format (NN NN NN with optional trailing asterisk)',
  });
export type MassIDAttributeLocalWasteClassificationId = z.infer<
  typeof MassIDAttributeLocalWasteClassificationIdSchema
>;

const MassIDAttributeRecyclingManifestCodeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Recycling Manifest Number'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Recycling Manifest Number',
      description: 'Official recycling manifest identifier',
      examples: ['2353', '12345'],
    }),
  }).meta({
    title: 'Recycling Manifest Number Attribute',
    description:
      'Official recycling manifest document number issued by regulatory authorities, linked to the Recycling event (optional)',
  });
export type MassIDAttributeRecyclingManifestCode = z.infer<
  typeof MassIDAttributeRecyclingManifestCodeSchema
>;

const MassIDAttributeTransportManifestCodeSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Transport Manifest Number'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Transport Manifest Number',
      description: 'Official transport manifest identifier',
      examples: ['2353', '12345'],
    }),
  }).meta({
    title: 'Transport Manifest Number Attribute',
    description:
      'Official transport manifest document number issued by logistics authorities, linked to transport events (optional)',
  });
export type MassIDAttributeTransportManifestCode = z.infer<
  typeof MassIDAttributeTransportManifestCodeSchema
>;

const MassIDAttributeWeighingCaptureMethodSchema =
  NftAttributeSchema.safeExtend({
    trait_type: z.literal('Weighing Capture Method'),
    value: WeighingCaptureMethodSchema,
  }).meta({
    title: 'Weighing Capture Method Attribute',
    description:
      'Method used to capture weight measurements during weighing operations (optional)',
  });
export type MassIDAttributeWeighingCaptureMethod = z.infer<
  typeof MassIDAttributeWeighingCaptureMethodSchema
>;

const MassIDAttributeScaleTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Scale Type'),
  value: ScaleTypeSchema,
}).meta({
  title: 'Scale Type Attribute',
  description:
    'Type of weighing equipment used to measure waste weight (optional)',
});
export type MassIDAttributeScaleType = z.infer<
  typeof MassIDAttributeScaleTypeSchema
>;

const MassIDAttributePickUpDateSchema = createDateAttributeSchema({
  traitType: 'Pick-up Date',
  title: 'Pick-up Date',
  description:
    'Unix timestamp in milliseconds when waste was picked up from the origin location',
});
export type MassIDAttributePickUpDate = z.infer<
  typeof MassIDAttributePickUpDateSchema
>;

const MassIDAttributeDropOffDateSchema = createDateAttributeSchema({
  traitType: 'Drop-off Date',
  title: 'Drop-off Date',
  description:
    'Unix timestamp in milliseconds when waste was delivered to the destination location',
});
export type MassIDAttributeDropOffDate = z.infer<
  typeof MassIDAttributeDropOffDateSchema
>;

const MassIDAttributeRecyclingDateSchema = createDateAttributeSchema({
  traitType: 'Recycling Date',
  title: 'Recycling Date',
  description:
    'Unix timestamp in milliseconds when waste recycling or processing was completed',
});
export type MassIDAttributeRecyclingDate = z.infer<
  typeof MassIDAttributeRecyclingDateSchema
>;

const REQUIRED_MASS_ID_ATTRIBUTES = [
  MassIDAttributeWasteTypeSchema,
  MassIDAttributeWasteSubtypeSchema,
  MassIDAttributeWeightSchema,
  MassIDAttributeOriginCitySchema,
  MassIDAttributePickUpVehicleTypeSchema,
  MassIDAttributeRecyclingMethodSchema,
  MassIDAttributePickUpDateSchema,
  MassIDAttributeDropOffDateSchema,
  MassIDAttributeRecyclingDateSchema,
] as const;

const OPTIONAL_MASS_ID_ATTRIBUTES = [
  MassIDAttributeLocalWasteClassificationIdSchema,
  MassIDAttributeRecyclingManifestCodeSchema,
  MassIDAttributeTransportManifestCodeSchema,
  MassIDAttributeWeighingCaptureMethodSchema,
  MassIDAttributeScaleTypeSchema,
] as const;

export const MassIDAttributesSchema = createOrderedAttributesSchema({
  required: REQUIRED_MASS_ID_ATTRIBUTES,
  optional: OPTIONAL_MASS_ID_ATTRIBUTES,
  title: 'MassID Attributes',
  description:
    'Array of NFT attributes describing waste characteristics, origin, logistics, and lifecycle events.',
  uniqueBySelector: (attr: unknown) =>
    (attr as { trait_type: string }).trait_type,
  requiredTraitTypes: [
    'Waste Type',
    'Waste Subtype',
    'Weight (kg)',
    'Origin City',
    'Pick-up Vehicle Type',
    'Recycling Method',
    'Pick-up Date',
    'Drop-off Date',
    'Recycling Date',
  ],
  optionalTraitTypes: [
    'Local Waste Classification ID',
    'Recycling Manifest Number',
    'Transport Manifest Number',
    'Weighing Capture Method',
    'Scale Type',
  ],
});
export type MassIDAttributes = z.infer<typeof MassIDAttributesSchema>;
