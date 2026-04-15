# FastScript v3.0.2 Final Release Notes

## Summary

FastScript v3.0.2 turns the stable `startup-mvp` template id into the first official FastScript greenfield product baseline.

This release keeps the public contract steady:

- `.fs` is a universal JS/TS container for the FastScript runtime
- support claims are governed by `/docs/support`
- valid JS/TS failures in `.fs` are compatibility bugs
- the Team Dashboard SaaS baseline is the first real product-shaped starting point on the `3.0.x` line

## What shipped

- Team Dashboard SaaS promoted as the public identity of the `startup-mvp` template
- dedicated baseline docs at `/docs/team-dashboard-saas`
- stronger baseline discovery across `/examples`, `/showcase`, `/docs/adoption`, `/docs/latest`, and `README.md`
- reference-app completion across pages, APIs, jobs, middleware, and DB-backed workspace state
- dedicated `test:startup-mvp-saas` proof elevated into the main test flow

## Hardening fixes included

- validator-safe class handling in the dashboard layout
- token-safe example styling that stays inside the style system rules
- CSRF-correct mutation flow in the reference-app proof
- rolling session-cookie handling in authenticated request flows
- proof alignment with the actual FastScript dev/start port behavior

## Product position

FastScript v3.0.2 is still the active public line.

The stable CLI/template surface remains:

- `fastscript create startup-mvp --template startup-mvp`

The public product story is now explicit:

- `startup-mvp` is the Team Dashboard SaaS reference app
- it is the first official FastScript greenfield product baseline
- it is the proving ground for real full-stack FastScript work before the first market-facing product built from it

## Release evidence

- `/docs/team-dashboard-saas`
- `/docs/support`
- `docs/PROOF_PACK.md`
- `.fastscript/proofs/compatibility-registry-report.json`
- `scripts/test-startup-mvp-saas.mjs`
