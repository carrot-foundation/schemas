---
name: rule-package-management
description: 'pnpm only, exact versions, Node >= 22, and minimal dependencies'
---

# Rule package-management

Apply this rule whenever work touches:

- `package.json`
- `pnpm-lock.yaml`

# Package management for the schemas package

This is a published npm package (`@carrot-foundation/schemas`). Every production dependency becomes a transitive dependency for every consumer. Minimizing the dependency footprint is a first-class concern.

## pnpm only

pnpm is the only supported package manager. This is enforced via a `preinstall` script in `package.json`:

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

Running `npm install` or `yarn install` will fail with an error. Always use `pnpm`:

```bash
pnpm install          # Install all dependencies
pnpm add -E <pkg>     # Add a production dependency (exact version)
pnpm add -DE <pkg>    # Add a dev dependency (exact version)
```

## Exact versions — always

All dependencies must use exact versions. Never use version ranges (`^`, `~`, `>=`). The `-E` flag ensures this:

```json
{
  "dependencies": {
    "zod": "4.0.0",
    "canonicalize": "2.0.0"
  }
}
```

```json
// BAD: version ranges
{
  "dependencies": {
    "zod": "^4.0.0",
    "canonicalize": "~2.0.0"
  }
}
```

Exact versions prevent unexpected behavior from minor/patch updates. Renovate handles dependency updates via automated PRs, where changes can be reviewed and tested.

## Node >= 22

The project requires Node.js 22 or later. This is specified in `package.json` engines and enforced in CI:

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

Use features available in Node 22+ freely (e.g., native fetch, structured clone, import attributes).

## Minimal production dependencies

The production dependency list must stay minimal. Currently the package has only:

- **`zod`** — schema definition and validation (core functionality)
- **`canonicalize`** — deterministic JSON serialization (required for IPFS content hashing)

Every additional production dependency:

- Increases install size for all consumers
- Adds potential security vulnerabilities
- Creates version conflict risks in consumer projects
- Requires ongoing maintenance and updates

## Adding new dependencies

Before adding any dependency, answer these questions:

1. **Is it necessary?** Can the functionality be implemented with standard library or existing dependencies?
2. **Is it production or dev?** Schema generation scripts, testing tools, and build tools are dev dependencies. Only the published library output needs production dependencies.
3. **What is the size impact?** Check the package size on bundlephobia.com.
4. **Is it maintained?** Check npm download counts, last publish date, and open issues.
5. **Are there lighter alternatives?** A 2KB utility is better than a 200KB framework.

When adding a dependency, document the reason in the PR description:

```
## New dependency: fast-json-stable-stringify

Added as a production dependency for deterministic JSON serialization.
Required for consistent IPFS content hash generation.

Size: 1.2KB minified + gzipped
Alternatives considered: JSON.stringify (non-deterministic key ordering)
```

## Dev dependencies

Dev dependencies are more permissive but should still be justified. Common dev dependencies include:

- **tsup** — build tool for ESM + CJS output
- **vitest** — test runner with coverage
- **typescript** — compiler and type checker
- **eslint** / **prettier** — linting and formatting
- **husky** / **lint-staged** — git hooks for pre-commit checks
- **commitlint** — commit message enforcement

## Production vs dev classification

Ensure dependencies are correctly classified:

```bash
# Production: ships with the package
pnpm add -E zod

# Dev: only needed for development/build
pnpm add -DE vitest typescript tsup eslint
```

Common misclassification:

- **`@types/*`** — always dev (types are stripped at build time)
- **Build tools** — always dev (tsup, esbuild, etc.)
- **Test utilities** — always dev (vitest, testing-library, etc.)
- **Linting tools** — always dev (eslint, prettier, cspell)

## Husky and lint-staged

Git hooks are configured via Husky and lint-staged:

- **Pre-commit**: runs lint-staged (ESLint + Prettier on staged files)
- **Commit-msg**: runs commitlint to enforce conventional commits

These hooks run automatically. Do not skip them with `--no-verify` unless you have a specific, documented reason.

## Lockfile

Always commit `pnpm-lock.yaml`. Never delete it to "fix" install issues — instead, run `pnpm install` to regenerate it properly. The lockfile ensures reproducible installs across all environments.
