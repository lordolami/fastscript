# FastScript

FastScript is a JavaScript-first full-stack language runtime built around a first-class `.fs` file format.

It is designed to feel easier to read than heavyweight stack combinations while staying compatible with the JavaScript ecosystem developers already use.

- Write pages, APIs, middleware, jobs, and database workflows in `.fs`
- Keep compatibility with normal `.js` packages and modules
- Compile to optimized JavaScript for production deployment
- Deploy the same app to Node, Vercel, or Cloudflare
- Run one quality gate for formatting, linting, typecheck, tests, smoke checks, benchmarks, and interop

FastScript v2.0 is built for product teams that want a simpler, faster full-stack pipeline without surrendering compatibility with the ground-level JavaScript platform.

## What FastScript Is

FastScript combines:

1. A source language: `.fs`
2. A compiler and CLI
3. A full-stack app runtime
4. A deployment pipeline for multiple targets
5. A bridge back to standard JavaScript and TypeScript export paths

That means a single project can contain:

- UI pages
- API handlers
- middleware
- database migrations
- seed scripts
- jobs and workers
- deploy adapters

## Core Positioning

FastScript is built to be:

- Simpler than stacking TypeScript + framework + glue code everywhere
- Faster to build and ship than heavier pipeline combinations
- Compatible with existing JavaScript libraries
- Friendly to AI-assisted generation because the language surface is smaller and more regular
- Easy to migrate into and easy to export back out

## Current Measured Numbers

These are the real measured numbers from the current repo benchmark report:

- Build time: `702.98ms`
- JS first-load gzip: `2.71KB`
- Routes in benchmark app: `16`
- API routes in benchmark app: `5`
- Interop matrix: `13/13` passing
- Current website deploy target: Node, Vercel, and Cloudflare adapters supported

See:

- `benchmarks/latest-report.md`
- `benchmarks/suite-latest.json`
- `benchmarks/interop-latest.json`

## Install

FastScript v2.0 currently ships as a repo-first toolchain while the protected core remains split from the public shell.

### Option 1: local repo workflow

```bash
git clone https://github.com/lordolami/fastscript.git
cd fastscript
npm install
```

### Option 2: global CLI link for daily use

```bash
git clone https://github.com/lordolami/fastscript.git
cd fastscript
npm install
npm link
fastscript --help
```

This gives you a global `fastscript` command backed by your local clone.

Public npm packaging is not the default install path yet because the protected core is still split from the public repo. The public release surface is frozen and documented; the npm publish model is the remaining packaging step.

To use the CLI directly during development:

```bash
node ./src/cli.mjs --help
```

If you publish or link the package locally, the command is:

```bash
fastscript
```

## Quick Start

### Create a project

```bash
npm run create
```

Or use one of the included templates:

```bash
npm run create:fullstack
npm run create:startup-mvp
```

### Run locally

```bash
npm run dev
```

### Link the CLI globally from your clone

```bash
npm link
fastscript create my-app
```

### Build for production

```bash
npm run build
```

### Start the production build

```bash
npm run start
```

### Run the full quality gate

```bash
npm run qa:all
```

## The `.fs` Language At A Glance

FastScript keeps normal JavaScript module structure and adds a few core forms:

- `fn` for functions
- `state` for named stateful declarations
- `~name = ...` for lightweight reactive-style declarations
- type syntax that can be stripped at compile time
- file conventions for pages, APIs, and runtime hooks

### Example: basic page

```fs
export default fn Page() {
  state title = "FastScript"
  ~subtitle = "Write once. Ship anywhere."

  return `
    <section>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </section>
  `
}
```

### Example: load data for a page

```fs
export async fn load(ctx) {
  const user = await ctx.db.get("users", ctx.params.id)
  if (!user) return { notFound: true }
  return { user }
}

export default fn Page({ user }) {
  return `<h1>${user.name}</h1>`
}
```

### Example: API route

```fs
export const schemas = {
  POST: { sku: "string", qty: "int" }
}

export async fn POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST)
  const order = { id: Date.now().toString(36), ...body }
  ctx.db.collection("orders").set(order.id, order)
  ctx.queue.enqueue("send-order-email", { orderId: order.id })
  return ctx.helpers.json({ ok: true, order })
}
```

