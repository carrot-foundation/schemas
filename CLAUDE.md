# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based schema definition library that provides Zod validation schemas and JSON schemas for IPFS metadata in the Carrot ecosystem. The package is published to npm as `@carrot-foundation/schemas` and supports both ESM and CommonJS.

## Development Commands

### Building and Generating Schemas

```bash
# Build TypeScript to dist/ (ESM + CJS)
pnpm build

# Generate JSON schemas from Zod schemas (requires build first)
pnpm generate-ipfs-schemas

# Clean build artifacts
pnpm clean
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type checking (no emit)
pnpm type-check

# Format code with Prettier
pnpm format

# Check code formatting
pnpm format:check

# Run spell checker
pnpm spell-check

# Validate package.json
pnpm pkgJsonLint
```

### Schema Validation

```bash
# Validate all JSON schemas
pnpm validate-schemas

# Check schema references
pnpm check-refs

# Verify schema versions in generated files
pnpm verify-schema-versions
```

### Versioned Builds

```bash
# Build with a specific version (for testing)
SCHEMA_VERSION=1.2.3 pnpm build
SCHEMA_VERSION=1.2.3 pnpm generate-ipfs-schemas
SCHEMA_VERSION=1.2.3 pnpm verify-schema-versions
```

### Testing

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (useful during development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Open Vitest UI for interactive testing
pnpm test:ui
```

**Test Structure:**

- Tests are placed in `__tests__/` folders next to their source files
- Test file names match source file names with `.spec.ts` suffix (NOT `.test.ts`)
- Example: `src/mass-id/mass-id.schema.ts` → `src/mass-id/__tests__/mass-id.schema.spec.ts`

**Coverage Requirements:**

- **100% coverage thresholds** for branches, functions, lines, and statements
- All schema validation logic must be tested
- Edge cases must be covered (empty arrays, optional fields, invalid data, boundary values)

**Testing Patterns:**

- Use centralized fixtures from `src/test-utils/fixtures/`
- Test both valid and invalid inputs for every schema
- Use `.safeParse()` for Zod schema validation tests
- Validate type inference in tests
- Test example JSON files from `schemas/ipfs/` for integration validation

See `.cursor/rules/testing.mdc` for comprehensive testing guidance and patterns.

## Architecture

### Source Structure

- **`src/{type}/`**: Schema definitions organized by type (e.g., `mass-id`)
  - `{type}.schema.ts`: Main IPFS schema combining NFT base + custom data
  - `{type}.data.schema.ts`: Type-specific data structure
  - `{type}.attributes.ts`: NFT attributes for the type
  - `index.ts`: Exports for the type
- **`src/shared/`**: Shared components used across all schemas
  - `base.schema.ts`: Base IPFS record structure
  - `nft.schema.ts`: NFT-specific extensions
  - `definitions.schema.ts`: Common field definitions (UUID, hashes, timestamps)
  - `helpers.schema.ts`: Utility functions for schema building
  - `schema-version.ts`: Version management utilities
  - `entities/`: Reusable entity schemas (participant, location)

### Build Pipeline

1. **TypeScript compilation** (`tsup`): Compiles TypeScript to ESM and CJS in `dist/`
2. **JSON Schema generation** (`generate-ipfs-schemas.js`): Converts Zod schemas to JSON Schema using `zod-to-json-schema`
3. **Version injection**: `SCHEMA_VERSION` environment variable is embedded into schema `$id` URLs

### Schema Versioning System

- **Unified approach**: All builds (dev and prod) use the same versioning mechanism
- **Default version**: Version from `package.json` (when `SCHEMA_VERSION` env var not set)
- **Production**: Version is set automatically during release via GitHub Actions
- **Schema `$id` format**: `https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/{version}/schemas/ipfs/{type}/{type}.schema.json`

### Schema Composition Pattern

Schemas follow a layered composition pattern:

1. `BaseIpfsSchema` - Common IPFS record fields (all records)
2. `NftIpfsSchema` - NFT-specific fields (extends Base)
3. Type-specific schemas (e.g., `MassIDIpfsSchema`) - Extends NFT with custom data and attributes

Each schema uses `.safeExtend()` to compose layers and `.meta()` to add metadata.

## Schema Development

### Zod as Source of Truth

**All schemas MUST be defined as Zod schemas** in TypeScript files (`.ts`). JSON schemas are generated automatically from Zod schemas and should never be written manually.

- Use `z.strictObject()` for all object schemas (NOT `z.object().strict()`)
- Use `.meta()` to add JSON Schema metadata (title, description, examples)
- Export both the schema and its inferred TypeScript type:
  - Schema export: `[Entity]Schema` (e.g., `MassIDDataSchema`)
  - Type export: `[Entity]` (e.g., `MassID`)
- Compose schemas via layers using `.safeExtend()` (Base → NFT → type-specific)
- Prefer built-in validators over `.refine()` - only use refine for cross-field or domain-specific validation
- JSON schemas in `schemas/` are generated artifacts, not source files

### Metadata in Zod Schemas

When defining Zod schemas, always include metadata:

```typescript
z.string().meta({
  title: 'Field Name',
  description: 'Clear explanation of the field',
  example: 'example-value', // Single example
  // OR
  examples: ['value1', 'value2'], // Multiple examples
});
```

### Timestamp and Date Formats

- **ISO 8601 timestamps** (for top-level metadata like `created_at`):
  - Use `IsoTimestampSchema` from definitions
  - Type: `string`, Format: `date-time`
  - Example: `"2024-12-05T14:30:00.000Z"`
- **Unix timestamps** (for attributes, events, on-chain data):
  - Type: `integer`
  - Unit: Milliseconds since Unix epoch
  - Example: `1710518400000`
- **ISO 8601 dates** (date-only values):
  - Type: `string`, Format: `date`
  - Example: `"2024-02-10"`

### Enum Conventions

Enum value casing depends on the context:

- **User-facing values**: Title Case (e.g., `'None'`, `'Low'`, `'Medium'`, `'High'`)
- **Technical/system values**: lowercase (e.g., `'mainnet'`, `'testnet'`)
- **Constants**: UPPERCASE (e.g., `'TEST'`, `'PRODUCTION'`)

Example:

```typescript
export const ContaminationLevelSchema = z
  .enum(['None', 'Low', 'Medium', 'High'])
  .meta({
    title: 'Contamination Level',
    description: 'Level of contamination in the waste batch.',
  });
```

### Code Comments

Follow these principles for code comments:

- Favor self-documenting code; use comments only when intent or constraints are not obvious
- Explain **why** something exists, not what it does
- Document domain/business context, non-obvious algorithms, and integration nuances
- Use TSDoc (`/** ... */`) sparingly for exported symbols requiring extra context
- Delete or update comments when behavior changes - stale comments are worse than none
- Avoid obvious statements that duplicate what the code already says

## Naming Conventions

### Property Names

- Use **snake_case** for all property names (project standard)
- Avoid abbreviations except well-established ones (`id`, `url`)
- Be descriptive and consistent across related schemas

### File Names

- Schema files: `{type}.schema.ts` or `{type}.schema.json`
- Example files: `{type}.example.json`
- Use **kebab-case** for file and directory names

## JSON Schema Standards

### Required Fields

Every JSON schema must include:

- `$schema`: JSON Schema draft version
- `$id`: Canonical URI for the schema
- `title`: Human-readable name
- `description`: Purpose and usage explanation
- `type`: Primary data type
- `properties`: Property definitions (for objects)
- `required`: Array of mandatory properties
- `additionalProperties: false`: Unless extensions are explicitly allowed

### Validation Patterns

- Use `format` validation where applicable (`uri`, `date-time`, `email`)
- Include `description` for all properties
- Provide `example` values for guidance
- Set appropriate constraints (`maxLength`, `minimum`, `maximum`)
- Use `enum` for restricted value sets
- Define reusable structures in `$defs` and reference with `$ref`

### Common Carrot Patterns

- **Timestamps**: See "Timestamp and Date Formats" in Schema Development section
- **External references**: `external_id` (UUID), `external_url` (public URL)
- **Signatures**: Follow EIP-712 structure in `$defs/signature`
- **Attributes**: NFT trait compatibility array

## Additional Resources

### Cursor Rules

Detailed guidance for specific scenarios is available in `.cursor/rules/`:

- **`testing.mdc`**: Testing patterns, fixture structure, coverage requirements, and Vitest standards
- **`zod.mdc`**: Comprehensive Zod schema authoring patterns and checklist
- **`json-schema.mdc`**: JSON Schema structure and validation requirements
- **`json.mdc`**: JSON data formatting conventions and type patterns
- **`commit.mdc`**: Complete commit message guidelines with AI generation checklist
- **`branch-naming.mdc`**: Branch naming conventions with examples
- **`pull-request.mdc`**: PR creation workflow, quality standards, and active criticism guidelines
- **`pull-request-description.mdc`**: PR description template requirements
- **`code-comments.mdc`**: When and how to write effective code comments
- **`code-preservation.mdc`**: Code preservation rules during refactoring

These rules provide more detailed guidance and examples beyond this overview.

## Important Notes

### Package Manager

- **MUST use pnpm** - enforced by preinstall script
- Requires Node.js >= 22

### Release Process

- Automated via GitHub Actions on push to `main`
- Uses conventional commits to determine version bump
- Automatically builds, tags, publishes to npm, and creates GitHub release
- Include `[skip ci]` in commit message to skip release

### Git Workflow

#### Branch Naming

Follow these conventions:

- **Format**: `<type>/<short-description>` or `<type>/<scope>-<short-description>`
- **Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `style`, `perf`, `build`, `ci`, `chore`, `revert`
- **Scopes** (optional): `schema`, `shared`
- Use lowercase kebab-case for descriptions
- Keep branches ≤ 60 characters when possible

Examples:

- `feat/schema-add-mass-id-schema`
- `fix/shared-harden-uuid-validation`
- `docs/update-readme`

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- **Format**: `<type>(optional scope): <description>`
- **Must use imperative mood**: "add", "fix", "update" (not "added", "fixed", "updated")
- **Must start with lowercase**: "add feature" not "Add feature"
- **No period at end**: "add feature" not "add feature."
- **Keep header ≤ 100 characters**; description ≤ 72 characters preferred

Common types (in order of frequency):

- `feat`: New feature or functionality
- `fix`: Bug fix or error correction
- `refactor`: Code restructuring without functional changes
- `docs`: Documentation changes only
- `chore`: Maintenance tasks, tooling, configuration
- `test`: Adding or modifying tests
- `build`, `ci`, `perf`, `style`, `revert`

Examples:

```text
feat(schema): add mass-id data schema
fix(shared): resolve UUID validation edge case
docs: update installation instructions
```

#### Git Hooks

- Uses Husky for Git hooks
- Commitlint enforces conventional commit messages
- Lint-staged runs linting on staged files before commit

#### Pull Requests

- PR titles use clear, descriptive format (NOT conventional commit format)
- Title example: "Add MassID IPFS and JSON schema definitions"
- Follow the PR template at `.github/pull_request_template.md`
- See `.cursor/rules/pull-request.mdc` for detailed PR creation guidelines
