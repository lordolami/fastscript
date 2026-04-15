# Agency Ops SaaS (Internal FastScript Proving-Ground App)

`examples/agency-ops` is the first real internal product track built on top of the proven `startup-mvp` baseline.

It is intentionally authored in strict ordinary TypeScript inside `.fs` files. The point is simple: the only obvious FastScript-specific difference should be the filename.

This app proves a small agency can run client operations inside one FastScript app boundary:

- public marketing page
- authenticated agency dashboard
- client and engagement management flows
- team invite and role tracking
- billing, invoices, and follow-up flow
- notification and receipt jobs
- DB-backed agency state
- Cloudflare-ready deployment path

## What this app exercises

- frontend + backend in `.fs`
- strict TypeScript authoring without FastScript-only syntax
- auth/session gating
- agency/client/team domain model
- API routes and queue jobs
- billing upgrade flow
- ops/support operational view
- governed compatibility in real product usage

## Core routes

- `/`
- `/sign-in`
- `/dashboard`
- `/dashboard/clients`
- `/dashboard/team`
- `/dashboard/billing`
- `/dashboard/settings`
- `/dashboard/ops`

## Run it

```bash
cd examples/agency-ops
node ../../src/cli.mjs dev
```

Build and deploy adapter generation:

```bash
node ../../src/cli.mjs build
node ../../src/cli.mjs deploy --target cloudflare
```

## Matrix-backed lanes used here

Check `/docs/support` in the main FastScript site for the governed support matrix behind this app. This proving-ground app intentionally exercises proven lanes across:

- JS/TS in `.fs`
- route loaders and SSR pages
- API modules
- auth middleware
- DB collections and migrations
- queue-backed jobs
- Cloudflare deployment adapter generation

If a valid JS/TS pattern used here fails in `.fs`, that is a FastScript compatibility bug.
