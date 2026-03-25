---
id: check
name: check
description: 'Use when running quality gates before committing, creating a PR, or validating the project builds correctly'
when_to_use:
  - 'Before creating a PR'
  - 'Before committing changes'
  - 'After making changes that affect build or tests'
  - 'When validating the project state'
workflow:
  - '[ ] Run pnpm check (all gates sequentially)'
  - '[ ] Fix any issues found'
  - '[ ] Re-run until clean'
inputs:
  - 'Current working tree'
outputs:
  - 'Clean check pass or list of issues to fix'
references:
  - .ai/rules/testing.md
---

# Check Skill

## Instructions

Run the full quality-gate pipeline for the schemas package and report any failures with context and suggested fixes.

### Full Sequential Pipeline

Run the canonical command that executes every gate in order:

```bash
pnpm check
```

This runs the following steps sequentially via `run-s`:

1. **lint:fix** -- ESLint with auto-fix (`eslint . --fix`)
2. **format** -- Prettier formatting (`prettier --write .`)
3. **type-check** -- TypeScript strict compilation (`tsc --noEmit`)
4. **spell-check** -- cspell on all source files (`cspell lint --no-must-find-files "src/**/*"`)
5. **pkgJsonLint** -- package.json validation (`npmPkgJsonLint .`)
6. **generate-schemas** -- Build then generate JSON schemas from Zod (`pnpm build && node scripts/generate-ipfs-schemas.js`)
7. **hash-schemas** -- Compute content hashes for generated schemas (`node scripts/hash-schemas.js`)
8. **update-examples** -- Regenerate example JSON files (`node scripts/update-examples.js`)
9. **validate-schemas** -- Validate all generated JSON schemas with AJV (`node scripts/validate-schemas.js`)
10. **verify-schema-versions** -- Check schema version consistency (`node scripts/verify-schema-versions.js`)
11. **check-refs** -- Validate internal `$ref` pointers (`node scripts/check-refs.js`)
12. **validate-examples** -- Validate example data against schemas (`node scripts/validate-schemas.js --data-only`)
13. **test** -- Run Vitest with 100% coverage enforcement (`vitest run`)

### Parallel Alternative

For faster execution when iterating:

```bash
pnpm check:parallel
```

This runs the same gates using `run-p` (parallel). Useful during development but may produce interleaved output.

### AI Instructions Check

If any files under `.ai/` were modified, also run:

```bash
pnpm ai:check
```

This validates that canonical AI instructions are consistent across tool adapters.

### Interpreting Failures

| Step                   | Common Cause                                  | Fix                                                         |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| lint:fix               | Unused imports, missing semicolons            | Usually auto-fixed; re-run to confirm                       |
| format                 | Formatting drift                              | Auto-fixed by the step; commit the changes                  |
| type-check             | Type errors in Zod schemas or exports         | Read the error, fix the source `.ts` file                   |
| spell-check            | Unknown words in source                       | Add to `.cspell.json` words list or fix the typo            |
| pkgJsonLint            | Invalid package.json fields                   | Check `npmpackagejsonlint.config.js` for rules              |
| generate-schemas       | Zod schema errors or missing `.meta()`        | Fix the Zod source schema; ensure every field has `.meta()` |
| hash-schemas           | Stale hashes after schema change              | Regenerate; this step updates hashes automatically          |
| update-examples        | Example JSON out of sync with schemas         | Auto-updated; commit the changes                            |
| validate-schemas       | Generated JSON schema is structurally invalid | Fix the Zod source; check `$id` URLs and `$ref` pointers    |
| verify-schema-versions | Version mismatch between schema files         | Align version fields in the Zod source                      |
| check-refs             | Broken `$ref` pointers in generated schemas   | Ensure referenced schemas exist and paths are correct       |
| validate-examples      | Generated example data doesn't match schema   | Fix Zod source or generation logic, then rerun regeneration |
| test                   | Test failures or coverage below 100%          | Fix failing tests; add missing coverage                     |

### Recovery Workflow

When a step fails:

1. Read the full error output carefully
2. Fix the root cause in the Zod source (never edit generated files)
3. Re-run only the failing step to verify the fix: `pnpm <step-name>`
4. Once fixed, re-run the full pipeline: `pnpm check`
5. Repeat until all gates pass

### Pre-Commit Integration

Husky runs `lint-staged` on pre-commit which covers a subset of these gates. Running `pnpm check` manually catches everything CI will check.
