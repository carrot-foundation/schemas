---
name: rule-code-comments
description: 'When and how to write effective comments — favor self-documenting code'
---

# Rule code-comments

Apply this rule whenever work touches:

- `src/**/*.ts`

# Comment guidelines for the schemas package

Well-named schemas and types are the primary documentation. Comments supplement when the code alone cannot convey intent, constraints, or domain knowledge.

## Self-documenting code first

The best comment is no comment. If you feel the need to add a comment, first ask: can I rename this variable, function, or type to make the comment unnecessary?

```typescript
// BAD: comment restates what the code does
// Parse the input data
const parsedData = parseInput(data);

// BAD: comment explains a cryptic name
// Maximum number of retries
const mr = 3;

// GOOD: name is self-documenting
const maxRetries = 3;
const parsedInput = parseInput(data);
```

## Explain WHY, not WHAT

When a comment is necessary, it should explain the reason behind a decision — not narrate the code.

```typescript
// BAD: restates the code
// Check if weight is greater than zero
if (weight_kg > 0) { ... }

// GOOD: explains domain constraint
// Negative weights indicate measurement errors and must be rejected
// per methodology rule MR-2024-003
if (weight_kg > 0) { ... }

// BAD: obvious comment
// Create a strict object schema
const LocationSchema = z.strictObject({ ... });

// GOOD: explains non-obvious design decision
// strictObject prevents extra properties from silently passing validation,
// which is critical for IPFS data integrity — any extra field would
// change the content hash
const LocationSchema = z.strictObject({ ... });
```

## Domain and business context

Schema libraries encode business rules. Document the domain knowledge that future developers will not find in the code.

```typescript
// GOOD: domain context that cannot be inferred from code
// ISO 3166-2 subdivision codes (e.g., "BR-SP" for Sao Paulo, Brazil).
// Required by the MassID methodology for geographic attribution of
// waste collection impact.
const AdministrativeDivisionCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}-[A-Z0-9]+$/);

// GOOD: explains constraint origin
// Maximum 17 attributes enforced by the smart contract's mint function.
// Adding more requires a contract upgrade.
const MassIDAttributesSchema = z.array(AttributeSchema).max(17);
```

## TSDoc for exported symbols

Use TSDoc (`/** ... */`) sparingly — only for exported symbols where the name and type signature are insufficient.

```typescript
// GOOD: TSDoc adds value for a utility with non-obvious behavior
/**
 * Creates a Zod schema that validates array items are unique by a selector.
 * Uses Set-based comparison for uniqueness checking.
 *
 * @param schema - The Zod schema for individual array items
 * @param selector - Function to extract the uniqueness key from each item
 * @param errorMessage - Custom error message for duplicate violations
 */
export function uniqueBy<T extends z.ZodTypeAny, K>(
  schema: T,
  selector: (item: z.infer<T>) => K,
  errorMessage?: string,
) { ... }

// BAD: TSDoc adds no value — name and types are clear
/**
 * The MassID data schema.
 * Validates MassID data objects.
 * @type {z.ZodObject}
 */
export const MassIDDataSchema = z.strictObject({ ... });
```

Skip TSDoc entirely when the export name, type signature, and `.meta()` already communicate everything. Schema exports with good `.meta()` titles and descriptions rarely need additional TSDoc.

## Commented-out code

Never commit commented-out code. Use version control to retrieve old code. If code is temporarily disabled, use a clear mechanism:

```typescript
// BAD: dead code polluting the file
// const OldSchema = z.object({
//   legacy_field: z.string(),
// });

// ACCEPTABLE: feature flag with tracking
// TODO(SCHEMAS-456): re-enable after v2 migration
const ENABLE_EXTENDED_VALIDATION = false;
```

## TODO comments

TODOs must include context and a tracking reference. Bare TODOs are not acceptable.

```typescript
// BAD: no context, no tracking
// TODO: fix this

// BAD: context but no tracking
// TODO: handle edge case for empty arrays

// GOOD: context + tracking reference
// TODO(SCHEMAS-789): add validation for negative coordinates
// after methodology team confirms the constraint rules

// GOOD: context + owner for short-term items
// TODO(@username): extract to shared utility before merging
```

## Zod `.meta()` as documentation

In this project, `.meta()` is a form of documentation. Use it to document fields instead of inline comments:

```typescript
// BAD: comment next to field
// The UUID identifier for external system references
external_id: ExternalIdSchema,

// GOOD: meta serves as structured documentation
external_id: ExternalIdSchema.meta({
  title: 'External ID',
  description: 'UUID identifier for external system references',
}),
```

This approach generates documentation automatically via JSON Schema output, making it more useful than static comments.
