---
id: create-pr
name: create-pr
description: 'Use when work is ready for review and a pull request needs to be created'
when_to_use:
  - 'After finishing implementation and all checks pass'
  - 'When the user asks to create a PR'
  - 'After running the check skill successfully'
workflow:
  - '[ ] Run pnpm check'
  - '[ ] Analyze all changes'
  - '[ ] Create PR description'
  - '[ ] Create PR via gh'
inputs:
  - 'Completed work on a feature branch with all checks passing'
outputs:
  - 'Created pull request with description following template'
references:
  - .ai/rules/pull-request.md
---

# Create PR Skill

## Instructions

Create a pull request for the schemas repository with a clear description, after verifying all quality gates pass.

### Pre-flight Checks

Before creating the PR, ensure all quality gates pass:

```bash
pnpm check
```

If any step fails, fix the issue before proceeding. Do not create a PR with failing checks.

Also verify you are on a feature branch (not `main`):

```bash
git branch --show-current
```

### Analyze Changes

Understand the full scope of the PR by examining all commits since diverging from `main`:

```bash
# View all commits in this branch
git log main..HEAD --oneline

# View the full diff against main
git diff main...HEAD

# View changed files summary
git diff main...HEAD --stat
```

### Size Check

Evaluate PR size to ensure it is reviewable:

- **Lines changed**: Aim for <= 400 lines (excluding generated files)
- **Files changed**: Aim for <= 20 files
- **Generated files**: JSON schemas, examples, and hashes don't count toward the limit

If the PR is too large, suggest splitting it:

```bash
# Count lines changed (excluding generated files)
git diff main...HEAD --stat -- ':!schemas/ipfs/' ':!*.json'
```

Common split strategies:

- Separate schema definitions from test additions
- Separate shared component changes from type-specific schemas
- Separate refactoring from new features

### PR Title

The PR title should be **clear and descriptive** -- NOT in conventional commit format.

**Good examples**:

- "Add MassID IPFS and JSON schema definitions"
- "Fix UUID format validation in base schema"
- "Extract address schema to shared module"
- "Add 100% test coverage for credit-audit schema"

**Bad examples**:

- "feat(schema): add mass-id schema" (conventional commit format)
- "Update schemas" (too vague)
- "WIP" (not ready for review)

### PR Description

Structure the description following this template:

```markdown
## Summary

- <1-3 bullet points describing what changed and why>

## Test plan

- [ ] All quality gates pass (`pnpm check`)
- [ ] 100% test coverage maintained
- [ ] Generated JSON schemas are valid
- [ ] Examples validate against schemas
- [ ] <additional test items specific to the changes>
```

### Create the PR

Push the branch and create the PR using `gh`:

```bash
# Push the branch to remote
git push -u origin HEAD

# Create the PR
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

### Linking Issues

If there is a related GitHub issue, link it in the PR body:

```markdown
## Summary

- Closes #42
- Add MassID IPFS schema definitions
```

Or use the `--assignee` and `--label` flags:

```bash
gh pr create --title "..." --body "..." --assignee @me --label "schema"
```

### Post-Creation

After creating the PR:

1. **Verify the PR** was created correctly:

   ```bash
   gh pr view --web
   ```

2. **Wait for CI** to run and confirm checks pass remotely.

3. **Wait for CodeRabbit** review (automatic) and address any findings.

4. **Report the PR URL** to the user.

### Common Issues

| Issue                     | Solution                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| `gh` not authenticated    | Run `gh auth login`                                                       |
| Branch not pushed         | Run `git push -u origin HEAD` before `gh pr create`                       |
| No remote tracking        | Use `git push -u origin HEAD` to set upstream                             |
| CI fails but local passes | Check Node version matches `.nvmrc`; ensure `pnpm-lock.yaml` is committed |
| PR too large              | Split into multiple PRs by concern                                        |

### PR Review Readiness Checklist

Before marking the PR as ready for review:

- [ ] `pnpm check` passes locally
- [ ] All commits follow Conventional Commits format
- [ ] PR title is descriptive (not conventional commit format)
- [ ] PR description includes summary and test plan
- [ ] No generated files were manually edited
- [ ] No secrets or credentials are included
- [ ] Branch is up to date with `main`
