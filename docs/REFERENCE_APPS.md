# FastScript Reference Apps

These are first-party production-reference applications used to validate 1.0 behavior.

1. Language website (`app/pages/*`)
- Exercises routing, docs search API, blog dynamic route, SSR hydration, deploy adapters.

2. Fullstack template (`npm run create:fullstack`)
- Exercises auth, middleware, API routes, DB/storage helpers, queue/webhook primitives.

3. Startup MVP template (`npm run create:startup-mvp`)
- Exercises app bootstrap, migration path, deploy workflow, and quality gate pipeline.

Validation evidence:
- `npm run smoke:dev`
- `npm run smoke:start`
- `npm run test:runtime-contract`
- `npm run test:deploy-adapters`
