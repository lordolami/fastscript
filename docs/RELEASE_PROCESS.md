# FastScript Release Process

## No-Billing CI Mode
When hosted CI is unavailable, local gate is mandatory.

1. `npm run hooks:install`
2. `npm run qa:all`
3. `npm run pack:check`
4. `npm run release:patch|minor|major`
5. Re-run `npm run qa:all`

`pre-push` hook:
- Runs `qa:all` automatically.
- Temporary bypass: `SKIP_QA_HOOK=1 git push` (hotfix-only policy).

## Required Language v1 Gates
- `npm run test:fs-diag`
- `npm run test:sourcemap-fidelity`
- `npm run test:typecheck`
- `npm run test:format-lint`
- `npm run test:conformance`

## Stable Gate
- All items in `spec/STABLE_RELEASE_CHECKLIST.md` complete.
- `spec/LANGUAGE_V1_SPEC.md` and governance policy are current.
- No open blocker defects.
- Production smoke (`npm run smoke:start`) passes.

## Governance
- Versioning, deprecation, and RFC workflow: `docs/GOVERNANCE_VERSIONING_POLICY.md`.
- Breaking changes require major release and migration notes.

## Release Execution Helpers
- `npm run rollback:drill`: validates rollback from bad deploy artifact to previous good artifact.
- `npm run soak:window`: runs staged smoke cycles and emits `/.release/soak-window/report.json`.
