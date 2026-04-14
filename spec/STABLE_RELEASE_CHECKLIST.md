# FastScript Stable Release Checklist

- Release target: `v0.1.2`
- Execution date: `2026-04-14`
- Evidence root: `spec/releases/v0.1.2/`

1. [x] Run formal security sign-off.
Evidence: `spec/releases/v0.1.2/RELEASE_SIGNOFF.md`, `spec/releases/v0.1.2/evidence/qa-all.log`, `spec/releases/v0.1.2/evidence/rollback-drill-report.json`

2. [x] Run formal docs/content sign-off.
Evidence: `spec/releases/v0.1.2/RELEASE_SIGNOFF.md`

3. [x] Execute rollback drill in a real environment.
Evidence: `spec/releases/v0.1.2/evidence/rollback-drill-report.json`

4. [x] Confirm zero open blocker issues with owners.
Evidence: `spec/releases/v0.1.2/BLOCKER_AUDIT.md`

5. [x] Cut and publish release candidate.
Evidence: `spec/releases/v0.1.2-rc.0/RELEASE_CANDIDATE_NOTES.md`, `spec/releases/v0.1.2/evidence/artifact-hashes.env`

6. [x] Complete soak window without critical regressions.
Evidence: `spec/releases/v0.1.2/evidence/soak-window-report.json`

7. [x] Promote stable and publish final release notes.
Evidence: `spec/releases/v0.1.2/FINAL_RELEASE_NOTES.md`, `CHANGELOG.md`

8. [x] Lock v1 scope and freeze non-v1 work.
Evidence: `docs/RELEASE_SCOPE_V1.md`, `spec/releases/v0.1.2/SCOPE_FREEZE.md`

9. [x] Define v1.1/v1.2 roadmap with owners/dates.
Evidence: `spec/ROADMAP_V1_1_V1_2.md`

10. [x] Enforce release checklist as merge gate.
Evidence: `scripts/release-merge-gate.mjs`, `.githooks/pre-push`
