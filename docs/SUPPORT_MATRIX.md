# FastScript Support Matrix

## Runtime Targets
- Node HTTP runtime: supported
- PM2 process manager: supported
- Vercel adapter: supported (catch-all SSR/API)
- Cloudflare adapter: supported (worker SSR/API + static assets)

## Language Surface
- `.fs` files with `~`, `state`, `fn`: supported
- `.js` compatibility mode: supported
- authored JS in `.fs`: supported
- authored TS in `.fs`: supported
- authored JSX/TSX in `.fs`: supported
- FastScript-specific syntax: optional sugar

## Platform Matrix
- Windows: supported
- macOS: supported
- Linux: supported
- Validation source: CI matrix in `.github/workflows/ci.yml`

## Node Support
- Minimum: Node `>=20`
- Tested: Node `20` and `22`

## Tooling Support
- VS Code syntax + LSP smoke-tested
- CLI + formatter + linter + typecheck stable under `qa:gate`

## Release Support
- Current stable line: `2.0.x`
- LTS policy reference: `docs/LTS_POLICY.md`
