# FastScript Extension Version Policy

- Patch: diagnostics/grammar/snippet fixes with no breaking changes.
- Minor: new LSP capabilities or non-breaking UI metadata changes.
- Major: breaking API/protocol changes or migration-required behavior.

Marketplace publish flow:

1. Run `npm run test:lsp`.
2. Run `npm run package:vsix`.
3. Run `npm run publish:check`.
4. Publish with `npm run publish:marketplace`.
