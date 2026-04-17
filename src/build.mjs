import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const PUBLIC_TITLE = "FastScript v4.0.0 - Complete TypeScript full-stack platform";
const PUBLIC_DESCRIPTION = "Write ordinary TS and JS in .fs, then ship pages, APIs, jobs, auth, data flows, and deploy-ready builds through one FastScript platform.";
const PUBLIC_OG_DESCRIPTION = "FastScript v4 turns .fs into the calm full-stack TypeScript platform surface: familiar authoring, first-party validation, deploy discipline, and a structured runtime for machine reasoning.";
const PUBLIC_TWITTER_DESCRIPTION = "FastScript 4.0.0 is the complete TypeScript platform release: ordinary TS in .fs, proof-backed validation, reference apps, and deploy-ready outputs from one runtime.";

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
