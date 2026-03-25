---
id: code-style
intent: 'Readable, consistent, and well-structured code across the schemas package'
scope:
  - '*'
requirements:
  - 'Descriptive names — verbs for functions, nouns for variables'
  - 'Guard clauses and early returns'
  - 'Nesting <= 2 levels'
  - 'No abbreviations except industry-standard (id, url, api)'
  - 'Single responsibility per function'
  - 'Functional patterns over classes'
anti_patterns:
  - 'Deep nesting (> 2 levels)'
  - 'God functions handling multiple concerns'
  - 'Abbreviated identifiers (val, tmp, cb)'
  - 'Silent error swallowing'
  - 'Deeply nested ternaries'
---

# Code Style Rule

## Rule body

# Code style conventions for the schemas package

The schemas package is a published library consumed by many services. Readability and consistency directly affect developer experience across the organization.

## Naming

Use descriptive, intention-revealing names. Functions should be verbs that describe what they do. Variables should be nouns that describe what they hold.

```typescript
// BAD: abbreviated, unclear intent
const val = getRes(inp);
const cb = (d: unknown) => proc(d);

// GOOD: descriptive and clear
const parsedSchema = parseSchemaFromInput(rawInput);
const validateDocument = (data: unknown) => DocumentSchema.safeParse(data);
```

Industry-standard abbreviations are acceptable: `id`, `url`, `api`, `uuid`, `nft`, `ipfs`. Everything else should be spelled out.

## Guard clauses and early returns

Flatten control flow by handling edge cases first. This reduces nesting and makes the "happy path" obvious.

```typescript
// BAD: deeply nested
function processSchema(input: unknown) {
  if (input !== null) {
    if (typeof input === 'object') {
      if ('type' in input) {
        return SchemaMap[input.type];
      }
    }
  }
  return undefined;
}

// GOOD: guard clauses
function processSchema(input: unknown) {
  if (input === null || typeof input !== 'object') {
    return undefined;
  }

  if (!('type' in input)) {
    return undefined;
  }

  return SchemaMap[input.type];
}
```

## Nesting depth

Maximum nesting depth is 2 levels. If you find yourself adding a third level, extract a helper function.

```typescript
// BAD: 3 levels deep
function validateAll(schemas: SchemaConfig[]) {
  for (const config of schemas) {
    if (config.enabled) {
      for (const field of config.fields) {
        // 3 levels — too deep
      }
    }
  }
}

// GOOD: extracted helper
function validateFields(fields: FieldConfig[]): ValidationResult[] {
  return fields.map((field) => validateField(field));
}

function validateAll(schemas: SchemaConfig[]) {
  const enabledSchemas = schemas.filter((config) => config.enabled);
  return enabledSchemas.flatMap((config) => validateFields(config.fields));
}
```

## Functional patterns

Prefer functional patterns over classes. This package defines schemas and utilities — pure functions and data transformations are the natural fit.

```typescript
// BAD: unnecessary class
class SchemaValidator {
  private schema: z.ZodType;
  constructor(schema: z.ZodType) {
    this.schema = schema;
  }
  validate(data: unknown) {
    return this.schema.safeParse(data);
  }
}

// GOOD: simple function
function validateWithSchema<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.SafeParseReturnType<z.input<T>, z.output<T>> {
  return schema.safeParse(data);
}
```

Use `Array.map`, `Array.filter`, `Array.reduce`, and `Array.flatMap` instead of imperative loops when transforming data.

## Single responsibility

Each function should do one thing. If a function name contains "and", it likely needs splitting.

```typescript
// BAD: does two things
function parseAndValidateSchema(input: string) {
  const parsed = JSON.parse(input);
  return MassIDDataSchema.parse(parsed);
}

// GOOD: separated concerns
function deserializeInput(input: string): unknown {
  return JSON.parse(input);
}

function validateMassIDData(data: unknown): MassIDData {
  return MassIDDataSchema.parse(data);
}
```

## File organization

Organize files by their role:

- `*.schema.ts` / `*.schemas.ts` — Zod schema definitions
- `*.types.ts` — TypeScript type definitions (when not inferred from Zod)
- `*.constants.ts` — constants and enums
- `*.helpers.ts` — pure utility functions
- `index.ts` — barrel exports for public API

Keep files focused. A schema file should contain related schemas and their inferred types, not validation logic or utilities.

## Error handling

Never swallow errors silently. Use `.safeParse()` and handle both success and failure paths explicitly.

```typescript
// BAD: silent failure
try {
  return schema.parse(data);
} catch {
  return undefined;
}

// GOOD: explicit error handling
const result = schema.safeParse(data);
if (!result.success) {
  throw new ValidationError('Invalid schema data', result.error.issues);
}
return result.data;
```

## Formatting

- End files with a single trailing newline
- Run formatter and linter after editing files
- Follow Prettier configuration for all formatting decisions
