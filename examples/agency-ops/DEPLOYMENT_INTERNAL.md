# Agency Ops Internal Deployment Runbook

This runbook is the first real internal deployment path for `examples/agency-ops`.

## Target shape

- custom Node/container runtime
- `DB_DRIVER=postgres`
- `DATABASE_URL`-backed persistence
- built artifact in `dist/`
- production start via `node ../../src/cli.mjs start`

## Required env

- `SESSION_SECRET`
- `NODE_ENV=production`
- `PORT`
- `DB_DRIVER=postgres`
- `DATABASE_URL`
- `AGENCY_OPS_APP_NAME`
- `AGENCY_OPS_SUPPORT_EMAIL`
- `AGENCY_OPS_NOTIFY_FROM`
- `AGENCY_OPS_PRIMARY_REGION`

Use `.env.production.example` as the base.

## First deployment flow

```bash
cd examples/agency-ops
node ../../src/cli.mjs build
DB_DRIVER=postgres DATABASE_URL=postgres://agency_ops:change_me@127.0.0.1:5432/agency_ops node ../../src/cli.mjs db:migrate
NODE_ENV=production PORT=4173 SESSION_SECRET=replace_me DB_DRIVER=postgres DATABASE_URL=postgres://agency_ops:change_me@127.0.0.1:5432/agency_ops node ../../src/cli.mjs start
```

Agency Ops bootstraps seeded agency data on first owner sign-in, so `db:seed` is optional here. Use it only if you later add an explicit `app/db/seed` file.

## What gets deployed

Ship the app with:

- `dist/`
- `app/`
- `src/`
- `package.json`
- lockfile
- installed production dependencies or target-side install step

`dist/fastscript-manifest.json` is the key runtime artifact. The production server reads it at startup.

The practical rule is:

- on Cloudflare, Vercel, or Node adapters, you may also get adapter-specific files
- on custom hosts like AWS, GCP, Oracle, Fly, Render, bare VMs, or containers, the real deployable unit is the app plus `dist/`

## Operator checklist

- Build: `node ../../src/cli.mjs build`
- Migrate: `DB_DRIVER=postgres DATABASE_URL=... node ../../src/cli.mjs db:migrate`
- Seed/bootstrap: owner sign-in bootstraps the first agency automatically if no explicit seed file exists
- Start: `NODE_ENV=production PORT=4173 SESSION_SECRET=... DB_DRIVER=postgres DATABASE_URL=... node ../../src/cli.mjs start`
- Health routes:
  - `/`
  - `/sign-in`
  - `/dashboard`
  - `/dashboard/billing`
  - `/dashboard/ops`
  - `/api/session`
  - `/api/work-items`
  - `/api/billing/reminders`

## Failure mode to expect

If `DB_DRIVER=postgres` is set and Postgres is unavailable or `DATABASE_URL` is missing, FastScript now fails fast instead of silently falling back to file storage. That keeps the deployment contract honest.

## Smoke checks

After boot, verify:

- `/`
- `/sign-in`
- `/dashboard`
- `/dashboard/billing`
- `/dashboard/ops`
- `/api/session`
- `/api/work-items`
- `/api/billing/reminders`

Then validate the operator-assignment path:

1. create a session
2. open `/dashboard/ops`
3. add a work item
4. assign it to an active operator
5. confirm workload counts update on `/dashboard/team`

Then validate the invoice-reminder path:

1. open `/dashboard/billing`
2. confirm due and overdue invoices are visible
3. queue or resend a reminder for a non-paid invoice
4. confirm reminder history updates on `/dashboard/billing`
5. confirm reminder rows are visible on `/dashboard/ops`

## Notes

- Keep Cloudflare example files in the repo for adapter generation proof, but this runbook is the primary internal deployment contract.
- If this path reveals a FastScript runtime or compatibility gap, add proof or update the support matrix instead of patching around it locally.
