import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
  UnixTimestampSchema,
  HoursSchema,
  NonEmptyStringSchema,
  CountryNameSchema,
  MunicipalitySchema,
  AdministrativeDivisionSchema,
  uniqueBy,
  OriginCountryAttributeSchema,
  OriginMunicipalityAttributeSchema,
  NftAttributeSchema,
} from '../shared';

const MassIDAttributeWasteTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Waste Type Attribute',
  description: 'Waste type attribute',
});

export type MassIDAttributeWasteType = z.infer<
  typeof MassIDAttributeWasteTypeSchema
>;

const MassIDAttributeWasteSubtypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Waste Subtype'),
  value: WasteSubtypeSchema,
}).meta({
  title: 'Waste Subtype Attribute',
  description: 'Waste subtype attribute',
});

export type MassIDAttributeWasteSubtype = z.infer<
  typeof MassIDAttributeWasteSubtypeSchema
>;

const MassIDAttributeWeightSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Weight (kg)'),
  value: WeightKgSchema,
  display_type: z.literal('number'),
}).meta({
  title: 'Weight Attribute',
  description: 'Weight attribute with numeric display',
});

export type MassIDAttributeWeight = z.infer<typeof MassIDAttributeWeightSchema>;

const MassIDAttributeOriginCountrySchema = OriginCountryAttributeSchema.extend({
  value: CountryNameSchema,
});

export type MassIDAttributeOriginCountry = z.infer<
  typeof MassIDAttributeOriginCountrySchema
>;

const MassIDAttributeOriginMunicipalitySchema =
  OriginMunicipalityAttributeSchema.extend({
    value: MunicipalitySchema,
  });

export type MassIDAttributeOriginMunicipality = z.infer<
  typeof MassIDAttributeOriginMunicipalitySchema
>;

const MassIDAttributeOriginDivisionSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Origin Administrative Division'),
  value: AdministrativeDivisionSchema,
}).meta({
  title: 'Origin Administrative Division Attribute',
  description: 'Origin administrative division attribute',
});

export type MassIDAttributeOriginDivision = z.infer<
  typeof MassIDAttributeOriginDivisionSchema
>;

const MassIDAttributeVehicleTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Vehicle Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Vehicle Type',
    description: 'Type of vehicle used for waste transportation',
    examples: ['Garbage Truck', 'Box Truck', 'Flatbed Truck', 'Roll-off Truck'],
  }),
}).meta({
  title: 'Vehicle Type Attribute',
  description: 'Vehicle type attribute',
});

export type MassIDAttributeVehicleType = z.infer<
  typeof MassIDAttributeVehicleTypeSchema
>;

const MassIDAttributeRecyclingMethodSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycling Method'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Recycling Method',
    description: 'Method used for recycling or processing the waste',
    examples: [
      'Composting',
      'Mechanical Recycling',
      'Incineration with Energy Recovery',
    ],
  }),
}).meta({
  title: 'Recycling Method Attribute',
  description: 'Recycling method attribute',
});

export type MassIDAttributeRecyclingMethod = z.infer<
  typeof MassIDAttributeRecyclingMethodSchema
>;

const MassIDAttributeProcessingTimeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Processing Time (hours)'),
  value: HoursSchema,
  trait_description: NonEmptyStringSchema.max(200).optional().meta({
    title: 'Processing Time Description',
    description: 'Custom description for the processing time',
  }),
}).meta({
  title: 'Processing Time Attribute',
  description: 'Processing time attribute with optional trait description',
});

export type MassIDAttributeProcessingTime = z.infer<
  typeof MassIDAttributeProcessingTimeSchema
>;

const MassIDAttributeLocalWasteClassificationIdSchema =
  NftAttributeSchema.extend({
    trait_type: z.literal('Local Waste Classification ID'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Local Waste Classification ID',
      description: 'Local or regional waste classification identifier',
      examples: ['04 02 20', 'IBAMA-A001', 'EWC-150101'],
    }),
  }).meta({
    title: 'Local Waste Classification ID Attribute',
    description: 'Local waste classification ID attribute',
  });

export type MassIDAttributeLocalWasteClassificationId = z.infer<
  typeof MassIDAttributeLocalWasteClassificationIdSchema
>;

const MassIDAttributeRecyclingManifestCodeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycling Manifest Code'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Recycling Manifest Code',
    description:
      'Concatenated recycling manifest code (Document Type + Document Number)',
    examples: ['CDF-2353', 'RC-12345', 'REC-MANIFEST-789'],
  }),
}).meta({
  title: 'Recycling Manifest Code Attribute',
  description: 'Recycling manifest code attribute (optional)',
});

export type MassIDAttributeRecyclingManifestCode = z.infer<
  typeof MassIDAttributeRecyclingManifestCodeSchema
