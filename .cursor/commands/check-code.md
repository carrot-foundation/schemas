# Check Code

Run automated project checks and fix all issues. Do not ignore warnings/errors without explicit approval.

## Usage

```bash
/check-code [sequential|parallel]
```

- **Default (sequential)**: Run checks sequentially (recommended for CI/safety)
- **Parallel**: Run all checks in parallel (faster execution)

## Commands

```bash
# Sequential execution (recommended for CI/safety)
pnpm check

# Parallel execution (faster, runs all checks in parallel)
pnpm check:parallel
```

The `check` script runs: `lint:fix` → `format` → `type-check` → `spell-check` → `pkgJsonLint` → `build` → `validate-schemas` → `verify-schema-versions` → `check-refs` → `test`

## Workflow

### 1. Run All Checks

- [ ] Execute `pnpm check` (sequential) or `pnpm check:parallel` based on usage option
- [ ] Capture all failures and warnings

### 2. Analyze and Fix Issues

- [ ] Analyze failures and fix the root cause
- [ ] Fix all lint, type, spelling, and test issues
- [ ] Do not ignore warnings/errors without explicit approval

### 3. Handle Ignore Comments

**If a legitimate ignore is needed:**

- [ ] **Stop and ask for approval**: "Should I ignore [specific issue] because [reason]?"
- [ ] Every ignore comment must include a clear explanation of why it's necessary
- [ ] Only proceed after explicit user approval

### 4. Verify Fixes

- [ ] Re-run checks after fixes to verify success
- [ ] Continue until all checks pass

### 5. Report Summary

- [ ] Report summary of changes made
- [ ] List all issues fixed
- [ ] Note any approved ignore comments

## Rules

- Fix all lint, type, spelling, and test issues
- If you must add an ignore comment (eslint-disable, @ts-ignore, etc.), **stop and ask for approval first**
- Every ignore comment must include a clear explanation of why it's necessary
- Re-run checks after fixes to verify success
