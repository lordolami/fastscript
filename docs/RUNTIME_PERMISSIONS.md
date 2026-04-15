# Runtime Permissions

FastScript exposes explicit runtime permission boundaries for:

1. file access
2. environment access
3. network access
4. subprocess execution
5. dynamic imports
6. plugin access

Default policy path: `fastscript.permissions.json`.

Example policy: `fastscript.permissions.example.json`.

## CLI

1. Show active policy summary:
`npm run permissions`

2. Check a specific permission in report mode:
`npm run permissions -- --kind dynamicImportAccess --resource ./app/pages/index.fs`

3. Enforce assertion mode:
`npm run permissions -- --mode assert --kind envAccess --resource FASTSCRIPT_PROFILE`

## Runtime Helpers

FastScript exposes permission-aware runtime helpers:

1. `permissionAwareEnvGet(key)`
2. `permissionAwareReadFile(path)`
3. `permissionAwareFetch(url, init)`
4. `permissionAwareSpawn(command, args, options)`
5. `permissionAwarePluginAccess(pluginId, { onAllowed })`

## Secure Preset

Set `FASTSCRIPT_PERMISSION_PRESET=secure` to apply a stricter runtime profile:

1. deny network access by default
2. deny subprocess execution by default
3. deny plugin access by default
4. allow dynamic import only for local/file/data-url kinds

## Audit Log

Permission decisions are written to:

`.fastscript/permissions-audit.jsonl`

Use policy `audit` settings to disable or relocate this log.
