# FastScript Architecture Overview

## Language Pipeline
1. Tokenize `.fs` input with trivia-preserving CST tokens.
2. Apply FastScript declaration rewrites (`~`, `state`, `fn`) to canonical JavaScript.
3. Parse rewritten source with full ECMAScript module grammar.
4. Remap AST spans to original `.fs` offsets.
5. Emit deterministic diagnostics and chained source maps.

## Static Analysis Pipeline
1. Parser diagnostics (`FS100x`) are collected first.
2. Linter runs AST/CST-aware rules with safe autofix support.
3. Type checker builds lexical scopes and symbol tables.
4. Inference + semantic checks emit `FS410x` diagnostics.
5. Route compatibility checks emit `FS400x` diagnostics.

## Build Pipeline
1. Validate app structure and style constraints.
2. Normalize `.fs` to JavaScript with inline source-map chaining.
3. Bundle routes/api/middleware with esbuild.
4. Generate `dist/fastscript-manifest.json`.
5. Emit runtime router and HTML shell.

## Runtime Pipeline
1. Load env and validate app env schema.
2. Initialize auth/db/queue/cache/storage services.
3. Apply middleware chain (core security, plugin middleware, app middleware).
4. Resolve API/page route and execute handler.
5. Return SSR HTML or API response.

## Conformance + Regression
- Language conformance fixtures: `spec/conformance/fixtures/*.fs`
- Snapshot baseline: `spec/conformance/snapshots.json`
- Regression harness: `npm run test:conformance`
