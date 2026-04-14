# FastScript Incident Playbook

## Severity Levels
- P0: active outage, data loss, auth bypass, or critical security exploit
- P1: severe degradation with user-facing impact
- P2: partial degradation/workaround exists
- P3: non-critical defect

## On-Call Response
1. Acknowledge incident and open timeline log.
2. Assign incident commander + owner.
3. Freeze non-incident deploys.
4. Classify severity and blast radius.

## Immediate Containment
- Roll back to last known good artifact (`npm run rollback:drill` process)
- Disable high-risk integrations (webhooks/jobs) if needed
- Rotate `SESSION_SECRET` and any impacted credentials
- Rate-limit abusive paths and block malicious signatures

## Recovery Workflow
1. Restore service baseline.
2. Run `npm run smoke:start` and key API smoke checks.
3. Validate metrics (`/__metrics`) and 5xx/latency trend.
4. Re-enable paused subsystems in stages.

## Evidence and Communication
- Record all commands, versions, and timestamps.
- Publish status updates with ETA and mitigation steps.
- Create post-incident report within 48 hours.

## Postmortem Requirements
- Root cause
- Contributing factors
- User impact timeline
- Corrective actions with owners/dates
- Verification test additions

## Operational Commands
- Backup now: `npm run backup:create`
- Verify backup: `npm run backup:verify`
- Restore backup: `npm run backup:restore -- --from <path>`
- Replay dead-letter jobs: `npm run worker:replay-dead-letter`
