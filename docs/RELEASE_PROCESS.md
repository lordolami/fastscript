# FastScript Release Process

## Fast Path (every PR/push)
1. `npm run hooks:install`
2. `npm run qa:gate`
3. `npm run merge:gate`

`pre-push` hook policy:
- Runs `qa:gate` + `merge:gate`.
- Temporary bypass only for emergency hotfix: `SKIP_QA_HOOK=1 git push`.

## Full Release Path (RC/stable)
1. `npm run qa:all`
2. `npm run sbom:generate`
3. `npm run pack:check`
4. `npm run release:patch|minor|major`
5. Re-run `npm run qa:all`

## Security-first v4.1 additions
- `npm run validate` now includes security readiness enforcement
- `npm run security:report` emits release-facing trust evidence
- release readiness now assumes explicit permissions policy, env schema, deploy-header baseline, and secret-exposure checks are part of the contract

## Required Language v1 Gates
- `npm run test:fs-diag`
- `npm run test:sourcemap-fidelity`
- `npm run test:typecheck`
- `npm run test:conformance`
- `npm run test:determinism`
- `npm run test:parser-fuzz`
- `npm run test:runtime-contract`
- `npm run test:security-baseline`

## Stable Gate Definition
- All items in `spec/STABLE_RELEASE_CHECKLIST.md` are checked.
- `docs/V1_FOREVER_READINESS.md` is current.
- No open blocker defects.
- `npm run smoke:start` passes in production-like mode.

## Governance
- SemVer/deprecation/RFC policy: `docs/GOVERNANCE_VERSIONING_POLICY.md`
- LTS support policy: `docs/LTS_POLICY.md`
- Threat/security policy: `docs/THREAT_MODEL.md`, `SECURITY.md`

## Release Execution Helpers
- `npm run rollback:drill`
- `npm run soak:window`
- `npm run deploy:zero-downtime`
