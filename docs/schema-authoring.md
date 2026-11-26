# Schema authoring

Zod definitions under `src/` own the runtime and JSON Schema contracts. Edit
the definitions and reference story before regenerating artifacts under
`schemas/ipfs/`.

## Composition and metadata

Use `z.strictObject()` for closed objects. Extend `BaseIpfsSchema` for common
IPFS properties and `NftIpfsSchema` for NFT properties, then add family-specific
data and attributes with `.safeExtend()`. Reuse primitives, entities and
references from `src/shared/schemas/`.

Use built-in Zod constraints for single-field validation and refinements for
cross-field checks. Cross-field refinements may require separate test coverage
because Zod cannot serialize arbitrary validation functions to JSON Schema.

Use `.meta()` with a descriptive title, description and representative
examples on fields where these add information. Prefer `examples` for a
range of values and `example` for a canonical value. Inherit metadata from an
existing schema when it already documents the same contract.

Wire fields use `snake_case`, including `_id` for identifiers, `_code` for
standardized codes and units for measurements such as `distance_km`.
TypeScript identifiers use domain casing such as `massID`, `gasID` and
`recycledID`. Export schemas as `[Entity]Schema` and inferred types as
`[Entity]`. Keep filenames in kebab-case.

Use ISO 8601 date-time strings for record timestamps, ISO dates for date-only
fields and Unix milliseconds for existing numeric timestamp contracts.

## JSON Schema and versioning

Schema generation runs through the TypeScript scripts in `scripts/`.
Generated root object schemas carry `$schema`, `$id`, title, description,
type, properties, required fields and `additionalProperties: false`.
Check references with `pnpm check-refs` and schema validity with
`pnpm validate-schemas`.

The schema version comes from `SCHEMA_VERSION` when set and falls back to
the package version. Published schema IDs take this form:

```text
https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/v{version}/schemas/ipfs/{type}/{type}.schema.json
```

Keep references to previously published contracts stable. Run
`pnpm verify-schema-versions` to check version consistency and
`pnpm check-generated` to compare checked-in artifacts against generation.
