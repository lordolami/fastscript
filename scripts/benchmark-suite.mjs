import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const dist = resolve("dist");
const outDir = resolve("benchmarks");
mkdirSync(outDir, { recursive: true });

function size(path) {
  if (!existsSync(path)) return 0;
  return gzipSync(readFileSync(path), { level: 9 }).byteLength;
}

const manifest = existsSync(join(dist, "fastscript-manifest.json"))
  ? JSON.parse(readFileSync(join(dist, "fastscript-manifest.json"), "utf8"))
  : { routes: [] };
const assets = existsSync(join(dist, "asset-manifest.json"))
  ? JSON.parse(readFileSync(join(dist, "asset-manifest.json"), "utf8"))
  : { mapping: {} };

function asset(name) {
  return assets.mapping?.[name] || name;
}

const metrics = {
  generatedAt: new Date().toISOString(),
  js: size(join(dist, asset("router.js"))),
  css: size(join(dist, asset("styles.css"))),
  routes: manifest.routes.length,
  apiRoutes: manifest.apiRoutes?.length ?? 0,
};

writeFileSync(join(outDir, "suite-latest.json"), JSON.stringify(metrics, null, 2), "utf8");
console.log(`benchmark suite generated: ${join(outDir, "suite-latest.json")}`);
