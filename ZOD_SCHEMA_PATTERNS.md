# Carrot Foundation Schema Patterns and Best Practices

This document outlines the established patterns and conventions for developing and maintaining Zod schemas within the Carrot Foundation schema repository.

## Core Principles

### 1. Meta Information for Enhanced Documentation

Every schema field should include comprehensive `meta` information to provide examples, titles, and contextual information for better developer experience and automated documentation generation.

#### Pattern Usage

```typescript
const fieldName = z.string().meta({
  title: 'Human-readable Field Title',
  examples: ['example1', 'example2', 'example3'],
  description: 'Detailed description of the field purpose and usage',
});
```

#### Benefits

- **Automated Documentation**: Meta information enables automatic generation of comprehensive JSON Schema documentation
- **Developer Experience**: Clear examples and titles improve code comprehensibility
- **API Documentation**: Facilitates creation of interactive API documentation with realistic examples
- **Testing**: Examples provide ready-to-use test data

### 2. Replacing `strict()` with `strictObject()`

Use `strictObject()` instead of combining `object()` with `strict()` for cleaner, more explicit schema definitions.

#### Migration Pattern

```typescript
// ❌ Old Pattern
const schema = z
  .object({
    field1: z.string(),
    field2: z.number(),
  })
  .strict();

// ✅ New Pattern
const schema = z.strictObject({
  field1: z.string(),
  field2: z.number(),
});
```

#### Benefits

- **Cleaner Syntax**: Single method call instead of chaining
- **Explicit Intent**: Clearly indicates strict object validation
- **Consistency**: Aligns with modern Zod best practices

### 4. Minimizing Use of `refine()` Validators

Avoid custom `refine()` validations except when business logic cannot be represented through standard Zod methods.

#### When to Use `refine()`

Use `refine()` only for:

- Cross-field validations that cannot be expressed declaratively
- Complex business rules that require custom logic
- Domain-specific constraints that have no Zod equivalent

#### Preferred Alternatives

```typescript
// ❌ Unnecessary refine usage
const schema = z
  .object({
    email: z.string(),
  })
  .refine((data) => data.email.includes('@'), 'Must be valid email');

// ✅ Use built-in validators
const schema = z.strictObject({
  email: z.string().email('Must be valid email'),
});

// ❌ Unnecessary refine for length
const schema = z
  .object({
    name: z.string(),
  })
  .refine((data) => data.name.length >= 1, 'Name required');

// ✅ Use built-in constraints
const schema = z.strictObject({
  name: z.string().min(1, 'Name required'),
});
```

#### Acceptable `refine()` Usage

```typescript
// ✅ Complex business logic that requires refine()
const schema = z
  .strictObject({
    participants: z.array(participantSchema),
    events: z.array(eventSchema),
  })
  .refine((data) => {
    const participantIds = new Set(data.participants.map((p) => p.id));
    const eventParticipantIds = data.events.map((e) => e.participant_id);
    return eventParticipantIds.every((id) => participantIds.has(id));
  }, 'All participant IDs in events must exist in participants array');
```

### 5. Naming Conventions

#### Schema Export Names

All schema definitions follow consistent naming patterns to ensure clarity and maintainability:

#### Pattern: `[Entity]Schema`

```typescript
// ✅ Schema naming pattern
export const MassIDDataSchema = z.strictObject({...});
export const LocationSchema = z.strictObject({...});
export const ParticipantSchema = z.strictObject({...});
export const WasteClassificationSchema = z.strictObject({...});
```

#### Benefits

- **Immediate Recognition**: Schema suffix makes purpose clear
- **Import Clarity**: Distinguishes schemas from types in imports
- **IDE Support**: Autocomplete easily identifies schema exports

### Type Export Names

TypeScript types inferred from schemas follow the pattern without "Schema" suffix:

#### Pattern: `[Entity]` (matches schema name without suffix)

```typescript
// ✅ Type naming pattern
export type MassIDData = z.infer<typeof MassIDDataSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type WasteClassification = z.infer<typeof WasteClassificationSchema>;
```

### Schema Field Naming

Field names use `snake_case` consistently across all schemas:

#### Pattern: `snake_case` for all object properties

