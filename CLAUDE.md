# CLAUDE.md

Claude adapter for Schemas AI instructions. This file is generated from canonical `.ai/`.

## Equality rule

- Cursor, Claude, and Codex are configured as equals.
- Capability parity is mandatory across all three.
- Canonical source remains tool-agnostic in `.ai/`.

## Claude runtime

- Baseline settings: `.claude/settings.json`
- Skills: `.claude/skills/*/SKILL.md`
- Agents: `.claude/agents/*.md`

## Required workflow

1. Update canonical docs under `.ai/`.
2. Run `pnpm ai:sync`.
3. Run `pnpm ai:check`.

## Canonical references

- `.ai/README.md`
- `.ai/DEFINITIONS.md`
- `.ai/STANDARDS.md`
- `.ai/PARITY_MATRIX.md`
- `.ai/PROJECT_CONTEXT.md`

## Capability counts

- Rules: 12
- Skills: 12
- Agents/Roles: 2

# Schemas Project Context

Project-specific knowledge for AI assistants working on Schemas. This content is appended to the generated CLAUDE.md adapter.

## Project Overview

Published npm package (`@carrot-foundation/schemas`) providing Zod validation schemas and JSON schemas for IPFS metadata in the Carrot ecosystem. Supports ESM and CJS. Apache-2.0 licensed.

### Available Schema Types

- **Asset Schemas**: `mass-id`, `gas-id`, `recycled-id`, `credit`, `collection`
- **Receipt Schemas**: `credit-purchase-receipt`, `credit-retirement-receipt`
- **Audit Schemas**: `mass-id-audit`
- **Reference Schemas**: `methodology`

Each type has its own directory in `src/{type}/` with schema definitions, data schemas, attributes, and tests.

## Technology Stack

- **Runtime**: Node.js >= 22 (see `package.json` engines)
- **Package Manager**: pnpm only (enforced via preinstall script)
- **Language**: TypeScript (strict mode)
- **Validation**: Zod 4.x (source of truth for all schemas)
- **Build**: tsup (ESM + CJS + DTS)
- **Testing**: Vitest (100% coverage enforced)
- **Linting**: ESLint (flat config) + Prettier + cspell
- **Production Dependencies**: `zod`, `canonicalize` only

## Architecture

### Source Structure

- **`src/{type}/`**: Schema definitions organized by type (e.g., `mass-id`)
  - `{type}.schema.ts`: Main IPFS schema combining NFT base + custom data
  - `{type}.data.schema.ts`: Type-specific data structure
  - `{type}.attributes.ts`: NFT attributes for the type
  - `index.ts`: Exports for the type
- **`src/shared/`**: Shared components used across all schemas
  - `schema-helpers.ts`: Utility functions for schema building
  - `schema-validation.ts`: Shared validation utilities
  - `schema-version.ts`: Version management
  - `schemas/core/`: Core schema components (BaseIpfsSchema, NftIpfsSchema, attributes)
  - `schemas/primitives/`: Primitive type schemas (blockchain, time, ids, numbers, text, URI, geo, hashes, enums, version)
  - `schemas/entities/`: Reusable entity schemas (participant, location)
  - `schemas/references/`: Reference schemas for cross-type linking
  - `schemas/receipt/`: Receipt-related schemas
  - `schemas/certificate/`: Certificate-related schemas
  - `schemas/audit.schema.ts`: Audit trail schema
  - `data/`: Reference data for geo-validation (e.g., Brazil municipalities)
  - `hash.ts`: Content hashing utility
- **`src/test-utils/`**: Centralized test utilities and fixtures
  - `fixtures/`: Reusable test data for all schema types
  - `schema-assertions.ts`: Custom test assertions
  - `zod-refinement-context.ts`: Zod refinement test utilities

### Build Pipeline

1. **TypeScript compilation** (`tsup`): Compiles TypeScript to ESM and CJS in `dist/`
2. **JSON Schema generation** (`generate-ipfs-schemas.js`): Converts Zod schemas to JSON Schema
3. **Version injection**: `SCHEMA_VERSION` environment variable is embedded into schema `$id` URLs
4. **Schema hashing** (`hash-schemas.js`): Generates integrity hashes
5. **Example updates** (`update-examples.js`): Regenerates example JSON from test fixtures
6. **Validation** (`validate-schemas.js`): Validates generated schemas and examples via AJV

### Schema Composition Pattern

Schemas follow a layered composition pattern:

1. `BaseIpfsSchema` — Common IPFS record fields (all records)
2. `NftIpfsSchema` — NFT-specific fields (extends Base)
3. Type-specific schemas (e.g., `MassIDIpfsSchema`) — Extends NFT with custom data and attributes

