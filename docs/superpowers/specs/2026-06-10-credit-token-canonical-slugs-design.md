# Credit Token Canonical Slugs Design

Date: 2026-06-10
Status: Approved design

## Summary

Make `carbon-ch4` the canonical carbon credit token slug in `@carrot-foundation/schemas`.

The current package version (`2.0.0`) accepts `carbon-methane` for carbon credit references while Smaug's credit catalogue already uses `carbon-ch4`. The new schema version should remove that drift by validating and emitting only `carbon-ch4` and `biowaste`.

This is a breaking schema contract change. The implementation should be released as the next major package version.

## Goals

- Replace `carbon-methane` with `carbon-ch4` in the credit token slug enum.
- Update examples, generated JSON schemas, schema hashes, and reference content.
- Keep existing symbols unchanged: `C-CARB.CH4` and `C-BIOW`.
- Keep the package strict: do not accept `carbon-methane` as an alias in the new canonical schema.
- Preserve existing validation patterns and generated artifact workflow.

## Non-Goals

- Do not implement Smaug-side catalogue, decimals, or Mongo reseed changes in this repo.
- Do not introduce slug aliases or compatibility transforms in runtime schemas.
- Do not decide or enforce ERC-20 decimals in `@carrot-foundation/schemas`; credit decimals remain a numeric field on `CreditSchema`.
- Do not migrate production data from this package.

## Current Context

The credit slug enum currently accepts `carbon-methane` and `biowaste` in `src/shared/schemas/primitives/enums.schema.ts`.

The generated credit metadata example also uses `carbon-methane`:

- `schemas/ipfs/credit/credit.example.json`
- `schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json`
- `schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json`

Generated JSON schemas include `carbon-methane` in the enum output. Schema hashes include the credit schema hash and must change when generated schemas change.

## Canonical Decisions

The canonical credit token slugs are:

| Credit token | Symbol | Canonical slug |
| --- | --- | --- |
| Carrot Carbon CH4 | `C-CARB.CH4` | `carbon-ch4` |
| Carrot Biowaste | `C-BIOW` | `biowaste` |

`carbon-methane` is legacy vocabulary. It should not validate in the next package version.

## Design

### Source Schema

Update `CreditTokenSlugSchema` to:

```ts
export const CreditTokenSlugSchema = z
  .enum(['carbon-ch4', 'biowaste'])
  .meta({
    title: 'Credit Token Slug',
    description: 'URL-friendly identifier for the credit token',
    examples: ['carbon-ch4', 'biowaste'],
  });
```

Keep `CreditTokenSymbolSchema` unchanged.

### Example Content

Update all source examples and generated examples that reference carbon credit slugs so carbon uses `carbon-ch4`.

The generated `Credit` example should continue to represent the carbon token, with:

- `symbol: "C-CARB.CH4"`
- `slug: "carbon-ch4"`
- `name: "Carrot Carbon (CH4)"` or the existing display form if the package intentionally keeps the Unicode display name
- `decimals` unchanged unless a separate schema decision changes examples

Receipt examples should update both credit references and certificate-level `credit_slug` fields.

### Generated Artifacts

Regenerate:

- JSON schemas under `schemas/ipfs/**`
- schema hashes under `schemas/schema-hashes.json`
- examples under `schemas/ipfs/**`
- docs or generated HTML coverage if the repo check workflow updates them

The implementation should use the repo scripts rather than manual generated-file edits wherever possible.

### Release Semantics

Because this removes a previously valid enum value, publish as a breaking release. The implementation commit or release PR should mark the breaking change so semantic-release produces the next major version.

Consumers that still emit `carbon-methane` must migrate before upgrading.

## Validation

Run the schema repo validation gates:

```bash
pnpm generate-schemas
pnpm hash-schemas
pnpm update-examples
pnpm validate-schemas
pnpm validate-examples
pnpm test
pnpm check
```

If `pnpm check` already includes some of the earlier commands, the implementation may run `pnpm check` as the final aggregate gate after focused commands.

## Acceptance Criteria

- `CreditTokenSlugSchema.parse('carbon-ch4')` passes.
- `CreditTokenSlugSchema.safeParse('carbon-methane')` fails.
- Generated `Credit`, `CreditPurchaseReceipt`, and `CreditRetirementReceipt` schemas contain `carbon-ch4` and no longer contain `carbon-methane`.
- Generated examples validate successfully.
- `schemas/schema-hashes.json` is regenerated and consistent.
- The release notes or commit metadata identify this as a breaking schema change.

## Downstream Dependency

Smaug should not merge its canonical slug guard until it consumes the released schemas package containing this change.

The production reseed script, owned by a separate task, must treat `carbon-methane` as legacy input and write `carbon-ch4` as canonical output.
