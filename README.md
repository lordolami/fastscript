# FastScript

FastScript is the structured substrate for AI-system workflows.

It already owns a complete full-stack TypeScript platform underneath that thesis: `.fs` as the runtime-native source surface, one compiler and runtime contract, pages, APIs, jobs, validation, security posture, and deploy-ready output in the same system.

## Current contract

- Write ordinary JS, TS, JSX, and TSX in `.fs`
- Build pages, APIs, middleware, migrations, seeds, jobs, and workers in one project
- Keep npm ecosystem compatibility and incremental migration paths
- Use one quality gate for formatting, linting, typecheck, validation, tests, smoke checks, benchmarks, and proof artifacts
- Start new apps with secure-by-default permissions policy and validator-backed security readiness
- Deploy the same app to Node, Vercel, or Cloudflare
- Inspect the permanent platform console under `/platform` for datasets, training, experiments, runs, evals, readiness, proof packs, models, deployments, workspaces, and grounded commands
- Learn the platform through a builders course at `/learn`
- Benefit from a structured FastScript language/runtime layer that stays better aligned for machine reasoning, validation, and future model-training workflows without forcing a new day-to-day coding style

## Why this positioning changed

Current AI tooling is still fragmented. Teams glue together product delivery, proof, evaluation, deploy logic, and future training-adjacent workflows from separate systems, then try to reason about them as one stack.

FastScript now leads with the larger claim:

- FastScript is the structured substrate for AI-system workflows
- the full-stack TypeScript platform is the proof that this is already credible

Core product pillars already exercised in the repo include:

- app creation and templates
- auth and session flows
- teams, workspaces, and permissions patterns
- migrations, seeds, and rollback support
- jobs, queues, dead-letter replay, and scheduling
- notifications, billing workflows, and webhook handling
- admin and operator product surfaces
- release-proof validation and compatibility artifacts
- security-readiness validation, explicit permissions policy, and secure deploy baseline
- deploy adapters and runtime observability

## Platform console

FastScript now exposes its public platform universe at `/platform`:

- datasets and lineage
- training jobs and checkpoints
- experiments and runs
- eval suites and results
- readiness assessments and proof packs
- specialization, adapters, and synthetic data
- models and deployments
- workspaces, audit, incidents, costs, and grounded commands

## Reference proof apps

FastScript keeps two visible product-shaped references, but they are proof surfaces for the main product, not separate public products:

1. `startup-mvp`
- the greenfield SaaS reference app
- proves auth, teams, roles, migrations, seeds, billing, notifications, admin, tests, deploy, and observability
- docs: `/docs/team-dashboard-saas`

2. `agency-ops`
- the operational proving-ground app
- proves ordinary TypeScript inside `.fs`, authenticated dashboards, assignments, jobs, billing reminders, and deploy/runtime discipline
- docs: `/docs/agency-ops`

## Why `.fs` exists

`.fs` is not a demand that developers stop writing TypeScript.

It is FastScript's runtime-native source container.
That means:

- teams keep familiar TS and JS habits
- FastScript can provide stronger full-stack structure and proof discipline
- the platform can still evolve its own structured language/runtime layer for compiler accuracy, validation, and machine reasoning advantages

## Install

```bash
npm install -g fastscript
fastscript --help
```

## Quick start

```bash
fastscript create my-app
cd my-app
npm install
npm run dev
```

Reference templates:

```bash
fastscript create startup-mvp --template startup-mvp
fastscript create fullstack --template fullstack
```

## Daily workflow

```bash
npm run dev
npm run build
npm run qa:all
npm run deploy:cloudflare
```

## Key commands

### App lifecycle

```bash
npm run dev
npm run start
npm run build
npm run build:ssg
npm run create
npm run validate
```

### Migration and language tooling

```bash
npm run migrate
npm run migrate:rollback
npm run convert
npm run compat
npm run typecheck
npm run lint:fs
npm run diagnostics
npm run permissions
npm run format
```

### Data and jobs

```bash
npm run db:migrate
npm run db:seed
npm run db:rollback
npm run worker
npm run worker:replay-dead-letter
```

### Quality and release

```bash
npm run test:core
npm run qa:gate
npm run qa:all
npm run docs:index
npm run docs:api-ref
npm run pack:check
```

## Learn and docs

Public proof surfaces:

- `/platform` - permanent platform console for the full universe
- `/learn` - builder-first FastScript course
- `/docs` - documentation entrypoint
- `/docs/latest` - current v5.0 platform track
- `/docs/support` - governed support matrix
- `/benchmarks` - proof-backed performance and artifact trail
- `/showcase` - visible project and reference-app surface

## Deploy targets

FastScript currently ships deploy adapters for:

- Node
- Vercel
- Cloudflare

## License and protection

FastScript is source-available, not permissively open source.

You can evaluate the repository and build with the published package under the repository license, but you cannot use this code to train, fine-tune, evaluate, or improve a competing AI or platform product without written permission.

That protection exists because the FastScript language/runtime layer is part of the wider platform moat.

## Canonical repo

```bash
npm run repo:lock
```

Repo lock: `github.com/lordolami/fastscript`
