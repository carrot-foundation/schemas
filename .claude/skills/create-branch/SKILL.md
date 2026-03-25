---
name: create-branch
description: 'Use when starting new work and need a branch following naming conventions'
---

Create a new git branch following the naming conventions for the schemas repository.

### Branch Naming Format

```
<type>/<short-description>
```

With optional scope:

```
<type>/<scope>-<short-description>
```

### Branch Types

Use the same types as Conventional Commits:

| Type       | Use When                                           |
| ---------- | -------------------------------------------------- |
| `feat`     | New schema type, new field, new capability         |
| `fix`      | Bug fix in schema validation, generation, or tests |
| `refactor` | Code restructuring without behavior change         |
| `docs`     | Documentation-only changes                         |
| `test`     | Test-only additions or updates                     |
| `chore`    | Tooling, config, dependency updates                |

### Scopes for schemas

| Scope    | Use When                                                      |
| -------- | ------------------------------------------------------------- |
| `schema` | Changes to a specific schema type                             |
| `shared` | Changes to shared components (base schemas, enums, utilities) |
| _(omit)_ | Cross-cutting or root-level changes                           |

### Naming Rules

1. **Lowercase only**: No uppercase letters
2. **Kebab-case**: Words separated by hyphens
3. **Max 60 characters**: Keep it concise
4. **Descriptive**: Should indicate what the branch accomplishes
5. **No ticket numbers** unless explicitly provided by the user

### Step-by-Step

1. Ensure you are on the latest `main`:

```bash
git checkout main
git pull origin main
```

2. Determine the type from the task description:
   - "Add new schema for X" -> `feat`
   - "Fix validation bug in Y" -> `fix`
   - "Refactor shared utilities" -> `refactor`

3. Generate the branch name:

```bash
# Without scope
git checkout -b feat/add-mass-id-schema

# With scope
git checkout -b feat/schema-add-mass-id-schema
```

4. Verify you are on the new branch:

```bash
git branch --show-current
```

### Examples

```
feat/schema-add-mass-id-schema
feat/shared-add-participant-role-enum
fix/schema-correct-uuid-validation
fix/shared-harden-timestamp-parsing
refactor/shared-extract-address-schema
test/schema-add-credit-audit-edge-cases
chore/update-tsup-config
chore/bump-zod-dependency
docs/add-schema-authoring-guide
```

### Deriving Branch Name from Task Description

When the user provides a task description, extract the key information:

| User Says                                    | Branch Name                                 |
| -------------------------------------------- | ------------------------------------------- |
| "Add a new schema for mass ID tokenization"  | `feat/schema-add-mass-id-schema`            |
| "Fix the UUID validation in the base schema" | `fix/shared-fix-uuid-validation`            |
| "Update the tests for credit audit"          | `test/schema-update-credit-audit-tests`     |
| "Refactor shared enum definitions"           | `refactor/shared-refactor-enum-definitions` |
| "Update dependencies"                        | `chore/update-dependencies`                 |

### Edge Cases

- **Multiple concerns**: If the task spans multiple types, use the primary type (e.g., adding a schema with tests is `feat`, not `test`)
- **Unclear type**: Default to `feat` for new functionality, `fix` for corrections, `chore` for maintenance
- **Branch already exists**: Check first with `git branch --list <name>` and suggest an alternative if it exists
- **Dirty working tree**: Warn the user about uncommitted changes before switching branches

### Post-Creation

After creating the branch, confirm:

```bash
git branch --show-current
git log --oneline -1
```

The branch is ready for implementation work.
