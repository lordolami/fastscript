# Agency Ops SaaS Guide

Agency Ops is the strict-TypeScript proving-ground app built from the public `startup-mvp` baseline.

It exists to show developers something very specific: you can keep writing ordinary TypeScript inside `.fs`, keep pages, APIs, jobs, middleware, and state in one runtime boundary, and still ship a product-shaped app with governed compatibility proof.

Use it when you want:

- a greenfield agency or client-ops SaaS
- an internal service-delivery dashboard
- a retainers, billing, invoice-reminder, assignment, and follow-up workflow app
- a small-team admin product with notifications, workload visibility, and invoice trails

## What it proves

- strict ordinary TypeScript in `.fs`
- public marketing routes plus authenticated dashboard routes
- session bootstrap and auth gating
- client and engagement CRUD
- team invite flow
- operator assignment and workload visibility
- billing, invoice, and reminder flow
- queue-backed notification and receipt jobs
- Cloudflare-ready adapter generation
- custom Node/container deployment from the same built `dist/` output
- internal delivery-queue workflows and work-item operations

## How to use it

1. Copy or fork `examples/agency-ops`
2. Rename the domain language for your own product
3. Keep pages, APIs, jobs, DB state, and middleware in one FastScript app boundary
4. Check `/docs/support` before extending into new framework/runtime territory
5. Run `npm run test:agency-ops`, `npm run validate`, and then your full QA flow before shipping

## Architecture map

- Pages: UI routes and server-rendered screens
- APIs: session, billing checkout, billing reminders, work-item mutation, assignment, and workflow actions
- Jobs: async receipts and follow-up notifications
- DB: seed data and collection-backed product state
- Middleware: auth/session guardrails
- Deploy: Cloudflare adapter generation path plus custom Node/container production start
- Config: app env schema plus Cloudflare-friendly and custom-host env examples for branding, support contact, notification sender, and database wiring

## Manual deployment if you are not using Node, Vercel, or Cloudflare adapters

This is the missing but important rule: the portable build artifact is `dist/`, not `worker.js`.

After `build`, the important production outputs are:

- `dist/fastscript-manifest.json`: route and API manifest
- `dist/asset-manifest.json`: hashed asset lookup table
- `dist/pages/*`: compiled pages
- `dist/api/*`: compiled API handlers
- `dist/middleware.js`: compiled middleware chain
- `dist/styles.css` and `dist/assets/*`: static assets

Adapter-specific files are extra:

- `dist/worker.js` is for Cloudflare only
- `vercel.json` and `api/[[...fastscript]].mjs` are for Vercel only

If you deploy Agency Ops to Google Cloud Run, AWS ECS/EC2, Oracle Cloud compute, or any other Node-capable platform, the manual path is:

1. `cd examples/agency-ops`
2. `node ../../src/cli.mjs build`
3. `DB_DRIVER=postgres DATABASE_URL=... node ../../src/cli.mjs db:migrate`
4. owner sign-in bootstraps the first seeded agency if no explicit seed file exists
5. ship the app with `dist/`, `app/`, `src/`, `package.json`, and installed production dependencies
6. set `NODE_ENV=production`, `PORT`, `SESSION_SECRET`, `DB_DRIVER=postgres`, and `DATABASE_URL`
7. run `node ../../src/cli.mjs start`

So the thing you are really deploying is the app plus its built `dist/` directory. The server reads `dist/fastscript-manifest.json` at startup.
If `DB_DRIVER=postgres` is set and Postgres is unavailable, FastScript now fails loudly instead of silently switching to file storage.

If you are targeting a provider-specific function runtime instead of a Node/container runtime, treat that as a custom integration unless FastScript already has a first-party adapter for it.

## Manual upload checklist

1. Build: `node ../../src/cli.mjs build`
2. Confirm `dist/fastscript-manifest.json` exists
3. Run migrations and seed against your target Postgres database
4. Upload the app bundle to your target
5. Make sure `dist/` is present on the target machine/image
6. Install production dependencies if they are not baked into the image
7. Start with `node ../../src/cli.mjs start`
8. Probe `/`, `/dashboard`, `/dashboard/ops`, `/api/session`, and `/api/work-items`

## Cloudflare env and bindings for the product track

Agency Ops includes an app-level env schema and example Cloudflare files so the proving-ground app can become a real internal product without inventing deployment wiring from scratch.

Files to use:

- `examples/agency-ops/app/env.schema.fs`
- `examples/agency-ops/.dev.vars.example`
- `examples/agency-ops/wrangler.toml.example`
- `examples/agency-ops/.env.production.example`
- `examples/agency-ops/DEPLOYMENT_INTERNAL.md`

Important runtime vars:

- `SESSION_SECRET`
- `DB_DRIVER`
- `DATABASE_URL`
- `AGENCY_OPS_APP_NAME`
- `AGENCY_OPS_SUPPORT_EMAIL`
- `AGENCY_OPS_NOTIFY_FROM`
- `AGENCY_OPS_PRIMARY_REGION`

That means the same app can be branded and operated per environment while staying inside the normal FastScript runtime contract.

## Performance evidence

Agency Ops is measured explicitly in the benchmark and runtime proof pipeline. The public proof pack and benchmark artifacts record:

- corpus build timings for `examples/agency-ops`
- runtime response timing snapshots for `/`, `/dashboard`, `/dashboard/clients`, and `/api/session`

If those numbers regress, the app should not be used as a speed claim without rerunning the proof.

## Product contract

`startup-mvp` remains the official public starter.

Agency Ops is a documented proving-ground app built from that baseline. It does not redefine the FastScript contract. It consumes the same support matrix and the same rule: if valid JS/TS fails in `.fs`, that is a compatibility bug.
