# FastScript Interop Matrix

- Generated: 2026-04-17T03:51:37.156Z
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
