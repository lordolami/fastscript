# Contributing to FastScript

## Local Setup
1. `npm install`
2. `npm run hooks:install`
3. `npm run qa:all`

## Definition of Done
- Feature includes tests.
- Docs updated for public behavior changes.
- `qa:all` passes locally.
- No unchecked security regressions.
- Language changes update `spec/LANGUAGE_V1_SPEC.md` and conformance snapshots.

## Review Checklist
- Is behavior backwards-compatible or clearly documented as breaking?
- Are parser/linter/typecheck diagnostics deterministic with stable codes?
- Are source maps still correct for transformed `.fs` code?
- Are formatter results idempotent?
- Are failure paths tested?
- Are docs and migration notes updated?

## RFC Requirement
- Follow `docs/GOVERNANCE_VERSIONING_POLICY.md`.
- Major and non-trivial language changes must ship with an RFC in `spec/rfcs/`.
