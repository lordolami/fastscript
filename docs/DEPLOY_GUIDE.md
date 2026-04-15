# FastScript Deploy Guide

## What gets built

`fastscript build` produces one universal production artifact directory:

- `dist/fastscript-manifest.json`: the route and API manifest the production runtime reads
- `dist/asset-manifest.json`: hashed asset lookup table
- `dist/pages/*`: compiled page modules
- `dist/api/*`: compiled API modules
- `dist/middleware.js`: compiled middleware entry
- `dist/styles.css` and `dist/assets/*`: public assets
- `dist/index.html`, `dist/manifest.webmanifest`, `dist/service-worker.js`: shell and PWA assets

That `dist/` directory is the core output. Adapter files are extra.

## Adapter-specific vs universal files

These files are not the universal app artifact. They are generated only for specific deploy targets:

- Cloudflare: `dist/worker.js`, `wrangler.toml`
- Vercel: `vercel.json`, `api/[[...fastscript]].mjs`
- Node/PM2: process manager and container wiring such as `ecosystem.config.cjs`

If you are not using one of the built-in adapters, do not look for one magic deployment file like `worker.js`. The portable build output is `dist/`.

## Support Levels
- `node/pm2`: stable
- `vercel`: stable catch-all SSR/API adapter
- `cloudflare`: stable worker SSR/API adapter

## Manual deployment on custom infrastructure

If you are deploying to Google Cloud Run, AWS ECS/EC2, Oracle Cloud compute, Azure VM/container services, or any other custom Node-capable environment, the generic production path is:

1. Build the app:

```bash
npm run build
```

2. Ship the project with at least:
   - `dist/`
   - `app/`
   - `package.json`
   - your lockfile
   - `src/`
   - installed production dependencies or a target-side `npm install`

3. Set production env:
   - `NODE_ENV=production`
   - `PORT`
   - `SESSION_SECRET`

4. Start the production runtime:

```bash
node ./src/cli.mjs start
```

That means the deployed runtime is the normal FastScript production server, and the build artifact it consumes is `dist/fastscript-manifest.json` plus the rest of `dist/`.

## Manual upload checklist

For teams doing a completely manual handoff instead of a first-party adapter:

1. Run `npm run build`
2. Inspect `dist/fastscript-manifest.json` to confirm the build succeeded
3. Upload the app package to your server, image, or container context
4. Make sure `dist/` is present on the target
5. Install production dependencies on the target if they are not baked into the image
6. Start with `node ./src/cli.mjs start`
7. Probe:
   - `/`
   - one authenticated route
   - one API route
   - static assets under `/assets/...`

## What to do on Google, AWS, Oracle, or similar providers

- VM/container products: use the manual Node runtime path above
- Managed container platforms: bake the app into an image, include `dist/`, then run `node ./src/cli.mjs start`
- Platform-specific serverless/function products: there is no first-party generic adapter yet; treat that as a custom integration instead of assuming `worker.js` or `vercel.json` will apply

So the honest answer is:

- the universal thing you deploy is `dist/`
- the universal production entrypoint today is `node ./src/cli.mjs start`
- adapter files only matter if you intentionally chose that adapter

## Agency Ops note

For `examples/agency-ops`, the same rule applies. The app-specific speed proof and Cloudflare adapter generation are documented publicly, but the manual deployment story is still:

1. `cd examples/agency-ops`
2. `node ../../src/cli.mjs build`
3. deploy the app with its `dist/` directory intact
4. run `node ../../src/cli.mjs start` on a Node-capable target

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
