# Schemas

`@carrot-foundation/schemas` publishes Zod validators and TypeScript types in
ESM and CommonJS, plus JSON Schema contracts and examples for IPFS records.
The production dependencies are `canonicalize` and `zod`.

## Setup and verification

Use the Node version in `.nvmrc` and pnpm version in the `packageManager`
field of `package.json`. The package's consumer Node range is in `engines`.
Run `/bin/sh scripts/setup-worktree.sh` after creating a worktree. It installs
from the frozen lockfile and verifies that Husky is active for that worktree.
An environment that owns setup can set `SCHEMAS_WORKTREE_SETUP_HELPER` to an
absolute executable path. The helper receives the repository root as its
only argument and owns dependency and hook setup.

The canonical gate is `pnpm check:verify`. It runs lint and formatting
verification, type checking, spelling, package manifest lint, artifact
comparison, AJV validation, version and reference verification, and focused
tests. CI also runs coverage, builds, package and license checks, an advisory
schema compatibility comparison, and the central agent configuration audit.

| Command                | Use                                                |
| ---------------------- | -------------------------------------------------- |
| `pnpm check:verify`    | Read-only local verification                       |
| `pnpm test:coverage`   | Full Vitest suite with 100% coverage thresholds    |
| `pnpm check-generated` | Compare tracked JSON to generated output           |
| `pnpm validate-all`    | Build, regenerate artifacts and validate packaging |
| `pnpm check`           | Maintenance pipeline that can rewrite files        |

## Where to work

| Path                         | Contents                                                   |
| ---------------------------- | ---------------------------------------------------------- |
| `src/{type}/`                | IPFS schemas, family-specific data, attributes and exports |
| `src/shared/schemas/`        | Primitives, entities, references and base record schemas   |
| `src/test-utils/`            | Shared fixtures and schema assertions                      |
| `scripts/example-content/`   | Reference story used to emit example records               |
| `schemas/ipfs/`              | Generated JSON schemas and examples                        |
| `schemas/schema-hashes.json` | Generated schema hash manifest                             |
| `dist/`                      | Build output                                               |

Families include MassID, GasID, RecycledID, Credit, Collection, purchase and
retirement receipts, MassID audit, and Methodology. The TypeScript entry point
is `src/index.ts`. Use relative imports and preserve the public exports.
Keep tests in `__tests__/` with the `*.spec.ts` suffix, using `.safeParse()`
for valid and invalid fixture cases. TypeScript runs in strict mode.

## Schema changes

See [schema authoring and versioning](docs/schema-authoring.md) for closed
objects, composition, metadata and the generated JSON Schema contract.
Edit Zod and the reference story to change generated files. Use the domain
skills for [adding a family](.agents/skills/create-schema/SKILL.md),
[regenerating artifacts](.agents/skills/update-examples/SKILL.md) and
[reviewing changes](.agents/skills/schema-reviewer/SKILL.md).

## Pull requests and releases

Use the repository pull request template. Explain changes to the public
schema contract and how the generated artifacts were verified.

Successful Check Code runs on `main` trigger the release workflow.
Semantic-release analyzes Conventional Commits since the previous tag.
A breaking change triggers a major release, a feature a minor release, and
`fix`, `perf`, `refactor` and `revert` can trigger patches. Use `chore`,
`docs`, `test`, `ci`, `build` or `style` for corresponding non-release
changes without a breaking marker. The release pipeline injects the new
version, regenerates the artifacts, publishes to npm, and creates a GitHub
release and a version tag.

## Review guidelines

Check whether older records still parse, and compare Zod and AJV validation
when constraints change. Treat required fields, removed enum values, narrower
types and changed references as compatibility-sensitive. Review hash and
example updates alongside the schemas they reference. Keep agent configuration
changes and tooling changes out of schema, example and package API diffs.
