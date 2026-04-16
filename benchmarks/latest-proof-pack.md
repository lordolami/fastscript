# FastScript Proof Pack

- Generated: 2026-04-16T20:09:48.165Z

## Summary
- Routes: n/a
- JS gzip: n/a bytes
- CSS gzip: n/a bytes
- JS budget (30KB): PASS
- CSS budget (10KB): FAIL
- Interop cases: 17
- Interop pass: 17
- Interop fail: 0
- JS/TS syntax proof: pass
- JS/TS syntax cases: 8
- `.fs` parity proof: pass
- Parser/frontend parity: pass (5 cases)
- Runtime/platform parity: pass (12 runtime cases, 1 build corpus)
- Compatibility registry entries: 34
- Compatibility proven entries: 32
- Framework proof rows: 15
- Agency Ops warm build p95 trimmed: 2362.4096ms
- Agency Ops cold build: 2220.1167ms
- Agency Ops runtime /dashboard: 37.35ms
- Launch line: FastScript v3
- Product contract: `.fs` is a universal JS/TS container and valid JS/TS failures in `.fs` are treated as FastScript compatibility bugs
- Release posture: source-available public repo, proprietary core, no AI-training use without permission

## Benchmark Report

# FastScript Benchmark Report

- Build time: 1960.96ms
- Routes: 38
- API routes: 5
- JS first-load gzip: 12.65KB
- CSS first-load gzip: 14.99KB

## Budgets
- JS budget (30KB): PASS
- CSS budget (10KB): FAIL
## Agency Ops Runtime Snapshot
- Home /: 6.43ms
- Sign-in /sign-in: 9.65ms
- Session bootstrap /api/session: 22.41ms
- Dashboard /dashboard: 37.35ms
- Clients /dashboard/clients: 10.52ms
- Clients mutation /api/clients: 8.18ms

## Interop Matrix

See full matrix: `docs/INTEROP_MATRIX.md`

### Failed Interop Cases
- None

## Agency Ops Speed Proof
- Benchmark corpus id: `example-agency-ops`
- Warm build p95 trimmed: 2362.4096ms
- Cold build: 2220.1167ms
- Runtime /: 6.43ms
- Runtime /dashboard: 37.35ms
- Runtime /dashboard/clients: 10.52ms
- Runtime /api/session: 22.41ms

## JS/TS Compatibility Proof
- Syntax proof artifact: `.fastscript/proofs/js-ts-syntax-proof.json`
- `.fs` parity artifact: `.fastscript/proofs/fs-parity-matrix.json`
- Compatibility registry artifact: `.fastscript/proofs/compatibility-registry-report.json`
- Product contract: valid JS/TS in `.fs` is the compatibility target; failures are treated as FastScript bugs.
- Current governed ecosystem sweep: Next pages/layouts/navigation/shared modules, React hooks/context/lazy/shared helpers, Node middleware/error/request-mutation flow, Vue composables/store/app utilities, and expanded npm export-condition interop are represented in the matrix.
