# FastScript Proof Pack

- Generated: 2026-04-15T19:21:33.044Z

## Summary
- Routes: n/a
- JS gzip: n/a bytes
- CSS gzip: n/a bytes
- JS budget (30KB): PASS
- CSS budget (10KB): PASS
- Interop cases: 17
- Interop pass: 17
- Interop fail: 0
- JS/TS syntax proof: pass
- JS/TS syntax cases: 8
- `.fs` parity proof: pass
- Parser/frontend parity: pass (5 cases)
- Runtime/platform parity: pass (12 runtime cases, 1 build corpus)
- Compatibility registry entries: 30
- Compatibility proven entries: 28
- Framework proof rows: 12
- Launch line: FastScript v3
- Product contract: `.fs` is a universal JS/TS container and valid JS/TS failures in `.fs` are treated as FastScript compatibility bugs
- Release posture: source-available public repo, proprietary core, no AI-training use without permission

## Benchmark Report

# FastScript Benchmark Report

- Build time: 702.98ms
- Routes: 16
- API routes: 5
- JS first-load gzip: 2.71KB
- CSS first-load gzip: 0.00KB

## Budgets
- JS budget (30KB): PASS
- CSS budget (10KB): PASS

## Interop Matrix

See full matrix: `docs/INTEROP_MATRIX.md`

### Failed Interop Cases
- None

## JS/TS Compatibility Proof
- Syntax proof artifact: `.fastscript/proofs/js-ts-syntax-proof.json`
- `.fs` parity artifact: `.fastscript/proofs/fs-parity-matrix.json`
- Compatibility registry artifact: `.fastscript/proofs/compatibility-registry-report.json`
- Product contract: valid JS/TS in `.fs` is the compatibility target; failures are treated as FastScript bugs.
- Current governed ecosystem sweep: Next pages/layouts/navigation/shared modules, React hooks/context/lazy/shared helpers, Node middleware/error/request-mutation flow, Vue composables/store/app utilities, and expanded npm export-condition interop are represented in the matrix.
