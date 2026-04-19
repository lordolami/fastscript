import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DIST_INDEX_PATH = resolve("dist", "index.html");
const DIST_WORKER_PATH = resolve("dist", "worker.js");

export const PUBLIC_TITLE = "FastScript - Structured substrate for AI-system workflows";
export const PUBLIC_DESCRIPTION = "FastScript is the structured substrate for AI-system workflows: experiments, evaluation, proof, deploy-ready product surfaces, and a complete full-stack TypeScript platform underneath.";
export const PUBLIC_OG_DESCRIPTION = "Build AI-native systems on a runtime that already owns compilation, validation, routing, APIs, jobs, security, proof, and deploy discipline.";
export const PUBLIC_TWITTER_DESCRIPTION = "FastScript launches as AI-system workflow infrastructure first: a structured substrate for experiments, evals, proof, and product delivery.";
export const PUBLIC_SSR_SHELL_DESCRIPTION = "FastScript is an AI-system workflow substrate backed by a complete full-stack TypeScript platform and a proof-driven runtime contract.";

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
