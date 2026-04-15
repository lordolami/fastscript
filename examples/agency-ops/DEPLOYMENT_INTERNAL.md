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
DB_DRIVER=postgres DATABASE_URL=postgres://agency_ops:change_me@127.0.0.1:5432/agency_ops node ../../src/cli.mjs db:seed
NODE_ENV=production PORT=4173 SESSION_SECRET=replace_me DB_DRIVER=postgres DATABASE_URL=postgres://agency_ops:change_me@127.0.0.1:5432/agency_ops node ../../src/cli.mjs start
```

## What gets deployed

Ship the app with:

- `dist/`
- `app/`
- `src/`
- `package.json`
- lockfile
- installed production dependencies or target-side install step

`dist/fastscript-manifest.json` is the key runtime artifact. The production server reads it at startup.

## Smoke checks

After boot, verify:

- `/`
- `/sign-in`
- `/dashboard`
- `/dashboard/ops`
- `/api/session`
- `/api/work-items`

Then validate the operator-assignment path:

1. create a session
2. open `/dashboard/ops`
3. add a work item
4. assign it to an active operator
5. confirm workload counts update on `/dashboard/team`

## Notes

- Keep Cloudflare example files in the repo for adapter generation proof, but this runbook is the primary internal deployment contract.
- If this path reveals a FastScript runtime or compatibility gap, add proof or update the support matrix instead of patching around it locally.
