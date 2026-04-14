# FastScript AI Context Pack v1

## Core Contracts
- `.fs` primary, `.js` compatible.
- Route pages live in `app/pages`.
- API routes live in `app/api`.
- Optional `app/middleware.fs` for global middleware.
- Optional `load(ctx)` and HTTP methods (`GET/POST/PUT/PATCH/DELETE`).

## Validation
- Use `ctx.input.validateBody(schema)` and `ctx.input.validateQuery(schema)`.
- Use `schemas` export in route modules to auto-enforce request shape.

## Runtime
- SSR + hydration (`export function hydrate({ root })`).
- Queue available via `ctx.queue`.
- DB available via `ctx.db`.
- Auth available via `ctx.auth`.
- Plugin hooks are supported via `fastscript.plugins.*` or `app/plugins.*`.
- Security defaults include headers, rate limit, and CSRF (can be tuned by env).

## Styling Guardrails
- Tokens live in `app/design/tokens.json`.
- Allowed non-utility classes live in `app/design/class-allowlist.json`.
- Utility classes are `u-*` and generated in `app/styles.generated.css`.
- Raw hex values in `app/styles.css` are blocked by style validation.

## Quality Gates
- `npm run validate`
- `npm run test:core`
- `npm run smoke:dev`
- `npm run smoke:start`
- `npm run qa:all`
