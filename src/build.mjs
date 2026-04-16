import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const PUBLIC_TITLE = "FastScript v3.0.8 - Universal JS/TS container for real full-stack apps";
const PUBLIC_DESCRIPTION = "Use .fs as a universal JS/TS container, ship frontend and backend in one runtime, and rely on the governed support matrix plus proof-backed speed to build real products.";
const PUBLIC_OG_DESCRIPTION = "Write JS/TS in .fs, use the governed support matrix, and ship real full-stack apps with proof-backed speed and 17/17 interop.";
const PUBLIC_TWITTER_DESCRIPTION = "FastScript 3.0.8 removes stale root HTML after deploys, keeps the logical-manifest plus asset-manifest contract stable, and leaves the FastScript line ready to move beyond language work.";

function rewriteTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function rewritePublicMetaShell() {
  if (!existsSync(DIST_INDEX_PATH)) return;
  let html = readFileSync(DIST_INDEX_PATH, "utf8");
  html = rewriteTag(html, /<title>[^<]*<\/title>/, `<title>${PUBLIC_TITLE}</title>`);
  html = rewriteTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${PUBLIC_DESCRIPTION}" />`);
  html = rewriteTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${PUBLIC_TITLE}" />`);
  html = rewriteTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${PUBLIC_OG_DESCRIPTION}" />`);
  html = rewriteTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${PUBLIC_TWITTER_DESCRIPTION}" />`);
  writeFileSync(DIST_INDEX_PATH, html, "utf8");
}

export async function runBuild(options = {}) {
  await runPrivateBuild(options);
  rewritePublicMetaShell();
}

export * from "@fastscript/core-private/build";
