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

#### Example Usage Guidelines

**Always add examples when:**

- The field is user-facing or requires clarification
- The format/pattern isn't obvious (UUIDs, hashes, timestamps)
- Enum values need to show variety
- Complex objects/arrays benefit from full examples

**Can skip examples when:**

- Field is a simple reference to a well-documented base schema that already has examples
- Field is clearly self-explanatory from the description and base type
- Example would be redundant with a referenced schema's examples

**Single vs Multiple Examples:**

- **Use `examples` (plural array) by default** to show variety and valid options
- **Use `example` (singular) only** for canonical patterns or when one example is sufficient
- **2–4 examples** is typically optimal for showing variety without overwhelming—adjust based on domain complexity and the number of valid enum values or distinct use cases.

```typescript
// ✅ Multiple examples showing variety
const WasteTypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Waste Type',
  description: 'Category or type of waste material',
  examples: ['Organic', 'Plastic', 'Metal'], // Shows variety
});

// ✅ Single example for canonical pattern
$schema: z.url().meta({
  title: 'JSON Schema URI',
  description: 'URI of the JSON Schema used to validate this record',
  example: 'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/heads/main/schemas/ipfs/shared/base/base.schema.json',
}),

// ✅ Base schema has examples, field just adds context
external_id: ExternalIdSchema.meta({
  title: 'External ID',
  description: 'UUID identifier for external system references',
  // No examples needed - ExternalIdSchema (UuidSchema) already has examples
}),
```

**Array and Object Examples:**

- **Add full array examples** for complex nested structures where the complete structure helps understanding
- **Add object examples** when relationships between fields need demonstration
- **Rely on item schema examples** for simple arrays of primitives or when item examples are sufficient

