import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
  UnixTimestampSchema,
  NonEmptyStringSchema,
  HoursSchema,
} from '../shared/definitions.schema';

const MassIDAttributeWasteTypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Type'),
    value: WasteTypeSchema,
  })
  .meta({
    title: 'Waste Type Attribute',
    description: 'Waste type attribute',
  });

export type MassIDAttributeWasteType = z.infer<
  typeof MassIDAttributeWasteTypeSchema
>;

const MassIDAttributeWasteSubtypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Subtype'),
    value: WasteSubtypeSchema,
  })
  .meta({
    title: 'Waste Subtype Attribute',
    description: 'Waste subtype attribute',
  });

export type MassIDAttributeWasteSubtype = z.infer<
  typeof MassIDAttributeWasteSubtypeSchema
>;

const MassIDAttributeWeightSchema = z
  .strictObject({
    trait_type: z.literal('Weight (kg)'),
    value: WeightKgSchema,
    display_type: z.literal('number'),
  })
  .meta({
    title: 'Weight Attribute',
    description: 'Weight attribute with numeric display',
  });

export type MassIDAttributeWeight = z.infer<typeof MassIDAttributeWeightSchema>;

const MassIDAttributeOriginCountrySchema = z
  .strictObject({
    trait_type: z.literal('Origin Country'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Country Value',
      description: 'Country where the waste was generated',
      examples: ['Brazil', 'United States', 'Germany', 'Japan'],
    }),
  })
  .meta({
    title: 'Origin Country Attribute',
    description: 'Origin country attribute',
  });

export type MassIDAttributeOriginCountry = z.infer<
  typeof MassIDAttributeOriginCountrySchema
>;

const MassIDAttributeOriginMunicipalitySchema = z
  .strictObject({
    trait_type: z.literal('Origin Municipality'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Municipality Value',
      description: 'Municipality where the waste was generated',
      examples: ['São Paulo', 'New York', 'Berlin', 'Tokyo'],
    }),
  })
  .meta({
    title: 'Origin Municipality Attribute',
    description: 'Origin municipality attribute',
  });

export type MassIDAttributeOriginMunicipality = z.infer<
  typeof MassIDAttributeOriginMunicipalitySchema
>;

const MassIDAttributeOriginDivisionSchema = z
  .strictObject({
    trait_type: z.literal('Origin Administrative Division'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Origin Division Value',
      description:
        'Administrative division (state/province) where the waste was generated',
      examples: ['São Paulo', 'California', 'Bavaria'],
    }),
  })
  .meta({
    title: 'Origin Administrative Division Attribute',
    description: 'Origin administrative division attribute',
  });

export type MassIDAttributeOriginDivision = z.infer<
  typeof MassIDAttributeOriginDivisionSchema
>;

const MassIDAttributeVehicleTypeSchema = z
  .strictObject({
    trait_type: z.literal('Vehicle Type'),
    value: NonEmptyStringSchema.max(100).meta({
      title: 'Vehicle Type Value',
      description: 'Type of vehicle used for waste transportation',
      examples: [
        'Garbage Truck',
        'Box Truck',
        'Flatbed Truck',
        'Roll-off Truck',
      ],
    }),
  })
  .meta({
    title: 'Vehicle Type Attribute',
    description: 'Vehicle type attribute',
  });

export type MassIDAttributeVehicleType = z.infer<
  typeof MassIDAttributeVehicleTypeSchema
>;

const MassIDAttributeRecyclingMethodSchema = z
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

export type MassIDAttributeRecyclingMethod = z.infer<
  typeof MassIDAttributeRecyclingMethodSchema
>;

const MassIDAttributeProcessingTimeSchema = z
  .strictObject({
    trait_type: z.literal('Processing Time (hours)'),
    value: HoursSchema,
    trait_description: NonEmptyStringSchema.max(200).optional().meta({
      title: 'Processing Time Description',
      description: 'Custom description for the processing time',
    }),
  })
  .meta({
    title: 'Processing Time Attribute',
    description: 'Processing time attribute with optional trait description',
  });

export type MassIDAttributeProcessingTime = z.infer<
  typeof MassIDAttributeProcessingTimeSchema
>;

const MassIDAttributeLocalWasteClassificationIdSchema = z
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

export type MassIDAttributeLocalWasteClassificationId = z.infer<
  typeof MassIDAttributeLocalWasteClassificationIdSchema
>;

const MassIDAttributeRecyclingManifestCodeSchema = z
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

export type MassIDAttributeRecyclingManifestCode = z.infer<
  typeof MassIDAttributeRecyclingManifestCodeSchema
>;

const MassIDAttributeTransportManifestCodeSchema = z
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

export type MassIDAttributeTransportManifestCode = z.infer<
  typeof MassIDAttributeTransportManifestCodeSchema
>;

const MassIDAttributeWeighingCaptureMethodSchema = z
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

export type MassIDAttributeWeighingCaptureMethod = z.infer<
  typeof MassIDAttributeWeighingCaptureMethodSchema
>;

const MassIDAttributeScaleTypeSchema = z
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

export type MassIDAttributeScaleType = z.infer<
  typeof MassIDAttributeScaleTypeSchema
>;

const MassIDAttributeContainerTypeSchema = z
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

export type MassIDAttributeContainerType = z.infer<
  typeof MassIDAttributeContainerTypeSchema
>;

const MassIDAttributePickUpDateSchema = z
  .strictObject({
    trait_type: z.literal('Pick-up Date'),
    value: UnixTimestampSchema.meta({
      title: 'Pick-up Date Value',
      description:
        'Unix timestamp in milliseconds when the waste was picked up from the source',
      examples: [1710518400000, 1704067200000, 1715270400000],
    }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Pick-up Date Attribute',
    description: 'Pick-up date attribute with Unix timestamp',
  });

export type MassIDAttributePickUpDate = z.infer<
  typeof MassIDAttributePickUpDateSchema
>;

const MassIDAttributeRecyclingDateSchema = z
  .strictObject({
    trait_type: z.literal('Recycling Date'),
    value: UnixTimestampSchema.meta({
      title: 'Recycling Date Value',
      description:
        'Unix timestamp in milliseconds when the waste was recycled/processed',
      examples: [1710604800000, 1704153600000, 1715356800000],
    }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Recycling Date Attribute',
    description: 'Recycling date attribute with Unix timestamp',
  });

export type MassIDAttributeRecyclingDate = z.infer<
  typeof MassIDAttributeRecyclingDateSchema
>;

export const MassIDAttributesSchema = z
  .array(
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
  )
  .min(12)
  .max(17)
  .refine(
    (attributes) => {
      const traitTypes = attributes.map((attribute) => attribute.trait_type);
      return new Set(traitTypes).size === traitTypes.length;
    },
    { message: 'Attribute trait_type values must be unique' },
  )
  .meta({
    title: 'MassID Attributes',
    description:
      'MassID NFT attributes array containing attributes selected from the available attribute types. The schema validates array length but does not enforce which specific attributes must be present.',
  });

export type MassIDAttributes = z.infer<typeof MassIDAttributesSchema>;
