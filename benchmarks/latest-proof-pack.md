# FastScript Proof Pack

- Generated: 2026-04-15T15:54:57.747Z

## Summary
- Routes: n/a
- JS gzip: n/a bytes
- CSS gzip: n/a bytes
- JS budget (30KB): PASS
- CSS budget (10KB): PASS
- Interop cases: 13
- Interop pass: 13
- Interop fail: 0
- JS/TS syntax proof: pass
- JS/TS syntax cases: 8
- `.fs` parity proof: pass
- Parser/frontend parity: pass (5 cases)
- Runtime/platform parity: pass (4 runtime cases, 1 build corpus)
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
- Product contract: valid JS/TS in `.fs` is the compatibility target; failures are treated as FastScript bugs.
