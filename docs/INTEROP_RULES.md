# FastScript Interop Rules

## Module Interop

1. Prefer ESM imports.
2. CJS is supported via esbuild bundling.
3. `.fs` can import `.js/.mjs/.cjs/.json`.
4. `importAny()` handles default-only modules.
5. Use `resolveExport(mod, ["named", "default"])` for unknown module shapes.

## Runtime Context Interop (v2.0)

FastScript models runtime availability by file context:

1. `app/pages/*.fs` => `universal + browser + server`
2. `app/api/*.fs` => `universal + server`
3. `*.client.fs` => `universal + browser`
4. `*.server.fs` => `universal + server`
5. `*.edge.fs` => `universal + edge`
6. default => `universal`

Context-mismatch diagnostics:

1. `FS4201`: Symbol not available in current runtime context.

Examples:

1. `window` inside `app/api/*.fs` => `FS4201`
2. `process` inside `*.client.fs` => `FS4201`
3. `self` inside `*.edge.fs` => allowed

## Migration Interop Policy

Mixed `.fs` + `.js` projects remain supported during migration. For v2 proof apps, the target is zero authored `.js` under `app/`, while generated output remains JavaScript.
