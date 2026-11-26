---
name: check
description: Run the read-only Schemas quality gate before committing or opening a pull request.
---

Run `pnpm check:verify` from the repository root. It verifies lint, formatting,
types, spelling, package metadata, committed schema artifacts, schema validity,
versions and references, then runs focused example and artifact tests. Report
failures with the check name and diagnostic. CI runs coverage, build and package
checks and audits agent configuration.
