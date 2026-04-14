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

## auth.mjs

- `createSessionManager`
- `parseCookies`
- `requireUser`
- `serializeCookie`

## bench.mjs

- `runBench`

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

## deploy.mjs

- `runDeploy`

## dev.mjs

- `runDev`

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

## fs-parser.mjs

- `FASTSCRIPT_AST_VERSION`
- `buildInlineSourceMapComment`
- `compileFastScript`
- `formatDiagnostic`
- `parseFastScript`
- `tokenizeFastScript`

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

## migrate.mjs

- `$1`
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

## plugins.mjs

- `PLUGIN_API_VERSION`
- `createPluginRuntime`

## retention.mjs

- `applyJsonArrayRetention`
- `runRetentionSweep`
- `sweepFileAges`

## routes.mjs

- `inferRouteLayouts`
- `inferRouteMeta`
- `inferRouteParamTypes`
- `isLayoutFile`
- `isNotFoundFile`

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

## storage.mjs

- `createLocalStorage`
- `createS3CompatibleStorage`

## style-system.mjs

- `ensureDesignSystem`
- `validateAppStyles`

## tenant.mjs

- `resolveTenantId`
- `scopeCacheByTenant`
- `scopeDbByTenant`

## typecheck.mjs

- `runTypeCheck`

## validate.mjs

- `runValidate`

## validation.mjs

- `readBody`
- `readJsonBody`
- `validateShape`

## webhook.mjs

- `isReplay`
- `readRawBody`
- `signPayload`
- `verifySignature`
- `verifyWebhookRequest`

## worker.mjs

- `runWorkerCommand`

