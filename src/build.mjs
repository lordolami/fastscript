import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const META_REWRITES = [
  [
    '<title>FastScript — Full-stack .fs language runtime</title>',
    '<title>FastScript v3.0.1 — Universal JS/TS container for real full-stack apps</title>',
  ],
  [
    'content="Write product code in .fs, compile to optimized JavaScript, and ship to Node, Vercel, or Cloudflare with one command pipeline."',
    'content="Use .fs as a universal JS/TS container, ship frontend and backend in one runtime, and rely on the governed support matrix plus proof-backed speed to build real products."',
  ],
  [
    'content="FastScript — Full-stack .fs language runtime"',
    'content="FastScript v3.0.1 — Universal JS/TS container for real full-stack apps"',
  ],
  [
    'content="Write .fs, compile to JS, ship anywhere. 1.8KB runtime. &lt;1s builds. 3 deploy targets."',
    'content="Write JS/TS in .fs, use the governed support matrix, and ship real full-stack apps with proof-backed speed and 17/17 interop."',
  ],
  [
    'content="Full-stack .fs language runtime. Write once, ship to Node, Vercel, or Cloudflare."',
    'content="FastScript 3.0.1 is the real-world adoption line for JS/TS-in-.fs, governed compatibility, and full-stack shipping."',
  ],
];

function rewritePublicMetaShell() {
  if (!existsSync(DIST_INDEX_PATH)) return;
  let html = readFileSync(DIST_INDEX_PATH, "utf8");
  for (const [from, to] of META_REWRITES) {
    html = html.replace(from, to);
  }
  writeFileSync(DIST_INDEX_PATH, html, "utf8");
}

export async function runBuild(options = {}) {
  await runPrivateBuild(options);
  rewritePublicMetaShell();
}

export * from "@fastscript/core-private/build";
