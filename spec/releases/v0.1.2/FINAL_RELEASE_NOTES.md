# FastScript v0.1.2 Final Release Notes

- Release date: `2026-04-14`
- Channel: `stable`
- Artifact: `spec/releases/v0.1.2/artifacts/fastscript-0.1.2.tgz`
- Hashes: `spec/releases/v0.1.2/evidence/artifact-hashes.env`

## Highlights
- Completed release steps 1-8 from `spec/MASTER_TODO.md`.
- Added formal rollback drill automation (`npm run rollback:drill`).
- Added soak-window automation (`npm run soak:window`) with machine-readable report output.
- Published signed release evidence and sign-off pack under `spec/releases/v0.1.2/`.

## Validation Summary
- `qa:all`: pass
- `pack:check`: pass
- Rollback drill: pass
- Soak window: pass (3 cycles, 0 critical regressions)

## Scope
- Stable scope remains locked to `docs/RELEASE_SCOPE_V1.md`.
- Non-v1 work remains frozen per `spec/releases/v0.1.2/SCOPE_FREEZE.md`.

## Post-Release v2.0 Ratification References
- `spec/LANGUAGE_V2_SPEC.md`
- `spec/V2_0_RATIFICATION_RECORD.md`
- `spec/V2_0_EXECUTION_TRACKER.md`
- `spec/V2_0_MIGRATION_PROOF_REPORT.md`
- `spec/V2_0_PERFORMANCE_PROTOCOL_REPORT.md`
