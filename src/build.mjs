import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const PUBLIC_TITLE = "FastScript v3.1.1 - Rename-only .fs for full-stack TS/JS apps";
const PUBLIC_DESCRIPTION = "Keep your TS/JS code, change the extension to .fs, and get FastScript full-stack runtime, validation, and deploy benefits.";
const PUBLIC_OG_DESCRIPTION = "Write ordinary JS/TS in .fs, keep your code unchanged, and ship full-stack apps with FastScript runtime and proof-backed compatibility.";
const PUBLIC_TWITTER_DESCRIPTION = "FastScript 3.1.1 keeps .fs as a rename-only TS/JS container for full-stack apps, now with safer Cloudflare runtime updates after deploys.";

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

