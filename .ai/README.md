# AI instructions

Neutral source-of-truth for Cursor, Claude, and Codex instructions.

## Governance

- Edit canonical instruction files only under `.ai/`.
- Regenerate all platform adapters with `pnpm ai:sync`.
- Validate parity and links with `pnpm ai:check`.
- Hard delete only: remove from canonical and all adapters in the same change.

## Structure

- `README.md`
- `DEFINITIONS.md`
- `STANDARDS.md`
- `PROJECT_CONTEXT.md`
- `PARITY_MATRIX.md`
- `rules/*.md`
- `capabilities/skills/*.md`
- `capabilities/agents/*.md`
- `schemas/*.yaml`
