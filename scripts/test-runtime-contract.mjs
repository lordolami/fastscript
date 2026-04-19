import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild } from "../src/build.mjs";

await runBuild();

const manifestPath = resolve("dist", "fastscript-manifest.json");
if (!existsSync(manifestPath)) throw new Error("missing dist/fastscript-manifest.json");
const assetManifestPath = resolve("dist", "asset-manifest.json");
if (!existsSync(assetManifestPath)) throw new Error("missing dist/asset-manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const assetManifest = JSON.parse(readFileSync(assetManifestPath, "utf8"));

if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) throw new Error("manifest.routes missing or empty");
if (!Array.isArray(manifest.apiRoutes) || manifest.apiRoutes.length === 0) throw new Error("manifest.apiRoutes missing or empty");
if (!manifest.layout || !manifest.notFound) throw new Error("layout/notFound contract missing");

const isHashed = (value) => /\.[a-f0-9]{8}\.[mc]?js$|\.[a-f0-9]{8}\.css$/i.test(String(value || ""));
const logicalKey = (value) => String(value || "").replace(/^\.\//, "");

const routeSet = new Set();
for (const route of manifest.routes) {
  const key = `${route.path}|${route.module}`;
  if (routeSet.has(key)) throw new Error(`duplicate route entry: ${key}`);
  routeSet.add(key);
  if (typeof route.path !== "string" || !route.path.startsWith("/")) throw new Error(`invalid route path: ${route.path}`);
  if (isHashed(route.module)) throw new Error(`route module should stay logical: ${route.module}`);
  if (!assetManifest.mapping?.[logicalKey(route.module)]) throw new Error(`route module missing asset-manifest mapping: ${route.module}`);
  for (const layoutPath of route.layouts || []) {
    if (isHashed(layoutPath)) throw new Error(`layout path should stay logical: ${layoutPath}`);
    if (!assetManifest.mapping?.[logicalKey(layoutPath)]) throw new Error(`layout missing asset-manifest mapping: ${layoutPath}`);
  }
}

for (const route of manifest.apiRoutes || []) {
  if (isHashed(route.module)) throw new Error(`api route module should stay logical: ${route.module}`);
  if (!assetManifest.mapping?.[logicalKey(route.module)]) throw new Error(`api route missing asset-manifest mapping: ${route.module}`);
}

if (isHashed(manifest.layout) || isHashed(manifest.notFound) || isHashed(manifest.middleware)) {
  throw new Error("layout/notFound/middleware should stay logical in fastscript-manifest");
}
if (!assetManifest.mapping?.[logicalKey(manifest.layout)]) throw new Error("layout missing asset-manifest mapping");
if (!assetManifest.mapping?.[logicalKey(manifest.notFound)]) throw new Error("notFound missing asset-manifest mapping");
if (manifest.middleware && !assetManifest.mapping?.[logicalKey(manifest.middleware)]) throw new Error("middleware missing asset-manifest mapping");

const requiredRoutes = [
  "/",
  "/docs",
  "/learn",
  "/benchmarks",
  "/showcase",
  "/blog",
  "/platform",
  "/platform/datasets",
  "/platform/experiments",
  "/platform/training",
  "/platform/evals",
  "/platform/models",
  "/platform/workspaces",
  "/platform/commands",
];
for (const path of requiredRoutes) {
  if (!manifest.routes.some((route) => route.path === path)) {
    throw new Error(`required route missing: ${path}`);
  }
}

const requiredApis = [
  "/api/hello",
  "/api/upload",
  "/api/webhook",
  "/api/docs-search",
  "/api/auth",
  "/api/platform/datasets",
  "/api/platform/training/jobs",
  "/api/platform/models",
  "/api/platform/workspaces",
  "/api/platform/commands",
];
for (const path of requiredApis) {
  if (!manifest.apiRoutes.some((route) => route.path === path)) {
    throw new Error(`required api route missing: ${path}`);
  }
}

const routerAssets = readdirSync(resolve("dist")).filter((name) => /^router\..+\.js$/.test(name));
if (!routerAssets.length) throw new Error("router runtime asset contract missing");

console.log(`test-runtime-contract pass: ${manifest.routes.length} routes, ${manifest.apiRoutes.length} APIs`);
