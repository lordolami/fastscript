# FastScript

FastScript is a proprietary, source-available JavaScript-first full-stack runtime built around a first-class `.fs` file format.

It is designed to feel easier to read than heavyweight stack combinations while staying compatible with the JavaScript ecosystem developers already use.

- Write normal JavaScript or TypeScript in `.fs`
- Write pages, APIs, middleware, jobs, and database workflows in `.fs`
- Keep compatibility with normal `.js` packages and modules
- Treat FastScript-specific syntax as optional sugar, not a requirement
- Govern compatibility claims through a source-of-truth support matrix
- Compile to optimized JavaScript for production deployment
- Deploy the same app to Node, Vercel, or Cloudflare
- Run one quality gate for formatting, linting, typecheck, tests, smoke checks, benchmarks, and interop
- Build on the same language/runtime foundation that powers the future FastScript AI coding products

FastScript v3 is built for product teams that want a simpler, faster full-stack pipeline without surrendering compatibility with the ground-level JavaScript platform.

The v3 product contract is simple:

- `.fs` is a universal JS/TS container for the FastScript runtime
- FastScript-specific syntax is optional sugar
- valid JS/TS failures in `.fs` are FastScript compatibility bugs
- the speed story is earned by the runtime/compiler/toolchain and backed by release proof artifacts

## What FastScript Is

FastScript combines:

1. A JS/TS-compatible source container: `.fs`
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
- Interop matrix: `17/17` passing
- Current website deploy target: Node, Vercel, and Cloudflare adapters supported
- Governed `.fs` parity corpus: `18` passing checks across JS/TS, Next-style, React, Node, and Vue patterns

See:

- `benchmarks/latest-report.md`
- `benchmarks/suite-latest.json`
- `benchmarks/interop-latest.json`
- `docs/PROOF_PACK.md`

## Why Teams Pick FastScript

- Smaller client payloads than heavier framework baselines
- Faster build loops and stricter release gates in one toolchain
- One runtime-native source container for pages, APIs, jobs, and middleware
- Package compatibility without giving up a proprietary language/runtime moat
- A direct path into the next FastScript AI assistant stack

## Why Developers Choose FastScript

FastScript is built for developers who want one system instead of a pile of cooperating tools.

- Write ordinary TS/JS/JSX/TSX in `.fs`
- Use the same runtime for frontend pages, backend APIs, middleware, jobs, and workers
- Keep npm packages and ecosystem code while migrating incrementally
- See exactly what is `proven`, `partial`, `planned`, or `blocked` in the governed support matrix
- Convert existing route-based codebases safely with dry-run previews, diff artifacts, validation, and rollback
- Ship through Node, Vercel, or Cloudflare deploy adapters without rebuilding your app around each target

The strongest public developer guide lives at `/why-fastscript`, and the compatibility lane for edge cases lives at:

- `https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml`

The canonical real-world adoption flow for greenfield apps and incremental migration lives at:

- `/docs/adoption`

The first official greenfield product baseline lives at:

- `/docs/team-dashboard-saas`

The strict-TypeScript proving-ground guide for developers who want the cleanest "only the filename changes" demo lives at:

- `/docs/agency-ops`

## Install

### Option 1: npm install

```bash
npm install -g fastscript
fastscript --help
```

The published npm package is generated as a self-contained release bundle, so the CLI works without a second private npm package.

### Option 2: local repo workflow

```bash
git clone https://github.com/lordolami/fastscript.git
cd fastscript
npm install
```

### Option 3: global CLI link for daily use

```bash
git clone https://github.com/lordolami/fastscript.git
cd fastscript
npm install
npm link
fastscript --help
```

This gives you a global `fastscript` command backed by your local clone.

The source repos remain split for development, but npm users get a clean self-contained public package.

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

`startup-mvp` is the stable template id for the Team Dashboard SaaS reference app, which is now the first official FastScript greenfield product baseline.

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

## Real-World Adoption

Use this rule before starting product work:

1. Check `/docs/support` for the framework, runtime, and syntax lanes you depend on.
2. Use `/docs/adoption` for the canonical path:
   - greenfield `.fs` app via `fastscript create`
   - incremental migration from existing TS/JS via `npm run migrate -- app --dry-run`
3. Prefer the Team Dashboard SaaS baseline when you want the strongest product-shaped starting point:
   - `fastscript create startup-mvp --template startup-mvp`
   - reference guide at `/docs/team-dashboard-saas`
4. Use Agency Ops when you want a public strict-TypeScript proving-ground app that shows pages, APIs, jobs, billing, and deploy flow without FastScript-only syntax:
   - source: `examples/agency-ops`
   - guide: `/docs/agency-ops`
5. Treat any valid JS/TS failure in `.fs` as a compatibility bug and report it through the public compatibility lane.

FastScript 3.0.2 is the first real-world adoption line. The public product contract stays anchored to the support matrix, proof pack, and release-blocking compatibility checks.

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

## Migration Story

FastScript is meant to meet existing teams where they are:

1. keep your current TS/JS modules
2. run `npm run migrate -- <path> --dry-run`
3. inspect `diff-preview.json`, manifests, validation, and fidelity output
4. convert route-by-route into `.fs`
5. preserve CSS, assets, and existing libraries
6. keep authoring normal TS/JS directly in `.fs` after conversion

If valid JS/TS or a real framework pattern fails in `.fs`, that is a FastScript compatibility gap and should be reported through the public compatibility issue lane.

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
npm run convert
npm run migrate:rollback
npm run manifest
npm run wizard:migrate
npm run export:js
npm run export:ts
npm run compat
npm run typecheck
npm run typecheck:pass
npm run lint:fs
npm run lint:fs:pass
npm run diagnostics
npm run permissions
npm run format
npm run format:check
```

`migrate` now runs strict compatibility-first conversion (rename-only + import extension rewrites + manifest/validation/fidelity reports).  
Example: `npm run migrate -- app --dry-run`  
Full proof mode: `npm run migrate -- app --fidelity-level full --fail-on-unproven-fidelity`

Latest trust artifacts are written to `.fastscript/conversion/latest`:
`conversion-manifest.json`, `diff-preview.json`, `validation-report.json`, `fidelity-report.json`.

Authored `.fs` now accepts normal JS/TS/JSX/TSX-style code directly. Proof artifacts for the current parity contract are written to `.fastscript/proofs/js-ts-syntax-proof.json` and `.fastscript/proofs/fs-parity-matrix.json`.
The governed compatibility registry and generated support matrix live in `spec/compatibility-registry.json` and `docs/SUPPORT_MATRIX.md`.

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
npm run bench:discipline
npm run regression
npm run profile
npm run trace
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

- public marketing page
- authenticated workspace dashboard
- projects, team, billing, settings, and admin routes
- migrations plus queue-backed receipt/notification jobs

### `examples/agency-ops`
A strict-TypeScript proving-ground app with:

- public marketing page
- authenticated agency dashboard
- clients, team, billing, settings, and ops routes
- queue-backed receipts and notification follow-up
- Cloudflare-ready deploy adapter generation
- a dedicated app proof via `npm run test:agency-ops`

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
- `docs/RUNTIME_PERMISSIONS.md`
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



