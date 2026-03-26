---
name: zod
description: 'Use when authoring or modifying Zod schemas -- composition, metadata, and validation patterns'
---

Comprehensive guide for authoring and modifying Zod schemas in the schemas package, covering composition, metadata, validation patterns, and project conventions.

### Core Rule: `z.strictObject()`

Always use `z.strictObject()` instead of `z.object()`. Strict objects reject unknown properties, which is critical for schema validation:

```typescript
// CORRECT: strictObject rejects unknown properties
const Schema = z.strictObject({
  name: z.string().meta({ description: 'The display name' }),
});

// INCORRECT: object allows unknown properties to pass through
const Schema = z.object({
  name: z.string().meta({ description: 'The display name' }),
});
```

### Metadata: `.meta()` on Every Field

Every field MUST have `.meta()` with at least a `description`. This is used to generate JSON Schema documentation.

```typescript
const DataSchema = z.strictObject({
  // Required field with description and examples
  document_id: z
    .string()
    .uuid()
    .meta({
      description: 'Unique identifier for the document',
      examples: ['550e8400-e29b-41d4-a716-446655440000'],
    }),

  // Numeric field with constraints
  weight_kg: z
    .number()
    .positive()
    .meta({
      description: 'Weight of the material in kilograms',
      examples: [150.5],
    }),

  // Optional field
  notes: z
    .string()
    .optional()
    .meta({
      description: 'Additional notes about the document',
      examples: ['Verified by field inspector'],
    }),

  // Enum field
  status: z.enum(['pending', 'approved', 'rejected']).meta({
    description: 'Current processing status',
    examples: ['pending'],
  }),
});
```

Parent objects also need `.meta()`:

```typescript
const Schema = z
  .strictObject({ ... })
  .meta({
    description: 'Data payload for the credit audit schema',
  });
```

### Schema Composition Layers

The schemas package uses a layered composition pattern:

```text
BaseIpfsSchema          (common IPFS fields: name, description, image, external_url)
  └── NftIpfsSchema     (adds NFT fields: attributes, data)
        └── TypeSchema   (type-specific data and attributes)
```

#### Extending with `.safeExtend()`

Always use `.safeExtend()` to compose schemas. This preserves strict object validation:

```typescript
import { NftIpfsSchema } from '../shared/nft-ipfs.schema';

export const CreditAuditSchema = NftIpfsSchema.safeExtend({
  data: CreditAuditDataSchema.meta({
    description: 'Credit audit specific data',
  }),
}).meta({
  description: 'Credit Audit IPFS schema for NFT metadata',
});
```

**Why `.safeExtend()` and not `.extend()`**: While both preserve `strictObject` enforcement, `.extend()` throws at runtime on schemas with refinements and clears existing checks. `.safeExtend()` preserves refinements and provides stricter TypeScript types that prevent incompatible field overrides.

### Field Type Patterns

#### Strings

```typescript
// Plain string
name: z.string().meta({ description: 'Display name' }),

// UUID
document_id: z.string().uuid().meta({ description: 'Document UUID' }),

// URL
external_url: z.string().url().meta({ description: 'External URL' }),

// Constrained string
code: z.string().min(1).max(50).meta({ description: 'Short code' }),

// Regex-validated string
hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).meta({ description: 'Hex hash' }),
```

#### Numbers

```typescript
// Positive number
weight: z.number().positive().meta({ description: 'Weight in kg' }),

// Non-negative integer
count: z.number().int().nonneg().meta({ description: 'Item count' }),

// Bounded number
percentage: z.number().min(0).max(100).meta({ description: 'Percentage value' }),
```

#### Enums

```typescript
// Technical enums (lowercase)
status: z
  .enum(['pending', 'approved', 'rejected'])
  .meta({ description: 'Processing status' }),

// User-facing enums (Title Case)
category: z
  .enum(['Recycling Center', 'Collection Point', 'Processing Facility'])
  .meta({ description: 'Facility category' }),
```

