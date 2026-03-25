---
name: review-pr
description: 'Use when reviewing a pull request for schema quality, test coverage, and conventions'
---

Review a pull request in the schemas repository, checking for schema quality, test coverage, naming conventions, and backward compatibility.

### Getting the PR

Fetch the PR details and diff:

```bash
# View PR metadata
gh pr view <PR_NUMBER>

# View the full diff
gh pr diff <PR_NUMBER>

# View changed files
gh pr diff <PR_NUMBER> --stat

# View PR comments
gh api repos/<owner>/<repo>/pulls/<PR_NUMBER>/comments
```

### Review Checklist

Evaluate the PR against each of the following areas. For each area, note whether it passes, has warnings, or needs changes.

#### 1. Zod Schema Patterns

Check that schemas follow project conventions:

- [ ] **`z.strictObject()`**: All object schemas use `strictObject` (not `z.object`) to reject unknown properties
- [ ] **`.safeExtend()`**: Schema composition uses `safeExtend` (not `extend`) to preserve strict validation
- [ ] **`.meta()` on every field**: Every field has `.meta({ description: '...' })` at minimum
- [ ] **`.meta()` on objects**: Parent objects also have `.meta({ description: '...' })`
- [ ] **Type inference**: Types are inferred via `z.infer<typeof Schema>` (not manually defined)
- [ ] **No `any`**: No use of `z.any()` or TypeScript `any`

**Red flags**:

```typescript
// BAD: z.object instead of z.strictObject
const Schema = z.object({ ... });

// BAD: missing .meta()
const Schema = z.strictObject({
  field: z.string(), // no .meta()
});

// BAD: .extend instead of .safeExtend
const Extended = Base.extend({ ... });
```

#### 2. Test Coverage

Check that tests are comprehensive:

- [ ] **Test file exists**: `__tests__/{type}.schema.spec.ts` exists for every schema
- [ ] **Valid inputs**: Tests include at least one complete valid input
- [ ] **Invalid inputs**: Tests cover missing required fields, wrong types, extra properties
- [ ] **Optional fields**: Tests verify behavior with and without optional fields
- [ ] **Edge cases**: Tests cover boundary values, empty strings, negative numbers, etc.
- [ ] **`.safeParse()` usage**: All validation uses `.safeParse()` (not `.parse()` which throws)
- [ ] **Table-driven**: Multiple similar cases use `it.each`
- [ ] **100% coverage**: Running `pnpm test:coverage` shows 100% on all 4 thresholds

**Red flags**:

```typescript
// BAD: using .parse() in tests (throws instead of returning result)
expect(() => Schema.parse(input)).not.toThrow();

// BAD: only testing happy path
it('should parse valid input', () => { ... });
// Missing: invalid inputs, edge cases, optional fields
```

#### 3. Naming Conventions

Check that names follow project standards:

- [ ] **File names**: kebab-case with appropriate suffix (`{type}.data.schema.ts`, `{type}.attributes.ts`)
- [ ] **Schema variables**: PascalCase + Schema suffix (`MassIdDataSchema`)
- [ ] **Type exports**: PascalCase (`MassIdData`)
- [ ] **Properties**: snake_case (`batch_size`, `processing_date`)
- [ ] **Enum values (user-facing)**: Title Case (`Recycling Center`)
- [ ] **Enum values (technical)**: lowercase (`pending`, `approved`)
- [ ] **Barrel exports**: `index.ts` re-exports all public symbols

**Red flags**:

```typescript
// BAD: camelCase property
batchSize: z.number() // should be batch_size

// BAD: wrong export name
export const massIdSchema = ... // should be MassIdSchema
```

#### 4. Backward Compatibility

Check for breaking changes:

- [ ] **No removed fields**: Required fields are not removed from existing schemas
- [ ] **No type changes**: Existing field types are not changed
- [ ] **New fields are optional**: New fields on existing schemas are optional (not required)
- [ ] **Enum additions only**: Enums only add values, never remove
- [ ] **Version bump**: If breaking changes are unavoidable, schema version is bumped

**Red flags**:

- Removing a required field from an existing schema
- Changing a field type (e.g., `string` to `number`)
- Making an optional field required
- Removing enum values

#### 5. Schema Composition

Check that the schema layer hierarchy is correct:

- [ ] **Base layer**: `BaseIpfsSchema` provides common IPFS fields
- [ ] **NFT layer**: `NftIpfsSchema` extends Base with NFT-specific fields
- [ ] **Type-specific layer**: Type schemas extend NFT with domain-specific data
- [ ] **No skipped layers**: Type schemas don't extend Base directly (use NFT layer)
- [ ] **Shared extractions**: Reusable sub-schemas are in `src/shared/`

#### 6. Generated Output

Check that generated files are consistent:

- [ ] **JSON schemas regenerated**: `schemas/ipfs/` contains updated JSON schema files
- [ ] **Hashes updated**: Schema hashes match the generated content
- [ ] **Examples valid**: Example files validate against their schemas
- [ ] **No manual edits**: Generated files were not manually edited (check for unexpected diffs)

### Providing Feedback

Structure your review as:

```markdown
## Review: PR #{number} - {title}

### Verdict: {Approve | Request Changes | Comment}

### Summary

{1-2 sentence overview}

### Findings

#### Must Fix

- {Blocking issues that prevent merge}

#### Should Fix

- {Non-blocking but important improvements}

#### Nit

- {Minor style or preference items}

### Positive Notes

- {Things done well -- always include at least one}
```

### Approve Criteria

Approve the PR if:

- All "Must Fix" items are clear
- Tests cover valid, invalid, and edge cases
- Naming follows conventions
- No backward-incompatible changes (or they are properly versioned)
- Generated files are up to date

### Request Changes Criteria

Request changes if:

- Missing `.meta()` on fields
- Test coverage below 100%
- Breaking changes without version bump
- `z.object` used instead of `z.strictObject`
- `.parse()` used instead of `.safeParse()` in tests
- Manual edits to generated files
- Missing barrel exports

### Comment-Only Criteria

Leave comments (without blocking) for:

- Style preferences
- Suggestions for better descriptions in `.meta()`
- Alternative approaches
- Documentation improvements
