import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const DIST_WORKER_PATH = resolve("dist", "worker.js");

export const PUBLIC_TITLE = "FastScript v4.1.0 - Security-first TypeScript full-stack platform";
export const PUBLIC_DESCRIPTION = "Write ordinary TS and JS in .fs, then ship pages, APIs, jobs, auth, and deploy-ready builds through one secure-by-default, validator-backed FastScript platform.";
export const PUBLIC_OG_DESCRIPTION = "FastScript v4.1 adds the security-first platform contract: secure-by-default scaffolds, runtime boundaries, validation discipline, and a structured runtime for machine reasoning.";
export const PUBLIC_TWITTER_DESCRIPTION = "FastScript 4.1.0 is the security-first TypeScript platform release: ordinary TS in .fs, validator-backed readiness, secure scaffolds, proof apps, and deploy-ready output.";
export const PUBLIC_SSR_SHELL_DESCRIPTION = "FastScript v4.1.0 serves a security-first TypeScript full-stack runtime: ordinary TS in .fs, validator-backed security readiness, and deploy-ready pages, APIs, jobs, and data flows.";

function rewriteTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

export function rewritePublicMetaShell() {
  if (existsSync(DIST_INDEX_PATH)) {
    let html = readFileSync(DIST_INDEX_PATH, "utf8");
    html = rewriteTag(html, /<title>[^<]*<\/title>/, `<title>${PUBLIC_TITLE}</title>`);
    html = rewriteTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${PUBLIC_DESCRIPTION}" />`);
    html = rewriteTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${PUBLIC_TITLE}" />`);
    html = rewriteTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${PUBLIC_OG_DESCRIPTION}" />`);
    html = rewriteTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${PUBLIC_TITLE}" />`);
    html = rewriteTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${PUBLIC_TWITTER_DESCRIPTION}" />`);
    writeFileSync(DIST_INDEX_PATH, html, "utf8");
  }

  if (existsSync(DIST_WORKER_PATH)) {
    let worker = readFileSync(DIST_WORKER_PATH, "utf8");
    worker = rewriteTag(worker, /<title>FastScript<\/title>/, `<title>${PUBLIC_TITLE}</title>`);
    if (!worker.includes('<meta name="description" content="')) {
      worker = rewriteTag(
        worker,
        /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />\n    <meta name="description" content="${PUBLIC_SSR_SHELL_DESCRIPTION}" />`
      );
    }
    writeFileSync(DIST_WORKER_PATH, worker, "utf8");
  }
}
