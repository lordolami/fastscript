# FastScript Threat Model

## Assets
- Source code (`.fs`, JS modules)
- Build output (`dist/` artifacts, manifests, source maps)
- Runtime data (`.fastscript` DB/session/job/state files)
- Secrets and environment values
- User/session identifiers and request payloads

## Trust Boundaries
1. Browser <-> runtime (HTTP boundary)
2. Runtime <-> database/storage/queue/webhook providers
3. CI/CD and release artifact boundary
4. Plugin and dependency boundary

## Primary Threat Categories
1. Input abuse: oversized bodies, malformed payloads, injection attempts
2. Auth/session abuse: fixation, replay, weak secret rotation
3. Webhook abuse: unsigned requests, replayed events
4. Supply chain risk: compromised dependency/plugin
5. Artifact tampering: non-deterministic/replaced build outputs
6. Config leaks: server secrets exposed to client runtime

## Mitigations (Current)
- Validation layer + schema checks for server inputs
- Route guards and middleware controls
- Webhook signature and replay defenses
- Structured logging, request IDs, and diagnostics
- Backup/restore verification and rollback drills
- Interop and conformance test gates before merge
- Release merge gate with vulnerability audit

## Residual Risks
- Misconfigured production environments
- Third-party service outages and API behavior drift
- Insider and token compromise scenarios

## Required Operational Controls
- Enforce `qa:gate` before merge/push
- Enforce `qa:all` before releases
- Rotate secrets on incident or scheduled cadence
- Keep vulnerability advisory channel active

## Validation Artifacts
- `scripts/test-security-baseline.mjs`
- `scripts/test-deploy-adapters.mjs`
- `scripts/backup-verify.mjs`
- `scripts/release-merge-gate.mjs`
