import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runBuild } from "../src/build.mjs";

const DIST = resolve("dist");
const MULTI_HASH_RE = /\.[a-f0-9]{8}\.[a-f0-9]{8}\.[mc]?js$|\.[a-f0-9]{8}\.[a-f0-9]{8}\.css$/i;
const HASHED_RE = /\.[a-f0-9]{8}\.[mc]?js$|\.[a-f0-9]{8}\.css$/i;

function assertNoMultiHash(stateLabel) {
  const files = readdirSync(DIST, { recursive: true }).map((entry) => String(entry).replace(/\\/g, "/"));
  const offenders = files.filter((name) => MULTI_HASH_RE.test(name));
  if (offenders.length) {
    throw new Error(`${stateLabel}: multi-hash files detected\n${offenders.join("\n")}`);
  }
  const assetManifestPath = join(DIST, "asset-manifest.json");
  if (!existsSync(assetManifestPath)) throw new Error(`${stateLabel}: missing asset-manifest.json`);
  const assetManifest = JSON.parse(readFileSync(assetManifestPath, "utf8"));
  for (const [logical, mapped] of Object.entries(assetManifest.mapping || {})) {
    if (MULTI_HASH_RE.test(String(mapped))) {
      throw new Error(`${stateLabel}: asset-manifest contains multi-hash entry ${logical} -> ${mapped}`);
    }
    if (!["router.js", "styles.css", "middleware.js"].includes(logical) && /\.(js|css)$/i.test(logical) && !HASHED_RE.test(String(mapped))) {
      throw new Error(`${stateLabel}: logical asset did not fingerprint to a single hash ${logical} -> ${mapped}`);
    }
  }
}

await runBuild();
assertNoMultiHash("first build");

await runBuild();
assertNoMultiHash("second build");

console.log("test-asset-fingerprint-contract pass");