```typescript
const schema = z.strictObject({
  // ✅ snake_case field names
  primary_type: z.string(),
  measurement_unit: z.enum(['kg', 'ton']),
  net_weight: z.number(),
  contamination_level: z.enum(['None', 'Low', 'Medium', 'High']),
  administrative_division_code: z.string(),
  total_distance_km: z.number(),
  total_duration_hours: z.number(),
});
```

#### Field Name Patterns

- **ID Fields**: Always end with `_id` (e.g., `participant_id`, `location_id`, `external_id`)
- **Timestamps**: Use descriptive names like `created_at`, `pickup_date`, `recycling_date`
- **Measurements**: Include unit in name when relevant (e.g., `distance_km`, `duration_hours`, `weight_kg`)
- **References**: Use `_id` suffix for foreign key relationships
- **Codes**: Use `_code` suffix for standardized codes (e.g., `country_code`, `administrative_division_code`)

### Enum Value Naming

Enum values use consistent patterns based on their semantic meaning:

#### Title Case for User-Facing Values

```typescript
// ✅ Title Case for user-facing enums
const ContaminationLevelSchema = z.enum(['None', 'Low', 'Medium', 'High']);
const PrecisionLevelSchema = z.enum([
  'exact',
  'neighborhood',
  'city',
  'region',
  'country',
]);
const FacilityTypeSchema = z.enum([
  'Collection Point',
  'Recycling Facility',
  'Administrative Office',
  'Other',
]);
```

#### lowercase for Technical Values

```typescript
// ✅ lowercase for technical/system values
const BlockchainNetworkSchema = z.enum(['mainnet', 'testnet']);
const DeploymentSchema = z.enum(['production', 'development', 'testing']);
const MeasurementUnitSchema = z.enum(['kg', 'ton']);
```

#### UPPERCASE for Constants

```typescript
// ✅ UPPERCASE for constant identifiers
const DataSetNameSchema = z.enum(['TEST', 'PROD']);
const EventAttributeFormatSchema = z.enum(['KILOGRAM', 'DATE', 'CURRENCY']);
```

### Variable and Function Naming

#### camelCase for Variables and Functions

```typescript
// ✅ camelCase for variables and functions
const wasteClassification = z.strictObject({...});
const localClassification = z.strictObject({...});

export function uniqueArrayItems<T extends z.ZodTypeAny>(
  schema: T,
  errorMessage: string = 'Array items must be unique',
) { ... }
```

### Complex Schema Composition

When composing complex schemas, use descriptive names that indicate the composition:

#### Pattern: `[Base][Modifier]Schema`

```typescript
// ✅ Composed schema naming
const AttributeWasteTypeSchema = z.strictObject({...});
const AttributeWeightSchema = z.strictObject({...});
const MassIDAttributesSchema = z.tuple([...]);
const NftIpfsSchema = BaseIpfsSchema.safeExtend({...});
```

## Implementation Examples

### Complete Field Definition

```typescript
const wasteClassification = z
  .strictObject({
    primary_type: wasteType.meta({
      title: 'Primary Waste Type',
      examples: ['Organic', 'Plastic', 'Metal'],
      description: 'Primary waste material category',
    }),
    net_weight: z
      .number()
      .min(0)
      .meta({
        title: 'Net Weight',
        examples: [3000, 1500, 2.5],
        description:
          'Net weight of the waste batch in the specified measurement unit',
      }),
    contamination_level: z.enum(['None', 'Low', 'Medium', 'High']).meta({
      title: 'Contamination Level',
      examples: ['Low', 'Medium', 'None'],
      description: 'Level of contamination in the waste batch',
    }),
  })
  .meta({
    title: 'Waste Classification',
    description:
      'Details about the waste classification including type, weight, and contamination level.',
  });
```

## Benefits of These Patterns

### 1. Enhanced Documentation Generation

- Automatic creation of comprehensive JSON Schema files
- Rich examples for API documentation
- Clear field descriptions for developers

### 2. Improved Developer Experience

- Consistent naming conventions
- Comprehensive examples for testing
- Clear validation error messages

### 3. Better Maintainability

- Reduced custom validation logic
- Consistent schema structure
- Self-documenting code

### 4. Automated Tooling Support

- Schema validation tools can leverage meta information
- Testing frameworks can use examples for property-based testing
- Documentation generators have rich context
