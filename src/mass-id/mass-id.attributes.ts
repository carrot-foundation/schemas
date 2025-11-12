import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
  UnixTimestampSchema,
  NonEmptyStringSchema,
} from '../shared/definitions.schema';

const AttributeWasteTypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Type'),
    value: WasteTypeSchema,
  })
  .meta({
    title: 'Waste Type Attribute',
    description: 'Waste type attribute',
  });

export type AttributeWasteType = z.infer<typeof AttributeWasteTypeSchema>;

const AttributeWasteSubtypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Subtype'),
    value: WasteSubtypeSchema,
  })
  .meta({
    title: 'Waste Subtype Attribute',
    description: 'Waste subtype attribute',
  });

export type AttributeWasteSubtype = z.infer<typeof AttributeWasteSubtypeSchema>;

const AttributeWeightSchema = z
  .strictObject({
    trait_type: z.literal('Weight (kg)'),
    value: WeightKgSchema,
    display_type: z.literal('number'),
  })
  .meta({
    title: 'Weight Attribute',
    description: 'Weight attribute with numeric display',
  });

export type AttributeWeight = z.infer<typeof AttributeWeightSchema>;

const AttributeOriginCountrySchema = z
  .strictObject({
    trait_type: z.literal('Origin Country'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Country Value',
      description: 'Country where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Country Attribute',
    description: 'Origin country attribute',
  });

export type AttributeOriginCountry = z.infer<
  typeof AttributeOriginCountrySchema
>;

const AttributeOriginMunicipalitySchema = z
  .strictObject({
    trait_type: z.literal('Origin Municipality'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Municipality Value',
      description: 'Municipality where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Municipality Attribute',
    description: 'Origin municipality attribute',
  });

export type AttributeOriginMunicipality = z.infer<
  typeof AttributeOriginMunicipalitySchema
>;

const AttributeOriginDivisionSchema = z
  .strictObject({
    trait_type: z.literal('Origin Administrative Division'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Division Value',
      description:
        'Administrative division (state/province) where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Administrative Division Attribute',
    description: 'Origin administrative division attribute',
  });

export type AttributeOriginDivision = z.infer<
  typeof AttributeOriginDivisionSchema
>;

const AttributeRecyclerSchema = z
  .strictObject({
    trait_type: z.literal('Recycler'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Recycler Value',
      description: 'Organization that processed the waste',
    }),
  })
  .meta({
    title: 'Recycler Attribute',
    description: 'Recycler attribute',
  });

export type AttributeRecycler = z.infer<typeof AttributeRecyclerSchema>;

const AttributeVehicleTypeSchema = z
  .strictObject({
    trait_type: z.literal('Vehicle Type'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Vehicle Type Value',
      description: 'Type of vehicle used for waste transportation',
    }),
  })
  .meta({
    title: 'Vehicle Type Attribute',
    description: 'Vehicle type attribute',
  });

export type AttributeVehicleType = z.infer<typeof AttributeVehicleTypeSchema>;

const AttributeRecyclingMethodSchema = z
  .strictObject({
    trait_type: z.literal('Recycling Method'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Recycling Method Value',
      description: 'Method used for recycling or processing the waste',
      examples: [
        'Composting',
        'Mechanical Recycling',
        'Incineration with Energy Recovery',
      ],
    }),
  })
  .meta({
    title: 'Recycling Method Attribute',
    description: 'Recycling method attribute',
  });

export type AttributeRecyclingMethod = z.infer<
  typeof AttributeRecyclingMethodSchema
>;

const AttributeProcessingTimeSchema = z
  .strictObject({
    trait_type: z.literal('Processing Time'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Processing Time Value',
      description: 'Duration or timestamp of processing',
    }),
    trait_description: NonEmptyStringSchema.max(200).optional().meta({
      title: 'Processing Time Description',
      description: 'Custom description for the processing time',
    }),
  })
  .meta({
    title: 'Processing Time Attribute',
    description: 'Processing time attribute with optional trait description',
  });

export type AttributeProcessingTime = z.infer<
  typeof AttributeProcessingTimeSchema
>;

const AttributeLocalWasteClassificationIdSchema = z
  .strictObject({
    trait_type: z.literal('Local Waste Classification ID'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Local Waste Classification ID Value',
      description: 'Local or regional waste classification identifier',
      examples: ['04 02 20', 'IBAMA-A001', 'EWC-150101'],
    }),
  })
  .meta({
    title: 'Local Waste Classification ID Attribute',
    description: 'Local waste classification ID attribute',
  });

export type AttributeLocalWasteClassificationId = z.infer<
  typeof AttributeLocalWasteClassificationIdSchema
>;

