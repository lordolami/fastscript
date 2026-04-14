# FastScript Rollout Guide

## Staged Rollout (No Hosted CI Mode)
1. Run local gate:
- `npm run qa:all`
- `npm run pack:check`
2. Build production artifact:
- `npm run build`
3. Deploy to staging environment.
4. Run smoke on staging:
- `npm run smoke:start`
5. Promote to production in controlled window.

## Canary Strategy
- Route a small percentage of traffic to new release.
- Monitor:
- 5xx rate
- request latency
- dead-letter queue growth
- rollback trigger thresholds from `docs/OBSERVABILITY.md`.

## Rollback
- Keep previous artifact.
- Re-point process manager to previous artifact.
- Re-run smoke and health checks.
