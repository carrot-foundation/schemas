# Commit Changes

Generate Conventional Commit messages following project standards.

## Usage

```bash
/commit [single]
```

- **Default (batch)**: Analyze changes and propose optimal commit grouping
- **Single**: Force single commit from all changes

## Workflow

### 1. Analyze Repository State

- [ ] Review current branch and changes
- [ ] Identify ClickUp task linkage (ask if unclear)
- [ ] Check for logical groupings

### 2. Propose Commit Plan

**For batch mode:**

- Group changes by purpose, domain, or risk
- Draft commit messages per `@commit.mdc`
- Include file lists and ClickUp references
- Present plan and await confirmation

**For single mode:**

- Determine type and scope from changes
- Craft concise commit message (≤72 chars)
- Include body with context when needed

### 3. Execution Options

Ask user to choose:

1. AI creates all commits automatically
2. AI creates commits sequentially (pause per commit)
3. User executes manually

### 4. Output Format

When proposing commits, always present commands as copyable markdown blocks:

**Single commit example:**

```bash
git add path/to/file1.ts path/to/file2.ts
git commit -m "feat(schema): add mass-id data schema"
```

**Batch commits example:**

```bash
# Commit 1: Schema changes
git add src/mass-id/mass-id.data.schema.ts
git commit -m "feat(schema): add mass-id data schema"

# Commit 2: Test updates
git add src/mass-id/__tests__/mass-id.schema.spec.ts
git commit -m "test(schema): add tests for mass-id schema"
```

**With body:**

```bash
git add src/shared/definitions.schema.ts
git commit -m "fix(shared): resolve UUID validation edge case

Handle edge case where UUID validation failed for uppercase hex values.
Updates regex pattern to accept both uppercase and lowercase hex digits."
```

### 5. Challenge Points

- Mixed concerns? → Suggest splitting
- Unclear value? → Ask what problem this solves
- Logic changes without tests? → Question coverage
- Header >72 chars? → Help trim
- Multiple unrelated groups? → Recommend batch mode

## Related

- `@commit.mdc` - Complete standards and scopes
- `@branch-naming.mdc` - Branch alignment
- `@code-preservation.mdc` - Code safety rules
