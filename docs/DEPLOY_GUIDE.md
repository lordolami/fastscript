# FastScript Deploy Guide

## Support Levels
- `node/pm2`: stable
- `vercel`: stable catch-all SSR/API adapter
- `cloudflare`: stable worker SSR/API adapter

## Node/PM2 (Stable Path)
1. `npm run qa:all`
2. `npm run build`
3. `npm run deploy:node`
4. `pm2 start ecosystem.config.cjs`

Required env:
- `NODE_ENV=production`
- `PORT`
- `SESSION_SECRET` (required in production)

## Vercel
1. `npm run deploy:vercel`
2. Commit generated `vercel.json` + `api/[[...fastscript]].mjs`
3. Import project in Vercel

Notes:
- Uses one catch-all serverless handler for SSR + API.
- Has immutable cache headers for hashed assets.

## Cloudflare
1. `npm run deploy:cloudflare`
2. Commit generated `wrangler.toml` and `dist/worker.js`
3. `wrangler deploy`

Notes:
- Worker handles SSR routes, API routes, middleware, and static asset pass-through.
- Requires current build artifacts (`dist/fastscript-manifest.json`).
