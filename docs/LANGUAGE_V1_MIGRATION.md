# FastScript Language v1 Migration Notes

## Who should read this
- Teams upgrading from pre-v1 parser/formatter/typecheck behavior.
- Plugin/tool authors consuming parser diagnostics or generated output.

## Key changes
1. `.fs` parsing now uses full ECMAScript module grammar with FastScript declaration rewrites.
2. Formatter is AST-based and canonicalizes output to valid JavaScript structure.
3. Linter is AST/CST-aware and supports safe autofix (`--fix`).
4. Type checker now performs semantic analysis (not just route-shape checks).
5. Diagnostics now include stable codes, richer spans, and related-context metadata.
6. Source-map chaining is emitted from `.fs` normalization into esbuild.

## Potentially visible behavior
- `fn`, `state`, and `~` declarations are normalized to `function`/`let` in generated code.
- `type`/`interface`/`enum` in `.fs` are reported and removed during lenient normalization.
- New semantic errors (`FS410x`) can fail `typecheck --mode fail`.
- `format --check` may now report more files due canonical structural formatting.

## Recommended rollout sequence
1. Run `npm run test:conformance` and inspect snapshot deltas.
2. Run `npm run lint:fs -- --fix` to apply safe lint rewrites.
3. Run `npm run format` to apply canonical formatting.
4. Run `npm run typecheck` and resolve new `FS410x` diagnostics.
5. Run full gate `npm run qa:all`.

## Backward-compatibility notes
- Runtime compatibility for valid `.fs` modules is preserved.
- Breaking syntax/runtime changes are governed by `docs/GOVERNANCE_VERSIONING_POLICY.md`.
