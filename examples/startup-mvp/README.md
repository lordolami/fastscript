# Team Dashboard SaaS (FastScript Reference App)

This is the first product-shaped FastScript reference app built on `examples/startup-mvp`.

It is also the first official FastScript greenfield product baseline. The stable CLI/template id stays `startup-mvp`, while the public product name is **Team Dashboard SaaS**.

It proves a normal business SaaS can live inside one FastScript app boundary:

- public marketing page
- authenticated workspace dashboard
- projects and team management flows
- billing and invoice flow
- notification and receipt jobs
- DB-backed workspace state
- Cloudflare-ready deployment path

## What this app exercises

- frontend + backend in `.fs`
- auth/session gating
- workspace/team domain model
- API routes and queue jobs
- billing upgrade flow
- admin/support operational view
- governed compatibility in real product usage

## Core routes

- `/`
- `/sign-in`
- `/dashboard`
- `/dashboard/projects`
- `/dashboard/team`
- `/dashboard/billing`
- `/dashboard/settings`
- `/dashboard/admin`

## Run it

```bash
cd examples/startup-mvp
node ../../src/cli.mjs dev
```

Build and deploy adapter generation:

```bash
node ../../src/cli.mjs build
node ../../src/cli.mjs deploy --target cloudflare
```

## Matrix-backed lanes used here

Check `/docs/support` in the main FastScript site for the governed support matrix behind this app. This reference app intentionally exercises proven lanes across:

- JS/TS in `.fs`
- route loaders and SSR pages
- API modules
- auth middleware
- DB collections and migrations
- queue-backed jobs
- Cloudflare deployment adapter generation

If a valid JS/TS pattern used here fails in `.fs`, that is a FastScript compatibility bug.

Public baseline guide:

- `/docs/team-dashboard-saas`
