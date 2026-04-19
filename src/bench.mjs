import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, resolve } from "node:path";

const DIST = resolve("dist");
const JS_BUDGET_BYTES = Number(process.env.FASTSCRIPT_JS_BUDGET_KB || 30) * 1024;
const CSS_BUDGET_BYTES = Number(process.env.FASTSCRIPT_CSS_BUDGET_KB || 16) * 1024;

function gzipSize(path) {
  if (!existsSync(path)) return 0;
  const raw = readFileSync(path);
  return gzipSync(raw, { level: 9 }).byteLength;
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function loadJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function resolveAsset(distPath, assetManifest, logicalName) {
  const direct = join(distPath, logicalName);
  if (existsSync(direct)) return direct;
  const mapped = assetManifest?.mapping?.[logicalName];
  if (!mapped) return direct;
  return join(distPath, mapped.replace(/^\.\//, ""));
}

export async function runBench() {
  const manifestPath = join(DIST, "fastscript-manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error("Missing dist build output. Run: fastscript build");
  }

  const manifest = loadJson(manifestPath);
  const assetManifest = loadJson(join(DIST, "asset-manifest.json"));
  const jsAssets = [resolveAsset(DIST, assetManifest, "router.js")];
  const cssAssets = [resolveAsset(DIST, assetManifest, "styles.css")];

  if (manifest.layout) jsAssets.push(resolveAsset(DIST, assetManifest, manifest.layout.replace(/^\.\//, "")));
  const root = manifest.routes.find((r) => r.path === "/");
  if (root?.module) jsAssets.push(resolveAsset(DIST, assetManifest, root.module.replace(/^\.\//, "")));

  const totalJs = jsAssets.reduce((sum, p) => sum + gzipSize(p), 0);
  const totalCss = cssAssets.reduce((sum, p) => sum + gzipSize(p), 0);

  console.log(`3G budget check -> JS: ${kb(totalJs)} / ${kb(JS_BUDGET_BYTES)}, CSS: ${kb(totalCss)} / ${kb(CSS_BUDGET_BYTES)}`);

  const errors = [];
  if (totalJs > JS_BUDGET_BYTES) errors.push(`JS budget exceeded by ${kb(totalJs - JS_BUDGET_BYTES)}`);
  if (totalCss > CSS_BUDGET_BYTES) errors.push(`CSS budget exceeded by ${kb(totalCss - CSS_BUDGET_BYTES)}`);

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
