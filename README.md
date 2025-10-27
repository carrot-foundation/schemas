# 🥕 Carrot IPFS Schemas

This repository contains all JSON Schemas used across the Carrot ecosystem.

These schemas define the structure of IPFS metadata for tokenized assets and other schemas.

They are versioned, publicly referenceable, and used for validation, traceability, and frontend/backend integration.

## 📦 Structure

- Schemas are organized by type (e.g., `mass-id`, `gas-id`, `shared`) and follow [Semantic Versioning](https://semver.org/), but folder names are not versioned.
- Each schema lives in its own folder and includes an `example.json` for testing and documentation.
- Shared components are located in `src/shared/**`.

## 🔖 Versioning

- Schemas are versioned using isolated versioning; each schema can evolve independently.
- For released versions, each schema’s `$id` must point to the tagged raw URL to remain immutable.
- During development on `main`, `$id` may reference `refs/heads/main`, but consumers should pin to tags in production.
- Keep `$ref` paths relative; they resolve against the `$id` base (the tag) at validation time.

Example `$id` pinned to a tag:

```json
"$id": "https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/v0.1.0/schemas/ipfs/collection/collection.schema.json"
```

## 📚 Package Usage

This package is published to npm as `@carrot-foundation/schemas` and supports both **ESM** and **CommonJS** module formats.

### Installation

```bash
npm install @carrot-foundation/schemas
# or
pnpm add @carrot-foundation/schemas
# or
yarn add @carrot-foundation/schemas
```

### ESM (ECMAScript Modules)

```typescript
import { MassIDIpfsSchema, MassIDDataSchema } from '@carrot-foundation/schemas';

// Use the schemas for validation
const result = MassIDIpfsSchema.safeParse(data);
```

### CommonJS

```javascript
const {
  MassIDIpfsSchema,
  MassIDDataSchema,
} = require('@carrot-foundation/schemas');

// Use the schemas for validation
const result = MassIDIpfsSchema.safeParse(data);
```

### TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { MassIDIpfs, MassIDData } from '@carrot-foundation/schemas';

// Types are automatically inferred from the schemas
const massIdData: MassIDData = {
  // ...
};
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
