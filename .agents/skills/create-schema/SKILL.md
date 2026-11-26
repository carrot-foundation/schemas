---
name: create-schema
description: Add a schema family or extend its data, NFT attributes, tests and exports.
---

1. Choose a composition layer using the [schema conventions](../../../docs/schema-authoring.md).
2. In `src/{type}/`, follow the closest existing family. Put domain data in
   `{type}.data.schema.ts`, the IPFS record in `{type}.schema.ts`, and NFT
   attributes in `{type}.attributes.ts` when applicable.
3. Export the schemas and inferred types through the family barrel and
   `src/index.ts`. Check the generator and example registry when adding a family.
4. Add valid, invalid and cross-field cases under `__tests__/` using shared
   fixtures in `src/test-utils/`. Keep coverage at 100%.
5. Follow the [artifact workflow](../update-examples/SKILL.md), then run `pnpm check:verify`.
