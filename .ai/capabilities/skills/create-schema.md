---
id: create-schema
name: create-schema
description: 'Use when scaffolding a new schema type directory with data, attributes, tests, and index'
when_to_use:
  - 'Adding a new IPFS schema type to the package'
  - 'When the user asks to create a new schema'
  - 'When extending the package with a new asset/receipt/audit type'
workflow:
  - '[ ] Create src/{type}/ directory'
  - '[ ] Create {type}.data.schema.ts with type-specific data'
  - '[ ] Create {type}.attributes.ts with NFT attributes'
  - '[ ] Create {type}.schema.ts extending NftIpfsSchema'
  - '[ ] Create index.ts barrel export'
  - '[ ] Create __tests__/{type}.schema.spec.ts'
  - '[ ] Add export to src/index.ts'
  - '[ ] Run pnpm check'
inputs:
  - 'Schema type name (kebab-case)'
  - 'Schema purpose'
  - 'Key fields'
outputs:
  - 'Complete schema type directory with data, attributes, main schema, tests, and exports'
references:
  - .ai/rules/zod.md
  - .ai/rules/naming-conventions.md
  - .ai/rules/testing.md
---

# Create Schema Skill

## Instructions

Scaffold a new IPFS schema type directory in the schemas package with all required files following project conventions.

### Directory Structure

For a new schema type called `{type}` (e.g., `mass-id`, `credit-audit`):

```
src/
  {type}/
    {type}.data.schema.ts      # Type-specific data fields
    {type}.attributes.ts       # NFT attribute definitions
    {type}.schema.ts           # Main schema extending NftIpfsSchema
    index.ts                   # Barrel exports
    __tests__/
      {type}.schema.spec.ts    # Comprehensive tests
```

### Step 1: Create the Directory

```bash
mkdir -p src/{type}/__tests__
```

### Step 2: Data Schema (`{type}.data.schema.ts`)

Define the type-specific data payload using `z.strictObject()`. Every field MUST have `.meta()` with at least a `description`.

```typescript
import { z } from 'zod';

export const {TypeName}DataSchema = z
  .strictObject({
    field_name: z
      .string()
      .meta({
        description: 'Human-readable description of this field',
        examples: ['example-value'],
      }),
    numeric_field: z
      .number()
      .positive()
      .meta({
        description: 'Description of the numeric field',
        examples: [42],
      }),
    optional_field: z
      .string()
      .optional()
      .meta({
        description: 'Description of the optional field',
        examples: ['optional-value'],
      }),
  })
  .meta({
    description: 'Type-specific data for {type} schema',
  });

export type {TypeName}Data = z.infer<typeof {TypeName}DataSchema>;
```

**Naming conventions**:

- Schema variable: `PascalCase` + `DataSchema` suffix (e.g., `MassIdDataSchema`)
- Type export: `PascalCase` + `Data` suffix (e.g., `MassIdData`)
- Properties: `snake_case` (e.g., `batch_size`, `processing_date`)

### Step 3: Attributes (`{type}.attributes.ts`)

Define NFT attributes as a typed array:

```typescript
import type { NftAttribute } from '../shared/nft-attribute.schema';

export const {typeName}Attributes: NftAttribute[] = [
  {
    trait_type: 'Attribute Name',
    value: 'default_value',
  },
  {
    trait_type: 'Another Attribute',
    value: 'another_value',
  },
];
```

**Conventions**:

- `trait_type` uses Title Case for user-facing labels
- `value` matches the expected runtime value type

### Step 4: Main Schema (`{type}.schema.ts`)

Extend `NftIpfsSchema` using `.safeExtend()`:

```typescript
import { z } from 'zod';
import { NftIpfsSchema } from '../shared/nft-ipfs.schema';
import { NftAttributeSchema } from '../shared/nft-attribute.schema';
import { {TypeName}DataSchema } from './{type}.data.schema';
import { {typeName}Attributes } from './{type}.attributes';

export const {TypeName}Schema = NftIpfsSchema.safeExtend({
  data: {TypeName}DataSchema.meta({
    description: 'Type-specific data for {type}',
  }),
  attributes: z
    .array(NftAttributeSchema)
    .default({typeName}Attributes)
    .meta({
      description: 'NFT attributes for {type}',
    }),
}).meta({
  description: '{TypeName} IPFS schema for NFT metadata',
});

export type {TypeName} = z.infer<typeof {TypeName}Schema>;
```

**Important**: Use `.safeExtend()` (not `.extend()`) to preserve strict object validation from the base schema.

### Step 5: Barrel Export (`index.ts`)

```typescript
export { {TypeName}DataSchema, type {TypeName}Data } from './{type}.data.schema';
export { {typeName}Attributes } from './{type}.attributes';
export { {TypeName}Schema, type {TypeName} } from './{type}.schema';
```

### Step 6: Tests (`__tests__/{type}.schema.spec.ts`)

Write comprehensive tests targeting 100% coverage:

```typescript
import { describe, expect, it } from 'vitest';
import { {TypeName}Schema } from '../{type}.schema';
import { {TypeName}DataSchema } from '../{type}.data.schema';

describe('{TypeName}Schema', () => {
  describe('valid inputs', () => {
    it('should parse a complete valid input', () => {
      const input = {
        // ... all required fields with valid values
      };
      const result = {TypeName}Schema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it.each([
      ['scenario 1', { /* valid variation 1 */ }],
      ['scenario 2', { /* valid variation 2 */ }],
    ])('should parse valid input: %s', (_label, input) => {
      const result = {TypeName}Schema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject missing required fields', () => {
      const result = {TypeName}Schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject invalid field types', () => {
      const input = {
        field_name: 123, // should be string
      };
      const result = {TypeName}Schema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject unknown properties (strict)', () => {
      const input = {
        // ... all valid fields plus:
        unknown_field: 'value',
      };
      const result = {TypeName}Schema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('optional fields', () => {
    it('should parse without optional fields', () => {
      const input = {
        // ... only required fields
      };
      const result = {TypeName}Schema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});

describe('{TypeName}DataSchema', () => {
  // ... similar test structure for the data schema alone
});
```

**Test patterns**:

- Use `.safeParse()` for all validation (never `.parse()` in tests)
- Use `it.each` for table-driven tests with multiple valid/invalid inputs
- Test every required field individually for rejection
- Test unknown property rejection (strictObject enforcement)
- Test optional field absence and presence
- Use fixtures from `src/test-utils/fixtures/` when available

### Step 7: Update Root Barrel Export

Add the new type to `src/index.ts`:

```typescript
export * from './{type}';
```

### Step 8: Run Quality Gates

```bash
pnpm check
```

This will:

- Lint and format the new files
- Type-check the new schemas
- Generate JSON schemas from the new Zod definitions
- Hash and validate the generated schemas
- Update and validate examples
- Run tests with 100% coverage enforcement

### Naming Reference

| Concept                   | Convention             | Example                  |
| ------------------------- | ---------------------- | ------------------------ |
| Directory                 | kebab-case             | `mass-id/`               |
| File names                | kebab-case with suffix | `mass-id.data.schema.ts` |
| Schema variables          | PascalCase + Schema    | `MassIdDataSchema`       |
| Type exports              | PascalCase             | `MassIdData`             |
| Properties                | snake_case             | `batch_size`             |
| Attribute trait_type      | Title Case             | `Batch Size`             |
| Enum values (user-facing) | Title Case             | `Recycling Center`       |
| Enum values (technical)   | lowercase              | `pending`                |
