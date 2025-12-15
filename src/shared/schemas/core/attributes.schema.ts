import { z } from 'zod';
import { NftAttributeSchema } from './nft.schema';
import {
  WeightKgSchema,
  UnixTimestampSchema,
  WasteTypeSchema,
  MethodologyNameSchema,
  StringifiedTokenIdSchema,
  CitySchema,
  CreditAmountSchema,
  CreditTypeSchema,
} from '../primitives';

function getSchemaMetadata<T extends z.ZodTypeAny>(
  schema: T,
): Record<string, unknown> | undefined {
  /* v8 ignore next -- @preserve */
  if (typeof schema.meta === 'function') {
    const meta = schema.meta();
    if (meta && typeof meta === 'object') {
      return meta as Record<string, unknown>;
    }
  }

  try {
    const meta = z.globalRegistry.get(schema);
    /* v8 ignore next -- @preserve */
    if (meta && typeof meta === 'object') {
      return meta as Record<string, unknown>;
    }
  } catch {
    // Registry lookup failed, return undefined
  }

  return undefined;
}

function mergeSchemaMeta(
  schema: z.ZodTypeAny,
  newMeta: { title: string; description: string },
): { title: string; description: string; examples?: unknown[] } {
  const baseMeta = getSchemaMetadata(schema);
  const merged: { title: string; description: string; examples?: unknown[] } = {
    title: newMeta.title,
    description: newMeta.description,
  };

  if (baseMeta?.examples) {
    merged.examples = baseMeta.examples as unknown[];
  }

  return merged;
}

export function createDateAttributeSchema(params: {
  traitType: string;
  title: string;
  description: string;
  omitMaxValue?: boolean;
}) {
  const { omitMaxValue = true } = params;
  const base = omitMaxValue
    ? NftAttributeSchema.omit({ max_value: true })
    : NftAttributeSchema;

  const descriptionLower = params.description.toLowerCase();
  const alreadyMentionsUnix =
    descriptionLower.includes('unix') ||
    descriptionLower.includes('unix timestamp');
  const metaDescription = alreadyMentionsUnix
    ? `${params.description} attribute`
    : `${params.description} attribute using Unix timestamp in milliseconds`;

  return base
    .safeExtend({
      trait_type: z.literal(params.traitType),
      value: UnixTimestampSchema.meta(
        mergeSchemaMeta(UnixTimestampSchema, {
          title: params.title,
          description: params.description,
        }),
      ),
      display_type: z.literal('date'),
    })
    .meta({
      title: `${params.title} Attribute`,
      description: metaDescription,
    });
}

export function createWeightAttributeSchema(params: {
  traitType: string;
  title: string;
  description: string;
}) {
  return NftAttributeSchema.safeExtend({
    trait_type: z.literal(params.traitType),
    value: WeightKgSchema.meta(
      mergeSchemaMeta(WeightKgSchema, {
        title: params.title,
        description: params.description,
      }),
    ),
    display_type: z.literal('number'),
  }).meta({
    title: `${params.title} Attribute`,
    description: `${params.description} attribute with numeric display`,
  });
}

export function createNumericAttributeSchema(params: {
  traitType: string;
  title: string;
  description: string;
  valueSchema: z.ZodNumber;
}) {
  return NftAttributeSchema.safeExtend({
    trait_type: z.literal(params.traitType),
    value: params.valueSchema.meta(
      mergeSchemaMeta(params.valueSchema, {
        title: params.title,
        description: params.description,
      }),
    ),
    display_type: z.literal('number'),
  }).meta({
    title: `${params.title} Attribute`,
    description: `${params.description} attribute with numeric display`,
  });
}

export const MethodologyAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Methodology'),
  value: MethodologyNameSchema,
}).meta({
  title: 'Methodology Attribute',
  description: 'Methodology used for certification',
});
export type MethodologyAttribute = z.infer<typeof MethodologyAttributeSchema>;

export const CreditAmountAttributeSchema = createNumericAttributeSchema({
  traitType: 'Credit Amount',
  title: 'Credit Amount',
  description: 'Credit amount',
  valueSchema: CreditAmountSchema,
});
export type CreditAmountAttribute = z.infer<typeof CreditAmountAttributeSchema>;

export const CreditTypeAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Credit Type'),
  value: CreditTypeSchema,
}).meta({
  title: 'Credit Type Attribute',
  description: 'Credit type attribute',
});
export type CreditTypeAttribute = z.infer<typeof CreditTypeAttributeSchema>;

export const SourceWasteTypeAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Source Waste Type'),
  value: WasteTypeSchema,
}).meta({
  title: 'Source Waste Type Attribute',
  description: 'Source waste type attribute',
});
export type SourceWasteTypeAttribute = z.infer<
  typeof SourceWasteTypeAttributeSchema
>;

export const SourceWeightAttributeSchema = createWeightAttributeSchema({
  traitType: 'Source Weight (kg)',
  title: 'Source Weight',
  description: 'Weight of the source waste in kilograms',
});
export type SourceWeightAttribute = z.infer<typeof SourceWeightAttributeSchema>;

export const MassIDTokenIdAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('MassID'),
  value: StringifiedTokenIdSchema.meta({
    title: 'MassID Token ID',
    description: 'Token ID of the source MassID NFT as #<token_id>',
  }),
}).meta({
  title: 'MassID Token ID Attribute',
  description: 'MassID token ID attribute',
});
export type MassIDTokenIdAttribute = z.infer<
  typeof MassIDTokenIdAttributeSchema
>;

export const MassIDRecyclingDateAttributeSchema = createDateAttributeSchema({
  traitType: 'MassID Recycling Date',
  title: 'MassID Recycling Date',
  description:
    'Unix timestamp in milliseconds when the source waste was recycled',
});
export type MassIDRecyclingDateAttribute = z.infer<
  typeof MassIDRecyclingDateAttributeSchema
>;

export const CertificateIssuanceDateAttributeSchema = createDateAttributeSchema(
  {
    traitType: 'Certificate Issuance Date',
    title: 'Certificate Issuance Date',
    description:
      'Unix timestamp in milliseconds when the certificate was issued',
  },
);
export type CertificateIssuanceDateAttribute = z.infer<
  typeof CertificateIssuanceDateAttributeSchema
>;

export const OriginCityAttributeSchema = NftAttributeSchema.safeExtend({
  trait_type: z.literal('Origin City'),
  value: CitySchema,
}).meta({
  title: 'Origin City Attribute',
  description: 'Origin municipality attribute',
});
export type OriginCityAttribute = z.infer<typeof OriginCityAttributeSchema>;
