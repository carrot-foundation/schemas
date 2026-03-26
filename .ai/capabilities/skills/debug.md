---
id: debug
name: debug
description: 'Use when schema generation fails, validation errors occur, or tests fail unexpectedly'
when_to_use:
  - 'Build or type-check fails with non-obvious cause'
  - 'Test failures needing root-cause analysis'
  - 'Schema generation or validation errors'
  - 'JSON Schema output does not match expectations'
workflow:
  - '[ ] Capture full error output and triggering command'
  - '[ ] Isolate to smallest reproduction'
  - '[ ] Identify root cause'
  - '[ ] Apply minimal fix'
  - '[ ] Re-verify with pnpm check'
inputs:
  - 'Error output, failing command, and context'
outputs:
  - 'Root-cause fix with verification'
references:
  - .ai/rules/testing.md
  - .ai/rules/zod.md
---

# Debug Skill

## Instructions

Diagnose and fix failures in the schemas package -- build errors, test failures, schema generation issues, and validation problems.

### General Debugging Approach

1. **Capture**: Get the exact error output and the command that triggered it
2. **Isolate**: Narrow down to the smallest failing unit
3. **Analyze**: Identify the root cause (not just the symptom)
4. **Fix**: Apply the minimal change to address the root cause
5. **Verify**: Run `pnpm check` to confirm the fix doesn't break anything else

### Error Category: TypeScript Type-Check

**Command**: `pnpm type-check` (runs `tsc --noEmit`)

**Common failures**:

```
error TS2322: Type 'string' is not assignable to type 'number'.
```

**Isolation**:

```bash
pnpm type-check 2>&1 | head -50
```

**Common causes**:

- Zod schema infers a different type than expected
- Missing or incorrect `z.infer<typeof Schema>` usage
- Path alias not resolving (check `tsconfig.json` paths)
- Missing export in barrel `index.ts`

**Fix patterns**:

- Check the Zod schema definition matches the expected TypeScript type
- Use `z.infer<typeof MySchema>` instead of manually defining types
- Ensure `tsconfig.json` includes the new file paths
- Verify barrel exports re-export all needed symbols

### Error Category: ESLint

**Command**: `pnpm lint` or `pnpm lint:fix`

**Common failures**:

```
error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

**Isolation**:

```bash
pnpm lint 2>&1 | head -50
```

**Common causes**:

- Using `any` type (use proper Zod inference instead)
- Unused imports or variables
- Missing return types on exported functions

**Fix patterns**:

- Replace `any` with `z.infer<typeof Schema>` or specific types
- Remove unused imports
- Add explicit return types to exported functions
- Run `pnpm lint:fix` for auto-fixable issues

### Error Category: Vitest Test Failures

**Command**: `pnpm test`

**Common failures**:

```
FAIL  src/mass-id/__tests__/mass-id.schema.spec.ts
  ✕ should parse a complete valid input
    Expected: true
    Received: false
```

**Isolation**:

```bash
# Run a single test file
npx vitest run src/mass-id/__tests__/mass-id.schema.spec.ts

# Run a specific test by name
npx vitest run -t "should parse a complete valid input"
```

**Common causes**:

- Test fixture doesn't match updated schema (fields added/removed/renamed)
- `.strictObject()` rejecting unknown properties in test data
- Optional field handling changed
- Zod validation rules changed (e.g., added `.positive()`, `.email()`)

**Fix patterns**:

- Update test fixtures to match current schema
- Check `safeParse` error details: `result.error?.issues`
- Add the `--reporter=verbose` flag for detailed output

**Inspecting parse errors in tests**:

```typescript
const result = Schema.safeParse(input);
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2));
}
```

### Error Category: Build (tsup)

**Command**: `pnpm build` (runs `tsup`)

**Common failures**:

```
DTS Build Start
Error: ...
DTS Build Failed
```

**Isolation**:

```bash
pnpm build 2>&1
```

**Common causes**:

- Circular imports between schema files
- Missing dependency in `package.json`
- Invalid TypeScript in source files (passes `tsc` but fails `tsup` DTS generation)

**Fix patterns**:

- Check for circular imports: A imports B which imports A
- Ensure all runtime dependencies are in `dependencies` (not `devDependencies`)
- Simplify complex type expressions that confuse DTS generation

### Error Category: Schema Generation

**Command**: `pnpm generate-schemas` (runs build + `node scripts/generate-ipfs-schemas.js`)

**Common failures**:

```
Error: Unable to generate JSON Schema for ...
```

**Isolation**:

```bash
pnpm build && node scripts/generate-ipfs-schemas.js 2>&1
```

**Common causes**:

- Zod schema uses unsupported features for JSON Schema conversion
- Missing `.meta()` on fields (causes empty descriptions)
- Schema not exported from barrel `index.ts`
- Circular references in schema composition

**Fix patterns**:

- Add `.meta({ description: '...' })` to every field
- Ensure the schema is exported from `src/index.ts`
- Avoid circular `$ref` patterns
- Check that `z.lazy()` is used correctly for recursive schemas

### Error Category: Schema Validation (AJV)

**Command**: `pnpm validate-schemas` (runs `node scripts/validate-schemas.js`)

**Common failures**:

```
Schema validation failed: /schemas/ipfs/mass-id/v1.0.0.json
  Error: strict mode: unknown keyword: "..."
```

**Isolation**:

```bash
node scripts/validate-schemas.js 2>&1
```

**Common causes**:

- Generated JSON schema contains non-standard keywords
- `$id` URL format is incorrect
- `$ref` pointer targets a non-existent schema
- Schema version in filename doesn't match content

**Fix patterns**:

- Fix the Zod source schema (never edit generated JSON)
- Check `$id` follows the expected URL pattern
- Verify all `$ref` targets exist
- Align version in schema content with filename

### Error Category: Version Verification

**Command**: `pnpm verify-schema-versions`

**Common failures**:

```
Version mismatch: expected v1.2.0, found v1.1.0
```

**Isolation**:

```bash
node scripts/verify-schema-versions.js 2>&1
```

**Common causes**:

- Schema version not bumped after changes
- Version in Zod source doesn't match generated output
- Multiple schemas have inconsistent versions

**Fix patterns**:

- Update the version field in the Zod schema source
- Regenerate: `pnpm generate-schemas && pnpm hash-schemas`

### Error Category: Example Validation

**Command**: `pnpm validate-examples`

**Common failures**:

```
Example validation failed: schemas/ipfs/mass-id/examples/valid.json
```

**Isolation**:

```bash
node scripts/validate-schemas.js --data-only 2>&1
```

**Common causes**:

- Example data doesn't conform to updated schema
- Missing required fields added in a schema update
- Type mismatch (string vs number)

**Fix patterns**:

- Regenerate examples: `pnpm update-examples`
- If examples are manually curated, update them to match the schema
- Never edit generated examples; fix the generation script or Zod source

### Recovery Checklist

After fixing any issue:

1. Run the specific failing command to verify the fix
2. Run `pnpm check` to verify nothing else broke
3. Check `git diff` to understand what changed
4. Commit the fix with a descriptive message
