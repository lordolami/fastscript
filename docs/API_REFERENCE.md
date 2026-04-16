# API Reference

Auto-generated from `src/*.mjs`.

## asset-optimizer.mjs

- `optimizeFontAssets`
- `optimizeImageAssets`

## audit-log.mjs

- `createAuditLog`

## auth-flows.mjs

- `buildOAuthAuthorizeUrl`
- `createOAuthState`
- `hashPassword`
- `verifyPassword`

## bench.mjs

- `runBench`

## benchmark-discipline.mjs

- `runBenchmarkDiscipline`

## build.mjs

- `runBuild`

## cache.mjs

- `createFileCache`
- `createMemoryCache`
- `createRedisCache`

## check.mjs

- `runCheck`

## compat.mjs

- `getN`
- `run`
- `runCompat`
- `value`

## compatibility-governance.mjs

- `COMPATIBILITY_REPORT`
- `buildCompatibilityReport`
- `collectProofMap`
- `generateSupportMatrixMarkdown`
- `loadCompatibilityArtifacts`
- `loadCompatibilityRegistry`
- `runCompatibilityGovernanceCheck`
- `validateCompatibilityGovernance`
- `writeCompatibilityArtifacts`

## conversion-manifest.mjs

- `loadConversionManifest`
- `runManifest`
- `summarizeConversionManifest`

## create.mjs

- `DELETE`
- `GET`
- `POST`
- `createApp`
- `hydrate`
- `middleware`
- `schemas`
- `seed`
- `up`

## csp.mjs

- `generateCspPolicy`

## db-cli.mjs

- `runDbMigrate`
- `runDbRollback`
- `runDbSeed`

## db-postgres-collection.mjs

- `createPostgresCollectionDatabase`

## db-postgres.mjs

- `createPostgresAdapter`

## db.mjs

- `createFileDatabase`

## dev.mjs

- `runDev`

## diagnostics.mjs

- `runDiagnostics`

## docs-search.mjs

- `loadDocsIndex`
- `rankDocs`

## env.mjs

- `appendEnvIfMissing`
- `ensureEnvExample`
- `listConfigProfiles`
- `loadEnv`
- `validateAppEnv`
- `validateEnv`

## export.mjs

- `runExport`

## fs-diagnostics.mjs

- `analyzeFastScript`
- `assertFastScript`
- `formatDiagnosticsReport`

## fs-error-codes.mjs

- `FS_ERROR_CODES`
- `resolveErrorMeta`

## fs-formatter.mjs

- `formatFastScriptSource`
- `runFormat`

## fs-linter.mjs

- `runLint`

## fs-normalize.mjs

- `normalizeFastScript`
- `normalizeFastScriptWithMetadata`
- `stripTypeScriptHints`

## i18n.mjs

- `getI18nConfig`
- `resolveLocaleFromPath`
- `withLocalePath`

## interop.mjs

- `importAny`
- `interopCall`
- `resolveExport`

## jobs.mjs

- `createDistributedJobQueue`
- `createJobQueue`
- `createRedisJobQueue`
- `loadJobHandlers`
- `loadSchedules`
- `replayDeadLetter`
- `runWorker`

## logger.mjs

- `createLogger`

## metrics.mjs

- `createMetricsStore`

## middleware.mjs

- `composeMiddleware`

## migrate-rollback.mjs

- `runMigrateRollback`

## migrate.mjs

- `createStrictConversionPlan`
- `runMigrate`

## migration-wizard.mjs

- `runMigrationWizard`

## module-loader.mjs

- `importSourceModule`

## oauth-providers.mjs

- `createOAuthAdapter`
- `getAuthProvider`
- `listAuthProviders`

## observability.mjs

- `createOtelExporter`
- `createTracer`

## permissions-cli.mjs

- `runPermissions`

## plugins.mjs

- `PLUGIN_API_VERSION`
- `createPluginRuntime`

## profile.mjs

- `runProfile`

## regression-guard.mjs

- `runRegressionGuard`

## retention.mjs

- `applyJsonArrayRetention`
- `runRetentionSweep`
- `sweepFileAges`

## routes.mjs

- `compareRoutePriority`
- `inferRouteLayouts`
- `inferRouteMeta`
- `inferRouteParamTypes`
- `isLayoutFile`
- `isNotFoundFile`
- `sortRoutesByPriority`

## runtime-permissions.mjs

- `createPermissionRuntime`
- `evaluateRuntimePermission`
- `loadPermissionPolicy`
- `permissionAwareEnvGet`
- `permissionAwareFetch`
- `permissionAwarePluginAccess`
- `permissionAwareReadFile`
- `permissionAwareSpawn`

## scheduler.mjs

- `nextCronRun`
- `normalizeScheduleEntry`
- `parseCronExpression`

## security.mjs

- `abuseGuard`
- `createFileWindowStore`
- `createMemoryWindowStore`
- `createRedisWindowStore`
- `createWindowStore`
- `csrf`
- `rateLimit`
- `requestQuota`
- `securityHeaders`

## server-runtime.mjs

- `runServer`

## session-policy.mjs

- `resolveSessionPolicy`

## start.mjs

- `runStart`

## style-system.mjs

- `ensureDesignSystem`
- `validateAppStyles`

## tenant.mjs

- `resolveTenantId`
- `scopeCacheByTenant`
- `scopeDbByTenant`

## trace.mjs

- `runTrace`

## validate.mjs

- `runValidate`

## validation.mjs

- `readBody`
- `readJsonBody`
- `validateShape`

## worker.mjs

- `runWorkerCommand`

