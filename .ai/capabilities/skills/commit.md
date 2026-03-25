---
id: commit
name: commit
description: 'Use when staging and committing code changes with conventional commit messages'
when_to_use:
  - 'After completing a task and ready to commit'
  - 'When staging and committing changes'
  - 'When the user says commit or asks to save changes'
workflow:
  - '[ ] Review changes with git diff'
  - '[ ] Group by concern if mixed'
  - '[ ] Stage relevant files'
  - '[ ] Generate conventional commit message'
  - '[ ] Commit'
inputs:
  - 'Staged and unstaged changes'
  - 'Optional commit mode (single/batch)'
outputs:
  - 'One or more git commits with conventional commit messages'
references:
  - .ai/rules/commit.md
---

# Commit Skill

## Instructions

Stage and commit code changes in the schemas repository using Conventional Commits format with appropriate scopes.

### Step 1: Analyze Changes

Start by reviewing the current state:

```bash
git status
git diff
git diff --cached
```

Understand what changed and why. Look at both staged and unstaged changes.

### Step 2: Group Changes by Concern

If changes touch multiple concerns, split them into separate commits. Common groupings:

- Schema definition changes (new/modified Zod schemas)
- Test additions or updates
- Generated file updates (JSON schemas, examples, hashes)
- Configuration changes (ESLint, tsconfig, etc.)
- Documentation updates

**Rule**: If you can describe the change with a single conventional commit message without using "and", it belongs in one commit. Otherwise, split.

### Step 3: Stage Files

Stage files for the current commit:

```bash
git add src/mass-id/mass-id.schema.ts
git add src/mass-id/__tests__/mass-id.schema.spec.ts
```

Prefer explicit file paths over `git add .` to avoid accidentally staging unrelated changes.

### Step 4: Generate Commit Message

Follow the Conventional Commits format:

```
<type>(scope): <description>
```

**Types** (most common for schemas):

| Type       | Use When                                    |
| ---------- | ------------------------------------------- |
| `feat`     | Adding a new schema type or field           |
| `fix`      | Correcting a schema bug or validation error |
| `refactor` | Restructuring without behavior change       |
| `test`     | Adding or updating tests only               |
| `docs`     | Documentation changes only                  |
| `chore`    | Tooling, config, dependency updates         |
| `build`    | Build system changes (tsup, scripts)        |
| `style`    | Formatting-only changes                     |

**Scopes for schemas repo**:

| Scope    | Use When                                                      |
| -------- | ------------------------------------------------------------- |
| `schema` | Changes to a schema type (data, attributes, main schema)      |
| `shared` | Changes to shared components (base schemas, utilities, enums) |
| _(omit)_ | Root-level config, scripts, or cross-cutting changes          |

**Rules**:

- Imperative mood: "add", "fix", "update" (NOT "added", "fixed", "updated")
- Lowercase first letter in description
- No trailing period
- Header must be <= 100 characters
- Description should be <= 72 characters when possible

### Step 5: Commit

```bash
git commit -m "feat(schema): add mass-id IPFS schema type"
```

For commits needing a body:

```bash
git commit -m "$(cat <<'EOF'
feat(schema): add mass-id IPFS schema type

Defines the data schema, NFT attributes, and main schema for
mass-id tokenization. Includes type-specific fields for batch
processing metadata.
EOF
)"
```

### Challenge Points

Before committing, verify:

1. **Clear value**: Does the commit message clearly convey what changed and why?
2. **Tests included**: If adding or modifying a schema, are tests part of this commit or a separate one?
3. **Header length**: Is the header <= 100 chars? Shorten the description if needed.
4. **Mixed concerns**: Are unrelated changes mixed in? Split them.
5. **Generated files**: If Zod schemas changed, did you also commit updated generated files (JSON schemas, examples, hashes)?

### Batch Mode

When multiple independent changes exist, create a commit for each:

```bash
# Commit 1: Schema changes
git add src/mass-id/
git commit -m "feat(schema): add mass-id IPFS schema type"

# Commit 2: Generated files
git add schemas/ipfs/
git commit -m "chore(schema): regenerate JSON schemas and examples"

# Commit 3: Config update
git add tsconfig.json
git commit -m "chore: update tsconfig paths for new schema type"
```

### Examples

```
feat(schema): add credit-audit IPFS schema type
feat(shared): add participant-role enum to shared schemas
fix(schema): correct uuid format validation in base schema
refactor(shared): extract address schema to shared module
test(schema): add edge case tests for mass-id schema
chore: update cspell dictionary with new schema terms
docs: add JSDoc to exported schema types
build: update tsup config for new entry points
```

### Post-Commit Verification

After committing, verify the commit looks correct:

```bash
git log --oneline -5
git show --stat HEAD
```

Ensure the commit includes exactly the files you intended.