const AttributeRecyclingManifestCodeSchema = z
  .strictObject({
    trait_type: z.literal('Recycling Manifest Code'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Recycling Manifest Code Value',
      description:
        'Concatenated recycling manifest code (Document Type + Document Number)',
      examples: ['CDF-2353', 'RC-12345', 'REC-MANIFEST-789'],
    }),
  })
  .meta({
    title: 'Recycling Manifest Code Attribute',
    description: 'Recycling manifest code attribute (optional)',
  });

export type AttributeRecyclingManifestCode = z.infer<
  typeof AttributeRecyclingManifestCodeSchema
>;

const AttributeTransportManifestCodeSchema = z
  .strictObject({
    trait_type: z.literal('Transport Manifest Code'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Transport Manifest Code Value',
      description:
        'Concatenated transport manifest code (Document Type + Document Number)',
      examples: ['MTR-4126', 'TRN-67890', 'TRANS-MANIFEST-456'],
    }),
  })
  .meta({
    title: 'Transport Manifest Code Attribute',
    description: 'Transport manifest code attribute (optional)',
  });

export type AttributeTransportManifestCode = z.infer<
  typeof AttributeTransportManifestCodeSchema
>;

const AttributeWeighingCaptureMethodSchema = z
  .strictObject({
    trait_type: z.literal('Weighing Capture Method'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Weighing Capture Method Value',
      description: 'Method used to capture weight data',
      examples: ['Digital', 'Manual', 'Automated', 'Electronic Scale'],
    }),
  })
  .meta({
    title: 'Weighing Capture Method Attribute',
    description: 'Weighing capture method attribute (optional)',
  });

export type AttributeWeighingCaptureMethod = z.infer<
  typeof AttributeWeighingCaptureMethodSchema
>;

const AttributeScaleTypeSchema = z
  .strictObject({
    trait_type: z.literal('Scale Type'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Scale Type Value',
      description: 'Type of scale used for weighing',
      examples: [
        'Weighbridge (Truck Scale)',
        'Floor Scale',
        'Bench Scale',
        'Crane Scale',
      ],
    }),
  })
  .meta({
    title: 'Scale Type Attribute',
    description: 'Scale type attribute (optional)',
  });

export type AttributeScaleType = z.infer<typeof AttributeScaleTypeSchema>;

const AttributeContainerTypeSchema = z
  .strictObject({
    trait_type: z.literal('Container Type'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Container Type Value',
      description: 'Type of container used for waste storage or transport',
      examples: ['Truck', 'Dumpster', 'Roll-off Container', 'Compactor', 'Bin'],
    }),
  })
  .meta({
    title: 'Container Type Attribute',
    description: 'Container type attribute (optional)',
  });

export type AttributeContainerType = z.infer<
  typeof AttributeContainerTypeSchema
>;

const AttributePickUpDateSchema = z
  .strictObject({
    trait_type: z.literal('Pick-up Date'),
    value: UnixTimestampSchema.meta({
      title: 'Pick-up Date Value',
      description:
        'Unix timestamp in milliseconds when the waste was picked up from the source',
    }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Pick-up Date Attribute',
    description: 'Pick-up date attribute with Unix timestamp',
  });

export type AttributePickUpDate = z.infer<typeof AttributePickUpDateSchema>;

const AttributeRecyclingDateSchema = z
  .strictObject({
    trait_type: z.literal('Recycling Date'),
    value: UnixTimestampSchema.meta({
      title: 'Recycling Date Value',
      description:
        'Unix timestamp in milliseconds when the waste was recycled/processed',
    }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Recycling Date Attribute',
    description: 'Recycling date attribute with Unix timestamp',
  });

export type AttributeRecyclingDate = z.infer<
  typeof AttributeRecyclingDateSchema
>;

export const MassIDAttributesSchema = z
  .array(
    z.union([
      AttributeWasteTypeSchema,
      AttributeWasteSubtypeSchema,
      AttributeWeightSchema,
      AttributeOriginCountrySchema,
      AttributeOriginMunicipalitySchema,
      AttributeOriginDivisionSchema,
      AttributeRecyclerSchema,
      AttributeVehicleTypeSchema,
      AttributeRecyclingMethodSchema,
      AttributeProcessingTimeSchema,
      AttributeLocalWasteClassificationIdSchema,
      AttributeRecyclingManifestCodeSchema,
      AttributeTransportManifestCodeSchema,
      AttributeWeighingCaptureMethodSchema,
      AttributeScaleTypeSchema,
      AttributeContainerTypeSchema,
      AttributePickUpDateSchema,
      AttributeRecyclingDateSchema,
    ]),
  )
  .min(13)
  .max(18)
  .meta({
    title: 'MassID Attributes',
    description:
      'MassID NFT attributes array containing between 13 and 18 attributes selected from the available attribute types. The schema validates array length (13-18 items) but does not enforce which specific attributes must be present.',
  });

export type MassIDAttributes = z.infer<typeof MassIDAttributesSchema>;
