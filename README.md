# 🥕 Carrot Schemas

This repository contains all JSON Schemas used across the Carrot ecosystem.

These schemas define the structure of IPFS metadata for tokenized assets.
They are versioned, publicly referenceable, and used for validation, traceability, and frontend/backend integration.

## 📦 Structure

- Schemas are organized by type and version, following [Semantic Versioning](https://semver.org/).
- Each schema lives in its own folder and includes an `example.json` for testing and documentation.
- Shared components like `signature`, `attribute`, and the `root` schema are located in `schemas/shared`.

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
