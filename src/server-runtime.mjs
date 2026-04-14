import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, watch } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { runBuild } from "./build.mjs";
import { parseCookies, serializeCookie, createSessionManager, requireUser } from "./auth.mjs";
import { createFileDatabase } from "./db.mjs";
import { createPostgresCollectionDatabase } from "./db-postgres-collection.mjs";
import { composeMiddleware } from "./middleware.mjs";
import { readJsonBody, validateShape } from "./validation.mjs";
import { loadEnv, validateAppEnv } from "./env.mjs";
import { createLogger } from "./logger.mjs";
import { createDistributedJobQueue } from "./jobs.mjs";
import { abuseGuard, requestQuota, securityHeaders, rateLimit, csrf } from "./security.mjs";
import { createFileCache, createRedisCache } from "./cache.mjs";
import { createTracer } from "./observability.mjs";
import { createLocalStorage, createS3CompatibleStorage } from "./storage.mjs";
import { createPluginRuntime } from "./plugins.mjs";
import { createMetricsStore } from "./metrics.mjs";
import { resolveSessionPolicy } from "./session-policy.mjs";
import { createAuditLog } from "./audit-log.mjs";
import { scopeCacheByTenant, scopeDbByTenant, resolveTenantId } from "./tenant.mjs";
import { getI18nConfig, resolveLocaleFromPath } from "./i18n.mjs";

const DIST_DIR = resolve("dist");
const DB_DIR = resolve(".fastscript");

function setupAppWatcher(onChange, logger) {
  const appRoot = resolve("app");
  if (!existsSync(appRoot)) return () => {};
  try {
    const watcher = watch(appRoot, { recursive: true }, onChange);
    return () => watcher.close();
  } catch (error) {
    logger.warn("recursive_watch_unavailable", { error: error?.message || String(error) });
    const watcher = watch(appRoot, onChange);
    return () => watcher.close();
  }
}

