---
name: rule-zod
description: 'Zod schema authoring — strictObject, safeExtend, meta(), and composition layers'
---

# Rule zod

Apply this rule whenever work touches:

- `src/**/*.schema.ts`
- `src/**/*.schemas.ts`

# Zod schema authoring patterns for the schemas package

Zod schemas are the single source of truth in this project. They drive TypeScript types, JSON Schema generation, documentation, and runtime validation. Getting them right is critical.

## `z.strictObject()` — always

Use `z.strictObject()` for all object schemas. This rejects unknown properties at parse time, which is essential for IPFS data integrity (extra fields change content hashes).

```typescript
// BAD: chaining .strict() on z.object()
const LocationSchema = z
  .object({
    latitude: LatitudeSchema,
    longitude: LongitudeSchema,
  })
  .strict();

// GOOD: strictObject from the start
const LocationSchema = z.strictObject({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});
```

## Composition layers with `.safeExtend()`

Schemas compose in layers. Use `.safeExtend()` to build from base to specific:

```
BaseIpfsSchema (shared $schema, schema, created_at, external_id, external_url, ...)
  -> NftIpfsSchema (adds blockchain, name, description, image, attributes, ...)
    -> MassIDNftIpfsSchema (adds mass-id-specific data and attributes)
```

```typescript
// Base layer — common IPFS record fields
export const BaseIpfsSchema = z.strictObject({
  $schema: z.url().meta({ ... }),
  schema: SchemaInfoSchema,
  created_at: IsoDateTimeSchema.meta({ ... }),
  external_id: ExternalIdSchema,
  external_url: ExternalUrlSchema,
  viewer_reference: ViewerReferenceSchema.optional(),
  environment: RecordEnvironmentSchema.optional(),
  data: z.record(z.string(), z.unknown()).optional().meta({ ... }),
});

// NFT layer extends base with blockchain and display fields
export const NftIpfsSchema = BaseIpfsSchema.safeExtend({
  blockchain: BlockchainReferenceSchema,
  name: NonEmptyStringSchema.max(100).meta({ ... }),
  short_name: NonEmptyStringSchema.max(50).meta({ ... }),
  description: NonEmptyStringSchema.max(500).meta({ ... }),
  image: IpfsUriSchema.meta({ ... }),
  audit_data_hash: Sha256HashSchema.meta({ ... }),
  attributes: uniqueBy(NftAttributeSchema, ...).meta({ ... }),
});

// Type-specific layer extends NFT
export const MassIDNftIpfsSchema = NftIpfsSchema.safeExtend({
  mass_id_data: MassIDDataSchema.meta({ ... }),
});
```

Never use `.merge()` — it does not preserve strict object behavior. Always use `.safeExtend()`.

## `.meta()` on every field

Every field must include `.meta()` with at minimum `title` and `description`. Add examples based on field complexity.

### When to use `examples` (plural array)

Use `examples` by default to show variety — 2 to 4 values is typical:

```typescript
waste_type: z.string().min(1).max(100).meta({
  title: 'Waste Type',
  description: 'Category or type of waste material',
  examples: ['Organic', 'Plastic', 'Metal', 'Paper'],
}),
```

### When to use `example` (singular)

Use singular `example` for canonical patterns where one value is sufficient:

```typescript
$schema: z.url().meta({
  title: 'JSON Schema URI',
  description: 'URI of the JSON Schema used to validate this record',
  example: 'https://raw.githubusercontent.com/carrot-foundation/schemas/...',
}),
```

### When to skip examples

Skip examples when a base schema already provides them:

```typescript
external_id: ExternalIdSchema.meta({
  title: 'External ID',
  description: 'UUID identifier for external system references',
  // No examples needed — ExternalIdSchema (UuidSchema) already has examples
}),
```

## Schema naming conventions

### PascalCase for schema exports

```typescript
export const MassIDDataSchema = z.strictObject({ ... });
export const LocationSchema = z.strictObject({ ... });
export const ParticipantSchema = z.strictObject({ ... });
```

### Type exports match schema name without suffix

```typescript
export type MassIDData = z.infer<typeof MassIDDataSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
```

## Minimize `.refine()`

Use `.refine()` only when built-in validators cannot express the constraint:

```typescript
// BAD: refine for something built-in
z.string().refine((s) => s.includes('@'), 'Must be email');
// GOOD: built-in validator
z.string().email('Must be valid email');

// BAD: refine for length
z.string().refine((s) => s.length >= 1, 'Required');
// GOOD: built-in constraint
z.string().min(1, 'Required');

// GOOD: refine for cross-field validation (no built-in alternative)
.refine((data) => {
  const ids = new Set(data.participants.map((p) => p.id));
  return data.events.every((e) => ids.has(e.participant_id));
}, 'All event participant IDs must exist in participants array')
```

## Schema extraction guidelines

### Extract when

1. **Reused by 2+ consumers** — shared across multiple schemas
2. **3+ fields** — complex enough to warrant a named concept
3. **Testable independently** — has validation logic worth testing
4. **Domain entity** — represents a cohesive business concept

```typescript
// GOOD: extracted — reused, 3+ fields, domain concept
export const CoordinatesSchema = z.strictObject({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});
```

### Keep inline when

1. **Simple single-use primitive** — one constraint, used once
2. **Schema-specific enum** — not reused elsewhere
3. **Single-field wrapper** — only adds metadata

```typescript
// GOOD: inline — simple, single-use
name: z.string().min(1).max(100).meta({
  title: 'Name',
  description: 'Name of the entity',
  examples: ['Example Name'],
}),
```

## Enum conventions

Use consistent casing based on semantic meaning:

- **Title Case** for user-facing values: `['None', 'Low', 'Medium', 'High']`
- **lowercase** for technical values: `['mainnet', 'testnet']`
- **UPPERCASE** for constants: `['KILOGRAM', 'DATE', 'CURRENCY']`

## Timestamp patterns

Use `IsoDateTimeSchema` for ISO 8601 strings and unix milliseconds for epoch timestamps. Always include the pattern in the field name:

```typescript
created_at: IsoDateTimeSchema.meta({ ... }),  // ISO 8601 string
pickup_date: IsoDateSchema.meta({ ... }),     // ISO 8601 date only
minted_at_ms: z.number().int().meta({ ... }), // Unix milliseconds
```
