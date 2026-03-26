---
name: rule-schema-versioning
description: 'Schema version injection, $id format, and SCHEMA_VERSION environment variable'
---

# Rule schema-versioning

Apply this rule whenever work touches:

- `src/shared/schema-version.ts`
- `scripts/**`

# Schema version injection and management

Schema versioning ensures every generated JSON Schema has a correct, traceable `$id` URL that points to the exact version of the schema definition. This is critical for schema consumers who validate data against specific versions.

## The `$id` URL format

Every generated JSON Schema includes a `$id` field with this format:

```
https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/{version}/schemas/ipfs/{type}/{type}.schema.json
```

Example for a MassID schema at version 1.2.3:

```
https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/1.2.3/schemas/ipfs/mass-id/mass-id.schema.json
```

This URL must resolve to the actual file in the GitHub repository at the tagged release, enabling consumers to fetch and validate against the exact schema version.

## Version source chain

The version flows through this chain:

1. **Source**: `SCHEMA_VERSION` environment variable (set in CI/CD or locally)
2. **Fallback**: `version` field in `package.json`
3. **Build injection**: `tsup` config uses `env` to set `process.env.SCHEMA_VERSION` at build time
4. **Runtime access**: `src/shared/schema-version.ts` exports the resolved version
5. **Schema generation**: Generated JSON Schemas use the version in their `$id` URLs

```
SCHEMA_VERSION env var
  |
  v
tsup.config.ts (env: { SCHEMA_VERSION: ... })
  |
  v
schema-version.ts (exports getSchemaVersionOrDefault())
  |
  v
JSON Schema generation (embeds version in $id URLs)
```

## The `schema-version.ts` module

This module is the single source of truth for version resolution at runtime:

```typescript
// src/shared/schema-version.ts
export function getSchemaVersionOrDefault(): string {
  return process.env['SCHEMA_VERSION'] || getPackageJsonVersion();
}
```

Never import the version from any other source. Always use `getSchemaVersionOrDefault()`.

## tsup configuration

The `tsup.config.ts` injects the version at build time:

```typescript
export default defineConfig({
  // ...
  env: {
    SCHEMA_VERSION: process.env.SCHEMA_VERSION || getPackageJsonVersion(),
  },
});
```

This sets `process.env.SCHEMA_VERSION` in the built output so the version is available at runtime without requiring the environment variable to be set by consumers.

## Unified dev/prod versioning

There is no separate versioning logic for development vs production. The same chain applies:

- **Local development**: No `SCHEMA_VERSION` set, falls back to `package.json` version
- **CI/CD builds**: `SCHEMA_VERSION` set to the release version (e.g., from git tag)
- **Published package**: Version baked in at build time via tsup env

This ensures consistency — the version resolution path is identical everywhere.

## Verifying versions

Run the verification script to ensure all generated schemas have correct version references:

```bash
pnpm verify-schema-versions
```

This checks:

- All `$id` URLs contain a valid version segment
- The version in `$id` matches the expected schema version
- No schemas have hardcoded or stale versions
- The version format follows semver

## Version bump workflow

Production releases are automated via GitHub Actions using conventional commits — do not manually bump versions for release.

To test a specific version locally:

1. Set the environment variable: `SCHEMA_VERSION=1.2.3 pnpm generate-ipfs-schemas`
2. Run `pnpm verify-schema-versions` to validate
3. Do not commit the locally generated schemas — CI/CD handles this for real releases

## Anti-patterns in detail

### Hardcoded version strings

```typescript
// BAD: hardcoded version
const schemaId =
  'https://raw.githubusercontent.com/.../refs/tags/1.2.3/schemas/...';

// GOOD: dynamic version
const schemaId = `https://raw.githubusercontent.com/.../refs/tags/${getSchemaVersionOrDefault()}/schemas/...`;
```

### Bypassing the injection chain

```typescript
// BAD: reading version directly from package.json at runtime
import pkg from '../package.json';
const version = pkg.version;

// GOOD: using the version module
import { getSchemaVersionOrDefault } from './shared/schema-version';
const version = getSchemaVersionOrDefault();
```

### Manual `$id` updates

Never manually edit `$id` URLs in generated JSON Schema files. They are overwritten on every generation. Fix the version source instead.
