# @carrot-foundation/schemas

[![npm version](https://img.shields.io/npm/v/@carrot-foundation/schemas)](https://www.npmjs.com/package/@carrot-foundation/schemas)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Zod validation schemas and generated JSON Schemas for IPFS metadata in the [Carrot](https://carrot.eco) ecosystem. Supports ESM and CJS.

## Installation

```bash
pnpm add @carrot-foundation/schemas
# or
npm install @carrot-foundation/schemas
```

> Requires Node.js >= 22

## Available Schemas

| Category      | Schema                              | Description                                        |
| ------------- | ----------------------------------- | -------------------------------------------------- |
| **Assets**    | `MassIDIpfsSchema`                  | Waste tracking tokens with chain of custody events |
|               | `GasIDIpfsSchema`                   | Gas/emissions reduction tokens                     |
|               | `RecycledIDIpfsSchema`              | Recycled material tokens                           |
|               | `CreditSchema`                      | Environmental credit tokens                        |
|               | `CollectionSchema`                  | Collection metadata for grouped assets             |
| **Receipts**  | `CreditPurchaseReceiptIpfsSchema`   | Proof of credit purchase transactions              |
|               | `CreditRetirementReceiptIpfsSchema` | Proof of credit retirement transactions            |
| **Audit**     | `MassIDAuditSchema`                 | Audit trail records for MassID tokens              |
| **Reference** | `MethodologySchema`                 | Methodology definitions and rules                  |

Asset, receipt, audit, and reference schema types also export their data schema where applicable (e.g., `MassIDDataSchema`) and inferred TypeScript types (e.g., `MassIDIpfs`, `MassIDData`).

## Usage

### Validation

```typescript
import { MassIDIpfsSchema } from '@carrot-foundation/schemas';

const result = MassIDIpfsSchema.safeParse(data);

if (result.success) {
  console.log('Valid MassID record:', result.data);
} else {
  console.error('Validation errors:', result.error.issues);
}
```

### TypeScript Types

```typescript
import type { MassIDIpfs, Credit } from '@carrot-foundation/schemas';

// NFT-based schemas include blockchain, attributes, and data
function processMassID(record: MassIDIpfs) {
  const { data, blockchain, attributes } = record;
}

// Non-NFT schemas extend BaseIpfsSchema directly
function processCredit(record: Credit) {
  const { schema, created_at, external_id } = record;
}
```

### Shared Primitives

The package exports reusable building blocks for custom schemas:

```typescript
import {
  IsoDateTimeSchema, // ISO 8601 date-time strings
  Sha256HashSchema, // SHA-256 hash validation
  IpfsUriSchema, // IPFS URI format (ipfs://...)
  SemanticVersionSchema, // Semver strings
  UuidSchema, // UUID v4
  LatitudeSchema, // Geographic coordinates
  LongitudeSchema,
  ParticipantSchema, // Stakeholder entities
  LocationSchema, // Geographic locations
} from '@carrot-foundation/schemas';
```

### CommonJS

```javascript
const { MassIDIpfsSchema } = require('@carrot-foundation/schemas');
```

### JSON Schema References

Generated JSON Schemas are available at stable URLs and included in the npm package under `schemas/`:

```text
https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/{version}/schemas/ipfs/{type}/{type}.schema.json
```

Example JSON data for each schema is also available:

```text
schemas/ipfs/mass-id/mass-id.schema.json
schemas/ipfs/mass-id/mass-id.example.json
```

Published examples are generated from the shared reference story and then
post-processed with schema/version/hash metadata. Edit the reference story
or emitter modules instead of hand-editing emitted example JSON.

## Architecture

Schemas follow a layered composition pattern using Zod's `.safeExtend()`:

```text
BaseIpfsSchema            Common IPFS record fields ($schema, created_at, external_id, ...)
├─ NftIpfsSchema          NFT fields (blockchain, name, description, image, attributes)
│    └─ Asset/Receipt     MassIDIpfsSchema, GasIDIpfsSchema, RecycledIDIpfsSchema,
│         Schemas         CreditPurchaseReceiptIpfsSchema, CreditRetirementReceiptIpfsSchema
└─ Non-NFT Schemas        CreditSchema, CollectionSchema, MassIDAuditSchema, MethodologySchema
```

### Source Structure

```text
src/
├── mass-id/                    # Example: NFT schema type (has all files)
│   ├── mass-id.schema.ts       #   IPFS schema (extends NftIpfsSchema)
│   ├── mass-id.data.schema.ts  #   Type-specific data structure
│   ├── mass-id.attributes.ts   #   NFT display attributes
│   ├── index.ts                #   Public exports
│   └── __tests__/              #   Tests (100% coverage enforced)
├── credit/                     # Example: non-NFT schema type (simpler structure)
│   ├── credit.schema.ts        #   Schema (extends BaseIpfsSchema directly)
│   ├── index.ts
│   └── __tests__/
├── shared/
│   ├── schemas/
│   │   ├── core/               #   BaseIpfsSchema, NftIpfsSchema, attributes
│   │   ├── primitives/         #   Blockchain, time, geo, IDs, hashes, URIs, enums
│   │   ├── entities/           #   Participant, Location
│   │   ├── references/         #   Cross-schema linking (MassID ref, Credit ref, ...)
│   │   ├── receipt/            #   Receipt base schemas
│   │   └── certificate/        #   Certificate schemas
│   ├── schema-version.ts       #   Version management utilities
│   ├── schema-helpers.ts       #   Zod utilities (uniqueArrayItems, uniqueBy)
│   ├── schema-validation.ts    #   Validation helpers
│   ├── hash.ts                 #   Canonical hashing (canonicalize + SHA-256)
│   └── data/                   #   Reference data (Brazil municipalities)
├── test-utils/                 #   Shared fixtures and test assertions
└── index.ts                    #   Package entry point
```

## Versioning

Schema `$id` fields reference Git tags for stable, immutable URLs:

```json
"$id": "https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/0.2.4/schemas/ipfs/mass-id/mass-id.schema.json"
```

- **Default**: version from `package.json`
- **CI/Release**: set via `SCHEMA_VERSION` environment variable
- **Local override**: `SCHEMA_VERSION=1.2.3 pnpm build`

### Release Process

Automated via GitHub Actions on push to `main`:

1. Determines version bump from conventional commits
2. Builds the package with the version embedded in schema `$id` URLs
3. Generates JSON Schemas, hashes, and examples
4. Creates a Git tag, publishes to npm, creates a GitHub release

## Development

```bash
pnpm install                      # Install dependencies
pnpm build                        # TypeScript -> dist/ (ESM + CJS)
pnpm test                         # Run all tests (100% coverage enforced)
pnpm generate-ipfs-schemas        # Generate JSON Schemas from Zod
pnpm check                        # Run ALL quality gates
```

### Quality Gates (`pnpm check`)

Lint, format, type-check, spell-check, schema generation, hash verification, example updates, schema validation, version verification, reference checks, example validation, tests, dead code detection, license check, bundle size, publint, and type export verification.

### Testing

```bash
pnpm test                         # Run once
pnpm test:watch                   # Watch mode
pnpm test:coverage                # Coverage report
pnpm test:ui                      # Vitest UI
```

Tests validate schema acceptance of valid data, rejection of invalid data, type inference, and cross-field refinements. Coverage thresholds: **100%** for branches, functions, lines, and statements.

## License

[Apache License 2.0](./LICENSE). For public reference and validation only. See [NOTICE](./NOTICE) for usage restrictions.