Each schema uses `.safeExtend()` to compose layers and `.meta()` to add metadata.

### Schema Versioning System

- **Unified approach**: All builds (dev and prod) use the same versioning mechanism
- **Default version**: Version from `package.json` (when `SCHEMA_VERSION` env var not set)
- **Production**: Version is set automatically during release via GitHub Actions
- **Schema `$id` format**: `https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/{version}/schemas/ipfs/{type}/{type}.schema.json`

## Common Commands

### Building and Generating Schemas

```bash
pnpm build                        # TypeScript → dist/ (ESM + CJS)
pnpm generate-ipfs-schemas        # Generate JSON schemas from Zod
pnpm clean                        # Clean build artifacts
SCHEMA_VERSION=1.2.3 pnpm build   # Build with specific version
```

### Code Quality

```bash
pnpm lint                         # Run ESLint
pnpm lint:fix                     # Fix linting issues
pnpm type-check                   # tsc --noEmit
pnpm format                       # Prettier write
pnpm format:check                 # Prettier check
pnpm spell-check                  # cspell
pnpm pkgJsonLint                  # Validate package.json
pnpm check                        # Run ALL quality gates sequentially
pnpm check:parallel               # Run ALL quality gates in parallel
```

### Schema Validation

```bash
pnpm validate-schemas             # Validate all JSON schemas
pnpm validate-examples            # Validate example data
pnpm check-refs                   # Check schema references
pnpm verify-schema-versions       # Verify version embedding
pnpm hash-schemas                 # Generate schema hashes
pnpm update-examples              # Update example JSON files
```

### Testing

```bash
pnpm test                         # Run all tests once
pnpm test:watch                   # Watch mode
pnpm test:coverage                # With coverage report
pnpm test:ui                      # Vitest UI
```

### AI Instructions

```bash
pnpm ai:sync                     # Regenerate all platform adapters
pnpm ai:check                    # Validate parity and links
```

## Zod as Source of Truth

- All schemas MUST be defined as Zod schemas in TypeScript
- JSON schemas are generated artifacts — never edit manually
- Use `z.strictObject()` for all object schemas (NOT `z.object().strict()`)
- Use `.meta()` to add JSON Schema metadata (title, description, examples)
- Export both schema and inferred type: `[Entity]Schema` and `[Entity]`
- Compose via layers using `.safeExtend()` (Base → NFT → type-specific)
- Prefer built-in validators over `.refine()` — only use refine for cross-field validation

## Metadata in Zod Schemas

Every field should include metadata:

```typescript
z.string().meta({
  title: 'Field Name',
  description: 'Clear explanation of the field',
  examples: ['value1', 'value2'],
});
```

- Use `examples` (plural) by default for variety (2-4 optimal)
- Use `example` (singular) for canonical patterns
- Skip when field references well-documented base schema

## Naming Conventions

- **Property names**: `snake_case` (project standard)
- **File names**: `kebab-case` (e.g., `mass-id.schema.ts`)
- **Schema exports**: `[Entity]Schema` (e.g., `MassIDDataSchema`)
- **Type exports**: `[Entity]` without Schema suffix (e.g., `MassIDData`)
- **ID fields**: `_id` suffix
- **Timestamps**: `created_at`, `pickup_date`, etc.
- **Measurements**: include unit in name (e.g., `distance_km`)
- **Enums**: Title Case (user-facing), lowercase (technical), UPPERCASE (constants)

## Timestamp and Date Formats

- **ISO 8601 timestamps** (top-level metadata like `created_at`): `IsoDateTimeSchema`, format `date-time`
- **Unix timestamps** (attributes, events, on-chain data): integer, milliseconds since epoch
- **ISO 8601 dates** (date-only values): string, format `date`

## JSON Schema Standards

Every generated JSON schema must include: `$schema`, `$id`, `title`, `description`, `type`, `properties`, `required`, `additionalProperties: false`.

## Release Process

- Automated via GitHub Actions on push to `main`
- Uses conventional commits to determine version bump
- Builds, tags, publishes to npm, creates GitHub release
- Include `[skip ci]` in commit message to skip release

## Important Notes

- Zod schemas are the source of truth; JSON schemas are generated — never edit manually
- 100% test coverage enforced for branches, functions, lines, statements
- Tests use centralized fixtures from `src/test-utils/fixtures/`
- Test files in `__tests__/` folders, named `*.spec.ts` (NOT `.test.ts`)
- Use `.safeParse()` for Zod schema validation tests
- Test both valid and invalid inputs for every schema
