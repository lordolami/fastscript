# FastScript v2.0 Execution Tracker

Source of truth: `spec/V2_0_FORMAL_SPEC_AND_EXECUTION_PLAN.md`

Last updated: `2026-04-14`

## Current Phase Status (A-Q)

1. `A. Freeze the Current Truth` - `completed`
- `npm run validate` now passes (`2026-04-14`) after budget config alignment.
- `npm run test:conformance` passes.

2. `B. Ambient Standard Library Layer` - `completed`
- Public repo now carries conformance fixtures for standard-library-heavy source patterns.
- Compiler/typechecker implementation lives in `@fastscript/core-private`.
- Probe evidence (`npm run test:v2:ambient-runtime`, `2026-04-14`):
- now resolves `Array`, `Date`, `Promise` baseline symbols with `errors=0`.
- Method coverage proof (`npm run test:v2:stdlib-methods`, `2026-04-14`):
- `Array.from`, `Array.isArray`, `Object.entries`, `Promise.all`, `Date.now`, `JSON.parse`, `Math.max` validate cleanly.
- Expanded matrix proof (`npm run test:v2:stdlib-matrix`, `2026-04-14`):
- broader usage across `Array`, `Object`, `String`, `Number`, `Date`, `Promise`, `Set`, `Map`, `Error`, `RegExp`, `URL`, `URLSearchParams`, `Intl`, `TextEncoder`, `TextDecoder` validates cleanly.

3. `C. Runtime-Aware Global Environments` - `completed`
- Public conformance fixtures added for runtime global usage patterns.
- Runtime-scoped semantic behavior depends on private core typechecker internals.
- Probe evidence (`npm run test:v2:ambient-runtime`, `2026-04-14`):
- now resolves `globalThis`, `Headers`, `FormData`, `setTimeout`, `clearTimeout` baseline symbols with `errors=0`.

