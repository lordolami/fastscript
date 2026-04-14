import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import { normalizeFastScript } from "./fs-normalize.mjs";
import { createPluginRuntime } from "./plugins.mjs";
import { ensureDesignSystem, validateAppStyles } from "./style-system.mjs";
import { assertFastScript } from "./fs-diagnostics.mjs";
import { inferRouteLayouts, inferRouteMeta, isLayoutFile, isNotFoundFile } from "./routes.mjs";
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
    });
    writeFileSync(target, wrapped, "utf8");
  }
}

function generatePwaArtifacts({ routerAsset, stylesAsset }) {
  const assets = walk(DIST_DIR)
    .map((file) => relDist(file))
    .filter((rel) => /\.(js|css|json|html)$/.test(rel))
    .map((rel) => `/${rel}`);
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
  const sw = `const CACHE_NAME = "fastscript-v1";\nconst ASSETS = ${JSON.stringify([...new Set(["/", `/${routerAsset}`, `/${stylesAsset}`, ...assets])], null, 2)};\nself.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });\nself.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });\nself.addEventListener("fetch", (event) => { if (event.request.method !== "GET") return; event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request).then((res) => { const copy = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {}); return res; }))); });\n`;
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

  rmSync(DIST_DIR, { recursive: true, force: true });
  mkdirSync(DIST_DIR, { recursive: true });

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
      const routeMeta = inferRouteMeta(file, PAGES_DIR);
      if (routeMeta.routePath === "/" && !manifest.layout) manifest.layout = `./${relModule}`;
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
  generatePwaArtifacts({ routerAsset, stylesAsset });
  writeFileSync(join(DIST_DIR, "fastscript-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  writeFileSync(join(DIST_DIR, "index.html"), buildIndexHtml(hasStyles, { stylesAsset, routerAsset }), "utf8");

  if (options.mode === "ssg") {
    await runSsg(manifest, { stylesAsset, routerAsset });
  }

  await plugins.onBuildEnd({ appDir: APP_DIR, distDir: DIST_DIR, manifest });

  console.log(`built FastScript app with ${manifest.routes.length} page route(s) and ${manifest.apiRoutes.length} api route(s)`);
}

function buildIndexHtml(hasStyles, { stylesAsset = "styles.css", routerAsset = "router.js", content = "" } = {}) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FastScript</title>
    <link rel="manifest" href="/manifest.webmanifest" />
    ${hasStyles ? `<link rel="stylesheet" href="/${stylesAsset}" />` : ""}
  </head>
  <body>
    <div id="app">${content}</div>
    <script type="module" src="/${routerAsset}"></script>
    <script>if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/service-worker.js").catch(() => {}); }</script>
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

function match(routePath, pathname) {
  const a = routePath.split("/").filter(Boolean);
  const b = pathname.split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = b[i];
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

function findRoute(pathname) {
  for (const route of manifest.routes) {
    const params = match(route.path, pathname);
    if (params) return { route, params };
  }
  return null;
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
      render(location.pathname, true);
    });
  }
}

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
