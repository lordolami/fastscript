# Compatibility Layer And Migration Packs

FastScript ships migration packs for common adoption paths:

- `packs/js-to-fs/basic`: JavaScript page migration starter.
- `packs/ts-to-fs/typed`: TypeScript to `.fs` conversion starter.
- `packs/next-to-fastscript/core`: Routing/layout migration checklist.

FastScript migration is rename-first and rename-only by default:

1. rename eligible `js/jsx/ts/tsx` files to `.fs`
2. rewrite only import specifiers that point to renamed files
3. emit conversion manifest + diff preview + validation report + fidelity report
4. fail when protected scopes would be mutated
5. fail when idempotency/import-resolution/fidelity checks do not pass

After conversion, teams can keep authoring ordinary JS/TS/JSX/TSX directly inside `.fs`. The extension is the runtime container; FastScript-specific forms such as `fn`, `state`, and `~` remain optional sugar.

The governed support surface for what is currently `proven`, `partial`, or `planned` lives in `docs/SUPPORT_MATRIX.md`. It now covers broader ecosystem proof across Next-style modules, React hooks/shared helpers, Node middleware/error flow, Vue composables/utilities, and npm/package interop.

Operational rule:

1. every accepted compatibility bug maps to an existing matrix row or creates a new one
2. every fixed compatibility bug adds or expands automated proof coverage
3. unresolved gaps stay visible as `partial`, `planned`, or `blocked` until the proof exists

Use `npm run wizard:migrate <path>` for preview-driven conversion planning.

Use `npm run migrate -- <path> --dry-run` for trust-first previews.
`npm run convert -- <path> --dry-run` is an alias.

Use `npm run migrate -- <path> --fidelity-level full --fail-on-unproven-fidelity` for full proof-mode conversion.

Optional config: `fastscript.compatibility.json` (see `fastscript.compatibility.example.json`).

Manifest and rollback workflow:

1. inspect latest conversion manifest: `npm run manifest -- --json`
2. inspect latest diff preview: `.fastscript/conversion/latest/diff-preview.json`
3. rollback from latest conversion manifest: `npm run migrate:rollback`

## Full-stack migration example

For a normal TypeScript app:

1. keep your existing page/component source and API routes in place
2. run `npm run migrate -- app --dry-run`
3. inspect `diff-preview.json`, manifest output, validation, and fidelity reports
4. convert eligible `ts/tsx/js/jsx` files into `.fs`
5. keep CSS, assets, and npm dependencies untouched
6. continue authoring ordinary TS/JS directly inside `.fs`
7. deploy through the existing FastScript targets

This is meant for teams coming from Node, Express, Next-style routes, Vue-adjacent script usage, or general TS projects that want one runtime boundary without a rewrite cliff.

## Compatibility request lane

If valid JS/TS, a framework pattern, or a real migration case fails in `.fs`, treat that as a FastScript compatibility bug and report it publicly:

1. open `https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml`
2. include the source snippet
3. include expected behavior
4. include framework/runtime context
5. include reproduction steps and whether the failure is parse/build/typecheck/runtime related
6. link the nearest support-matrix lane if one already exists
