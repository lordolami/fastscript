import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild } from "../src/build.mjs";

await runBuild();

const manifestPath = resolve("dist", "fastscript-manifest.json");
if (!existsSync(manifestPath)) throw new Error("missing dist/fastscript-manifest.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) throw new Error("manifest.routes missing or empty");
if (!Array.isArray(manifest.apiRoutes) || manifest.apiRoutes.length === 0) throw new Error("manifest.apiRoutes missing or empty");
if (!manifest.layout || !manifest.notFound) throw new Error("layout/notFound contract missing");

const routeSet = new Set();
for (const route of manifest.routes) {
  const key = `${route.path}|${route.module}`;
  if (routeSet.has(key)) throw new Error(`duplicate route entry: ${key}`);
  routeSet.add(key);
  if (typeof route.path !== "string" || !route.path.startsWith("/")) throw new Error(`invalid route path: ${route.path}`);
}

const requiredRoutes = ["/", "/docs", "/learn", "/benchmarks", "/showcase", "/blog"];
for (const path of requiredRoutes) {
  if (!manifest.routes.some((route) => route.path === path)) {
    throw new Error(`required route missing: ${path}`);
  }
}

const requiredApis = ["/api/hello", "/api/upload", "/api/webhook", "/api/docs-search", "/api/auth"];
for (const path of requiredApis) {
  if (!manifest.apiRoutes.some((route) => route.path === path)) {
    throw new Error(`required api route missing: ${path}`);
  }
}

const routerAssets = readdirSync(resolve("dist")).filter((name) => /^router\..+\.js$/.test(name));
if (!routerAssets.length) throw new Error("router runtime asset contract missing");

console.log(`test-runtime-contract pass: ${manifest.routes.length} routes, ${manifest.apiRoutes.length} APIs`);
