# Compatibility Layer And Migration Packs

FastScript ships migration packs for common adoption paths:

- `packs/js-to-fs/basic`: JavaScript page migration starter.
- `packs/ts-to-fs/typed`: TypeScript to `.fs` conversion starter.
- `packs/next-to-fastscript/core`: Routing/layout migration checklist.

FastScript strict conversion is compatibility-first and rename-only by default:

1. rename eligible `js/jsx/ts/tsx` files to `.fs`
2. rewrite only import specifiers that point to renamed files
3. emit conversion manifest + diff preview + validation report + fidelity report
4. fail when protected scopes would be mutated
5. fail when idempotency/import-resolution/fidelity checks do not pass

After conversion, teams can keep authoring ordinary JS/TS/JSX/TSX directly inside `.fs`. The extension is the runtime container; FastScript-specific forms such as `fn`, `state`, and `~` remain optional sugar.

Use `npm run wizard:migrate <path>` for preview-driven conversion planning.

Use `npm run migrate -- <path> --dry-run` for trust-first previews.
`npm run convert -- <path> --dry-run` is an alias.

Use `npm run migrate -- <path> --fidelity-level full --fail-on-unproven-fidelity` for full proof-mode conversion.

Optional config: `fastscript.compatibility.json` (see `fastscript.compatibility.example.json`).

Manifest and rollback workflow:

1. inspect latest conversion manifest: `npm run manifest -- --json`
2. inspect latest diff preview: `.fastscript/conversion/latest/diff-preview.json`
3. rollback from latest conversion manifest: `npm run migrate:rollback`