### Example: middleware

```fs
export async fn middleware(ctx, next) {
  ctx.state.requestStartedAt = Date.now()

  if (ctx.url.pathname.startsWith("/private") && !ctx.session?.user) {
    return ctx.helpers.redirect("/")
  }

  return next()
}
```

### Example: hydration hook for client behavior

```fs
export function hydrate({ root }) {
  const button = root.querySelector("[data-action]")
  if (!button) return

  button.addEventListener("click", () => {
    console.log("hydrated")
  })
}
```

## Page Contract

A FastScript page can export any of the following:

- `export default fn Page(...)` or `export default function Page(...)`
- `export async fn load(ctx)` for server-side data loading
- `export function hydrate({ root, ...ctx })` for client behavior
- HTTP method handlers like `POST`, `PUT`, `PATCH`, `DELETE`

### Minimal page

```fs
export default fn Page() {
  return `<h1>Hello</h1>`
}
```

### Page with loader

```fs
export async fn load(ctx) {
  return { now: new Date().toISOString() }
}

export default fn Page({ now }) {
  return `<p>${now}</p>`
}
```

## Routing

FastScript uses file-based routing under `app/pages`.

### Route examples

- `app/pages/index.fs` -> `/`
- `app/pages/blog/index.fs` -> `/blog`
- `app/pages/blog/[slug].fs` -> `/blog/:slug`
- `app/pages/docs/[...slug].fs` -> `/docs/:slug*`
- `app/pages/[[...slug]].fs` -> optional catch-all
- `app/pages/blog/[id:int].fs` -> typed param route
- `app/pages/404.fs` -> not-found page
- `app/pages/_layout.fs` -> global layout wrapper

## Full-Stack Surface Area

FastScript currently includes first-party support for:

- pages
- layouts
- API routes
- middleware
- auth/session flows
- database migrations
- database seed scripts
- storage and upload handlers
- jobs and worker runtime
- deploy targets
- benchmark and interop reporting
- docs indexing and API reference generation

## Interop Story

FastScript is designed to sit on top of the JavaScript ecosystem, not replace it with an isolated wall.

### What works

- normal `.js` dependencies
- ESM/CJS compatibility checks
- export from `.fs` to `.js`
- export from `.fs` to `.ts`
- migration tooling from page-based JS/TS apps into `.fs`

### Why that matters

Developers should be able to:

1. migrate into FastScript without rewriting the whole world
2. use existing libraries
3. export back out when needed
4. keep real production optionality

## Commands

### Main app lifecycle

```bash
npm run dev
npm run start
npm run build
npm run build:ssg
npm run create
npm run check
npm run validate
```

### Language and migration

```bash
npm run migrate
npm run wizard:migrate
npm run export:js
npm run export:ts
npm run compat
npm run typecheck
npm run typecheck:pass
npm run lint:fs
npm run lint:fs:pass
npm run format
npm run format:check
```

### Database and data

```bash
npm run db:migrate
npm run db:seed
npm run db:rollback
```

### Deploy and runtime

```bash
npm run deploy:node
npm run deploy:vercel
npm run deploy:cloudflare
npm run worker
npm run worker:replay-dead-letter
```

### Quality and testing

```bash
npm run smoke:dev
npm run smoke:start
npm run test:core
npm run test:conformance
npm run test:plugins
npm run test:routes
npm run test:interop-matrix
npm run test:vscode-language
npm run qa:gate
npm run qa:all
```

### Benchmarks, reports, and ops

```bash
npm run bench
npm run bench:report
npm run benchmark:suite
npm run interop:report
npm run sbom:generate
npm run proof:publish
npm run backup:create
npm run backup:restore
npm run backup:verify
npm run retention:sweep
npm run kpi:track
npm run deploy:zero-downtime
```

### Release and tooling

```bash
npm run release:patch
npm run release:minor
npm run release:major
npm run pack:check
npm run hooks:install
npm run repo:lock
npm run plugins:marketplace-sync
npm run docs:index
npm run docs:api-ref
npm run style:generate
npm run style:check
```

## Recommended Developer Flow

For normal development:

```bash
npm install
npm run dev
```

Before shipping:

```bash
npm run qa:all
```

For deployment:

