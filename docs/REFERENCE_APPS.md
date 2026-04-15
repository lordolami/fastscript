# FastScript Reference Apps

These are first-party product and infrastructure references used to validate the active FastScript 3.0.x contract in real app shapes.

1. Language website (`app/pages/*`)
- Exercises routing, docs search API, blog dynamic route, SSR hydration, compatibility storytelling, and deploy adapters.

2. Fullstack template (`npm run create:fullstack`)
- Exercises auth, middleware, API routes, DB/storage helpers, queue/webhook primitives, and incremental app bootstrap.

3. Team dashboard SaaS reference (`npm run create:startup-mvp`)
- Exercises public marketing pages, authenticated workspaces, projects, team invites, billing upgrades, background jobs, admin/support flows, Cloudflare-ready deployment, and governed compatibility in a real SaaS shape.
- This is the first official FastScript greenfield product baseline. Public guide: `/docs/team-dashboard-saas`

4. Agency Ops proving-ground app (`examples/agency-ops`)
- Exercises strict ordinary TypeScript inside `.fs`, client-ops routes, billing, follow-up jobs, Cloudflare-ready deploy generation, and app-specific build/runtime speed proof.
- Public guide: `/docs/agency-ops`
- Latest measured proof: 895.79ms cold build, 1065.45ms warm-build p95 trimmed, 37.35ms dashboard response, 22.41ms session bootstrap

Validation evidence:
- `npm run smoke:dev`
- `npm run smoke:start`
- `npm run test:runtime-contract`
- `npm run test:deploy-adapters`
- `npm run test:startup-mvp-saas`
- `npm run test:agency-ops`
