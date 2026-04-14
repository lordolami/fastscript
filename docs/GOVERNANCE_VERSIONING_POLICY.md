# FastScript Governance and Versioning Policy

## Scope
This policy governs FastScript language/runtime changes beginning with Language v1.

## 1. Semantic Versioning Rules
- `MAJOR`: any breaking change to language syntax, runtime behavior, CLI contracts, diagnostics codes, or generated output contracts.
- `MINOR`: backward-compatible feature additions.
- `PATCH`: backward-compatible bug and correctness fixes.

## 2. Breaking-Change Definition
A change is breaking if any of the following occurs:
- valid v1 source fails to parse/typecheck/lint without opt-in flags,
- runtime behavior changes for previously valid programs,
- a stable diagnostic code is removed or semantics materially change without aliasing,
- AST/CST/source-map schema changes incompatibly,
- CLI command/flag contracts are removed or renamed.

## 3. RFC Workflow
Required for `MAJOR` changes and non-trivial `MINOR` language changes.

1. Open RFC in `spec/rfcs/` using `spec/rfcs/0000-template.md`.
2. Include motivation, exact grammar/runtime/diagnostic deltas, migration + rollback.
3. Keep review window with language + runtime owners.
4. Land behind flag for risky changes; promote after conformance + QA gates pass.

## 4. Deprecation Policy
- Minimum deprecation period: one minor release cycle.
- Deprecations must include warning code, migration guidance, and changelog entry.
- Removal occurs only in next `MAJOR`.

## 5. Syntax Stability Commitments
- FastScript v1 syntax (`state`, `~`, `fn`, JS-compatible module grammar) is stable.
- Existing syntax forms are never repurposed in patch/minor releases.

## 6. Required Merge Gates
- `npm run qa:gate`
- `npm run merge:gate`

## 7. Release Gates
- `npm run qa:all`
- Stable checklist completion (`spec/STABLE_RELEASE_CHECKLIST.md`)
- Security/audit and release evidence publication.

## 8. Migration Notes Requirement
Any user-visible behavioral change must include:
- before/after examples,
- risk classification,
- fallback/rollback strategy,
- exact version where change lands.
