# FastScript Reference Apps

These are the two canonical product-shaped proof apps for the active FastScript v4 contract, plus the website surface that documents them.

1. Language website (`app/pages/*`)
- Exercises routing, docs search API, blog dynamic route, SSR hydration, release storytelling, `/learn`, and deploy adapters.
- Serves as the public proof surface for the FastScript platform itself.

2. Greenfield SaaS reference (`npm run create:startup-mvp`)
- Exercises public marketing pages, authenticated workspaces, billing, jobs, roles, admin and support flows, DB state, notifications, and Cloudflare-ready deployment.
- Exercises security-readiness validation, explicit permissions policy, CSRF/session behavior, and signed webhook verification.
- This is the canonical greenfield proof app.
- Public guide: `/docs/team-dashboard-saas`

3. Agency Ops proving-ground app (`examples/agency-ops`)
- Exercises ordinary TypeScript inside `.fs`, authenticated dashboards, assignments, billing reminders, jobs, follow-up notifications, and runtime-safe deploy generation.
- Exercises security-readiness validation, explicit permissions policy, CSRF/session behavior, and signed webhook verification.
- This is the canonical ops and agency proof app.
- Public guide: `/docs/agency-ops`

Validation evidence:
- `npm run smoke:dev`
- `npm run smoke:start`
- `npm run test:runtime-contract`
- `npm run test:deploy-adapters`
- `npm run test:startup-mvp-saas`
- `npm run test:agency-ops`
- `npm run security:report`
