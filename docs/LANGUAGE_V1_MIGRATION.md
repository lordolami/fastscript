# FastScript Language v1 Migration Notes

## Who should read this

1. Teams upgrading from pre-v1 parser/formatter/typecheck behavior.
2. Plugin/tool authors consuming parser diagnostics or generated output.

## Key v1 changes

1. `.fs` parsing uses full ECMAScript module grammar with FastScript declaration rewrites.
2. Formatter is AST-based and canonicalizes output to valid JavaScript structure.
3. Linter is AST/CST-aware and supports safe autofix (`--fix`).
4. Type checker performs semantic analysis (not only route-shape checks).
5. Diagnostics include stable codes, richer spans, and related-context metadata.
6. Source-map chaining is emitted from `.fs` normalization into esbuild.

## Potentially visible behavior

1. `fn`, `state`, and `~` normalize to `function`/`let` in generated code.
2. `type`/`interface`/`enum` and other standard TS syntax in `.fs` now flow through the JS/TS compatibility frontend and erase during normalization instead of being rejected.
3. Semantic errors (`FS410x`, `FS4201`) can fail `typecheck --mode fail`.
4. `format --check` can report more files due to canonical formatting.

## v2.0 Addendum (Migration Contract)

v2 migration work should align with the formal v2 spec and execution tracker.

1. Runtime context checks are now formalized (`FS4201`) with file-scope rules:
- `app/pages/*.fs` => universal+browser+server
- `app/api/*.fs` => universal+server
- `*.client.fs` => universal+browser
- `*.server.fs` => universal+server
- `*.edge.fs` => universal+edge

2. Ambient stdlib/runtime coverage is tracked by v2 probes:
- `npm run test:v2:ambient-runtime`
- `npm run test:v2:stdlib-methods`
- `npm run test:v2:stdlib-matrix`

3. DOM and inference migration confidence gates:
- `npm run test:v2:dom-globals`
- `npm run test:v2:dom-patterns`
- `npm run test:v2:inference-corpus`
- `npm run test:v2:inference-patterns`

4. Zero-authored-JS proof gate for app source:
- `npm run test:v2:zero-js-app`

## Recommended rollout sequence

1. `npm run test:conformance`
2. `npm run lint:fs -- --fix`
3. `npm run format`
4. `npm run typecheck`
5. `npm run validate`
6. Run v2-specific probes/tests listed above.

## Backward-compatibility notes

1. Runtime compatibility for valid `.fs` modules is preserved.
2. Breaking syntax/runtime changes are governed by `docs/GOVERNANCE_VERSIONING_POLICY.md`.
