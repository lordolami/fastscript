# FastScript Proof Pack

- Generated: 2026-04-14T06:57:05.570Z

## Summary
- Routes: 16
- JS gzip: 2382 bytes
- CSS gzip: 6135 bytes
- JS budget (30KB): PASS
- CSS budget (10KB): PASS
- Interop cases: 13
- Interop pass: 13
- Interop fail: 0

## Benchmark Report

# FastScript Benchmark Report

- Build time: 701.36ms
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


---

# FastScript Interop Matrix

- Generated: 2026-04-14T06:57:04.533Z
- Profile: report
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

