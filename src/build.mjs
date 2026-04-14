import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import { normalizeFastScript } from "./fs-normalize.mjs";
import { createPluginRuntime } from "./plugins.mjs";
import { ensureDesignSystem, validateAppStyles } from "./style-system.mjs";
import { assertFastScript } from "./fs-diagnostics.mjs";
import { inferRouteLayouts, inferRouteMeta, isLayoutFile, isNotFoundFile, sortRoutesByPriority } from "./routes.mjs";
import { optimizeFontAssets, optimizeImageAssets } from "./asset-optimizer.mjs";
import { getI18nConfig } from "./i18n.mjs";

const APP_DIR = resolve("app");
const PAGES_DIR = join(APP_DIR, "pages");
const API_DIR = join(APP_DIR, "api");
const DIST_DIR = resolve("dist");

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureEmptyDir(dir, { retries = 6, delayMs = 40 } = {}) {
  mkdirSync(dir, { recursive: true });
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const target = join(dir, entry.name);
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        rmSync(target, { recursive: true, force: true });
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt === retries) break;
        await sleep(delayMs * (attempt + 1));
      }
    }
    if (lastError) throw lastError;
  }
}

function fsLoaderPlugin() {
  const compilerMode = (process.env.FASTSCRIPT_COMPILER_MODE || "strict").toLowerCase() === "lenient" ? "lenient" : "strict";
  return {
    name: "fastscript-fs-loader",
    setup(build) {
      build.onLoad({ filter: /\.fs$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        assertFastScript(raw, { file: args.path, mode: compilerMode });
        return {
          contents: normalizeFastScript(raw, { file: args.path, mode: compilerMode, sourceMap: "inline" }),
          loader: "js",
        };
      });
    },
  };
}

function routeFromApiFile(file) {
  const rel = relative(API_DIR, file).replace(/\\/g, "/").replace(/\.(js|fs)$/, "");
  const segs = rel.split("/").filter(Boolean);
  if (segs.at(-1) === "index") segs.pop();
  return "/api/" + segs.join("/");
}

async function compileFile(file, out, platform) {
  mkdirSync(dirname(out), { recursive: true });
  await esbuild.build({
    entryPoints: [file],
    outfile: out,
    bundle: true,
    format: "esm",
    platform,
    sourcemap: true,
    minify: platform === "browser",
    logLevel: "silent",
    resolveExtensions: [".fs", ".js", ".mjs", ".cjs", ".json"],
    plugins: [fsLoaderPlugin()],
    loader: { ".fs": "js" },
  });
}

function hashContent(buf) {
  return createHash("sha1").update(buf).digest("hex").slice(0, 8);
}

function relDist(path) {
  return relative(DIST_DIR, path).replace(/\\/g, "/");
}

