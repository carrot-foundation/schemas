# Credit Token Canonical Slugs Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release a breaking `@carrot-foundation/schemas` change that makes `carbon-ch4` the canonical carbon credit token slug and rejects `carbon-methane`.

**Architecture:** `CreditTokenSlugSchema` remains the single source for credit token slug validation. Generated IPFS JSON schemas, schema hashes, and example JSON are regenerated from source emitters instead of being hand-edited.

**Tech Stack:** TypeScript, Zod 4, Vitest, tsup, repository schema generator scripts.

---

## Preconditions

- Work from `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas`.
- Keep this repo scoped to schema/package changes only. Do not change Smaug code here.
- Treat this as a breaking release. The implementation commit must use a breaking Conventional Commit marker or a `BREAKING CHANGE:` footer so semantic-release publishes the next major version.
- Before edits, verify the branch and baseline:

```bash
git status --short --branch
pnpm test src/credit/__tests__/credit.schema.spec.ts
```

The new enum test does not exist yet; add it in Chunk 1 before running the red test.

## Chunk 1: Lock The Enum Contract With Tests

- [ ] **Step 1.1: Add the focused enum regression test**

Create `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/src/shared/schemas/primitives/__tests__/enums.schema.spec.ts`.

Use the existing primitive test style from:

- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/src/shared/schemas/primitives/__tests__/numbers.schema.spec.ts`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/src/credit/__tests__/credit.schema.spec.ts`

Test cases:

- `CreditTokenSlugSchema.parse('carbon-ch4')` succeeds.
- `CreditTokenSlugSchema.parse('biowaste')` succeeds.
- `CreditTokenSlugSchema.safeParse('carbon-methane')` fails.
- `CreditTokenSymbolSchema.parse('C-CARB.CH4')` and `.parse('C-BIOW')` still succeed.

- [ ] **Step 1.2: Run the failing focused test**

```bash
pnpm test src/shared/schemas/primitives/__tests__/enums.schema.spec.ts
```

Expected before implementation: both the `carbon-ch4` acceptance assertion and the `carbon-methane` rejection assertion fail because the enum still accepts only `carbon-methane` and `biowaste`.

Do not commit the red state.

## Chunk 2: Change The Canonical Source Schema

- [ ] **Step 2.1: Update `CreditTokenSlugSchema`**

Edit `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/src/shared/schemas/primitives/enums.schema.ts`.

Change:

```ts
.enum(['carbon-methane', 'biowaste'])
```

to:

```ts
.enum(['carbon-ch4', 'biowaste'])
```

Update metadata examples from `carbon-methane` to `carbon-ch4`.

Keep `CreditTokenSymbolSchema` unchanged:

- `C-CARB.CH4`
- `C-BIOW`

- [ ] **Step 2.2: Update source example data**

Edit `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/scripts/example-content/reference-story.ts`.

Change `credit.slug` from `carbon-methane` to `carbon-ch4`.

- [ ] **Step 2.3: Verify no active source still emits the legacy slug**

```bash
rg -n "carbon-methane" src scripts --glob '*.ts' --glob '*.json' --glob '*.md'
```

Expected: no active source references remain. Generated artifacts under `schemas/ipfs/**` can still contain `carbon-methane` until Chunk 3 regenerates them.

- [ ] **Step 2.4: Run focused tests**

```bash
pnpm test src/shared/schemas/primitives/__tests__/enums.schema.spec.ts scripts/example-content/__tests__/reference-example-content.spec.ts
```

Do not run the schema specs that read generated examples yet; those examples still contain `carbon-methane` until Chunk 3 regenerates them.

## Chunk 3: Regenerate Schema Artifacts

- [ ] **Step 3.1: Regenerate JSON schemas, hashes, and examples**

Run the repository scripts in source-of-truth order:

```bash
pnpm build
pnpm generate-schemas
pnpm hash-schemas
pnpm update-examples
```

Expected generated updates include:

- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit/credit.example.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit/credit.schema.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.schema.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.schema.json`
- `/Users/cristianosantos/CrisOS/Repositories/Work/Carrot/schemas/schemas/schema-hashes.json`

- [ ] **Step 3.2: Verify generated content**

```bash
rg -n "carbon-methane" schemas src scripts
rg -n "carbon-ch4" schemas/ipfs/credit schemas/ipfs/credit-purchase-receipt schemas/ipfs/credit-retirement-receipt src/shared/schemas/primitives/enums.schema.ts scripts/example-content/reference-story.ts
```

Expected:

- `carbon-methane` has no matches.
- `carbon-ch4` appears in source enum metadata, reference story, generated examples, and generated JSON schema enum arrays.

- [ ] **Step 3.3: Validate generated artifacts**

```bash
pnpm validate-schemas
pnpm validate-examples
pnpm verify-schema-versions
pnpm test src/credit/__tests__/credit.schema.spec.ts src/credit-purchase-receipt/__tests__/credit-purchase-receipt.schema.spec.ts src/credit-retirement-receipt/__tests__/credit-retirement-receipt.schema.spec.ts
```

Fix generator/source issues rather than hand-editing generated JSON.

## Chunk 4: Final Validation And Release Metadata

- [ ] **Step 4.1: Run full validation**

```bash
pnpm test
pnpm build
pnpm check
```

If `pnpm check` changes formatting or generated files, inspect the diff and rerun the affected focused command.

- [ ] **Step 4.2: Inspect the final diff**

```bash
git diff -- src/shared/schemas/primitives/enums.schema.ts scripts/example-content/reference-story.ts schemas
git status --short
```

Confirm:

- `CreditTokenSlugSchema.safeParse('carbon-methane')` fails.
- Generated `Credit`, `CreditPurchaseReceipt`, and `CreditRetirementReceipt` schemas contain `carbon-ch4`.
- No generated or source file contains `carbon-methane`.
- Symbols still use `C-CARB.CH4` and `C-BIOW`.

- [ ] **Step 4.3: Commit the breaking schema change**

Use a breaking Conventional Commit:

```bash
git add src/shared/schemas/primitives/enums.schema.ts scripts/example-content/reference-story.ts schemas src/shared/schemas/primitives/__tests__/enums.schema.spec.ts
git commit -m "feat(schema)!: canonicalize carbon credit slug" -m "BREAKING CHANGE: CreditTokenSlugSchema now accepts carbon-ch4 instead of carbon-methane."
```

- [ ] **Step 4.4: Record downstream dependency**

In the PR description, call out:

- Smaug must upgrade to the released package version before adding no-alias drift guards.
- Production `credit-token-definition` reseed must write `carbon-ch4` before a Smaug production deploy that consumes this release.

## Acceptance Checklist

- [ ] `CreditTokenSlugSchema.parse('carbon-ch4')` passes.
- [ ] `CreditTokenSlugSchema.safeParse('carbon-methane')` fails.
- [ ] `CreditTokenSymbolSchema` remains unchanged.
- [ ] `rg -n "carbon-methane" src scripts schemas` returns no matches.
- [ ] Generated IPFS schemas and examples use `carbon-ch4`.
- [ ] `schemas/schema-hashes.json` is regenerated.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm check` passes.
- [ ] Commit metadata marks the release as breaking.
