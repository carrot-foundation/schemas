---
name: update-examples
description: Regenerate checked-in IPFS schemas, hashes and examples after a schema or reference story change.
---

Run `pnpm validate-all` for generation, hashing, example updates and package
validation. For targeted regeneration, run these commands in order:

```sh
pnpm generate-ipfs-schemas
pnpm hash-schemas
pnpm update-examples
pnpm check:verify
```

Change example data in `scripts/example-content/`. Inspect the resulting diff
under `schemas/ipfs/` for expected fields and versioned references, and check
`schemas/schema-hashes.json` for updated hashes. See
[schema conventions](../../../docs/schema-authoring.md) for the version
source and generated artifact rules.
