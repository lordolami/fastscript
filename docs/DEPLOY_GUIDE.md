# FastScript Deploy Guide

## Support Levels
- `node/pm2`: stable
- `vercel`: adapter starter (review before production use)
- `cloudflare`: adapter starter (review before production use)

## Node/PM2 (Stable Path)
1. `npm run qa:all`
2. `npm run build`
3. `npm run deploy:node`
4. `pm2 start ecosystem.config.cjs`

Required env:
- `NODE_ENV=production`
- `PORT`
- `SESSION_SECRET` (required in production)

## Vercel (Starter Adapter)
1. `npm run deploy:vercel`
2. Review generated `vercel.json` for your project shape
3. Import project in Vercel

Notes:
- Generated adapter is a starter scaffold.
- Validate routing/runtime behavior with `npm run smoke:start`.

## Cloudflare (Starter Adapter)
1. `npm run deploy:cloudflare`
2. Review generated `wrangler.toml` and `dist/worker.js`
3. `wrangler deploy`

Notes:
- Generated adapter is a starter scaffold.
- Validate behavior against your SSR/API requirements.
