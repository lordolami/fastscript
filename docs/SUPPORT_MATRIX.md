# FastScript Support Matrix

## Runtime Targets
- Node HTTP runtime: supported
- PM2 process manager: supported
- Vercel adapter: supported (catch-all SSR/API)
- Cloudflare adapter: supported (worker SSR/API + static assets)

## Language Surface
- `.fs` files with `~`, `state`, `fn`: supported
- `.js` compatibility mode: supported
- `.tsx/.jsx` direct compile in pipeline: not supported (use migration path)

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
- Current stable line: `0.1.x`
- LTS policy reference: `docs/LTS_POLICY.md`