function contentType(path) {
  const ext = extname(path);
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".map") return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function readManifest() {
  const path = join(DIST_DIR, "fastscript-manifest.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

function readAssetManifest() {
  const path = join(DIST_DIR, "asset-manifest.json");
  if (!existsSync(path)) return { mapping: {} };
  return JSON.parse(readFileSync(path, "utf8"));
}

function assetPath(name, mapping = {}) {
  return `/${mapping[name] || name}`;
}

function parseRouteToken(token) {
  const m = /^:([A-Za-z_$][\w$]*)(\*)?(\?)?$/.exec(token || "");
  if (!m) return null;
  return { name: m[1], catchAll: Boolean(m[2]), optional: Boolean(m[3]) };
}

function match(routePath, pathname) {
  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  const params = {};
  let ri = 0;
  let pi = 0;

  while (ri < routeParts.length) {
    const token = routeParts[ri];
    const dyn = parseRouteToken(token);

    if (dyn?.catchAll) {
      const rest = pathParts.slice(pi);
      if (!rest.length && !dyn.optional) return null;
      params[dyn.name] = rest;
      pi = pathParts.length;
      ri = routeParts.length;
      break;
    }

    if (dyn) {
      const value = pathParts[pi];
      if (value === undefined) {
        if (dyn.optional) {
          params[dyn.name] = undefined;
          ri += 1;
          continue;
        }
        return null;
      }
      params[dyn.name] = value;
      ri += 1;
      pi += 1;
      continue;
    }

    if (pathParts[pi] !== token) return null;
    ri += 1;
    pi += 1;
  }

  if (pi !== pathParts.length) return null;
  return params;
}

function routePriorityScore(routePath) {
  const parts = String(routePath || "/").split("/").filter(Boolean);
  if (!parts.length) return 1000;
  let score = parts.length;
  for (const part of parts) {
    const dyn = parseRouteToken(part);
    if (!dyn) score += 40;
    else if (dyn.catchAll && dyn.optional) score += 5;
    else if (dyn.catchAll) score += 10;
    else if (dyn.optional) score += 20;
    else score += 30;
  }
  return score;
}

function resolveRoute(routes, pathname) {
  let best = null;
  for (const route of routes) {
    const params = match(route.path, pathname);
    if (!params) continue;
    if (!best) {
      best = { route, params, score: routePriorityScore(route.path) };
      continue;
    }
    const score = routePriorityScore(route.path);
    if (score > best.score) best = { route, params, score };
  }
  return best ? { route: best.route, params: best.params } : null;
}

async function importDist(modulePath) {
  const abs = join(DIST_DIR, modulePath.replace(/^\.\//, ""));
  const url = `${pathToFileURL(abs).href}?t=${Date.now()}`;
  return import(url);
}

function createHelpers(res, { secureCookies = false, defaultSameSite = "Lax", defaultPath = "/" } = {}) {
  return {
    json(body, status = 200, headers = {}) {
      return { status, json: body, headers };
    },
    text(body, status = 200, headers = {}) {
      return { status, body, headers };
    },
    redirect(location, status = 302) {
      return { status, headers: { location } };
    },
    setCookie(name, value, opts = {}) {
      const current = res.getHeader("set-cookie");
      const next = serializeCookie(name, value, {
        sameSite: defaultSameSite,
        secure: secureCookies,
        path: defaultPath,
        ...opts,
      });
      if (!current) res.setHeader("set-cookie", [next]);
      else res.setHeader("set-cookie", Array.isArray(current) ? [...current, next] : [String(current), next]);
    },
  };
}

function writeResponse(res, payload) {
  if (!payload) {
    res.writeHead(204);
    res.end();
    return;
  }
  const status = payload.status ?? 200;
  const headers = payload.headers ?? {};
  if (payload.cookies && payload.cookies.length) headers["set-cookie"] = payload.cookies;
  if (payload.json !== undefined) {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers });
    res.end(JSON.stringify(payload.json));
    return;
  }
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8", ...headers });
  res.end(payload.body ?? "");
}

function htmlDoc(content, ssrData, { hasStyles = false, stylesHref = "/styles.css", routerHref = "/router.js" } = {}) {
  const safe = JSON.stringify(ssrData ?? {}).replace(/</g, "\\u003c");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FastScript</title>
    ${hasStyles ? `<link rel="stylesheet" href="${stylesHref}" />` : ""}
  </head>
  <body>
    <div id="app">${content}</div>
    <script>window.__FASTSCRIPT_SSR=${safe}</script>
    <script type="module" src="${routerHref}"></script>
  </body>
</html>`;
}

export async function runServer({ mode = "development", watchMode = false, buildOnStart = true, port = 4173, listen = true } = {}) {
  loadEnv({ mode });
  await validateAppEnv();

  const isProduction = (mode || process.env.NODE_ENV || "development") === "production";
  const sessionPolicy = resolveSessionPolicy({ mode });

  const logger = createLogger({ service: "fastscript-server" });
  const tracer = createTracer({ service: "fastscript-server" });
  const plugins = await createPluginRuntime({ logger });
  const metrics = createMetricsStore({ dir: DB_DIR, name: "metrics" });
  const audit = createAuditLog({ file: join(DB_DIR, "audit.log") });
  const i18n = getI18nConfig(process.env);
  if (buildOnStart) await runBuild();

  const sessions = createSessionManager({
    dir: DB_DIR,
    cookieName: sessionPolicy.cookie.name,
    secret: sessionPolicy.secret,
  });
  let db = createFileDatabase({ dir: DB_DIR, name: "appdb" });
  if ((process.env.DB_DRIVER || "").toLowerCase() === "postgres") {
    try {
      db = await createPostgresCollectionDatabase({ connectionString: process.env.DATABASE_URL });
      logger.info("db_driver", { driver: "postgres" });
    } catch (error) {
      logger.warn("db_driver_fallback", { driver: "file", error: error?.message || String(error) });
      db = createFileDatabase({ dir: DB_DIR, name: "appdb" });
    }
  }
  const queue = await createDistributedJobQueue({ dir: DB_DIR, driver: process.env.JOBS_DRIVER || "file" });

  let cache = createFileCache({ dir: join(DB_DIR, "cache") });
  if ((process.env.CACHE_DRIVER || "").toLowerCase() === "redis") {
    try {
      cache = await createRedisCache({ url: process.env.REDIS_URL });
      logger.info("cache_driver", { driver: "redis" });
    } catch (error) {
      logger.warn("cache_driver_fallback", { driver: "file", error: error?.message || String(error) });
    }
  }

  let storage = createLocalStorage({ dir: join(DB_DIR, "storage") });
  if ((process.env.STORAGE_DRIVER || "").toLowerCase() === "s3") {
    const bucket = process.env.STORAGE_S3_BUCKET;
    const endpoint = process.env.STORAGE_S3_ENDPOINT;
    const presignBaseUrl = process.env.STORAGE_S3_PRESIGN_BASE_URL;
    if (bucket && endpoint && presignBaseUrl) {
      storage = createS3CompatibleStorage({ bucket, endpoint, presignBaseUrl, region: process.env.STORAGE_S3_REGION || "auto" });
      logger.info("storage_driver", { driver: "s3-compatible" });
    } else {
      logger.warn("storage_driver_fallback", { driver: "local", reason: "missing_s3_env" });
    }
  }
  let stopWatching = null;
  const hmrClients = new Set();

  function pushHmr(event = { type: "reload", ts: Date.now() }) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    for (const res of hmrClients) {
      try {
        res.write(payload);
      } catch {}
    }
  }

  if (watchMode) {
    let timer = null;
    stopWatching = setupAppWatcher(() => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          await runBuild();
          logger.info("rebuild complete");
          pushHmr({ type: "rebuild", ts: Date.now() });
        } catch (error) {
          logger.error("rebuild failed", { error: error.message });
          pushHmr({ type: "rebuild_error", error: error?.message || String(error), ts: Date.now() });
        }
      }, 120);
    }, logger);
  }

  const server = createServer(async (req, res) => {
    const requestId = logger.requestId();
    const start = Date.now();
    const span = tracer.span("request", { requestId, path: req.url, method: req.method });
    res.setHeader("x-request-id", requestId);
    let responseStatus = 500;
    let responseKind = "error";
    let responseError = null;
    let requestCtx = null;

    try {
      const url = new URL(req.url || "/", "http://localhost");
      const originalPathname = url.pathname;
      const localized = resolveLocaleFromPath(originalPathname, i18n);
      const pathname = localized.pathname;
      const method = (req.method || "GET").toUpperCase();
      const manifest = readManifest();
      const assets = readAssetManifest();
      const helpers = createHelpers(res, {
        secureCookies: sessionPolicy.cookie.secure,
        defaultSameSite: sessionPolicy.cookie.sameSite,
        defaultPath: sessionPolicy.cookie.path,
      });
      requestCtx = { requestId, pathname: originalPathname, method, mode, locale: localized.locale };
      await plugins.onRequestStart(requestCtx);
      const cookies = parseCookies(req.headers.cookie || "");
      const session = sessions.read(cookies[sessions.cookieName]);
      sessions.sweepExpired();
      if (sessionPolicy.rotateOnRead && cookies[sessions.cookieName]) {
        const rotated = sessions.rotate(cookies[sessions.cookieName], sessionPolicy.cookie.maxAgeSec);
        if (rotated) {
          helpers.setCookie(sessions.cookieName, rotated, {
            path: sessionPolicy.cookie.path,
            httpOnly: sessionPolicy.cookie.httpOnly,
            sameSite: sessionPolicy.cookie.sameSite,
            secure: sessionPolicy.cookie.secure,
            maxAge: sessionPolicy.cookie.maxAgeSec,
          });
        }
      }
      const tenantId = resolveTenantId(req, { fallback: process.env.DEFAULT_TENANT_ID || "public" });
      const tenantDb = scopeDbByTenant(db, tenantId);
      const tenantCache = scopeCacheByTenant(cache, tenantId);

      const ctx = {
        req,
        res,
        requestId,
        tenantId,
        locale: localized.locale,
        originalPathname,
        pathname,
        method,
        params: {},
        query: Object.fromEntries(url.searchParams.entries()),
        cookies,
        user: session?.user ?? null,
        db: tenantDb,
        queue,
        cache: tenantCache,
        storage,
        auth: {
          login: (user, opts = {}) => {
            const maxAge = opts.maxAge ?? sessionPolicy.cookie.maxAgeSec;
            const token = sessions.create(user, maxAge);
            helpers.setCookie(sessions.cookieName, token, {
              path: sessionPolicy.cookie.path,
              httpOnly: sessionPolicy.cookie.httpOnly,
              sameSite: sessionPolicy.cookie.sameSite,
              secure: sessionPolicy.cookie.secure,
              maxAge,
            });
            audit.append({ action: "auth.login", actor: user?.id || "anonymous", tenantId, requestId, pathname });
            return token;
          },
          logout: () => {
            sessions.delete(cookies[sessions.cookieName]);
            helpers.setCookie(sessions.cookieName, "", {
              path: sessionPolicy.cookie.path,
              httpOnly: sessionPolicy.cookie.httpOnly,
              sameSite: sessionPolicy.cookie.sameSite,
              secure: sessionPolicy.cookie.secure,
              maxAge: 0,
            });
            audit.append({ action: "auth.logout", actor: session?.user?.id || "anonymous", tenantId, requestId, pathname });
          },
          requireUser: () => requireUser(session?.user ?? null),
          rotate: (opts = {}) => {
            const maxAge = opts.maxAge ?? sessionPolicy.cookie.maxAgeSec;
            const token = sessions.rotate(cookies[sessions.cookieName], maxAge);
            if (token) helpers.setCookie(sessions.cookieName, token, {
              path: sessionPolicy.cookie.path,
              httpOnly: sessionPolicy.cookie.httpOnly,
              sameSite: sessionPolicy.cookie.sameSite,
              secure: sessionPolicy.cookie.secure,
              maxAge,
            });
            if (token) audit.append({ action: "auth.rotate", actor: session?.user?.id || "anonymous", tenantId, requestId, pathname });
            return token;
          },
        },
        input: {
          body: null,
          query: Object.fromEntries(url.searchParams.entries()),
          async readJson() {
            if (ctx.input.body !== null) return ctx.input.body;
            ctx.input.body = await readJsonBody(req, { maxBytes: Number(process.env.MAX_BODY_BYTES || 1024 * 1024) });
            return ctx.input.body;
          },
          validateQuery(schema) {
            return validateShape(schema, ctx.query, "query").value;
          },
          async validateBody(schema) {
            const body = await ctx.input.readJson();
            return validateShape(schema, body, "body").value;
          },
        },
        helpers,
      };

      const isBodyMethod = !["GET", "HEAD"].includes(ctx.method);
      const contentTypeHeader = String(req.headers["content-type"] || "");
      if (isBodyMethod && contentTypeHeader.includes("application/json")) {
        ctx.input.body = await ctx.input.readJson();
      }

      const target = join(DIST_DIR, pathname === "/" ? "index.html" : pathname.slice(1));
      if (pathname === "/__hmr" && watchMode) {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
        });
        res.write("event: ready\ndata: {}\n\n");
        hmrClients.add(res);
        req.on("close", () => hmrClients.delete(res));
        responseStatus = 200;
        responseKind = "hmr";
        span.end({ status: 200, kind: "hmr" });
        return;
      }
      if (pathname === "/__metrics" && process.env.METRICS_PUBLIC === "1") {
        writeResponse(res, { status: 200, json: metrics.snapshot() });
        responseStatus = 200;
        responseKind = "metrics";
        span.end({ status: 200, kind: "metrics" });
        return;
      }
      if (pathname === "/__cache/invalidate" && method === "POST") {
        const body = await ctx.input.readJson();
        const tag = String(body.tag || "").trim();
        if (!tag) {
          writeResponse(res, { status: 400, json: { ok: false, error: "missing_tag" } });
          responseStatus = 400;
          responseKind = "cache";
          span.end({ status: 400, kind: "cache" });
          return;
        }
        const count = await tenantCache.invalidateTag(tag);
        audit.append({ action: "cache.invalidate", actor: session?.user?.id || "anonymous", tenantId, requestId, pathname, tag, count });
        writeResponse(res, { status: 200, json: { ok: true, tag, count } });
        responseStatus = 200;
        responseKind = "cache";
        span.end({ status: 200, kind: "cache" });
        return;
      }
      if (pathname === "/__observability" && process.env.OBSERVABILITY_UI !== "0") {
        const snap = metrics.snapshot();
        const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>FastScript Observability</title><style>body{font:14px/1.4 ui-sans-serif,system-ui;background:#070707;color:#fff;padding:20px}pre{background:#111;padding:16px;border-radius:10px;overflow:auto}h1{font-size:18px}</style></head><body><h1>Observability Dashboard</h1><h2>Metrics</h2><pre>${JSON.stringify(snap, null, 2)}</pre><h2>Audit Chain</h2><pre>${JSON.stringify(audit.verify(), null, 2)}</pre></body></html>`;
        writeResponse(res, { status: 200, body: html, headers: { "content-type": "text/html; charset=utf-8" } });
        responseStatus = 200;
        responseKind = "observability";
        span.end({ status: 200, kind: "observability" });
        return;
      }
      if (pathname === "/__alerts" && process.env.OBSERVABILITY_UI !== "0") {
        const snap = metrics.snapshot();
        const total = snap.counters.requests_total || 0;
        const errors = snap.counters.requests_error_total || 0;
        const p95 = snap.timings.request_duration_ms?.max || 0;
        const alert = {
          status: errors > Math.max(5, total * 0.05) || p95 > Number(process.env.SLO_P95_MS || 1200) ? "degraded" : "healthy",
          triage: errors > 0 ? "check /__observability and recent deploys; inspect dead-letter queue growth" : "no incident signal",
          counters: snap.counters,
          timings: snap.timings,
        };
        writeResponse(res, { status: 200, json: alert });
        responseStatus = 200;
        responseKind = "alerts";
        span.end({ status: 200, kind: "alerts" });
        return;
      }
      if (pathname.startsWith("/__storage/")) {
        if (pathname === "/__storage/signed") {
          const token = String(url.searchParams.get("token") || "");
          const payload = storage.verifySignedUrl ? storage.verifySignedUrl(token) : null;
          if (!payload || payload.action !== "get") {
            writeResponse(res, { status: 401, body: "Invalid signed URL" });
            responseStatus = 401;
            responseKind = "storage";
            span.end({ status: 401, kind: "storage" });
            return;
          }
          const record = storage.get(payload.key);
          if (!record) {
            writeResponse(res, { status: 404, body: "Not found" });
            responseStatus = 404;
            responseKind = "storage";
            span.end({ status: 404, kind: "storage" });
            return;
          }
          res.writeHead(200, { "content-type": "application/octet-stream" });
          res.end(record);
          responseStatus = 200;
          responseKind = "storage";
          span.end({ status: 200, kind: "storage" });
          return;
        }
        const key = decodeURIComponent(pathname.slice("/__storage/".length));
        const record = storage.get(key);
        if (!record) {
          writeResponse(res, { status: 404, body: "Not found" });
          responseStatus = 404;
          responseKind = "storage";
          span.end({ status: 404, kind: "storage" });
          return;
        }
        const meta = storage.meta ? storage.meta(key) : { acl: "public" };
        if (meta.acl !== "public") {
          writeResponse(res, { status: 403, body: "Forbidden" });
          responseStatus = 403;
          responseKind = "storage";
          span.end({ status: 403, kind: "storage" });
          return;
        }
        res.writeHead(200, { "content-type": "application/octet-stream" });
        res.end(record);
        responseStatus = 200;
        responseKind = "storage";
        span.end({ status: 200, kind: "storage" });
        return;
      }
      if (existsSync(target) && statSync(target).isFile() && !pathname.endsWith(".html")) {
        const body = readFileSync(target);
        const immutable = /\.[a-f0-9]{8}\.(js|css)$/.test(pathname);
        res.writeHead(200, {
          "content-type": contentType(target),
          "cache-control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=300",
        });
        res.end(body);
        logger.info("static", { requestId, path: pathname, status: 200, ms: Date.now() - start });
        responseStatus = 200;
        responseKind = "static";
        span.end({ status: 200, kind: "static" });
        return;
      }

      const middlewareList = [];
      middlewareList.push(securityHeaders(), rateLimit(), requestQuota(), abuseGuard());
      if (process.env.CSRF_PROTECT !== "0") middlewareList.push(csrf());
      const pluginMiddleware = plugins.middleware();
      if (pluginMiddleware.length) middlewareList.push(...pluginMiddleware);
      if (manifest.middleware) {
        const mm = await importDist(manifest.middleware);
        if (Array.isArray(mm.middlewares)) middlewareList.push(...mm.middlewares);
        else if (typeof mm.middleware === "function") middlewareList.push(mm.middleware);
        else if (typeof mm.default === "function") middlewareList.push(mm.default);
      }
      const runWithMiddleware = composeMiddleware(middlewareList);

      const out = await runWithMiddleware(ctx, async () => {
        async function renderParallelSlots(params, data) {
          const slots = {};
          for (const route of manifest.parallelRoutes || []) {
            const slotHit = match(route.path, pathname);
            if (!slotHit) continue;
            const slotMod = await importDist(route.module);
            let slotData = {};
            if (typeof slotMod.load === "function") {
              slotData = (await slotMod.load({ ...ctx, pathname, locale: ctx.locale, params, slot: route.slot })) || {};
            }
            slots[route.slot || "default"] = slotMod.default
              ? slotMod.default({ ...slotData, params, pathname, locale: ctx.locale, slot: route.slot })
              : "";
          }
          return slots;
        }

        async function applyLayouts(route, html, params, data, slots = {}) {
          const layoutList = route.layouts && route.layouts.length
            ? route.layouts
            : (manifest.layout ? [manifest.layout] : []);
          let outHtml = html;
          for (const layoutPath of layoutList) {
            const layout = await importDist(layoutPath);
            outHtml = layout.default
              ? layout.default({ content: outHtml, pathname, locale: ctx.locale, user: ctx.user, params, data, slots, tenantId: ctx.tenantId })
              : outHtml;
          }
          return outHtml;
        }

        if (pathname.startsWith("/api/")) {
          const apiHit = resolveRoute(manifest.apiRoutes, pathname);
          if (!apiHit) return { status: 404, body: "API route not found" };
          ctx.params = apiHit.params;
          const mod = await importDist(apiHit.route.module);
          const handler = mod[ctx.method];
          if (typeof handler !== "function") return { status: 405, body: `Method ${ctx.method} not allowed` };
          if (mod.schemas?.[ctx.method]) {
            ctx.input.body = await ctx.input.readJson();
            validateShape(mod.schemas[ctx.method], ctx.input.body, "body");
          }
          return handler(ctx, helpers);
        }

        const hit = resolveRoute(manifest.routes, pathname);
        if (!hit) {
          if (manifest.notFound) {
            const nfMod = await importDist(manifest.notFound);
            const body = nfMod.default ? nfMod.default({ pathname, locale: ctx.locale }) : "<h1>404</h1>";
            return { status: 404, html: body, data: null };
          }
          return { status: 404, body: "Not found" };
        }

        ctx.params = hit.params;
        const mod = await importDist(hit.route.module);

        if (!["GET", "HEAD"].includes(ctx.method) && typeof mod[ctx.method] === "function") {
          if (mod.schemas?.[ctx.method]) {
            ctx.input.body = await ctx.input.readJson();
            validateShape(mod.schemas[ctx.method], ctx.input.body, "body");
          }
          return mod[ctx.method](ctx, helpers);
        }

        const revalidateSec = Number(mod.revalidate || 0);
        const isrEnabled = Number.isFinite(revalidateSec) && revalidateSec > 0 && ["GET", "HEAD"].includes(ctx.method);
        const isrKey = `isr:${pathname}`;
        if (isrEnabled) {
          const cached = await tenantCache.get(isrKey);
          if (cached && cached.html && cached.generatedAt && Date.now() - cached.generatedAt < revalidateSec * 1000) {
            return { status: 200, html: cached.html, data: cached.data || {}, isr: true };
          }
        }

        if (typeof mod.stream === "function" && ["GET", "HEAD"].includes(ctx.method)) {
          return {
            status: 200,
            stream: mod.stream({ ...ctx, params: hit.params, pathname, locale: ctx.locale }),
            route: hit.route,
            mod,
          };
        }

        let data = {};
        if (typeof mod.load === "function") data = (await mod.load({ ...ctx, params: hit.params, pathname, locale: ctx.locale })) || {};
        let html = mod.default ? mod.default({ ...data, params: hit.params, pathname, locale: ctx.locale, user: ctx.user }) : "";
        const slots = await renderParallelSlots(hit.params, data);
        html = await applyLayouts(hit.route, html, hit.params, data, slots);

        if (isrEnabled) {
          await tenantCache.setWithTags(isrKey, { html, data, generatedAt: Date.now() }, {
            ttlMs: revalidateSec * 1000,
            tags: [`route:${pathname}`, "isr"],
          });
        }
        return { status: 200, html, data };
      });

      if (out?.stream) {
        const hasStyles = existsSync(join(DIST_DIR, "styles.css")) || Boolean(assets.mapping["styles.css"]);
        const stylesHref = assetPath("styles.css", assets.mapping || {});
        const routerHref = assetPath("router.js", assets.mapping || {});
        const safe = JSON.stringify({ pathname, data: null }).replace(/</g, "\\u003c");
        responseStatus = out.status ?? 200;
        responseKind = "stream";
        res.writeHead(responseStatus, { "content-type": "text/html; charset=utf-8", "transfer-encoding": "chunked" });
        res.write(`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>FastScript</title>${hasStyles ? `<link rel="stylesheet" href="${stylesHref}" />` : ""}</head><body><div id="app">`);
        for await (const chunk of out.stream) {
          res.write(String(chunk ?? ""));
        }
        res.write(`</div><script>window.__FASTSCRIPT_SSR=${safe}</script><script type="module" src="${routerHref}"></script></body></html>`);
        res.end();
        logger.info("ssr_stream", { requestId, path: pathname, status: responseStatus, ms: Date.now() - start });
        span.end({ status: responseStatus, kind: "stream" });
        return;
      }

      if (out?.html !== undefined) {
        const hasStyles = existsSync(join(DIST_DIR, "styles.css")) || Boolean(assets.mapping["styles.css"]);
        const payload = { pathname, data: out.data ?? null };
        const stylesHref = assetPath("styles.css", assets.mapping || {});
        const routerHref = assetPath("router.js", assets.mapping || {});
        responseStatus = out.status ?? 200;
        responseKind = out?.isr ? "isr" : "ssr";
        res.writeHead(responseStatus, { "content-type": "text/html; charset=utf-8" });
        res.end(htmlDoc(out.html, payload, { hasStyles, stylesHref, routerHref }));
        logger.info("ssr", { requestId, path: pathname, status: responseStatus, ms: Date.now() - start, isr: Boolean(out?.isr) });
        span.end({ status: responseStatus, kind: out?.isr ? "isr" : "ssr" });
        return;
      }

      writeResponse(res, out);
      responseStatus = out?.status ?? 200;
      responseKind = "response";
      logger.info("response", { requestId, path: pathname, status: responseStatus, ms: Date.now() - start });
      span.end({ status: responseStatus, kind: "response" });
    } catch (error) {
      const status = error?.status && Number.isInteger(error.status) ? error.status : 500;
      const payload = {
        ok: false,
        error: {
          message: error?.message || "Unknown error",
          status,
          details: error?.details || null,
        },
      };
      const wantsJson = (req.headers.accept || "").includes("application/json") || (req.url || "").startsWith("/api/");
      if (wantsJson) {
        res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(payload));
      } else {
        res.writeHead(status, { "content-type": "text/html; charset=utf-8" });
        if (!isProduction) {
          const mapped = String(error?.stack || "").replace(/\bdist[\\/]/g, "app/");
          res.end(`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>FastScript Dev Error</title><style>body{background:#080808;color:#fff;font:14px/1.5 ui-monospace,Menlo,monospace;padding:20px}pre{background:#121212;padding:12px;border-radius:8px;overflow:auto}</style></head><body><h1>FastScript Dev Error</h1><p>Request ID: <code>${requestId}</code></p><pre>${mapped.replace(/</g, "&lt;")}</pre></body></html>`);
        } else {
          res.end(`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Error</title><style>body{background:#050505;color:#fff;font:16px/1.6 ui-sans-serif,system-ui;padding:40px}code{color:#9f92ff}</style></head><body><h1>Something went wrong</h1><p>Please retry or roll back to the previous deploy.</p><p>Request ID: <code>${requestId}</code></p></body></html>`);
        }
      }
      responseStatus = status;
      responseKind = "error";
      responseError = payload.error.message;
      logger.error("request_error", { requestId, status, path: req.url, error: payload.error.message });
      span.end({ status, error: payload.error.message, kind: "error" });
    } finally {
      const durationMs = Date.now() - start;
      metrics.inc("requests_total", 1);
      metrics.inc(`requests_status_${responseStatus}`, 1);
      metrics.inc(`requests_kind_${responseKind}`, 1);
      if (responseError) metrics.inc("requests_error_total", 1);
      metrics.observe("request_duration_ms", durationMs);
      try {
        await plugins.onRequestEnd({
          ...(requestCtx || { requestId, pathname: req.url || "/", method: req.method || "GET", mode }),
          status: responseStatus,
          kind: responseKind,
          error: responseError,
          durationMs,
        });
      } catch (hookError) {
        logger.warn("plugin_on_request_end_failed", { error: hookError?.message || String(hookError) });
      }
    }
  });
  const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
  if (Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0) {
    server.requestTimeout = requestTimeoutMs;
  }

  if (listen) {
    server.listen(port, () => {
      logger.info("server_started", { mode, port, watchMode });
    });
  }

  function cleanup() {
    if (stopWatching) {
      stopWatching();
      stopWatching = null;
    }
    for (const client of hmrClients) {
      try { client.end(); } catch {}
    }
    hmrClients.clear();
    if (db && typeof db.flush === "function") {
      Promise.resolve(db.flush()).catch(() => {});
    }
    if (db && typeof db.close === "function") {
      Promise.resolve(db.close()).catch(() => {});
    }
    if (cache && typeof cache.close === "function") {
      Promise.resolve(cache.close()).catch(() => {});
    }
    if (queue && typeof queue.close === "function") {
      Promise.resolve(queue.close()).catch(() => {});
    }
  }
  process.once("SIGINT", cleanup);
  process.once("SIGTERM", cleanup);

  return server;
}
