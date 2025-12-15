/* v8 ignore file -- @preserve */
import { z } from 'zod';
import { NftAttributeSchema, type NftAttribute } from './nft.schema';
import { WeightKgSchema, UnixTimestampSchema } from '../primitives';
import { uniqueBy } from '../../schema-helpers';

function getSchemaMetadata<T extends z.ZodTypeAny>(
  schema: T,
): Record<string, unknown> | undefined {
  if (typeof schema.meta === 'function') {
    const meta = schema.meta();
    if (meta && typeof meta === 'object') {
      return meta as Record<string, unknown>;
    }
  }

  try {
    const meta = z.globalRegistry.get(schema);
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

function extractTraitType(schema: z.ZodTypeAny): string {
  try {
    // For schemas created with safeExtend, we need to traverse the shape
    if (
      typeof schema === 'object' &&
      schema !== null &&
      'shape' in schema &&
      typeof schema.shape === 'object' &&
      schema.shape !== null &&
      'trait_type' in schema.shape
    ) {
      const traitTypeSchema = schema.shape.trait_type as z.ZodTypeAny;

      // Check if it's a literal
      if (
        traitTypeSchema.def &&
        typeof traitTypeSchema.def === 'object' &&
        'typeName' in traitTypeSchema.def &&
        traitTypeSchema.def.typeName === 'ZodLiteral' &&
        'value' in traitTypeSchema.def
      ) {
        return traitTypeSchema.def.value as string;
      }
    }

    // Fallback: try to get from metadata if available
    // Note: This is a fallback and may not be accurate, so we return empty string
    // to avoid false positives in validation
    const meta = getSchemaMetadata(schema);
    if (meta?.title) {
      // Try to infer from title (e.g., "Waste Type Attribute" -> "Waste Type")
      const title = meta.title as string;
      if (title.endsWith(' Attribute')) {
        const inferred = title.slice(0, -11); // Remove " Attribute" suffix
        // Only return if it looks reasonable (not truncated)
        if (inferred.length > 3) {
          return inferred;
        }
      }
    }
  } catch {
    // If extraction fails, return empty string
  }

  return '';
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

export function createOrderedAttributesSchema(params: {
  required: readonly z.ZodTypeAny[];
  optional?: readonly z.ZodTypeAny[];
  title: string;
  description: string;
  uniqueBySelector: (attr: unknown) => string;
  maxItems?: number;
  requiredTraitTypes?: readonly string[];
  optionalTraitTypes?: readonly string[];
}) {
  const {
    required,
    optional = [],
    title,
    description,
    uniqueBySelector,
    maxItems,
    requiredTraitTypes,
    optionalTraitTypes,
  } = params;

  const allSchemas = [...required, ...optional];
  // Guard against invalid union cases: z.union requires at least 2 schemas
  // If no schemas provided, return z.never() (nothing can match)
  // If only one schema, return it directly (no union needed)
  let unionSchema: z.ZodTypeAny;
  if (allSchemas.length === 0) {
    unionSchema = z.never();
  } else if (allSchemas.length === 1) {
    unionSchema = allSchemas[0];
  } else {
    unionSchema = z.union(
      allSchemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
    );
  }

  const requiredTypes =
    requiredTraitTypes ?? required.map(extractTraitType).filter(Boolean);
  const optionalTypes =
    optionalTraitTypes ?? optional.map(extractTraitType).filter(Boolean);

  const isDynamic = description.includes('Dynamic attributes');

  const descriptionParts = [description];
  if (requiredTypes.length > 0) {
    descriptionParts.push(
      `\n\nRequired attributes (${required.length}): ${requiredTypes.join(', ')}`,
    );
  }
  // Skip optional attributes enumeration for dynamic schemas (already explained in description)
  if (optionalTypes.length > 0 && !isDynamic) {
    descriptionParts.push(
      `\nOptional attributes (${optional.length}): ${optionalTypes.join(', ')}`,
    );
  }

  // Cast to ensure compatibility with NftAttribute[] type expected by schemas
  let arraySchema = uniqueBy(unionSchema, uniqueBySelector).min(
    required.length,
  );

  if (maxItems !== undefined) {
    arraySchema = arraySchema.max(maxItems);
  } else if (optional.length > 0 && !isDynamic) {
    arraySchema = arraySchema.max(required.length + optional.length);
  }

  return arraySchema
    .superRefine((attributes, ctx) => {
      // All attribute schemas extend NftAttributeSchema, so they're compatible with NftAttribute
      const traitTypes = new Set(
        (attributes as NftAttribute[]).map(uniqueBySelector),
      );

      for (const traitType of requiredTypes) {
        if (traitType && !traitTypes.has(traitType)) {
          ctx.addIssue({
            code: 'custom',
            message: `Required attribute '${traitType}' is missing`,
            path: [],
          });
        }
      }
    })
    .meta({
      title,
      description: descriptionParts.join(''),
    }) as unknown as z.ZodArray<typeof NftAttributeSchema>;
}
