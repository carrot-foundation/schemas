import { z } from 'zod';
import { NftIpfsSchema } from '../shared/nft.schema.js';
import { MassIDDataSchema } from './mass-id.data.schema.js';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
} from '../shared/definitions.schema.js';

const AttributeWasteTypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Type'),
    value: WasteTypeSchema,
  })
  .meta({
    title: 'Waste Type Attribute',
    description: 'Waste type attribute',
  });

const AttributeWasteSubtypeSchema = z
  .strictObject({
    trait_type: z.literal('Waste Subtype'),
    value: WasteSubtypeSchema,
  })
  .meta({
    title: 'Waste Subtype Attribute',
    description: 'Waste subtype attribute',
  });

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

const AttributeOriginCountrySchema = z
  .strictObject({
    trait_type: z.literal('Origin Country'),
    value: z.string().max(100).meta({
      title: 'Origin Country Value',
      description: 'Country where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Country Attribute',
    description: 'Origin country attribute',
  });

const AttributeOriginMunicipalitySchema = z
  .strictObject({
    trait_type: z.literal('Origin Municipality'),
    value: z.string().max(100).meta({
      title: 'Origin Municipality Value',
      description: 'Municipality where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Municipality Attribute',
    description: 'Origin municipality attribute',
  });

const AttributeOriginDivisionSchema = z
  .strictObject({
    trait_type: z.literal('Origin Administrative Division'),
    value: z.string().max(100).meta({
      title: 'Origin Division Value',
      description:
        'Administrative division (state/province) where the waste was generated',
    }),
  })
  .meta({
    title: 'Origin Administrative Division Attribute',
    description: 'Origin administrative division attribute',
  });

const AttributeRecyclerSchema = z
  .strictObject({
    trait_type: z.literal('Recycler'),
    value: z.string().max(100).meta({
      title: 'Recycler Value',
      description: 'Organization that processed the waste',
    }),
  })
  .meta({
    title: 'Recycler Attribute',
    description: 'Recycler attribute',
  });

const AttributeIntegratorSchema = z
  .strictObject({
    trait_type: z.literal('Integrator'),
    value: z.string().max(100).meta({
      title: 'Integrator Value',
      description:
        'Organization that integrated the waste into the Carrot network',
    }),
  })
  .meta({
    title: 'Integrator Attribute',
    description: 'Integrator attribute',
  });

const AttributePickupDateSchema = z
  .strictObject({
    trait_type: z.literal('Pick-up Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .meta({
        title: 'Pick-up Date Value',
        description: 'Date when the waste was picked up from the source',
      }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Pick-up Date Attribute',
    description: 'Pick-up date attribute',
  });

const AttributeRecyclingDateSchema = z
  .strictObject({
    trait_type: z.literal('Recycling Date'),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format')
      .meta({
        title: 'Recycling Date Value',
        description: 'Date when the waste was recycled/processed',
      }),
    display_type: z.literal('date'),
  })
  .meta({
    title: 'Recycling Date Attribute',
    description: 'Recycling date attribute',
  });

const MassIDAttributesSchema = z
  .tuple([
    AttributeWasteTypeSchema,
    AttributeWasteSubtypeSchema,
    AttributeWeightSchema,
    AttributeOriginCountrySchema,
    AttributeOriginMunicipalitySchema,
    AttributeOriginDivisionSchema,
    AttributeRecyclerSchema,
    AttributeIntegratorSchema,
    AttributePickupDateSchema,
    AttributeRecyclingDateSchema,
  ])
  .meta({
    title: 'MassID Attributes',
    description: 'Fixed set of MassID NFT attributes in required order',
  });

export const MassIDIpfsSchema = NftIpfsSchema.safeExtend({
  schema: NftIpfsSchema.shape.schema.safeExtend({
    type: z.literal('MassID').meta({
      title: 'MassID Schema Type',
      description: 'MassID NFT schema type',
    }),
  }),

  attributes: MassIDAttributesSchema.meta({
    title: 'MassID NFT Attributes',
    description:
      'Fixed set of MassID NFT attributes enforcing order and type for each trait',
  }).check(z.minLength(10), z.maxLength(10)),

  data: MassIDDataSchema.meta({
    title: 'MassID Data',
    description:
      'MassID-specific data containing waste tracking and chain of custody information',
  }),
}).meta({
  title: 'MassID NFT IPFS Record',
  description:
    'Complete MassID NFT IPFS record including fixed attributes and detailed waste tracking data',
  $id: 'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/mass-id.schema.json',
  version: '1.0.0',
});

export type MassIDIpfsSchemaType = z.infer<typeof MassIDIpfsSchema>;
export type MassIDAttributesType = z.infer<typeof MassIDAttributesSchema>;
export type AttributeWasteTypeType = z.infer<typeof AttributeWasteTypeSchema>;
export type AttributeWasteSubtypeType = z.infer<
  typeof AttributeWasteSubtypeSchema
>;
export type AttributeWeightType = z.infer<typeof AttributeWeightSchema>;
export type AttributeOriginCountryType = z.infer<
  typeof AttributeOriginCountrySchema
>;
export type AttributeOriginMunicipalityType = z.infer<
  typeof AttributeOriginMunicipalitySchema
>;
export type AttributeOriginDivisionType = z.infer<
  typeof AttributeOriginDivisionSchema
>;
export type AttributeRecyclerType = z.infer<typeof AttributeRecyclerSchema>;
export type AttributeIntegratorType = z.infer<typeof AttributeIntegratorSchema>;
export type AttributePickupDateType = z.infer<typeof AttributePickupDateSchema>;
export type AttributeRecyclingDateType = z.infer<
  typeof AttributeRecyclingDateSchema
>;
