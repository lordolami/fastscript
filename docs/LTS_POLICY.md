# FastScript LTS Policy

## Versioning Tracks
- `current`: newest stable feature line
- `lts`: long-term supported line after 1.0 stabilization

## LTS Commitments
- Security fixes and critical reliability patches only
- No breaking syntax/runtime changes inside an LTS major line
- Backports must include test evidence and migration notes

## Support Windows
- Current line: active feature development
- LTS line: 18 months from LTS designation
- Overlap window: 3 months when next LTS is introduced

## Backport Rules
1. Patch must already pass on current line
2. No schema/runtime contract break in LTS
3. Include explicit changelog annotation `[LTS backport]`
4. Include rollback procedure in release notes

## End-of-Life
- EOL notice published at least 90 days in advance
- Final EOL patch includes migration checklist to next supported line

## Governance Links
- Semver + RFC: `docs/GOVERNANCE_VERSIONING_POLICY.md`
- Release mechanics: `docs/RELEASE_PROCESS.md`
- 1.0 readiness matrix: `docs/V1_FOREVER_READINESS.md`