```bash
npm run deploy:cloudflare
```

Or:

```bash
npm run deploy:node
npm run deploy:vercel
```

## Project Layout

```txt
app/
  api/
    auth.fs
    docs-search.fs
    hello.fs
    upload.fs
    webhook.fs
  db/
    migrations/
      001_init.fs
    seed.fs
  design/
    class-allowlist.json
    tokens.json
  pages/
    _layout.fs
    index.fs
    learn.fs
    examples.fs
    benchmarks.fs
    roadmap.fs
    docs/
      index.fs
      latest.fs
      playground.fs
      search.fs
      v1/
        index.fs
      v1.1/
        index.fs
    blog/
      index.fs
      [slug].fs
  env.schema.fs
  middleware.fs
  styles.css
  styles.generated.css
src/
  cli.mjs
  build.mjs
  server-runtime.mjs
examples/
  fullstack/
  startup-mvp/
spec/
  LANGUAGE_V1_SPEC.md
  MASTER_TODO.md
```

## Example Projects Included

### `examples/fullstack`
A production-style full-stack starter with:

- pages
- API route
- migration
- seed script
- job handler
- layout

### `examples/startup-mvp`
A more startup-shaped example with:

- cart + checkout APIs
- dashboard page
- migrations
- email job flow

## Deploy Targets

FastScript currently has deploy adapters for:

- Node
- Vercel
- Cloudflare

The long-term direction is one language, many targets:

- web
- server
- mobile
- desktop

That roadmap is tracked in:

- `spec/MULTI_TARGET_APP_PLAN.md`
- `app/pages/roadmap.fs`

## Documentation Map

Key docs in this repo:

- `spec/LANGUAGE_V1_SPEC.md`
- `spec/STYLING_V1_SPEC.md`
- `docs/GOVERNANCE_VERSIONING_POLICY.md`
- `docs/LANGUAGE_V1_MIGRATION.md`
- `docs/COMPILER_ERROR_CODES.md`
- `docs/AI_CONTEXT_PACK_V1.md`
- `docs/PLUGIN_API_CONTRACT.md`
- `docs/INCIDENT_PLAYBOOK.md` (public stub; full version lives in private core)
- `docs/DEPLOY_GUIDE.md`
- `docs/SUPPORT_MATRIX.md`
- `docs/RELEASE_PROCESS.md`
- `docs/TROUBLESHOOTING.md`
- `docs/ARCHITECTURE_OVERVIEW.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/CONTRIBUTING.md`
- `docs/OBSERVABILITY.md` (public stub; full version lives in private core)
- `docs/ROLLOUT_GUIDE.md` (public stub; full version lives in private core)
- `SECURITY.md`

## Protection, Licensing, and Commercial Use

FastScript is being built as the core language layer for a larger AI product. Because of that, the repository is not licensed under a permissive open-source license.

What that means in practice:

- you can review the repository and evaluate it internally;
- you cannot commercially use, redistribute, relicense, or build competing products on top of this code without written permission;
- you cannot use this repository to train, fine-tune, improve, or evaluate a commercial AI product without written permission;
- trademark rights in the FastScript name, logo, and branding are reserved.

If you need commercial use, partnership, integration, or platform rights, contact:

- `legal@fastscript.dev`

## Contributing

FastScript is evolving quickly. If you contribute:

1. keep the canonical repo lock intact
2. run `npm run qa:all`
3. keep `.fs` and `.js` interop working
4. avoid unnecessary ecosystem lock-in
5. preserve the language goal: simpler, faster, still grounded in JavaScript

Contribution review does not grant any right to commercially reuse the platform outside the repository license.

## Public/Private Boundary

This public repository is the developer-facing FastScript surface. Sensitive compiler/runtime/platform materials now live in the protected private repository `https://github.com/lordolami/fastscript-core-private`. The public repo consumes private-core modules through bridge files and tracks the boundary in `docs/PRIVATE_CORE_SPLIT.md`.

## Canonical Repo

Canonical repo lock:

`github.com/lordolami/fastscript`

The repo lock script is:

```bash
npm run repo:lock
```

## License

This repository is licensed under the FastScript Source-Available License v1.

See:

- `LICENSE`
- `SECURITY.md`
- `app/pages/license.fs`



