# Agency Ops SaaS Guide

Agency Ops is the strict-TypeScript proving-ground app built from the public `startup-mvp` baseline.

It exists to show developers something very specific: you can keep writing ordinary TypeScript inside `.fs`, keep pages, APIs, jobs, middleware, and state in one runtime boundary, and still ship a product-shaped app with governed compatibility proof.

Use it when you want:

- a greenfield agency or client-ops SaaS
- an internal service-delivery dashboard
- a retainers, billing, and follow-up workflow app
- a small-team admin product with notifications and invoice trails

## What it proves

- strict ordinary TypeScript in `.fs`
- public marketing routes plus authenticated dashboard routes
- session bootstrap and auth gating
- client and engagement CRUD
- team invite flow
- billing and invoice flow
- queue-backed notification and receipt jobs
- Cloudflare-ready adapter generation

## How to use it

1. Copy or fork `examples/agency-ops`
2. Rename the domain language for your own product
3. Keep pages, APIs, jobs, DB state, and middleware in one FastScript app boundary
4. Check `/docs/support` before extending into new framework/runtime territory
5. Run `npm run test:agency-ops`, `npm run validate`, and then your full QA flow before shipping

## Architecture map

- Pages: UI routes and server-rendered screens
- APIs: session, billing, data mutation, and workflow actions
- Jobs: async receipts and follow-up notifications
- DB: seed data and collection-backed product state
- Middleware: auth/session guardrails
- Deploy: Cloudflare adapter generation path

## Performance evidence

Agency Ops is measured explicitly in the benchmark and runtime proof pipeline. The public proof pack and benchmark artifacts record:

- corpus build timings for `examples/agency-ops`
- runtime response timing snapshots for `/`, `/dashboard`, `/dashboard/clients`, and `/api/session`

If those numbers regress, the app should not be used as a speed claim without rerunning the proof.

## Product contract

`startup-mvp` remains the official public starter.

Agency Ops is a documented proving-ground app built from that baseline. It does not redefine the FastScript contract. It consumes the same support matrix and the same rule: if valid JS/TS fails in `.fs`, that is a compatibility bug.
