---
name: rule-naming-conventions
description: 'Naming standards — snake_case properties, kebab-case files, PascalCase types and exports'
---

# Rule naming-conventions

Apply this rule whenever work touches:

- `src/**/*.ts`

# Naming standards for the schemas package

Consistent naming across schemas, files, and exports is non-negotiable for a published package. Every consumer interacts with these names directly.

## Schema property names — `snake_case`

All properties within Zod schemas use `snake_case`. This matches the JSON output format and the IPFS data conventions.

```typescript
// GOOD: snake_case properties
const LocationSchema = z.strictObject({
  administrative_division_code: z.string().meta({ ... }),
  country_code: CountryCodeSchema.meta({ ... }),
  facility_type: FacilityTypeSchema.meta({ ... }),
  total_distance_km: z.number().min(0).meta({ ... }),
  created_at: IsoDateTimeSchema.meta({ ... }),
});

// BAD: camelCase properties
const LocationSchema = z.strictObject({
  administrativeDivisionCode: z.string(),  // WRONG
  countryCode: z.string(),                 // WRONG
  facilityType: z.string(),                // WRONG
});
```

This is a strict rule — there are no exceptions for "TypeScript convention". The schemas define data contracts, and those contracts use `snake_case`.

## File and directory names — `kebab-case`

All files and directories use `kebab-case`:

```
GOOD:
  src/mass-id/mass-id.data.schema.ts
  src/shared/schemas/primitives/ids.schema.ts
  src/test-utils/fixtures/mass-id-data.fixture.ts

BAD:
  src/massId/MassIdData.schema.ts           // PascalCase dir + file
  src/shared/schemas/UUID.schema.ts         // UPPERCASE
  src/mass_id/mass_id_data.schema.ts        // snake_case
```

File naming patterns by type:

- **Schema files**: `{entity}.schema.ts` or `{entity}.schemas.ts` (plural when file contains multiple related schemas)
- **Test files**: `{entity}.schema.spec.ts` (in `__tests__/` directory)
- **Fixture files**: `{entity}.fixture.ts` (in `src/test-utils/fixtures/`)
- **Type files**: `{entity}.types.ts`
- **Helper files**: `{entity}.helpers.ts`
- **Constant files**: `{entity}.constants.ts`
- **Index files**: `index.ts` (barrel exports)

## Schema exports — `PascalCase` with `Schema` suffix

All exported Zod schema constants use PascalCase with a `Schema` suffix:

```typescript
// GOOD: PascalCase + Schema suffix
export const MassIDDataSchema = z.strictObject({ ... });
export const LocationSchema = z.strictObject({ ... });
export const ParticipantRoleSchema = z.enum([...]);
export const BlockchainReferenceSchema = z.strictObject({ ... });
export const WastePropertiesSchema = z.strictObject({ ... });

// BAD: missing suffix or wrong casing
export const massIdData = z.strictObject({ ... });        // camelCase, no suffix
export const MASS_ID_DATA_SCHEMA = z.strictObject({ ... }); // UPPER_CASE
export const massIDDataSchema = z.strictObject({ ... });   // camelCase
```

## Type exports — `PascalCase` without `Schema` suffix

TypeScript types inferred from schemas drop the `Schema` suffix:

```typescript
// GOOD: matches schema name without "Schema"
export type MassIDData = z.infer<typeof MassIDDataSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;

// BAD: Schema suffix on type
export type MassIDDataSchema = z.infer<typeof MassIDDataSchema>; // Conflicts!
export type LocationSchemaType = z.infer<typeof LocationSchema>; // Redundant suffix
```

## ID field naming — `_id` suffix

Fields that hold identifiers always end with `_id`:

```typescript
// GOOD: _id suffix for identifiers
participant_id: UuidSchema.meta({ ... }),
location_id: UuidSchema.meta({ ... }),
external_id: ExternalIdSchema.meta({ ... }),
document_id: UuidSchema.meta({ ... }),

// BAD: no _id suffix or inconsistent
participant: UuidSchema.meta({ ... }),     // Missing _id
participantId: UuidSchema.meta({ ... }),   // camelCase
```

The only exception is `id` itself (the primary identifier of an entity), which does not need the prefix.

## Timestamp naming

Use descriptive names that indicate what the timestamp represents:

```typescript
// GOOD: descriptive timestamp names
created_at: IsoDateTimeSchema.meta({ ... }),      // When created
updated_at: IsoDateTimeSchema.meta({ ... }),      // When last modified
pickup_date: IsoDateSchema.meta({ ... }),          // Date of pickup
recycling_date: IsoDateSchema.meta({ ... }),       // Date of recycling
minted_at: IsoDateTimeSchema.meta({ ... }),        // When NFT was minted

// BAD: vague timestamp names
date: IsoDateTimeSchema.meta({ ... }),             // Date of what?
time: IsoDateTimeSchema.meta({ ... }),             // Time of what?
timestamp: IsoDateTimeSchema.meta({ ... }),        // Too generic
```

## Measurement naming — include unit

When a field represents a measurement, include the unit in the name:

```typescript
// GOOD: unit in name
distance_km: z.number().min(0).meta({ ... }),
weight_kg: z.number().min(0).meta({ ... }),
duration_hours: z.number().min(0).meta({ ... }),
area_hectares: z.number().min(0).meta({ ... }),
total_distance_km: z.number().min(0).meta({ ... }),

// BAD: no unit
distance: z.number().min(0).meta({ ... }),         // Kilometers? Miles?
weight: z.number().min(0).meta({ ... }),            // Kilograms? Tons?
duration: z.number().min(0).meta({ ... }),          // Hours? Seconds?
```

## Code field naming — `_code` suffix

Fields holding standardized codes use the `_code` suffix:

```typescript
// GOOD: _code suffix for standardized codes
country_code: CountryCodeSchema.meta({ ... }),                    // ISO 3166-1
administrative_division_code: z.string().meta({ ... }),           // ISO 3166-2
currency_code: z.string().meta({ ... }),                          // ISO 4217

// BAD: missing _code suffix
country: z.string().meta({ ... }),                                // Ambiguous
admin_division: z.string().meta({ ... }),                         // Abbreviated + no suffix
```

## Variables and functions — `camelCase`

Internal variables and functions use standard TypeScript `camelCase`:

```typescript
// GOOD: camelCase for functions and variables
export function uniqueArrayItems<T>(schema: T, message: string) { ... }
const parsedResult = schema.safeParse(data);
const schemaVersion = getSchemaVersionOrDefault();
```

This is distinct from schema property names (which are `snake_case`). The distinction is clear: schema properties define data contracts, while variables and functions are TypeScript implementation details.
