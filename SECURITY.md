# Security Policy

## Supported Versions
- Active stable: `0.1.x`
- Security patches: latest patch on active stable line
- Planned LTS line: `1.0.x` (policy in `docs/LTS_POLICY.md`)

## Reporting a Vulnerability
Report privately to maintainers before public disclosure:
- Email: `security@lakesbim.com`
- Backup: open a private advisory through GitHub Security Advisories.

Please include:
1. Affected version(s)
2. Repro steps / PoC
3. Impact assessment
4. Suggested mitigation if available

## Disclosure Timeline
- Acknowledge report: within 24 hours
- Triage + severity assignment: within 72 hours
- Fix target:
  - Critical: 24-72 hours
  - High: 7 days
  - Medium: 30 days
  - Low: next scheduled patch

## Severity Model
- Critical: RCE, auth bypass, broad data exposure
- High: privilege escalation, signature bypass, SSRF with impact
- Medium: scoped data leakage, hardened-path bypass
- Low: defense-in-depth gaps with limited exploitability

## Coordinated Disclosure
- We prefer coordinated disclosure after patch release.
- Advisory includes: affected range, fixed version, migration notes, and rollback guidance.

## Security Baseline Controls
- Secure headers in deploy adapters (`vercel.json`)
- Session/auth primitives with rotation and revocation support
- Webhook signature verification + replay protection
- Backup/restore/verify scripts and retention sweeps

## References
- Threat model: `docs/THREAT_MODEL.md`
- Incident handling: `docs/INCIDENT_PLAYBOOK.md`
- Release process: `docs/RELEASE_PROCESS.md`
