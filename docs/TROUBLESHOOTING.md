# FastScript Troubleshooting

## `Missing SESSION_SECRET in production`
- Set `SESSION_SECRET` before `npm run start`.
- `smoke:start` injects a local test secret automatically.

## `Style validation failed`
- Add class names to `app/design/class-allowlist.json` or use `u-*` utility classes.
- Replace raw hex values in `app/styles.css` with token variables (`var(--fs-color-*)`).

## `db migrate` keeps running old migrations
- Applied migration ledger is in `.fastscript/migrations.json`.
- Remove ledger entries only when intentionally re-running migrations.

## Plugin not loading
- Ensure plugin file is one of:
- `fastscript.plugins.{fs,js,mjs,cjs}`
- `app/plugins.{fs,js,mjs,cjs}`
- Ensure `apiVersion: 1`.
