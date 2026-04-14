# FastScript VS Code Extension

Supports:
- `.fs` syntax highlighting
- snippets
- language configuration
- LSP diagnostics (syntactic + semantic)
- document symbols
- hover, completion, rename, and go-to-definition
- `.fs` custom file icon and icon theme fallback

## Publish
- `cd vscode/fastscript-language`
- `npm install`
- `npm run test:lsp`
- `npm run package:vsix`
- `npm run publish:check`
- `npm run publish:marketplace`
