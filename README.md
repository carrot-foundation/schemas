# 🥕 Carrot IPFS Schemas

This repository contains all JSON Schemas used across the Carrot ecosystem.

These schemas define the structure of IPFS metadata for tokenized assets and other schemas.

They are versioned, publicly referenceable, and used for validation, traceability, and frontend/backend integration.

## 📦 Structure

- Schemas are organized by type (e.g., `mass-id`, `gas-id`, `shared`) and follow [Semantic Versioning](https://semver.org/), but folder names are not versioned.
- Each schema lives in its own folder and includes an `example.json` for testing and documentation.
- Shared components are located in `src/shared/**`.

## 🔖 Versioning

This project uses automated schema reference versioning with a **unified versioning approach** for both development and production environments. All schema `$id` fields always reference Git tags, ensuring consistency across all environments.

### How It Works

- **All builds**: Schemas reference `refs/tags/{version}` where version is set via `SCHEMA_VERSION` environment variable
- **Default version**: If `SCHEMA_VERSION` is not set, defaults to `0.0.0-dev`
- **No special cases**: Development and production use the exact same versioning mechanism

### Local Development

For local development, the default version `0.0.0-dev` is used automatically:

```bash
# Build with default dev version (0.0.0-dev)
pnpm build
pnpm generate-ipfs-schemas
```

### Development Tag Management

The `0.0.0-dev` tag should be maintained to point to the latest development state. To update it:

```bash
# Update the dev tag to current HEAD
./scripts/update-dev-tag.sh
```

This ensures that schemas referencing `0.0.0-dev` always resolve to the current development version.

To test a versioned build locally:

```bash
# Build with a specific version
SCHEMA_VERSION=1.2.3 pnpm build
SCHEMA_VERSION=1.2.3 pnpm generate-ipfs-schemas
SCHEMA_VERSION=1.2.3 pnpm verify-schema-versions
```

### Release Process

The release process automatically:

1. Calculates the next version based on conventional commits
2. Builds the package with the new version embedded
3. Generates JSON schemas with versioned `$id` references
4. Creates a Git tag
5. Publishes to npm
6. Creates a GitHub release

All of this happens automatically via the GitHub Actions workflow when you push to `main`.

### Example Schema References

**Development (default):**

```json
"$id": "https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/0.0.0-dev/schemas/ipfs/mass-id/mass-id.schema.json"
```

**Production (versioned):**

```json
"$id": "https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/1.2.3/schemas/ipfs/mass-id/mass-id.schema.json"
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
