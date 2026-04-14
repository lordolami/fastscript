import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { runBuild } from "../src/build.mjs";

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

function distFingerprint() {
  const files = walk(DIST_DIR)
    .filter((file) => /\.(js|css|html|json|webmanifest)$/.test(file))
    .sort();

  const rows = files.map((file) => {
    const rel = relative(DIST_DIR, file).replace(/\\/g, "/");
    const body = readFileSync(file);
    const hash = createHash("sha1").update(body).digest("hex");
    const size = statSync(file).size;
    return `${rel}:${size}:${hash}`;
  });

  return createHash("sha1").update(rows.join("\n")).digest("hex");
}

await runBuild();
const first = distFingerprint();
await runBuild();
const second = distFingerprint();

if (first !== second) {
  throw new Error(`determinism mismatch: ${first} != ${second}`);
}

console.log(`test-determinism pass: ${first}`);