#### Timestamps

```typescript
// ISO 8601 datetime string
created_at: z
  .string()
  .datetime()
  .meta({
    description: 'Creation timestamp in ISO 8601 format',
    examples: ['2024-01-15T10:30:00Z'],
  }),
```

#### Arrays

```typescript
// Array of objects
participants: z
  .array(ParticipantSchema)
  .min(1)
  .meta({ description: 'List of participants' }),

// Array of strings
tags: z
  .array(z.string())
  .meta({ description: 'Classification tags' }),
```

### Extraction Guidelines

When to extract a sub-schema into a shared module:

| Extract When                | Keep Inline When        |
| --------------------------- | ----------------------- |
| Used by 2+ schemas          | Used by only one schema |
| Has 3+ fields               | Has 1-2 simple fields   |
| Independently testable      | Trivial validation      |
| Represents a domain concept | Just a container        |

Extract to `src/shared/`:

```typescript
// src/shared/address.schema.ts
export const AddressSchema = z
  .strictObject({
    street: z.string().meta({ description: 'Street address' }),
    city: z.string().meta({ description: 'City name' }),
    country: z
      .string()
      .meta({ description: 'Country code (ISO 3166-1 alpha-2)' }),
    postal_code: z.string().meta({ description: 'Postal/ZIP code' }),
  })
  .meta({ description: 'Physical address' });

export type Address = z.infer<typeof AddressSchema>;
```

Then use it in type-specific schemas:

```typescript
import { AddressSchema } from '../shared/address.schema';

const FacilityDataSchema = z.strictObject({
  address: AddressSchema.meta({ description: 'Facility address' }),
  // ...
});
```

### Type Inference

Always infer types from schemas instead of defining them manually:

```typescript
// CORRECT: inferred from schema
export type CreditAudit = z.infer<typeof CreditAuditSchema>;
export type CreditAuditData = z.infer<typeof CreditAuditDataSchema>;

// INCORRECT: manually defined type (drifts from schema)
export interface CreditAudit {
  name: string;
  data: { ... };
}
```

### Do / Don't Quick Reference

```typescript
// DO: strictObject with meta on every field
const Schema = z.strictObject({
  field: z.string().meta({ description: 'Field description' }),
});

// DON'T: object without meta
const Schema = z.object({
  field: z.string(),
});

// DO: safeExtend for composition
const Extended = Base.safeExtend({
  newField: z.string().meta({ description: '...' }),
});

// DON'T: extend (throws on schemas with refinements, clears checks)
const Extended = Base.extend({ newField: z.string() });

// DO: snake_case properties
const Schema = z.strictObject({
  document_id: z.string().meta({ description: '...' }),
});

// DON'T: camelCase properties
const Schema = z.strictObject({
  documentId: z.string().meta({ description: '...' }),
});

// DO: infer types from schema
type MyType = z.infer<typeof MySchema>;

// DON'T: manually define types
interface MyType {
  field: string;
}

// DO: .safeParse() in tests
const result = Schema.safeParse(input);
expect(result.success).toBe(true);

// DON'T: .parse() in tests (throws)
expect(() => Schema.parse(input)).not.toThrow();
```

### Naming Conventions Summary

| Concept            | Convention          | Example                       |
| ------------------ | ------------------- | ----------------------------- |
| Schema variable    | PascalCase + Schema | `CreditAuditDataSchema`       |
| Type export        | PascalCase          | `CreditAuditData`             |
| Properties         | snake_case          | `document_id`, `weight_kg`    |
| File name          | kebab-case + suffix | `credit-audit.data.schema.ts` |
| Enum (user-facing) | Title Case          | `Recycling Center`            |
| Enum (technical)   | lowercase           | `pending`                     |

### Additional Reference

For more detailed Zod patterns and project-specific conventions, see `ZOD_SCHEMA_PATTERNS.md` in the project documentation.
