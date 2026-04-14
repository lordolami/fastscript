# FastScript v2.0 External Migration Evidence

Date: `2026-04-14`

## Corpus Run Matrix

| Corpus | Zero authored `.js` under `app/` | Typecheck | Build | Notes |
|---|---:|---:|---:|---|
| `yomiru` | pass | fail | fail | Parser/type gaps on current app pages and one stdlib symbol gap (`parseInt`) |
| `examples/startup-mvp` | pass | fail | pass | One runtime-global gap: `alert` unresolved in strict typecheck |
| `examples/fullstack` | pass | pass | pass | No blocking gaps in this run |

## Commands Executed

1. `npm run test:v2:zero-js-corpora` => `pass`
2. `node ..\src\cli.mjs typecheck --mode fail` (in `yomiru`) => `fail`
3. `node ..\src\cli.mjs build` (in `yomiru`) => `fail`
4. `node ..\..\src\cli.mjs typecheck --mode fail` (in `examples/startup-mvp`) => `fail`
5. `node ..\..\src\cli.mjs build` (in `examples/startup-mvp`) => `pass`
6. `node ..\..\src\cli.mjs typecheck --mode fail` (in `examples/fullstack`) => `pass`
7. `node ..\..\src\cli.mjs build` (in `examples/fullstack`) => `pass`

## Failure Snapshots

### `yomiru` typecheck/build

- `FS4101`: unknown symbol `parseInt` in `app/lib/anilist.fs`
- parser diagnostics across page modules:
- `FS1005` unexpected token
- `FS1010` unterminated regex / unexpected character around inline markup content

Representative files:

1. `yomiru/app/lib/anilist.fs`
2. `yomiru/app/pages/_layout.fs`
3. `yomiru/app/pages/anime/[id].fs`
4. `yomiru/app/pages/index.fs`
5. `yomiru/app/pages/movies.fs`

### `examples/startup-mvp` typecheck

- `FS4101`: unknown symbol `alert` in `app/pages/index.fs`

## Interpretation

1. External evidence collection is now concrete and command-backed.
2. Zero-authored-JS migration target remains satisfied across configured external corpora.
3. Remaining expansion work is now narrowed to:
- parser compatibility for certain inline page patterns used in `yomiru`
- ambient runtime symbol coverage update for `alert` and (if required) `parseInt`

