# FastScript Proof Pack

- Generated: 2026-04-15T18:50:40.636Z

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
- Runtime/platform parity: pass (8 runtime cases, 1 build corpus)
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
- 4.0.1 proof expansion: Next-style layout/metadata, React hooks/context/lazy, Node middleware/error/env flow, and Vue composable/store-adjacent patterns are now represented in the governed matrix.


---

# FastScript Interop Matrix

- Generated: 2026-04-14T07:04:23.711Z
- Profile: test
- Total: 13
- Pass: 13
- Fail: 0

Interop matrix includes:
- Framework API compatibility shims for react, next/link, vue, svelte/store, preact, and solid-js.
- Scoped/subpath and dual-mode package checks (@fastscript/runtime/edge, dual-mode-lib).
- Real npm package checks using installed dependencies (acorn, acorn-walk, astring).
- Node built-in and CommonJS interop checks.

| Case | Target | Kind | Platform | Status | Bundle Bytes | Notes |
|---|---|---|---|---|---:|---|
| react-core-fs | react | framework | browser | pass | 618 | FastScript module imports React + react-dom/client. |
| next-link-fs | next | framework | browser | pass | 226 | FastScript module imports next/link shape. |
| vue-core-fs | vue | framework | browser | pass | 365 | FastScript module imports Vue createApp/h API. |
| svelte-store-fs | svelte | framework | browser | pass | 528 | FastScript module imports svelte/store writable. |
| preact-core-fs | preact | framework | browser | pass | 340 | FastScript module imports preact h/render API. |
| solid-core-fs | solid-js | framework | browser | pass | 386 | FastScript module imports solid-js signals. |
| scoped-subpath-fs | @fastscript/runtime/edge | npm | node | pass | 174 | FastScript module imports scoped package subpath export. |
| dual-mode-fs | dual-mode-lib | npm | node | pass | 163 | FastScript module imports dual-mode package through ESM export condition. |
| node-cjs-npm-fs | left-pad | npm | node | pass | 1809 | FastScript module imports CommonJS npm package. |
| node-builtins-fs | node:crypto,node:path | node | node | pass | 209 | FastScript module imports Node built-ins. |
| real-acorn-js | acorn | npm | node | pass | 200464 | Real npm package from FastScript dependencies. |
| real-astring-js | astring | npm | node | pass | 31834 | Real npm package from FastScript dependencies. |
| real-acorn-walk-js | acorn-walk | npm | node | pass | 9438 | Real npm package from FastScript dependencies. |

## Failures
- None

