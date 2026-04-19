import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";
import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";
import { rewritePublicMetaShell } from "./public-meta.mjs";

const DIST_DIR = resolve("dist");
const HASHED_JS_RE = /^(?<name>.+)\.(?<hash>[a-f0-9]{8})\.js$/i;

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function saveJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function logicalCandidatesForModule(modulePath) {
  const normalized = String(modulePath || "").replace(/^\.\//, "");
  const parsed = parse(normalized);
  const dir = join(DIST_DIR, parsed.dir);
  const fileStem = parsed.name;
  return { normalized, dir, fileStem };
}

function findHashedModule(modulePath) {
  const { dir, fileStem } = logicalCandidatesForModule(modulePath);
  const names = existsSync(dir) ? readdirSync(dir) : [];
  for (const name of names) {
    const match = name.match(HASHED_JS_RE);
    if (match?.groups?.name === fileStem) return join(dir, name);
  }
  return null;
}

function ensureLogicalAlias(modulePath) {
  const normalized = String(modulePath || "").replace(/^\.\//, "");
  const logicalPath = join(DIST_DIR, normalized);
  if (existsSync(logicalPath)) return normalized;
  const hashedPath = findHashedModule(normalized);
  if (!hashedPath) return normalized;
  ensureDir(logicalPath);
  copyFileSync(hashedPath, logicalPath);
  return normalized;
}

function patchManifestAndAssets() {
  const manifestPath = join(DIST_DIR, "fastscript-manifest.json");
  const assetManifestPath = join(DIST_DIR, "asset-manifest.json");
  if (!existsSync(manifestPath) || !existsSync(assetManifestPath)) return;

  const manifest = loadJson(manifestPath);
  const assetManifest = loadJson(assetManifestPath);
  const mapping = { ...(assetManifest.mapping || {}) };

  const allModules = new Set([
    manifest.layout,
    manifest.notFound,
    manifest.middleware,
    ...(manifest.routes || []).flatMap((route) => [route.module, ...(route.layouts || [])]),
    ...(manifest.apiRoutes || []).map((route) => route.module),
  ].filter(Boolean));

  for (const modulePath of allModules) {
    const normalized = ensureLogicalAlias(modulePath);
    const hashedPath = findHashedModule(normalized);
    if (hashedPath) {
      mapping[normalized.replace(/\\/g, "/")] = hashedPath.replace(`${DIST_DIR}\\`, "").replace(/\\/g, "/");
    }
  }

  const rootLayout = "./pages/_layout.js";
  if (mapping[rootLayout.replace(/^\.\//, "")] || findHashedModule(rootLayout)) {
    ensureLogicalAlias(rootLayout);
    manifest.layout = rootLayout;
  }

  assetManifest.mapping = mapping;
  saveJson(assetManifestPath, assetManifest);
  saveJson(manifestPath, manifest);
}

export async function runBuild(options = {}) {
  rmSync(DIST_DIR, { recursive: true, force: true });
  await runPrivateBuild(options);
  patchManifestAndAssets();
  rewritePublicMetaShell();
}

export * from "@fastscript/core-private/build";