>;

const MassIDAttributeTransportManifestCodeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Transport Manifest Code'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Transport Manifest Code',
    description:
      'Concatenated transport manifest code (Document Type + Document Number)',
    examples: ['MTR-4126', 'TRN-67890', 'TRANS-MANIFEST-456'],
  }),
}).meta({
  title: 'Transport Manifest Code Attribute',
  description: 'Transport manifest code attribute (optional)',
});

export type MassIDAttributeTransportManifestCode = z.infer<
  typeof MassIDAttributeTransportManifestCodeSchema
>;

const MassIDAttributeWeighingCaptureMethodSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Weighing Capture Method'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Weighing Capture Method',
    description: 'Method used to capture weight data',
    examples: ['Digital', 'Manual', 'Automated', 'Electronic Scale'],
  }),
}).meta({
  title: 'Weighing Capture Method Attribute',
  description: 'Weighing capture method attribute (optional)',
});

export type MassIDAttributeWeighingCaptureMethod = z.infer<
  typeof MassIDAttributeWeighingCaptureMethodSchema
>;

const MassIDAttributeScaleTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Scale Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Scale Type',
    description: 'Type of scale used for weighing',
    examples: [
      'Weighbridge (Truck Scale)',
      'Floor Scale',
      'Bench Scale',
      'Crane Scale',
    ],
  }),
}).meta({
  title: 'Scale Type Attribute',
  description: 'Scale type attribute (optional)',
});

export type MassIDAttributeScaleType = z.infer<
  typeof MassIDAttributeScaleTypeSchema
>;

const MassIDAttributeContainerTypeSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Container Type'),
  value: NonEmptyStringSchema.max(100).meta({
    title: 'Container Type',
    description: 'Type of container used for waste storage or transport',
    examples: ['Truck', 'Dumpster', 'Roll-off Container', 'Compactor', 'Bin'],
  }),
}).meta({
  title: 'Container Type Attribute',
  description: 'Container type attribute (optional)',
});

export type MassIDAttributeContainerType = z.infer<
  typeof MassIDAttributeContainerTypeSchema
>;

const MassIDAttributePickUpDateSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Pick-up Date'),
  value: UnixTimestampSchema.meta({
    title: 'Pick-up Date',
    description:
      'Unix timestamp in milliseconds when the waste was picked up from the source',
    examples: [1710518400000, 1704067200000, 1715270400000],
  }),
  display_type: z.literal('date'),
}).meta({
  title: 'Pick-up Date Attribute',
  description: 'Pick-up date attribute with Unix timestamp',
});

export type MassIDAttributePickUpDate = z.infer<
  typeof MassIDAttributePickUpDateSchema
>;

const MassIDAttributeRecyclingDateSchema = NftAttributeSchema.extend({
  trait_type: z.literal('Recycling Date'),
  value: UnixTimestampSchema.meta({
    title: 'Recycling Date',
    description:
      'Unix timestamp in milliseconds when the waste was recycled/processed',
    examples: [1710604800000, 1704153600000, 1715356800000],
  }),
  display_type: z.literal('date'),
}).meta({
  title: 'Recycling Date Attribute',
  description: 'Recycling date attribute with Unix timestamp',
});

export type MassIDAttributeRecyclingDate = z.infer<
  typeof MassIDAttributeRecyclingDateSchema
>;

export const MassIDAttributesSchema = uniqueBy(
  z.union([
    MassIDAttributeWasteTypeSchema,
    MassIDAttributeWasteSubtypeSchema,
    MassIDAttributeWeightSchema,
    MassIDAttributeOriginCountrySchema,
    MassIDAttributeOriginMunicipalitySchema,
    MassIDAttributeOriginDivisionSchema,
    MassIDAttributeVehicleTypeSchema,
    MassIDAttributeRecyclingMethodSchema,
    MassIDAttributeProcessingTimeSchema,
    MassIDAttributeLocalWasteClassificationIdSchema,
    MassIDAttributeRecyclingManifestCodeSchema,
    MassIDAttributeTransportManifestCodeSchema,
    MassIDAttributeWeighingCaptureMethodSchema,
    MassIDAttributeScaleTypeSchema,
    MassIDAttributeContainerTypeSchema,
    MassIDAttributePickUpDateSchema,
    MassIDAttributeRecyclingDateSchema,
  ]),
  (attr) => attr.trait_type,
)
  .min(12)
  .max(17)
  .meta({
    title: 'MassID Attributes',
    description:
      'MassID NFT attributes array containing attributes selected from the available attribute types. The schema validates array length but does not enforce which specific attributes must be present.',
  });

export type MassIDAttributes = z.infer<typeof MassIDAttributesSchema>;