4. `D. DOM and Web API Modeling` - `completed`
- Ambient DOM global baseline now modeled in private core (`Event`, `CustomEvent`, `history`, `localStorage`, `sessionStorage`).
- Public proof added: `npm run test:v2:dom-globals` (passes, `2026-04-14`).
- Expanded DOM/web-pattern proof added: `npm run test:v2:dom-patterns` (passes, `2026-04-14`), covering selector APIs, event listeners, `closest`, attributes, form extraction, location/history/storage usage.
5. `E. Inference for Normal Code` - `completed`
- Added inference corpus regression: `npm run test:v2:inference-corpus` (passes, `2026-04-14`).
- Improved chain/callback typing baseline (`map`, `filter`, `reduce`, `find`, `some`, `every`, plus expanded string/object/promise static+instance call typing).
- Added broader patterns regression: `npm run test:v2:inference-patterns` (passes, `2026-04-14`) covering destructuring, async/await flow usage, guard/nullability-safe patterns, and higher-order function compile-path coverage.
- Higher-order combinator precision improved: `twice(addTwo)`-style callable propagation now infers downstream numeric result in regression coverage.
6. `F. Runtime-Scoped Diagnostics` - `completed`
- Implemented in private core typechecker:
- context-scoped symbol diagnostics => `FS4201` with allowed-context hints
- context detection aligned to spec appendix rules (`app/pages`, `app/api`, `*.client.fs`, `*.server.fs`, `*.edge.fs`)
- public regression proof added: `npm run test:runtime-scope-diagnostics` (passes)
7. `G. Convert Remaining API .js` - `completed`
8. `H. Convert Data/State Helpers` - `completed`
9. `I. Convert Runtime Adapters` - `completed`
10. `J. Convert Render/Interaction Modules` - `completed`
- Phase `G-J` migration-equivalence matrix published: `spec/V2_0_PHASE_GJ_EQUIVALENCE_MATRIX.md`
- Current in-repo proof-app scope has zero authored `.js` under `app/` and `app/api/`.
11. `K. Prove Zero-JS Authored App` - `completed`
- Added automated proof gate: `npm run test:v2:zero-js-app` (passes, `2026-04-14`) to enforce zero authored `.js` under `app/` in this repo.
- Added cross-corpus gate: `npm run test:v2:zero-js-corpora` (passes, `2026-04-14`) to enforce zero authored `.js` under `app/` for repo, `yomiru`, `examples/startup-mvp`, and `examples/fullstack`.
- Cross-corpus gate is presence-aware: any corpus missing an `app/` directory is reported as skipped; present corpora are strictly enforced.
- Proof artifact published: `spec/V2_0_MIGRATION_PROOF_REPORT.md`
12. `L. Lock Interop and Migration Contracts` - `completed`
- Updated `docs/INTEROP_RULES.md` with v2 runtime-context interop and `FS4201` behavior.
- Updated `docs/LANGUAGE_V1_MIGRATION.md` with v2 migration addendum and concrete v2 gate command sequence.
- Evidence and command outputs consolidated in: `spec/V2_0_MIGRATION_PROOF_REPORT.md`
13. `M. Add Conformance Fixtures` - `completed`
- Added 11 new v2 fixtures across stdlib/runtime/DOM/inference coverage (`2026-04-14`).
- Added 12 additional fixtures in a second expansion wave (`2026-04-14`).
- Added 21 fixtures in a third expansion wave (`2026-04-14`) and reached quantified threshold.
- Fixture count now `50` total under `spec/conformance/fixtures` (appendix target `>=50` satisfied).
14. `N. Preserve Performance` - `completed`
- Benchmark evidence refreshed (`npm run benchmark:suite`, `2026-04-14`):
- report: `benchmarks/suite-latest.json`
- current snapshot: `js=4138` bytes, `css=13078` bytes, `routes=26`, `apiRoutes=5`.
- Protocol status report added: `spec/V2_0_PERFORMANCE_PROTOCOL_REPORT.md`
- Protocol runner now emits repeated-run timing series, outlier policy, environment metadata, memory peaks, and hard-limit checks.
- Multi-corpus execution/reporting now implemented (`repo-app`, `yomiru`, `examples/startup-mvp`, `examples/fullstack`).
- Current snapshot details:
- `repo-app` hard-limit checks pass.
- `examples/startup-mvp` and `examples/fullstack` benchmark runs complete with build timing/memory captured.
- `yomiru` benchmark runs now complete with build timing/memory captured and hard-limit checks passing.
- Current benchmark suite snapshot shows hard-limit checks passing across all configured corpora.
15. `O. Keep Syntax Simple` - `completed`
- Readability/sign-off artifact published: `spec/V2_0_READABILITY_SIGNOFF.md`
16. `P. Keep Same-Host First` - `completed`
- Same-host-first sign-off artifact published: `spec/V2_0_SAME_HOST_FIRST_SIGNOFF.md`
17. `Q. Ship Formal v2 Language Spec` - `completed`
- Formal spec ratified: `spec/LANGUAGE_V2_SPEC.md`
- Ratification record published: `spec/V2_0_RATIFICATION_RECORD.md`

## Enforcement in Core Test Chain

- `test:core` now includes:
- runtime context/rule diagnostics gates
- v2 ambient/runtime/stdlib/DOM/inference gates
- zero-JS gates (repo and cross-corpus)

## Public vs Private Boundary

Rule of thumb enforced:

- public language/product/spec work: `fastscript/spec/` (this repo: `spec/`)
- protected implementation details: `fastscript-core-private`

Bridge files under `src/` (`typecheck.mjs`, `fs-parser.mjs`, `server-runtime.mjs`, etc.) correctly re-export private core modules.

## Immediate Next Slice

1. Post-ratification expansion:
- extend migration-equivalence artifacts beyond proof-app scope with additional non-demo app module evidence.
- latest artifact: `spec/V2_0_EXTERNAL_MIGRATION_EVIDENCE_2026_04_14.md`
2. Release communications:
- align release notes/changelog references to v2.0 ratification artifacts.
