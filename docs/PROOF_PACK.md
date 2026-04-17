# FastScript Proof Pack

- Generated: 2026-04-17T15:14:03.853Z

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
- Agency Ops warm build p95 trimmed: 2172.6728000000003ms
- Agency Ops cold build: 2098.4901ms
- Agency Ops runtime /dashboard: 37.35ms
- Launch line: FastScript v4
- Product contract: FastScript is the complete TypeScript platform, with ordinary JS/TS in `.fs` and valid JS/TS failures in `.fs` treated as FastScript compatibility bugs
- Release posture: source-available public repo, proprietary core, no AI-training use without permission

## Benchmark Report

# FastScript Benchmark Report

- Build time: 1500.14ms
- Routes: 39
- API routes: 5
- JS first-load gzip: 11.91KB
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
- Warm build p95 trimmed: 2172.6728000000003ms
- Cold build: 2098.4901ms
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


---

# FastScript Interop Matrix

- Generated: 2026-04-17T15:14:00.958Z
- Profile: report
- Total: 17
- Pass: 17
- Fail: 0
- Governed registry entries linked here: 11
- Governance track: FastScript 4.0 compatibility system

Interop matrix includes:
- Framework API compatibility shims for react, react-dom/server, next/link, next/navigation, vue, vue-router, svelte/store, preact, and solid-js.
- Scoped/subpath and export-condition package checks (@fastscript/runtime/edge, conditioned-subpath-lib/server, dual-mode-lib).
- Real npm package checks using installed dependencies (acorn, acorn-walk, astring).
- Node built-in and CommonJS interop checks.

| Case | Target | Kind | Platform | Status | Bundle Bytes | Notes |
|---|---|---|---|---|---:|---|
| react-core-fs | react | framework | browser | pass | 618 | FastScript module imports React + react-dom/client. |
| react-dom-server-fs | react-dom/server | framework | node | pass | 516 | FastScript module imports react-dom/server rendering helpers. |
| next-link-fs | next | framework | browser | pass | 226 | FastScript module imports next/link shape. |
| next-navigation-fs | next/navigation | framework | browser | pass | 276 | FastScript module imports next/navigation redirect and notFound helpers. |
| vue-core-fs | vue | framework | browser | pass | 365 | FastScript module imports Vue createApp/h API. |
| vue-router-fs | vue-router | framework | browser | pass | 412 | FastScript module imports vue-router createRouter history helpers. |
| svelte-store-fs | svelte | framework | browser | pass | 528 | FastScript module imports svelte/store writable. |
| preact-core-fs | preact | framework | browser | pass | 340 | FastScript module imports preact h/render API. |
| solid-core-fs | solid-js | framework | browser | pass | 386 | FastScript module imports solid-js signals. |
| scoped-subpath-fs | @fastscript/runtime/edge | npm | node | pass | 174 | FastScript module imports scoped package subpath export. |
| conditioned-subpath-fs | conditioned-subpath-lib/server | npm | node | pass | 202 | FastScript module resolves a subpath export with node/default conditions. |
| dual-mode-fs | dual-mode-lib | npm | node | pass | 163 | FastScript module imports dual-mode package through ESM export condition. |
| node-cjs-npm-fs | left-pad | npm | node | pass | 1809 | FastScript module imports CommonJS npm package. |
| node-builtins-fs | node:crypto,node:path | node | node | pass | 209 | FastScript module imports Node built-ins. |
| real-acorn-js | acorn | npm | node | pass | 200464 | Real npm package from FastScript dependencies. |
| real-astring-js | astring | npm | node | pass | 31834 | Real npm package from FastScript dependencies. |
| real-acorn-walk-js | acorn-walk | npm | node | pass | 9438 | Real npm package from FastScript dependencies. |

## Failures
- None

