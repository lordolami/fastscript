# FastScript Governance and Versioning Policy

## Scope
This policy governs FastScript language/runtime changes beginning with Language v1.

## 1. Semantic Versioning Rules
- `MAJOR`: any breaking change to language syntax, runtime behavior, CLI contracts, diagnostics codes, or generated output contracts.
- `MINOR`: backward-compatible feature additions (new syntax forms, diagnostics, APIs, tooling capabilities).
- `PATCH`: backward-compatible bug fixes and tooling correctness fixes.

## 2. Breaking-Change Definition
A change is breaking if any of the following occurs:
- valid v1 source fails to parse/typecheck/lint without opt-in flags,
- runtime behavior changes for previously valid programs,
- a stable diagnostic code is removed or semantics materially change without aliasing,
- AST/CST/source-map schema consumed by first-party tools changes incompatibly,
- CLI command/flag contracts are removed or renamed.

## 3. RFC Workflow
Required for `MAJOR` changes and non-trivial `MINOR` language changes.

1. Open RFC in `spec/rfcs/` with:
   - motivation,
   - exact grammar/semantic deltas,
   - migration and compatibility impact,
   - rollout and rollback plans.
2. Maintain a review window with at least one implementation owner and one runtime owner.
3. Land behind feature flag when migration risk is non-trivial.
4. Promote after conformance + QA gate passes and migration docs are merged.

## 4. Deprecation Policy
- Minimum deprecation period: one minor release cycle.
- Deprecations must include:
  - stable warning diagnostic code,
  - actionable migration guidance,
  - changelog entry and docs update.
- Removal of deprecated behavior occurs only in the next `MAJOR`.

## 5. Syntax Stability Commitments
- FastScript v1 syntax (`state`, `~`, `fn`, JS-compatible module grammar) is stable.
- Existing syntax forms will not be repurposed in a patch or minor release.
- Parser behavior changes that affect accepted programs require explicit compatibility notes.

## 6. Required Merge Gates
- `npm run qa:all`
- language conformance snapshot check (`npm run test:conformance`)
- parser/diagnostic/source-map tests
- formatter idempotence and lint autofix safety tests

## 7. Migration Notes Requirement
Any user-visible behavioral change must include:
- before/after examples,
- risk classification,
- fallback/rollback strategy,
- exact release version where change lands.
