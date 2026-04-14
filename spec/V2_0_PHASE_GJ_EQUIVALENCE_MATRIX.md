# FastScript v2.0 Phase G-J Migration Equivalence Matrix

Date: `2026-04-14`

Source of truth: `spec/V2_0_FORMAL_SPEC_AND_EXECUTION_PLAN.md`

## Scope

This matrix captures migration-equivalence evidence for phases `G-J` in the current FastScript proof-app scope (`./app`).

## Baseline Audit

- Authored `.js` under `app/`: `0`
- Authored `.js` under `app/api/`: `0`
- Authored `.fs` under `app/`: present across pages, APIs, middleware, env schema, and db assets.

## Equivalence Matrix

1. **G. Convert Remaining API `.js` Source**
- Current state: no authored `.js` API route modules remain in `app/api`.
- Compilation equivalence: `npm run validate` passes.
- Runtime equivalence: API routes build and run in standard validation path.
- Behavioral equivalence status: no JS->FS delta pending in current proof-app scope.

2. **H. Convert Data/State Helper Modules**
- Current state: no authored `.js` data/state helper modules remain under `app/`.
- Type-safety equivalence: typecheck passes in `npm run validate`.
- Behavioral equivalence status: no pending helper conversion deltas in current proof-app scope.

3. **I. Convert Runtime Adapters Where Legitimate**
- Current state: app-scoped runtime helpers are already represented in `.fs` app source; framework/runtime internals remain implementation modules outside app migration scope.
- Compilation/runtime checks: `npm run validate` and `npm run test:core` pass.
- Behavioral equivalence status: no pending app-authored adapter conversion deltas.

4. **J. Convert Render/Interaction Modules**
- Current state: app-rendering route modules under `app/pages` are `.fs`.
- Zero-authored-JS proof: `npm run test:v2:zero-js-app` and `npm run test:v2:zero-js-corpora` pass.
- Behavioral equivalence status: route rendering/build pipeline is green in validate/core tests.

## Evidence Commands

- `npm run validate`
- `npm run test:core`
- `npm run test:v2:zero-js-app`
- `npm run test:v2:zero-js-corpora`

## Notes and Limits

- This matrix closes `G-J` for the current in-repo proof-app scope.
- Additional external app migrations (ecosystem-scale) remain tracked in `spec/V2_0_MIGRATION_PROOF_REPORT.md` as broader evidence expansion work, not as blockers for in-repo phase closure.