function mapAssetPath(path, mapping) {
  if (!path) return path;
  const rel = path.replace(/^\.\//, "");
  return mapping[rel] ? `./${mapping[rel]}` : path;
}

function rewriteManifestAssetPaths(manifest, mapping) {
  manifest.layout = mapAssetPath(manifest.layout, mapping);
  manifest.notFound = mapAssetPath(manifest.notFound, mapping);
  manifest.middleware = mapAssetPath(manifest.middleware, mapping);
  manifest.routes = manifest.routes.map((route) => ({
    ...route,
    module: mapAssetPath(route.module, mapping),
    layouts: (route.layouts || []).map((layout) => mapAssetPath(layout, mapping)),
  }));
  manifest.parallelRoutes = (manifest.parallelRoutes || []).map((route) => ({
    ...route,
    module: mapAssetPath(route.module, mapping),
  }));
  manifest.apiRoutes = manifest.apiRoutes.map((route) => ({
    ...route,
    module: mapAssetPath(route.module, mapping),
  }));
  return manifest;
}

function applyAssetFingerprinting(manifest) {
  const assets = walk(DIST_DIR)
    .filter((file) => /\.(js|css)$/.test(file))
    .filter((file) => !file.endsWith(".map"));
  const mapping = {};

  for (const file of assets) {
    const rel = relDist(file);
    const body = readFileSync(file);
    const hash = hashContent(body);
    const ext = extname(rel);
    const stem = rel.slice(0, -ext.length);
    const nextRel = `${stem}.${hash}${ext}`;
    if (nextRel === rel) continue;
    renameSync(file, join(DIST_DIR, nextRel));
    const mapFrom = `${file}.map`;
    const mapTo = join(DIST_DIR, `${nextRel}.map`);
    if (existsSync(mapFrom)) renameSync(mapFrom, mapTo);
    mapping[rel] = nextRel;
    const logicalRel = rel.replace(/\.[a-f0-9]{8}(\.[mc]?js|\.css)$/i, "$1");
    if (logicalRel !== rel && !mapping[logicalRel]) {
      mapping[logicalRel] = nextRel;
    }
  }

  rewriteManifestAssetPaths(manifest, mapping);
  const routerAsset = mapping["router.js"] || "router.js";
  const stylesAsset = mapping["styles.css"] || "styles.css";
  writeFileSync(join(DIST_DIR, "asset-manifest.json"), JSON.stringify({ mapping }, null, 2), "utf8");
  return { routerAsset, stylesAsset, mapping };
}

async function runSsg(manifest, { stylesAsset, routerAsset }) {
  const staticDir = join(DIST_DIR, "static");
  mkdirSync(staticDir, { recursive: true });
  const routes = manifest.routes.filter((route) => !route.path.includes(":"));
  for (const route of routes) {
    const mod = await import(`${pathToFileURL(join(DIST_DIR, route.module.replace(/^\.\//, ""))).href}?t=${Date.now()}`);
    const html = typeof mod.default === "function" ? mod.default({ pathname: route.path, params: {} }) : "";
    const target = route.path === "/" ? join(staticDir, "index.html") : join(staticDir, route.path.slice(1), "index.html");
    mkdirSync(dirname(target), { recursive: true });
    const wrapped = buildIndexHtml(Boolean(stylesAsset), {
      content: html,
      stylesAsset,
      routerAsset,
      devMode: false,
    });
    writeFileSync(target, wrapped, "utf8");
  }
}

function generatePwaArtifacts({ routerAsset, stylesAsset, cacheVersion = "v1" }) {
  const assets = walk(DIST_DIR)
    .map((file) => relDist(file))
    .filter((rel) => /\.(js|css|json|html)$/.test(rel))
    .map((rel) => `/${rel}`);
  const cacheName = `fastscript-${cacheVersion}`;
  const webmanifest = {
    name: "FastScript App",
    short_name: "FastScript",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [],
  };
  writeFileSync(join(DIST_DIR, "manifest.webmanifest"), JSON.stringify(webmanifest, null, 2), "utf8");
  const sw = `const CACHE_NAME = "${cacheName}";\nconst ASSETS = ${JSON.stringify([...new Set(["/", `/${routerAsset}`, `/${stylesAsset}`, ...assets])], null, 2)};\nconst FASTSCRIPT_CACHE_PREFIX = "fastscript-";\nself.addEventListener("install", (event) => {\n  event.waitUntil(\n    caches.open(CACHE_NAME)\n      .then((c) => c.addAll(ASSETS))\n      .then(() => self.skipWaiting())\n  );\n});\nself.addEventListener("activate", (event) => {\n  event.waitUntil(\n    caches.keys()\n      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(FASTSCRIPT_CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k))))\n      .then(() => self.clients.claim())\n  );\n});\nself.addEventListener("fetch", (event) => {\n  if (event.request.method !== "GET") return;\n  const req = event.request;\n  const accept = req.headers.get("accept") || "";\n  const isHtml = req.mode === "navigate" || accept.includes("text/html");\n\n  if (isHtml) {\n    event.respondWith(\n      fetch(req)\n        .then((res) => {\n          if (res && res.ok) {\n            const copy = res.clone();\n            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});\n          }\n          return res;\n        })\n        .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))\n    );\n    return;\n  }\n\n  event.respondWith(\n    caches.match(req).then((hit) => {\n      if (hit) return hit;\n      return fetch(req).then((res) => {\n        const copy = res.clone();\n        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});\n        return res;\n      });\n    })\n  );\n});\n`;
  writeFileSync(join(DIST_DIR, "service-worker.js"), sw, "utf8");
}

export async function runBuild(options = {}) {
  if (!existsSync(PAGES_DIR)) throw new Error("Missing app/pages directory. Run: fastscript create app");
  ensureDesignSystem({ root: process.cwd() });
  validateAppStyles({ root: process.cwd() });

  const pluginLogger = {
    info(msg, extra = {}) { console.log(`[plugin] ${msg}`, extra); },
    warn(msg, extra = {}) { console.warn(`[plugin] ${msg}`, extra); },
    error(msg, extra = {}) { console.error(`[plugin] ${msg}`, extra); },
  };
  const plugins = await createPluginRuntime({ logger: pluginLogger });
  await plugins.onBuildStart({ appDir: APP_DIR, distDir: DIST_DIR });

  await ensureEmptyDir(DIST_DIR);

  const manifest = {
    routes: [],
    parallelRoutes: [],
    apiRoutes: [],
    layout: null,
    notFound: null,
    middleware: null,
    mode: options.mode || "build",
    compilerMode: (process.env.FASTSCRIPT_COMPILER_MODE || "strict").toLowerCase() === "lenient" ? "lenient" : "strict",
    generatedAt: new Date().toISOString(),
    devMode: (process.env.NODE_ENV || "development") !== "production",
    i18n: getI18nConfig(process.env),
  };
  const pageFiles = walk(PAGES_DIR).filter((f) => [".js", ".fs"].includes(extname(f)));
  const layoutFiles = new Set(
    pageFiles
      .filter((file) => isLayoutFile(file, PAGES_DIR))
      .map((file) => relative(PAGES_DIR, file).replace(/\\/g, "/")),
  );

  for (const file of pageFiles) {
    const rel = relative(APP_DIR, file).replace(/\\/g, "/");
    const relModule = rel.replace(/\.fs$/, ".js");
    const out = join(DIST_DIR, relModule);
    await compileFile(file, out, "browser");

    if (isLayoutFile(file, PAGES_DIR)) {
      if (!manifest.layout) manifest.layout = `./${relModule}`;
      continue;
    }

    if (isNotFoundFile(file, PAGES_DIR)) {
      if (!manifest.notFound) manifest.notFound = `./${relModule}`;
      continue;
    }

    const routeMeta = inferRouteMeta(file, PAGES_DIR);
    const layouts = inferRouteLayouts(file, PAGES_DIR, layoutFiles)
      .map((layoutRel) => `./pages/${layoutRel}`.replace(/\.fs$/, ".js"));
    const record = {
      path: routeMeta.routePath,
      module: `./${relModule}`,
      slot: routeMeta.slot || null,
      params: routeMeta.params,
      paramTypes: routeMeta.paramTypes || {},
      layouts,
    };

    if (routeMeta.slot) manifest.parallelRoutes.push(record);
    else manifest.routes.push(record);
  }

  if (existsSync(API_DIR)) {
    const apiFiles = walk(API_DIR).filter((f) => [".js", ".fs"].includes(extname(f)));
    for (const file of apiFiles) {
      const rel = relative(APP_DIR, file).replace(/\\/g, "/");
      const relModule = rel.replace(/\.fs$/, ".js");
      const out = join(DIST_DIR, relModule);
      await compileFile(file, out, "node");
      manifest.apiRoutes.push({ path: routeFromApiFile(file), module: `./${relModule}` });
    }
  }

  manifest.routes = sortRoutesByPriority(manifest.routes);
  manifest.parallelRoutes = sortRoutesByPriority(manifest.parallelRoutes);
  manifest.apiRoutes = sortRoutesByPriority(manifest.apiRoutes);

  const middlewareSource = [join(APP_DIR, "middleware.fs"), join(APP_DIR, "middleware.js")].find((p) => existsSync(p));
  if (middlewareSource) {
    const rel = relative(APP_DIR, middlewareSource).replace(/\\/g, "/").replace(/\.fs$/, ".js");
    const out = join(DIST_DIR, rel);
    await compileFile(middlewareSource, out, "node");
    manifest.middleware = `./${rel}`;
  }

  await optimizeImageAssets({ appDir: APP_DIR, distDir: DIST_DIR });
  await optimizeFontAssets({ appDir: APP_DIR, distDir: DIST_DIR });

  const stylesSrc = join(APP_DIR, "styles.css");
  const generatedStylesSrc = join(APP_DIR, "styles.generated.css");
  const generatedFontsCss = join(DIST_DIR, "fonts.generated.css");
  const styleChunks = [];
  if (existsSync(generatedFontsCss)) styleChunks.push(readFileSync(generatedFontsCss, "utf8"));
  if (existsSync(generatedStylesSrc)) styleChunks.push(readFileSync(generatedStylesSrc, "utf8"));
  if (existsSync(stylesSrc)) styleChunks.push(readFileSync(stylesSrc, "utf8"));
  const hasStyles = styleChunks.length > 0;
  if (hasStyles) {
    writeFileSync(join(DIST_DIR, "styles.css"), styleChunks.join("\n\n"), "utf8");
  }
  writeFileSync(join(DIST_DIR, "router.js"), buildRouterRuntime(), "utf8");
  const { routerAsset, stylesAsset } = applyAssetFingerprinting(manifest);
  generatePwaArtifacts({
    routerAsset,
    stylesAsset,
    cacheVersion: `${manifest.generatedAt}-${routerAsset}-${stylesAsset}`.replace(/[^a-zA-Z0-9.-]/g, "-"),
  });
  writeFileSync(join(DIST_DIR, "fastscript-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  writeFileSync(
    join(DIST_DIR, "index.html"),
    buildIndexHtml(hasStyles, { stylesAsset, routerAsset, devMode: manifest.devMode }),
    "utf8",
  );

  if (options.mode === "ssg") {
    await runSsg(manifest, { stylesAsset, routerAsset });
  }

  await plugins.onBuildEnd({ appDir: APP_DIR, distDir: DIST_DIR, manifest });

  console.log(`built FastScript app with ${manifest.routes.length} page route(s) and ${manifest.apiRoutes.length} api route(s)`);
}

function buildIndexHtml(hasStyles, { stylesAsset = "styles.css", routerAsset = "router.js", content = "", devMode = false } = {}) {
  const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23000'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-weight='800' font-size='16' fill='%23fff'>FS</text></svg>`;
  const faviconUrl = `data:image/svg+xml,${faviconSvg}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FastScript — Full-stack .fs language runtime</title>
    <meta name="description" content="Write product code in .fs, compile to optimized JavaScript, and ship to Node, Vercel, or Cloudflare with one command pipeline." />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" type="image/svg+xml" href="${faviconUrl}" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="FastScript — Full-stack .fs language runtime" />
    <meta property="og:description" content="Write .fs, compile to JS, ship anywhere. 1.8KB runtime. &lt;1s builds. 3 deploy targets." />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="FastScript" />
    <meta name="twitter:description" content="Full-stack .fs language runtime. Write once, ship to Node, Vercel, or Cloudflare." />
    ${hasStyles ? `<link rel="stylesheet" href="/${stylesAsset}" />` : ""}
  </head>
  <body>
    <div id="app">${content}</div>
    <script type="module" src="/${routerAsset}"></script>
    <script>
      (function () {
        if (!("serviceWorker" in navigator)) return;
        const isDevMode = ${devMode ? "true" : "false"};
        const host = (location && location.hostname) || "";
        const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "::1";
        if (isDevMode || isLocalhost) {
          navigator.serviceWorker.getRegistrations()
            .then((regs) => Promise.all(regs.map((r) => r.unregister())))
            .catch(() => {});
          if (window.caches && typeof window.caches.keys === "function") {
            window.caches.keys()
              .then((keys) => Promise.all(keys.filter((k) => String(k).indexOf("fastscript-") === 0).map((k) => window.caches.delete(k))))
              .catch(() => {});
          }
          return;
        }
        navigator.serviceWorker.register("/service-worker.js").catch(() => {});
      })();
    </script>
  </body>
</html>`;
}

function buildRouterRuntime() {
  return `
const app = document.getElementById("app");
const manifest = await fetch("/fastscript-manifest.json").then((r) => r.json());
let overlayEl = null;

function stackMap(stack) {
  if (!stack) return "";
  return String(stack).replace(/\\b(dist\\\\|dist\\/)/g, "app/");
}

function showOverlay(error) {
  if (!manifest.devMode) return;
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.id = "__fs_error_overlay";
    overlayEl.style.cssText = "position:fixed;inset:0;z-index:999999;background:rgba(10,10,10,.94);color:#fff;padding:24px;font:14px/1.45 ui-monospace,Menlo,monospace;overflow:auto;white-space:pre-wrap";
    document.body.appendChild(overlayEl);
  }
  const message = error?.message || String(error);
  const stack = stackMap(error?.stack || "");
  overlayEl.textContent = "FastScript Runtime Error\\n\\n" + message + (stack ? "\\n\\n" + stack : "");
}

function clearOverlay() {
  if (!overlayEl) return;
  overlayEl.remove();
  overlayEl = null;
}

function parseRouteToken(token) {
  const m = /^:([A-Za-z_$][\\w$]*)(\\*)?(\\?)?$/.exec(token || "");
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

function findRoute(pathname) {
  let best = null;
  for (const route of manifest.routes) {
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

function resolveLocale(pathname) {
  const cfg = manifest.i18n || { locales: ["en"], defaultLocale: "en" };
  const parts = String(pathname || "/").split("/").filter(Boolean);
  const head = parts[0];
  if (head && cfg.locales.includes(head)) {
    const normalized = "/" + parts.slice(1).join("/");
    return { locale: head, pathname: normalized === "/" ? "/" : normalized || "/" };
  }
  return { locale: cfg.defaultLocale || "en", pathname: pathname || "/" };
}

async function hydrate(mod, ctx) {
  if (typeof mod.hydrate === "function") {
    await mod.hydrate({ ...ctx, root: app });
  }
}

async function hydrateLayouts(route, ctx) {
  const layouts = route?.layouts && route.layouts.length ? route.layouts : (manifest.layout ? [manifest.layout] : []);
  for (const layoutPath of layouts) {
    const layout = await import(layoutPath);
    if (typeof layout.hydrate === "function") {
      await layout.hydrate({ ...ctx, root: app });
    }
  }
}

async function applyLayouts(html, route, ctx, slots = {}) {
  const layouts = route?.layouts && route.layouts.length ? route.layouts : (manifest.layout ? [manifest.layout] : []);
  if (!layouts.length) return html;
  let out = html;
  for (const layoutPath of layouts) {
    const layout = await import(layoutPath);
    out = layout.default ? layout.default({ ...ctx, slots, content: out }) : out;
  }
  return out;
}

async function resolveParallel(pathname, params, data) {
  const out = {};
  for (const route of manifest.parallelRoutes || []) {
    const hit = match(route.path, pathname);
    if (!hit) continue;
    const mod = await import(route.module);
    let payload = {};
    if (typeof mod.load === "function") payload = (await mod.load({ pathname, params, slot: route.slot })) || {};
    const html = mod.default ? mod.default({ ...payload, params, pathname, slot: route.slot }) : "";
    out[route.slot || "default"] = html || "";
  }
  return out;
}

async function render(pathname, force = false) {
  try {
    clearOverlay();
    const path = pathname || "/";
    const localeInfo = resolveLocale(path);
    const routePath = localeInfo.pathname;
    const ssr = globalThis.__FASTSCRIPT_SSR;
    const initialHit = ssr && ssr.pathname === routePath;

    const matched = findRoute(routePath);
    let mod = null;
    let params = {};
    let data = {};
    let html = "";
    let slots = {};

    if (matched) {
      params = matched.params;
      mod = await import(matched.route.module);
    }

    if (initialHit && !force) {
      html = app.innerHTML;
      if (ssr?.data) data = ssr.data;
    } else if (!matched && manifest.notFound) {
      const nfMod = await import(manifest.notFound);
      html = (nfMod.default ? nfMod.default({ pathname: routePath, locale: localeInfo.locale }) : "<h1>404</h1>") || "";
      app.innerHTML = html;
    } else if (matched) {
      if (typeof mod.load === "function") data = (await mod.load({ params, pathname: routePath, locale: localeInfo.locale })) || {};
      html = (mod.default ? mod.default({ ...data, params, pathname: routePath, locale: localeInfo.locale }) : "") || "";
      slots = await resolveParallel(routePath, params, data);
      html = await applyLayouts(html, matched.route, { pathname: routePath, locale: localeInfo.locale, params, data }, slots);
      app.innerHTML = html;
    }

    bindLinks();
    if (matched) {
      await hydrateLayouts(matched.route, { pathname: routePath, locale: localeInfo.locale, params, data, slots });
    } else if (!matched && manifest.notFound) {
      await hydrateLayouts({ layouts: manifest.layout ? [manifest.layout] : [] }, { pathname: routePath, locale: localeInfo.locale, params, data, slots });
    }
    if (mod) await hydrate(mod, { pathname: routePath, locale: localeInfo.locale, params, data, slots });
    globalThis.__FASTSCRIPT_SSR = null;
  } catch (error) {
    showOverlay(error);
  }
}

function bindLinks() {
  for (const a of app.querySelectorAll('a[href^="/"]')) {
    if (a.dataset.fsBound === "1") continue;
    a.dataset.fsBound = "1";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      let href = a.getAttribute("href");
      const localeInfo = resolveLocale(location.pathname);
      const cfg = manifest.i18n || { locales: ["en"], defaultLocale: "en" };
      if (localeInfo.locale && localeInfo.locale !== cfg.defaultLocale && !href.startsWith("/" + localeInfo.locale + "/") && href !== "/" + localeInfo.locale) {
        href = href === "/" ? "/" + localeInfo.locale : "/" + localeInfo.locale + href;
      }
      history.pushState({}, "", href);
      window.scrollTo(0, 0);
      render(location.pathname, true);
    });
  }
}

if (history.scrollRestoration) history.scrollRestoration = "manual";

function connectHmr() {
  if (!manifest.devMode) return;
  const es = new EventSource("/__hmr");
  es.onmessage = () => render(location.pathname, true);
  es.onerror = () => {};
}

window.addEventListener("popstate", () => render(location.pathname, true));
connectHmr();
render(location.pathname, false);
`;
}
