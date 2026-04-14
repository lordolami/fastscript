# FastScript

FastScript is a full-stack framework with a first-class `.fs` language and compiler pipeline.

- Simpler than heavy framework stacks
- Faster build and runtime pipeline
- Compatible with existing JavaScript ecosystem
- `.fs` first, `.js` interoperability always supported
- Canonical repo lock: `github.com/lordolami/fastscript` (`npm run repo:lock`)

## Commands

```bash
npm install
npm run create
npm run dev
npm run start
npm run build
npm run check
npm run migrate
npm run bench
npm run export:js
npm run export:ts
npm run compat
npm run validate
npm run repo:lock
npm run db:migrate
npm run db:seed
npm run smoke:dev
npm run smoke:start
npm run test:core
npm run test:conformance
npm run test:plugins
npm run bench:report
npm run qa:all
npm run worker
npm run deploy:node
npm run deploy:vercel
npm run deploy:cloudflare
npm run release:patch
npm run pack:check
npm run hooks:install
npm run style:generate
npm run style:check
```

- `npm run migrate`: convert `app/pages` files (`.js/.jsx/.ts/.tsx`) to `.fs`
- `npm run bench`: enforce 3G-oriented gzip budgets on built output
- `npm run export:js`: export `.fs` app source to plain `.js` project
- `npm run export:ts`: export `.fs` app source to `.ts` project
- `npm run compat`: run ESM/CJS/FS interop smoke checks
- `npm run db:migrate`: run database migrations from `app/db/migrations` (`.fs`/`.js`)
- `npm run db:seed`: seed database from `app/db/seed.fs`
- `npm run validate`: run full quality gate (check/build/bench/compat/db/export)
- `npm run smoke:dev`: automated SSR/API/auth/middleware smoke test
- `npm run smoke:start`: production `fastscript start` smoke test
- `npm run test:core`: core platform/unit/integration suite
- `npm run test:conformance`: language parser/codegen/diagnostic snapshot suite
- `npm run test:plugins`: plugin hook + middleware integration tests
- `npm run bench:report`: writes benchmark report to `benchmarks/latest-report.md`
- `npm run qa:all`: full quality sweep in one command
- `npm run worker`: run queue worker runtime
- `npm run deploy:*`: generate deploy adapters for node/vercel/cloudflare
- `npm run release:*`: semver bump + changelog append
- `npm run pack:check`: npm publish dry-run
- `npm run hooks:install`: configure local git hooks (`pre-push` runs `qa:all`)
- `npm run style:generate`: generate token utilities (`app/styles.generated.css`)
- `npm run style:check`: validate class/token constraints

## Additional Docs

- `spec/LANGUAGE_V1_SPEC.md`
- `docs/GOVERNANCE_VERSIONING_POLICY.md`
- `docs/LANGUAGE_V1_MIGRATION.md`
- `docs/COMPILER_ERROR_CODES.md`
- `docs/AI_CONTEXT_PACK_V1.md`
- `docs/PLUGIN_API_CONTRACT.md`
- `docs/INCIDENT_PLAYBOOK.md`
- `docs/DEPLOY_GUIDE.md`
- `docs/SUPPORT_MATRIX.md`
- `docs/RELEASE_PROCESS.md`
- `docs/TROUBLESHOOTING.md`
- `docs/ARCHITECTURE_OVERVIEW.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/CONTRIBUTING.md`
- `docs/RELEASE_SCOPE_V1.md`
- `docs/RELEASE_SIGNOFF_TEMPLATE.md`
- `docs/OBSERVABILITY.md`
- `docs/ROLLOUT_GUIDE.md`
- `spec/MASTER_TODO.md`

## Project layout

```txt
app/
  pages/
    _layout.fs
    index.fs
    404.fs
  api/
    hello.fs
    auth.fs
  db/
    migrations/
      001_init.fs
    seed.fs
  middleware.fs
  styles.css
```

## Page contract

- `export default function Page(ctx) { return htmlString }`
- Optional `export async function load(ctx) { return data }`
- Optional method actions in page files: `POST/PUT/PATCH/DELETE`
- `.fs` supports FastScript declarations such as `~name = value`, `state name = value`, and `fn name(...)`
- Optional `export function hydrate({ root, ...ctx })` for client hydration

## Routing

- `app/pages/index.fs` or `index.js` -> `/`
- `app/pages/blog/index.fs` or `index.js` -> `/blog`
- `app/pages/blog/[slug].fs` or `[slug].js` -> `/blog/:slug`
- `app/pages/docs/[...slug].fs` -> `/docs/:slug*`
- `app/pages/[[...slug]].fs` -> `/docs/:slug*?`
- `app/pages/blog/[id:int].fs` -> `/blog/:id` with typed params in generated route types
- `app/pages/404.fs` or `404.js` -> not found view
- `app/pages/_layout.fs` or `_layout.js` -> global layout wrapper

## Language Baseline

Language v1 syntax, semantics, diagnostics contract, and compatibility guarantees are specified in `spec/LANGUAGE_V1_SPEC.md`.