```typescript
// ✅ Complex nested array - full example shows structure
external_links: uniqueBy(ExternalLinkSchema, ...).optional().meta({
  title: 'External Links',
  description: 'Optional list of public resource links with labels',
  examples: [
    [
      {
        label: 'Carrot Explorer',
        url: 'https://explore.carrot.eco/document/...',
        description: 'Complete chain of custody and audit trail',
      },
      {
        label: 'Carrot White Paper',
        url: 'https://whitepaper.carrot.eco',
        description: 'Carrot Foundation technical and impact white paper',
      },
    ],
  ],
}),

// ✅ Simple array - item schema examples are sufficient
roles: uniqueArrayItems(ParticipantRoleSchema, ...).meta({
  title: 'Participant Roles',
  description: 'Roles of the participant',
  // No array example needed - ParticipantRoleSchema has examples
}),
```

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
export const WastePropertiesSchema = z.strictObject({...});
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
export type WasteProperties = z.infer<typeof WastePropertiesSchema>;
```

### Schema Field Naming

Field names use `snake_case` consistently across all schemas:

#### Pattern: `snake_case` for all object properties

```typescript
const schema = z.strictObject({
  // ✅ snake_case field names
  type: z.string(),
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
const FacilityTypeSchema = z.enum([
  'Waste Generation',
  'Collection Point',
  'Sorting Facility',
  'Recycling Facility',
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

### Schema Extraction Guidelines

Extract a schema into its own definition when:

#### 1. Reusability

Used in 2+ schemas or likely to be reused across the codebase.

```typescript
// ✅ Extract - Used in multiple places
export const ExternalLinkSchema = z.strictObject({
  label: z.string().min(1).max(50).meta({...}),
  url: z.url().meta({...}),
  description: z.string().optional().meta({...}),
});
```

#### 2. Complexity

Multi-field object (3+ fields) representing a domain concept.

```typescript
// ✅ Extract - Complex object representing domain entity
export const CoordinatesSchema = z.strictObject({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});
```

#### 3. Testability

Needs independent validation and testing.

```typescript
// ✅ Extract - Can be tested independently
export const ParticipantSchema = z.strictObject({
  id_hash: Sha256HashSchema,
  roles: uniqueArrayItems(ParticipantRoleSchema, ...),
});
```

#### 4. Logical Grouping

Represents a cohesive domain entity worth documenting separately.

```typescript
// ✅ Extract - Logical grouping representing domain concept
export const BlockchainReferenceSchema = z.strictObject({
  smart_contract_address: SmartContractAddressSchema,
  chain_id: BlockchainChainIdSchema,
  network_name: z.string(),
  token_id: TokenIdSchema,
});
```

**Keep inline when:**

- Simple primitive with constraints used only once
- Schema-specific enum not reused elsewhere
- Single-field wrapper that only adds metadata

```typescript
// ✅ Keep inline - Simple, single-use
name: z.string().min(1).max(100).meta({
  title: 'Name',
  description: 'Name of the entity',
  examples: ['Example Name'],
}),

// ✅ Keep inline - Schema-specific enum
const MeasurementUnitSchema = z.enum(['kg', 'ton']).meta({
  title: 'Measurement Unit',
  description: 'Unit of measurement',
  examples: ['kg', 'ton'],
});
```

#### Array Schema Extraction

Extract array schemas with extra logic (like `uniqueBy()` wrappers) based on complexity, not just the presence of wrapper functions.

**Extract when:**

1. **Complex type composition** - Union/intersection with multiple schemas

   ```typescript
   // ✅ Extract - Complex union of 17 attribute types
   export const MassIDAttributesSchema = uniqueBy(
     z.union([Attribute1Schema, Attribute2Schema, ..., Attribute17Schema]),
     (attr) => attr.trait_type,
   ).min(12).max(17);
   ```

2. **Domain-specific constraints** - Business rules beyond basic validation

   ```typescript
   // ✅ Extract - Specific min/max represents domain rules
   .min(12).max(17)  // Must have 12-17 specific attributes
   ```

3. **Reusability** - Used in multiple places or likely to be reused

4. **Cohesive domain entity** - Represents a distinct business concept worth documenting separately

**Keep inline when:**

1. **Simple wrapper** - Just `uniqueBy()` or `uniqueArrayItems()` with basic constraints (typically 1–4 item schemas)

   ```typescript
   // ✅ Keep inline - Simple wrapper
   external_links: uniqueBy(ExternalLinkSchema, ...).max(10).optional()
   ```

2. **Generic/context-specific** - Tied to a specific schema context

   ```typescript
   // ✅ Keep inline - Context-specific to NFT records
   attributes: uniqueBy(NftAttributeSchema, ...)
   ```

3. **Single constraint** - Just `.min()`, `.max()`, or `.optional()` added
   ```typescript
   // ✅ Keep inline - Simple constraint
   locations: uniqueBy(LocationSchema, ...).min(1)
   ```

**Decision Matrix:**

| Factor                                                | Extract | Keep Inline |
| ----------------------------------------------------- | ------- | ----------- |
| Complex union/intersection type                       | ✅      | ❌          |
| Multiple domain-specific constraints                  | ✅      | ❌          |
| 5+ item union/complex composition                     | ✅      | ❌          |
| Reusable across schemas                               | ✅      | ❌          |
| Represents cohesive domain entity                     | ✅      | ❌          |
| Simple wrapper (`uniqueBy` + basic constraints)       | ❌      | ✅          |
| Context-specific to parent schema                     | ❌      | ✅          |
| Single constraint (`.min()`, `.max()`, `.optional()`) | ❌      | ✅          |

**Guideline:** Extract based on structural complexity and domain cohesion, not just the presence of a wrapper function. A wrapper function is just a validation pattern; the complexity of what's inside determines extraction.

## Implementation Examples

### Complete Field Definition

```typescript
const wasteProperties = z
  .strictObject({
    type: wasteType.meta({
      title: 'Waste Type',
      examples: ['Organic', 'Plastic', 'Metal'],
      description: 'Waste material category',
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
