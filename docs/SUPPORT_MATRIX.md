# FastScript Support Matrix

## Runtime Targets
- Node HTTP runtime: supported
- PM2 process manager: supported
- Vercel adapter: supported (catch-all SSR/API)
- Cloudflare adapter: supported (worker SSR/API + static assets)

## Language Surface
- `.fs` files with `~state`, `state`, `fn`: supported
- `.js` compatibility mode: supported
- `.tsx/.jsx` compile as runtime pages: not supported in build pipeline (use `migrate`)

## Platforms
- Development: Windows/macOS/Linux
- Local release gate: `npm run qa:all`

## Minimum Node
- Node `>=20`
