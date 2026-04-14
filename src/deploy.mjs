import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runBuild } from "./build.mjs";

function parseArgs(args = []) {
  let target = "node";
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--target") target = (args[i + 1] || "node").toLowerCase();
  }
  return { target };
}

async function ensureBuildArtifacts(root) {
  const manifestPath = join(root, "dist", "fastscript-manifest.json");
  if (existsSync(manifestPath)) return;
  await runBuild();
}

function writeNodeAdapter(root) {
  writeFileSync(
    join(root, "ecosystem.config.cjs"),
    `module.exports = {
  apps: [{
    name: "fastscript-app",
    script: "node",
    args: "./src/cli.mjs start",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 4173
    }
  }]
};
`,
    "utf8",
  );
  writeFileSync(
    join(root, "Dockerfile"),
    `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
ENV NODE_ENV=production
ENV PORT=4173
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O /dev/null http://127.0.0.1:4173/__metrics || exit 1
CMD ["node","./src/cli.mjs","start"]
`,
    "utf8",
  );
}

function writeVercelAdapter(root) {
  mkdirSync(join(root, "api"), { recursive: true });
  writeFileSync(
    join(root, "api", "[[...fastscript]].mjs"),
    `import handler from "../src/serverless-handler.mjs";
export default handler;
`,
    "utf8",
  );
  writeFileSync(
    join(root, "vercel.json"),
    JSON.stringify(
      {
        version: 2,
        functions: {
          "api/[[...fastscript]].mjs": {
            runtime: "nodejs20.x",
            maxDuration: 30,
          },
        },
        headers: [
          {
            source: "/(.*\\.[a-f0-9]{8}\\.(js|css))",
            headers: [{ key: "cache-control", value: "public, max-age=31536000, immutable" }],
          },
        ],
        routes: [
          { src: "/(.*\\.(js|css|json|map|webmanifest|png|jpg|jpeg|svg|gif|woff|woff2|ttf|otf))", dest: "/dist/$1" },
          { src: "/service-worker.js", dest: "/dist/service-worker.js" },
          { src: "/manifest.webmanifest", dest: "/dist/manifest.webmanifest" },
          { src: "/(.*)", dest: "/api/[[...fastscript]].mjs" },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );
}

function collectCloudflareModules(manifest) {
  const modules = new Set();
  for (const route of manifest.routes || []) modules.add(route.module);
  for (const route of manifest.parallelRoutes || []) modules.add(route.module);
  for (const route of manifest.apiRoutes || []) modules.add(route.module);
  for (const route of manifest.routes || []) {
    for (const layout of route.layouts || []) modules.add(layout);
  }
  if (manifest.layout) modules.add(manifest.layout);
  if (manifest.notFound) modules.add(manifest.notFound);
  if (manifest.middleware) modules.add(manifest.middleware);
  return [...modules].filter(Boolean).sort();
}

function buildCloudflareWorkerSource({ manifest, assetMap }) {
  const modulePaths = collectCloudflareModules(manifest);
  const imports = [];
  const moduleEntries = [];
  modulePaths.forEach((modulePath, index) => {
    const alias = `m${index}`;
    const spec = `./${String(modulePath).replace(/^\.\//, "")}`;
    imports.push(`import * as ${alias} from "${spec}";`);
    moduleEntries.push(`  "${modulePath}": ${alias}`);
  });

  const lines = [];
  lines.push(...imports);
  lines.push("");
  lines.push(`const MODULES = {\n${moduleEntries.join(",\n")}\n};`);
  lines.push(`const MANIFEST = ${JSON.stringify(manifest, null, 2)};`);
  lines.push(`const ASSET_MAP = ${JSON.stringify(assetMap || {}, null, 2)};`);
  lines.push(`
function moduleFor(path) {
  return MODULES[path] || null;
}

function assetPath(name) {
  return "/" + (ASSET_MAP[name] || name);
}

function parseRouteToken(token) {
  const m = /^:([A-Za-z_$][\\w$]*)(\\*)?(\\?)?$/.exec(token || "");
  if (!m) return null;
  return { name: m[1], catchAll: Boolean(m[2]), optional: Boolean(m[3]) };
}

function match(routePath, pathname) {
  const routeParts = String(routePath || "/").split("/").filter(Boolean);
  const pathParts = String(pathname || "/").split("/").filter(Boolean);
  const params = {};
  let ri = 0;
  let pi = 0;

  while (ri < routeParts.length) {
    const token = routeParts[ri];
    const dyn = parseRouteToken(token);
    if (dyn && dyn.catchAll) {
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

function resolveRoute(routes, pathname) {
  for (const route of routes || []) {
    const params = match(route.path, pathname);
    if (params) return { route, params };
  }
  return null;
}

function parseCookies(header) {
  const out = {};
  String(header || "").split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx <= 0) return;
    const key = decodeURIComponent(part.slice(0, idx).trim());
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = value;
  });
  return out;
}

function serializeCookie(name, value, opts = {}) {
  const segs = [\`\${encodeURIComponent(name)}=\${encodeURIComponent(value)}\`];
  if (opts.maxAge !== undefined) segs.push(\`Max-Age=\${Number(opts.maxAge)}\`);
  if (opts.path) segs.push(\`Path=\${opts.path}\`);
  if (opts.httpOnly) segs.push("HttpOnly");
  if (opts.secure) segs.push("Secure");
  if (opts.sameSite) segs.push(\`SameSite=\${opts.sameSite}\`);
  return segs.join("; ");
}

async function readJsonBody(request) {
  const text = await request.text();
  if (!text.trim()) return {};
  try { return JSON.parse(text); }
  catch {
    const error = new Error("Invalid JSON body");
    error.status = 400;
    throw error;
  }
}

function validateShape(schema, input, scope = "input") {
  if (!schema || typeof schema !== "object") return { ok: true, value: input ?? {} };
  const errors = [];
  const out = {};
  const source = input && typeof input === "object" ? input : {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = source[key];
    const optional = typeof rule === "string" && rule.endsWith("?");
    const t = typeof rule === "string" ? rule.replace(/\\?$/, "") : String(rule);
    if (value === undefined || value === null) {
      if (!optional) errors.push(\`\${scope}.\${key} is required\`);
      continue;
    }
    if (t === "array") {
      if (!Array.isArray(value)) errors.push(\`\${scope}.\${key} must be array\`);
      else out[key] = value;
      continue;
    }
    if (t === "int") {
      const n = Number(value);
      if (!Number.isInteger(n)) errors.push(\`\${scope}.\${key} must be integer\`);
      else out[key] = n;
      continue;
    }
    if (t === "float" || t === "number") {
      const n = Number(value);
      if (!Number.isFinite(n)) errors.push(\`\${scope}.\${key} must be number\`);
      else out[key] = n;
      continue;
    }
    if (t === "bool" || t === "boolean") {
      if (typeof value !== "boolean") errors.push(\`\${scope}.\${key} must be boolean\`);
      else out[key] = value;
      continue;
    }
    if (t === "str" || t === "string") {
      if (typeof value !== "string") errors.push(\`\${scope}.\${key} must be string\`);
      else out[key] = value;
      continue;
    }
    out[key] = value;
  }
  if (errors.length) {
    const error = new Error(\`Validation failed: \${errors.join("; ")}\`);
    error.status = 400;
    error.details = errors;
    throw error;
  }
  return { ok: true, value: out };
}

function makeHelpers(responseCookies) {
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
      responseCookies.push(serializeCookie(name, value, opts));
    }
  };
}

function toResponse(payload, responseCookies = []) {
  if (!payload) return new Response(null, { status: 204 });
  const status = payload.status ?? 200;
  const headers = new Headers(payload.headers || {});
  for (const cookie of responseCookies) headers.append("set-cookie", cookie);
  if (payload.json !== undefined) {
    headers.set("content-type", "application/json; charset=utf-8");
    return new Response(JSON.stringify(payload.json), { status, headers });
  }
  if (!headers.has("content-type")) headers.set("content-type", "text/plain; charset=utf-8");
  return new Response(payload.body ?? "", { status, headers });
}

function htmlDoc(content, ssrData) {
  const safe = JSON.stringify(ssrData ?? {}).replace(/</g, "\\\\u003c");
  return \`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FastScript</title>
    <link rel="stylesheet" href="\${assetPath("styles.css")}" />
  </head>
  <body>
    <div id="app">\${content}</div>
    <script>window.__FASTSCRIPT_SSR=\${safe}</script>
    <script type="module" src="\${assetPath("router.js")}"></script>
  </body>
</html>\`;
}

function localeFromPath(pathname) {
  const i18n = MANIFEST.i18n || { locales: ["en"], defaultLocale: "en" };
  const parts = String(pathname || "/").split("/").filter(Boolean);
  const head = parts[0];
  if (head && i18n.locales.includes(head)) {
    const normalized = "/" + parts.slice(1).join("/");
    return { locale: head, pathname: normalized === "/" ? "/" : normalized || "/" };
  }
  return { locale: i18n.defaultLocale || "en", pathname: pathname || "/" };
}

async function maybeServeStatic(request, env, pathname) {
  if (!env || !env.ASSETS) return null;
  const staticLike = /\\.[a-zA-Z0-9]+$/.test(pathname) || pathname === "/manifest.webmanifest" || pathname === "/service-worker.js";
  if (!staticLike) return null;
  const res = await env.ASSETS.fetch(request);
  if (res && res.status !== 404) return res;
  return null;
}

async function runMiddlewares(ctx, middlewares, done) {
  let idx = -1;
  async function next() {
    idx += 1;
    const mw = middlewares[idx];
    if (!mw) return done();
    return mw(ctx, next);
  }
  return next();
}

async function renderParallel(pathname, locale, baseParams) {
  const slots = {};
  for (const route of MANIFEST.parallelRoutes || []) {
    const hit = match(route.path, pathname);
    if (!hit) continue;
    const mod = moduleFor(route.module);
    if (!mod) continue;
    let data = {};
    if (typeof mod.load === "function") data = (await mod.load({ pathname, params: baseParams, locale, slot: route.slot })) || {};
    const html = mod.default ? mod.default({ ...data, pathname, params: baseParams, locale, slot: route.slot }) : "";
    slots[route.slot || "default"] = html || "";
  }
  return slots;
}

async function applyLayouts(route, pathname, locale, html, params, data, slots) {
  const list = (route.layouts && route.layouts.length ? route.layouts : (MANIFEST.layout ? [MANIFEST.layout] : [])) || [];
  let out = html;
  for (const layoutPath of list) {
    const mod = moduleFor(layoutPath);
    if (!mod || typeof mod.default !== "function") continue;
    out = mod.default({ content: out, pathname, locale, params, data, slots });
  }
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const localized = localeFromPath(url.pathname);
    const pathname = localized.pathname;
    const method = (request.method || "GET").toUpperCase();

    const staticResponse = await maybeServeStatic(request, env, url.pathname);
    if (staticResponse) return staticResponse;

    const responseCookies = [];
    const helpers = makeHelpers(responseCookies);
    const cookies = parseCookies(request.headers.get("cookie") || "");
    const queryObject = Object.fromEntries(url.searchParams.entries());
    const ctx = {
      req: request,
      env,
      pathname,
      method,
      locale: localized.locale,
      params: {},
      query: queryObject,
      cookies,
      input: {
        body: null,
        query: queryObject,
        async readJson() {
          if (this.body !== null) return this.body;
          this.body = await readJsonBody(request);
          return this.body;
        },
        validateQuery(schema) {
          return validateShape(schema, queryObject, "query").value;
        },
        async validateBody(schema) {
          const body = await this.readJson();
          return validateShape(schema, body, "body").value;
        }
      },
      helpers,
      user: null,
      auth: {
        requireUser() {
          const error = new Error("Unauthorized");
          error.status = 401;
          throw error;
        }
      }
    };

    try {
      const middlewares = [];
      if (MANIFEST.middleware) {
        const mm = moduleFor(MANIFEST.middleware);
        if (Array.isArray(mm?.middlewares)) middlewares.push(...mm.middlewares);
        else if (typeof mm?.middleware === "function") middlewares.push(mm.middleware);
        else if (typeof mm?.default === "function") middlewares.push(mm.default);
      }

      const result = await runMiddlewares(ctx, middlewares, async () => {
        if (pathname.startsWith("/api/")) {
          const apiHit = resolveRoute(MANIFEST.apiRoutes || [], pathname);
          if (!apiHit) return { status: 404, json: { ok: false, error: "API route not found" } };
          ctx.params = apiHit.params;
          const mod = moduleFor(apiHit.route.module);
          if (!mod) return { status: 500, json: { ok: false, error: "API module missing" } };
          const handler = mod[method];
          if (typeof handler !== "function") return { status: 405, json: { ok: false, error: \`Method \${method} not allowed\` } };
          if (mod.schemas?.[method]) {
            const body = await ctx.input.readJson();
            validateShape(mod.schemas[method], body, "body");
          }
          return handler(ctx, helpers);
        }

        const hit = resolveRoute(MANIFEST.routes || [], pathname);
        if (!hit) {
          if (MANIFEST.notFound) {
            const nf = moduleFor(MANIFEST.notFound);
            const notFoundHtml = nf?.default ? nf.default({ pathname, locale: ctx.locale }) : "<h1>404</h1>";
            return { status: 404, body: htmlDoc(notFoundHtml, { pathname, data: null }), headers: { "content-type": "text/html; charset=utf-8" } };
          }
          return { status: 404, body: "Not found" };
        }

        ctx.params = hit.params;
        const mod = moduleFor(hit.route.module);
        if (!mod) return { status: 500, body: "Route module missing" };

        if (!["GET", "HEAD"].includes(method) && typeof mod[method] === "function") {
          if (mod.schemas?.[method]) {
            const body = await ctx.input.readJson();
            validateShape(mod.schemas[method], body, "body");
          }
          return mod[method](ctx, helpers);
        }

        let data = {};
        if (typeof mod.load === "function") data = (await mod.load({ ...ctx, pathname, params: hit.params, locale: ctx.locale })) || {};
        let html = mod.default ? mod.default({ ...data, pathname, params: hit.params, locale: ctx.locale }) : "";
        const slots = await renderParallel(pathname, ctx.locale, hit.params);
        html = await applyLayouts(hit.route, pathname, ctx.locale, html, hit.params, data, slots);
        return {
          status: 200,
          body: htmlDoc(html, { pathname, data }),
          headers: { "content-type": "text/html; charset=utf-8" },
        };
      });

      return toResponse(result, responseCookies);
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      return new Response(JSON.stringify({ ok: false, error: error?.message || "Unknown error", details: error?.details || null }), {
        status,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
  }
};
`);
  return lines.join("\n");
}

function writeCloudflareAdapter(root) {
  const distDir = join(root, "dist");
  const manifestPath = join(distDir, "fastscript-manifest.json");
  const assetManifestPath = join(distDir, "asset-manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error("Cloudflare deploy requires build output. Run `fastscript build` first.");
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const assetManifest = existsSync(assetManifestPath) ? JSON.parse(readFileSync(assetManifestPath, "utf8")) : { mapping: {} };
  const source = buildCloudflareWorkerSource({ manifest, assetMap: assetManifest.mapping || {} });

  writeFileSync(join(distDir, "worker.js"), source, "utf8");
  writeFileSync(
    join(root, "wrangler.toml"),
    `name = "fastscript-app"
main = "dist/worker.js"
compatibility_date = "2026-04-14"
compatibility_flags = ["nodejs_compat"]
workers_dev = true

[assets]
directory = "dist"
binding = "ASSETS"
`,
    "utf8",
  );
}

export async function runDeploy(args = []) {
  const { target } = parseArgs(args);
  const root = resolve(process.cwd());

  if (target === "node" || target === "pm2") {
    writeNodeAdapter(root);
    console.log("deploy adapter ready: node/pm2 + docker");
    return;
  }

  if (target === "vercel") {
    await ensureBuildArtifacts(root);
    writeVercelAdapter(root);
    console.log("deploy adapter ready: vercel (full catch-all SSR/API)");
    return;
  }

  if (target === "cloudflare") {
    await ensureBuildArtifacts(root);
    writeCloudflareAdapter(root);
    console.log("deploy adapter ready: cloudflare (worker SSR/API + static assets)");
    return;
  }

  throw new Error(`Unknown deploy target: ${target}. Use node|pm2|vercel|cloudflare`);
}

