# FastScript v2.0 Migration Proof Report

Date: `2026-04-14`

Source of truth:

1. `spec/V2_0_FORMAL_SPEC_AND_EXECUTION_PLAN.md`
2. `spec/V2_0_EXECUTION_TRACKER.md`

## Scope

This report captures concrete proof artifacts for v2 migration-readiness claims already achieved in this repository, with focus on:

1. zero-authored-JS app source proof;
2. build/typecheck/conformance health;
3. migration and interop documentation parity updates.

## Proof Artifacts

### 1. Zero-Authored-JS App Source

Evidence:

1. `npm run test:v2:zero-js-app` => `pass`
2. `app/` audit shows authored route/API modules are `.fs`

Current app source shape (summary):

1. page source: `.fs`
2. API source: `.fs`
3. middleware/env/db scripts in app tree: `.fs`
4. authored `.js` under `app/`: `0`

### 2. Build/Typecheck/Conformance Health

Evidence:

1. `npm run validate` => `pass`
2. `npm run test:conformance` => `pass`

Validated output snapshot:

1. routes: `26`
2. apiRoutes: `5`
3. budget check pass: JS `11.25KB / 30.00KB`, CSS `12.77KB / 15.00KB`

### 3. Conformance Surface Growth

Evidence:

1. fixture count under `spec/conformance/fixtures`: `50`
2. quantified appendix target (`>=50`) satisfied
3. snapshots refreshed via `npm run test:conformance:update`

### 4. Runtime Context and Diagnostic Contract

Evidence:

1. `FS4201` runtime-context diagnostic live in typecheck path
2. regression tests:
- `npm run test:runtime-scope-diagnostics` => `pass`
- `npm run test:runtime-context-rules` => `pass`

### 5. Migration/Interop Documentation Parity

Evidence:

1. `docs/INTEROP_RULES.md` updated with v2 runtime-context rules and `FS4201`.
2. `docs/LANGUAGE_V1_MIGRATION.md` updated with v2 migration addendum and command sequence.
3. `docs/COMPILER_ERROR_CODES.md` includes `FS4201`.

### 6. Phase G-J Equivalence Closure (Proof-App Scope)

Evidence:

1. `spec/V2_0_PHASE_GJ_EQUIVALENCE_MATRIX.md` published.
2. `app/` authored `.js` audit remains `0`.
3. `app/api/` authored `.js` audit remains `0`.
4. `npm run validate` and `npm run test:core` pass.

### 7. External Evidence Expansion (Post-Ratification)

Current external-evidence anchors available in-repo:

1. benchmark multi-corpus execution includes:
- `yomiru`
- `examples/startup-mvp`
- `examples/fullstack`
2. cross-corpus zero-authored-JS gate:
- `npm run test:v2:zero-js-corpora` (presence-aware enforcement across configured corpora)
3. runtime/migration behavior checks exercised in shared gate chain:
- `npm run test:core`

Planned additions for ecosystem-scale expansion:

1. module-level before/after conversion tables for non-demo apps
2. per-module runtime equivalence notes (API/render/helper groupings)
3. artifact links for external app smoke/integration passes

Latest external evidence artifact:

1. `spec/V2_0_EXTERNAL_MIGRATION_EVIDENCE_2026_04_14.md`
- includes command-backed matrix for `yomiru`, `examples/startup-mvp`, and `examples/fullstack`
- records current blockers and narrowed follow-up targets

## Current Status Against v2 Exit Direction

Completed-in-repo evidence:

1. zero-authored-JS app source proof (for this repo app) => yes
2. build/validate green => yes
3. conformance quantified fixture floor (`>=50`) => yes
4. runtime context diagnostics formalized => yes
5. migration/interop docs updated => yes

Post-ratification expansion backlog:

1. external real-app migration equivalence artifacts for non-demo target modules (ecosystem-scale expansion beyond proof-app scope).
2. close external-corpus blockers listed in `spec/V2_0_EXTERNAL_MIGRATION_EVIDENCE_2026_04_14.md` (`yomiru` parser/type gaps, `startup-mvp` `alert` ambient gap).
