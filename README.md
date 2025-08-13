# 🥕 Carrot Schemas

This repository contains all JSON Schemas used across the Carrot ecosystem.

These schemas define the structure of IPFS metadata for tokenized assets.
They are versioned, publicly referenceable, and used for validation, traceability, and frontend/backend integration.

## 📦 Structure

- Schemas are organized by type (e.g., `mass-id`, `gas-id`, `shared`) and follow [Semantic Versioning](https://semver.org/), but folder names are not versioned.
- Each schema lives in its own folder and includes an `example.json` for testing and documentation.
- Shared components like `signature`, `attribute`, and the `root` schema are located in `schemas/ipfs/shared`.

## 🔖 Versioning

- Schemas are versioned using Git tags (`vX.Y.Z`); directory names are not versioned.
- For released versions, each schema’s `$id` must point to the tagged raw URL to remain immutable.
- During development on `main`, `$id` may reference `refs/heads/main`, but consumers should pin to tags in production.
- Keep `$ref` paths relative; they resolve against the `$id` base (the tag) at validation time.

Example `$id` pinned to a tag:

```json
"$id": "https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/v0.1.0/schemas/ipfs/collection/collection.schema.json"
```

## ✅ Usage

You may:

- Reference any schema via its `$id` (e.g. in IPFS metadata)
- Validate metadata files using these schemas
- Link to them from applications, dashboards, or traceability tools

You may not:

- Redistribute, rebrand, or fork these schemas for other ecosystems
- Create derivative schemas that use Carrot's identity

See [NOTICE](./NOTICE) for full usage guidance.

## 🔐 License

Licensed under the [Apache License 2.0](./LICENSE).  
See [NOTICE](./NOTICE) for additional terms and usage intentions.
