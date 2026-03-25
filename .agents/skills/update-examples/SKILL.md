---
name: update-examples
description: 'Use when schemas have changed and example JSON files need regeneration and validation'
---

Regenerate all JSON schema artifacts, examples, and hashes after modifying Zod source schemas.

### Golden Rule

**Never edit generated files manually.** All JSON schemas, examples, and hashes under `schemas/ipfs/` are generated from the Zod source schemas. If the output is wrong, fix the Zod source.

### Complete Regeneration Pipeline

Run each step in order. Each step depends on the previous one.

#### Step 1: Build

Compile TypeScript to JavaScript so the generation scripts can import the schemas:

```bash
pnpm build
```

**Expected outcome**: `dist/` directory is created with ESM and CJS output.

**If it fails**: Fix TypeScript compilation errors first (see debug skill).

#### Step 2: Generate JSON Schemas

Convert Zod schemas to JSON Schema format:

```bash
pnpm generate-schemas
```

This runs `pnpm build` as a prerequisite (via `pregenerate-ipfs-schemas`), then executes `node scripts/generate-ipfs-schemas.js`.

**Expected outcome**: JSON schema files appear or update under `schemas/ipfs/{type}/`.

**If it fails**:

- Check that all Zod fields have `.meta()` -- missing metadata causes empty descriptions
- Ensure the schema is exported from `src/index.ts`
- Verify no unsupported Zod features are used (e.g., `z.transform` may not convert cleanly)

#### Step 3: Hash Schemas

Compute content hashes for all generated JSON schemas:

```bash
pnpm hash-schemas
```

This runs `node scripts/hash-schemas.js`.

**Expected outcome**: Hash files are updated alongside JSON schemas.

**If it fails**: Usually means a schema file is malformed JSON -- check the previous step's output.

#### Step 4: Update Examples

Regenerate example JSON files from the schemas:

```bash
pnpm update-examples
```

This runs `node scripts/update-examples.js`.

**Expected outcome**: Example JSON files are created or updated under `schemas/ipfs/{type}/examples/`.

**If it fails**: Check that the schema can produce valid example data. Some constraints (like strict regex patterns) may need example values in `.meta()`.

#### Step 5: Validate Schemas

Run AJV validation on all generated JSON schemas:

```bash
pnpm validate-schemas
```

This runs `node scripts/validate-schemas.js`.

**Expected outcome**: All schemas pass validation. Output shows each schema checked with a pass/fail status.

**If it fails**:

- Check `$id` URLs match the expected pattern
- Verify `$ref` pointers target existing schemas
- Look for non-standard JSON Schema keywords

#### Step 6: Validate Examples

Run validation specifically on example data files:

```bash
pnpm validate-examples
```

This runs `node scripts/validate-schemas.js --data-only`.

**Expected outcome**: All example files validate against their corresponding schemas.

**If it fails**: Example data doesn't conform to the schema. Since examples are generated, this usually means the generation script has a bug. Fix the script or the Zod source.

#### Step 7: Verify Schema Versions

Check that schema versions are consistent:

```bash
pnpm verify-schema-versions
```

This runs `node scripts/verify-schema-versions.js`.

**Expected outcome**: All schema versions are consistent between filenames and content.

**If it fails**: Update the version field in the Zod source schema to match the expected version.

### Shortcut: Full Validation Pipeline

If you want to run steps 2-7 in a single command:

```bash
pnpm validate-all
```

This runs: `generate-schemas -> hash-schemas -> update-examples -> validate-schemas -> verify-schema-versions -> check-refs -> validate-examples`.

### Checking for Unexpected Changes

After regeneration, review what changed:

```bash
# See which files changed
git diff --stat schemas/

# See the actual changes
git diff schemas/

# Check for new untracked files
git status schemas/
```

**Expected changes**:

- Updated `schemas/ipfs/{type}/*.json` files (schema definitions)
- Updated `schemas/ipfs/{type}/examples/*.json` files (example data)
- Updated hash files

**Unexpected changes**:

- Changes to schemas you didn't modify -- investigate why
- Deleted files -- check if a schema was accidentally removed from exports
- Dramatically different output -- check the Zod source for unintended changes

### Common Issues and Fixes

| Issue                              | Cause                                            | Fix                                           |
| ---------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| Empty `description` in JSON schema | Missing `.meta()` on the Zod field               | Add `.meta({ description: '...' })`           |
| Wrong `$id` URL                    | Schema name or version mismatch                  | Fix the schema name/version in Zod source     |
| Missing schema in output           | Not exported from `src/index.ts`                 | Add to barrel export                          |
| Stale hashes                       | Forgot to run `hash-schemas` after generation    | Run `pnpm hash-schemas`                       |
| Example doesn't match schema       | Schema changed but examples weren't regenerated  | Run `pnpm update-examples`                    |
| Extra properties in example        | Zod `.default()` or `.transform()` adding fields | Review the Zod schema for unintended defaults |
| Version mismatch                   | Schema version in code doesn't match filename    | Align version in Zod source                   |

### Integration with Other Skills

This skill is typically run as part of:

- **check skill**: `pnpm check` includes all these steps
- **finish-work skill**: Quality gates include regeneration
- **create-pr skill**: Pre-flight includes validation

You can also run it standalone when iterating on schema changes to verify output before committing.

### Workflow During Schema Development

When actively developing schemas, use this iterative workflow:

1. Modify Zod source schema
2. Run `pnpm generate-schemas` to see JSON output
3. Inspect the generated JSON: `cat schemas/ipfs/{type}/v*.json | head -50`
4. If wrong, fix Zod source and repeat
5. Once correct, run the full pipeline: `pnpm validate-all`
6. Run tests: `pnpm test`
7. Commit everything together
