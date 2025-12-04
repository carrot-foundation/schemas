# Finish Task

Complete work by orchestrating branch validation, commits, and PR creation.

## Usage

```bash
/finish-task
```

Guides through complete workflow interactively.

## Workflow

### 1. Capture Context

- [ ] Review repository state
- [ ] Ask for ClickUp task (CRT-12345)

### 2. Validate Branch

- Compare to `@branch-naming.mdc`
- If violations or on `main` → propose compliant branch
- Ask if user wants to create/switch

### 3. Plan Commits

**If changes exist:**

- Run `/commit` workflow (batch mode)
- Provide staging/commit commands
- Offer execution options

**If no changes:**

- Proceed to PR

### 4. Confirm PR Branches

Ask user:

- Base branch? (default: `main`)
- Confirm source branch

### 5. Create PR

Execute complete `/create-pr` workflow:

**5a. Gather data** (logs, diffs, stats)

**5b. Critical analysis** (size, clarity, red flags)

- Do not proceed until clear or answered

**5c. Generate description** (follow template, challenge weak value)

#### 5d. Save and output

- Save to `tmp/pull-requests/{sanitized-branch}.md`
- Output exact `gh pr create` command with all flags

### 5.5. Validate Before Marking Task Done

Before considering the task finished, ensure:

- [ ] Lint passes (e.g., `pnpm lint`)
- [ ] Type-check passes (e.g., `pnpm type-check`)
- [ ] Build succeeds if applicable (e.g., `pnpm build`)
- [ ] Schema validation passes when schemas changed (e.g., `pnpm validate-schemas`, `pnpm check-refs`, `pnpm verify-schema-versions`)

### 6. Summarize

Provide:

- Branch status
- Commit plan
- PR file location and exact command
- Final reminders (tests, push, ClickUp refs)

## Challenge Points

- Branch violations? → Propose alternative
- On `main`? → Create feature branch
- Vague commits? → Guide through `/commit`
- Large PR? → Suggest split before creation
- No ClickUp task? → Confirm intentional
- Tests not run? → Remind to validate

## Related

- `/create-branch` - Branch validation
- `/commit` - Commit planning
- `/create-pr` - PR generation
- `@code-preservation.mdc` - Code safety rules
