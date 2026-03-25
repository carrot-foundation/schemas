---
name: coderabbit
description: 'Use when triggering a CodeRabbit review on current changes or a pull request'
---

Trigger and manage automated CodeRabbit reviews on pull requests in the schemas repository.

### How CodeRabbit Reviews Work

CodeRabbit is an AI-powered code review tool that automatically analyzes pull requests. It runs as a GitHub App and posts review comments directly on the PR.

### Automatic Triggering

CodeRabbit reviews are triggered **automatically** when:

- A new pull request is created
- New commits are pushed to an existing PR
- A draft PR is marked as ready for review

No manual action is needed for the initial review.

### Re-triggering a Review

If you need to re-trigger a CodeRabbit review (e.g., after addressing findings or if the initial review didn't run), comment on the PR:

```
@coderabbitai review
```

Other useful CodeRabbit commands:

```
@coderabbitai summary        # Get a summary of the PR changes
@coderabbitai resolve         # Resolve all CodeRabbit comments
@coderabbitai configuration   # Show current CodeRabbit configuration
```

### Pre-requisites Before Triggering

Before requesting a CodeRabbit review, ensure:

1. **All changes are pushed** to the remote branch:

   ```bash
   git push origin HEAD
   ```

2. **Quality gates pass locally** -- run `pnpm check` first to avoid noise in the review from issues you could have caught locally.

3. **The PR description is complete** -- CodeRabbit uses the PR description for context when reviewing.

### Addressing CodeRabbit Findings

When CodeRabbit posts review comments:

1. **Read each comment carefully** -- CodeRabbit flags potential issues, style violations, and bugs.

2. **Categorize findings**:
   - **Valid issues**: Fix them in a new commit and push
   - **False positives**: Reply to the comment explaining why it's not applicable
   - **Suggestions**: Consider adopting if they improve code quality

3. **Schema-specific patterns CodeRabbit checks**:
   - Missing `.meta()` on Zod fields
   - Inconsistent naming conventions (snake_case properties, PascalCase exports)
   - Test coverage gaps
   - Missing barrel exports in `index.ts`
   - Backward-incompatible schema changes

4. **After addressing all findings**, re-trigger the review:

   ```
   @coderabbitai review
   ```

5. **Resolve addressed comments** once fixes are pushed.

### Common CodeRabbit Findings in schemas

| Finding                   | What It Means                                | How to Fix                                                 |
| ------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Missing field description | A Zod field lacks `.meta()` with description | Add `.meta({ description: '...' })` to the field           |
| Unused export             | An exported symbol is not used elsewhere     | Remove the export or verify it's used by consumers         |
| Type assertion            | Using `as` instead of proper typing          | Use Zod inference (`z.infer<typeof schema>`)               |
| Missing test case         | A code path is not tested                    | Add test for the uncovered path                            |
| Breaking change           | Schema field removed or type changed         | Add backward compatibility or document the breaking change |

### Workflow Integration

The recommended workflow for CodeRabbit integration:

1. Complete implementation locally
2. Run `pnpm check` -- fix all issues
3. Commit and push changes
4. Create PR via `gh pr create`
5. Wait for automatic CodeRabbit review
6. Address findings
7. Push fixes
8. Re-trigger review if needed
9. Once CodeRabbit is satisfied, request human review

### Configuration

CodeRabbit configuration for this repository lives in `.coderabbit.yaml` at the repo root. Do not modify this file unless explicitly asked.
