---
name: 'check'
description: 'Use when running quality gates before committing, creating a PR, or validating the project builds correctly'
---

Run the read-only quality gate for the schemas package and report any failures with context and suggested fixes.

### Full Sequential Pipeline

Run the canonical command that executes every gate in order:

```bash
pnpm check:verify
```

This runs the following steps sequentially via `run-s`:

1. **lint:verify** -- ESLint without fixes or a cache
2. **format:check** -- Prettier formatting verification
3. **type-check** -- TypeScript strict compilation (`tsc --noEmit`)
4. **spell-check** -- cspell on all source files (`cspell lint --no-must-find-files "src/**/*"`)
5. **pkgJsonLint** -- package.json validation (`npmPkgJsonLint .`)
6. **check-generated** -- Compare checked-in JSON with the output of `generate-ipfs-schemas`, `hash-schemas`, and `update-examples` in `--check` mode
7. **validate-schemas** -- Validate all generated JSON schemas and examples with AJV
8. **verify-schema-versions** -- Check schema version consistency
9. **check-refs** -- Validate internal `$ref` pointers
10. **test:examples** -- Run the reference example tests with Vitest
11. **ai:check** -- Validate parity between canonical AI instructions and their adapters

### Maintenance Commands

For intentional artifact changes, run `pnpm generate-ipfs-schemas && pnpm hash-schemas && pnpm update-examples` and review the diff. The maintenance commands `pnpm check` and `pnpm check:parallel` can rewrite files.

### AI Instructions Check

`pnpm check:verify` includes the parity check:

```bash
pnpm ai:check
```

This validates that canonical AI instructions are consistent across tool adapters. CI runs the full coverage suite, build, and package checks.

### Interpreting Failures

| Step                   | Common Cause                                  | Fix                                                         |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| lint:verify            | Unused imports, missing semicolons            | Fix the reported issues and rerun the check                 |
| format:check           | Formatting drift                              | Run `pnpm format` and review the diff                       |
| type-check             | Type errors in Zod schemas or exports         | Read the error, fix the source `.ts` file                   |
| spell-check            | Unknown words in source                       | Add to `.cspell.json` words list or fix the typo            |
| pkgJsonLint            | Invalid package.json fields                   | Check `npmpackagejsonlint.config.js` for rules              |
| check-generated        | JSON artifacts out of sync                    | Fix Zod source or generation logic, then rerun regeneration |
| validate-schemas       | Generated JSON schema is structurally invalid | Fix the Zod source; check `$id` URLs and `$ref` pointers    |
| verify-schema-versions | Version mismatch between schema files         | Align version fields in the Zod source                      |
| check-refs             | Broken `$ref` pointers in generated schemas   | Ensure referenced schemas exist and paths are correct       |
| test:examples          | Reference example test failures               | Fix the failing example emitters or schemas                 |

### Recovery Workflow

When a step fails:

1. Read the full error output carefully
2. Fix the root cause in the Zod source (never edit generated files)
3. Re-run only the failing step to verify the fix: `pnpm <step-name>`
4. Once fixed, re-run the local gate: `pnpm check:verify`
5. Repeat until all gates pass

### Pre-Commit Integration

Husky runs `lint-staged` on pre-commit which covers a subset of these gates. Run `pnpm check:verify` before staging to check the full working tree.
