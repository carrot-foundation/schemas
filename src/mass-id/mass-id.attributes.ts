import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  NonEmptyStringSchema,
  uniqueBy,
  OriginCityAttributeSchema,
  NftAttributeSchema,
  IbamaWasteClassificationSchema,
  VehicleTypeSchema,
  ScaleTypeSchema,
  WeighingCaptureMethodSchema,
  createDateAttributeSchema,
  createWeightAttributeSchema,
} from '../shared';

const MassIDAttributeWasteTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Waste Type Attribute',
  description:
    'Primary waste material category (e.g., Organic, Paper, Glass, Metal)',
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
  description: 'Vehicle type used during pick-up',
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
    'Process applied to this mass (e.g., composting, mechanical recycling)',
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
      'Regulatory waste classification code (e.g., Ibama format NN NN NN[*])',
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
      'Official recycling manifest number issued by recycling authority (optional)',
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
      'Official transport manifest number issued by logistics/transport authority (optional)',
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
    description: 'Weighing capture method attribute (optional)',
  });
export type MassIDAttributeWeighingCaptureMethod = z.infer<
  typeof MassIDAttributeWeighingCaptureMethodSchema
>;

const MassIDAttributeScaleTypeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Scale Type'),
  value: ScaleTypeSchema,
}).meta({
  title: 'Scale Type Attribute',
  description: 'Scale type attribute (optional)',
});
export type MassIDAttributeScaleType = z.infer<
  typeof MassIDAttributeScaleTypeSchema
>;

const MassIDAttributePickUpDateSchema = createDateAttributeSchema({
  traitType: 'Pick-up Date',
  title: 'Pick-up Date',
  description:
    'Unix timestamp in milliseconds when the waste was picked up from the source',
});
export type MassIDAttributePickUpDate = z.infer<
  typeof MassIDAttributePickUpDateSchema
>;

const MassIDAttributeDropOffDateSchema = createDateAttributeSchema({
  traitType: 'Drop-off Date',
  title: 'Drop-off Date',
  description:
    'Unix timestamp in milliseconds when the waste was dropped off at the destination',
});
export type MassIDAttributeDropOffDate = z.infer<
  typeof MassIDAttributeDropOffDateSchema
>;

const MassIDAttributeRecyclingDateSchema = createDateAttributeSchema({
  traitType: 'Recycling Date',
  title: 'Recycling Date',
  description:
    'Unix timestamp in milliseconds when the waste was recycled/processed',
});
export type MassIDAttributeRecyclingDate = z.infer<
  typeof MassIDAttributeRecyclingDateSchema
>;

export const MassIDAttributesSchema = uniqueBy(
  z.union([
    MassIDAttributeWasteTypeSchema,
    MassIDAttributeWasteSubtypeSchema,
    MassIDAttributeWeightSchema,
    MassIDAttributeOriginCitySchema,
    MassIDAttributePickUpVehicleTypeSchema,
    MassIDAttributeRecyclingMethodSchema,
    MassIDAttributeLocalWasteClassificationIdSchema,
    MassIDAttributeRecyclingManifestCodeSchema,
    MassIDAttributeTransportManifestCodeSchema,
    MassIDAttributeWeighingCaptureMethodSchema,
    MassIDAttributeScaleTypeSchema,
    MassIDAttributePickUpDateSchema,
    MassIDAttributeDropOffDateSchema,
    MassIDAttributeRecyclingDateSchema,
  ]),
  (attr) => attr.trait_type,
)
  .min(9)
  .max(14)
  .meta({
    title: 'MassID Attributes',
    description:
      'MassID NFT attributes array. Provide the canonical set covering waste (type, subtype, net weight), origin (municipality), logistics (vehicle, manifests, weighing method/scale), and lifecycle timestamps (pick-up, drop-off, recycling). Length is validated; specific composition is producer-controlled.',
  });
export type MassIDAttributes = z.infer<typeof MassIDAttributesSchema>;
