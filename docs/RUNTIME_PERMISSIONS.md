# Runtime Permissions

FastScript v4.1 treats runtime permissions as part of the production security contract, not as optional hardening trivia.

Default policy path: `fastscript.permissions.json`

Example policy: `fastscript.permissions.example.json`

## What the policy controls

1. file access
2. environment access
3. network access
4. subprocess execution
5. dynamic imports
6. plugin access

## v4.1 security-first posture

- New apps now emit an explicit `fastscript.permissions.json`
- New apps default to the `secure` preset
- Production guidance treats missing explicit policy as a release-readiness failure
- Security readiness reporting uses the same policy as the validator, proof apps, and release flow

## Secure preset

The secure preset is the v4.1 default for new apps and proof apps:

1. deny network access by default
2. deny subprocess execution by default
3. deny plugin access by default
4. allow dynamic import only for local/file/data-url kinds
5. keep env access explicit and reviewable

## CLI

1. Show active policy summary:
`npm run permissions`

2. Generate security-readiness evidence:
`npm run security:report`

3. Validate the full production contract:
`npm run validate`

## Runtime helpers

FastScript exposes permission-aware runtime helpers:

1. `permissionAwareEnvGet(key)`
2. `permissionAwareReadFile(path)`
3. `permissionAwareFetch(url, init)`
4. `permissionAwareSpawn(command, args, options)`
5. `permissionAwarePluginAccess(pluginId, { onAllowed })`

## Audit log

Permission decisions are written to:

`.fastscript/permissions-audit.jsonl`

Use policy `audit` settings to disable or relocate this log.
