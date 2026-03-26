---
name: finish-work
description: 'Use when a task is complete and needs the full check, commit, and PR workflow'
---

Orchestrate the complete wrap-up workflow: validate, check, commit, push, and create a pull request.

### Overview

This skill chains together several other skills into a single end-to-end workflow. It is the recommended way to wrap up a task.

### Step 1: Verify Branch

Ensure you are on a feature branch (not `main`) and the branch name follows conventions:

```bash
git branch --show-current
```

Expected format: `<type>/<description>` or `<type>/<scope>-<description>`

Valid examples:

- `feat/schema-add-mass-id-schema`
- `fix/shared-harden-uuid-validation`
- `chore/update-dependencies`

If you are on `main`, create a branch first using the create-branch skill.

If the branch name doesn't follow conventions, warn the user but proceed (don't rename mid-work).

### Step 2: Run Quality Gates

Execute the full quality gate pipeline:

```bash
pnpm check
```

This runs all 13 steps sequentially: lint:fix, format, type-check, spell-check, pkgJsonLint, generate-schemas, hash-schemas, update-examples, validate-schemas, verify-schema-versions, check-refs, validate-examples, test.

**If any step fails**:

1. Fix the issue
2. Re-run `pnpm check`
3. Repeat until clean

Do NOT proceed to committing until all gates pass.

If `.ai/` files were modified, also run:

```bash
pnpm ai:check
```

### Step 3: Stage and Commit

Review all changes:

```bash
git status
git diff
git diff --cached
```

Group changes by concern and create appropriate commits. Follow the commit skill guidelines:

**Single-concern changes** (most common):

```bash
git add src/mass-id/
git add schemas/ipfs/mass-id/
git commit -m "feat(schema): add mass-id IPFS schema type"
```

**Multi-concern changes** (split into multiple commits):

```bash
# Commit 1: Schema implementation
git add src/mass-id/
git commit -m "feat(schema): add mass-id IPFS schema type"

# Commit 2: Generated artifacts
git add schemas/ipfs/
git commit -m "chore(schema): regenerate JSON schemas and examples"

# Commit 3: Root config updates
git add src/index.ts
git commit -m "chore: add mass-id to barrel exports"
```

**Generated files**: If the check pipeline auto-fixed formatting or regenerated schemas, include those changes. They are expected artifacts of the quality gates.

### Step 4: Push Branch

Push the branch to the remote repository:

```bash
git push -u origin HEAD
```

If the branch already tracks a remote, a simple push suffices:

```bash
git push
```

### Step 5: Create Pull Request

Create the PR using the create-pr skill guidelines:

```bash
gh pr create --title "Add MassID IPFS schema definitions" --body "$(cat <<'EOF'
## Summary
- Add MassID IPFS schema with data, attributes, and NFT schema definitions
- Include comprehensive tests with 100% coverage
- Regenerate JSON schemas and examples

## Test plan
- [ ] All quality gates pass (`pnpm check`)
- [ ] 100% test coverage maintained
- [ ] Generated JSON schemas are valid
- [ ] Examples validate against schemas
EOF
)"
```

**PR title rules**:

- Clear and descriptive (not conventional commit format)
- Under 70 characters when possible

### Step 6: Summarize

Provide a concise summary to the user:

```md
## Summary

- **Branch**: feat/schema-add-mass-id-schema
- **Commits**:
  - feat(schema): add mass-id IPFS schema type
  - chore(schema): regenerate JSON schemas and examples
- **PR**: https://github.com/carrot-foundation/schemas/pull/123
- **Status**: All quality gates passing
- **Remaining**: Awaiting CodeRabbit review and human review
```

### Error Recovery

If issues arise during the workflow:

| Issue                      | Action                                            |
| -------------------------- | ------------------------------------------------- |
| `pnpm check` fails         | Fix the issue, re-run check, then continue        |
| Commit hook fails          | Fix lint/format issues, stage fixes, commit again |
| Push fails (no remote)     | Run `git push -u origin HEAD`                     |
| Push fails (behind remote) | Run `git pull --rebase @{u}` then push            |
| `gh pr create` fails       | Check `gh auth status`, ensure branch is pushed   |
| PR title too long          | Shorten to under 70 characters                    |

### Checklist Before Marking Complete

- [ ] On a properly named feature branch
- [ ] `pnpm check` passes with zero errors
- [ ] All changes committed with conventional commit messages
- [ ] Branch pushed to remote
- [ ] PR created with summary and test plan
- [ ] PR URL reported to the user
