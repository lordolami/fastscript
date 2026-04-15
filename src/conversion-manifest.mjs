import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const DEFAULT_MANIFEST = resolve(".fastscript", "conversion", "latest", "conversion-manifest.json");

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function parseArgs(args = []) {
  const options = {
    manifest: DEFAULT_MANIFEST,
    json: false,
    out: "",
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--manifest") {
      options.manifest = resolve(args[i + 1] || options.manifest);
      i += 1;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || "");
      i += 1;
      continue;
    }
  }

  return options;
}

export function loadConversionManifest(manifestPath) {
  const path = resolve(manifestPath || DEFAULT_MANIFEST);
  if (!existsSync(path)) throw new Error(`manifest missing: ${path}`);
  return { path, manifest: JSON.parse(readFileSync(path, "utf8")) };
}

export function summarizeConversionManifest(manifest) {
  const converted = Array.isArray(manifest.convertedFiles) ? manifest.convertedFiles.length : 0;
  const importRewrites = Array.isArray(manifest.importRewrites)
    ? manifest.importRewrites.reduce((sum, item) => sum + Number(item.count || 0), 0)
    : 0;
  const blocked = Array.isArray(manifest.blockedFiles) ? manifest.blockedFiles.length : 0;
  const protectedCount = Array.isArray(manifest.protectedFiles) ? manifest.protectedFiles.length : 0;
  const untouched = Array.isArray(manifest.untouchedFiles) ? manifest.untouchedFiles.length : 0;

  return {
    spec: manifest.spec || "unknown",
    mode: manifest.mode || "unknown",
    runId: manifest.runId || "unknown",
    generatedAt: manifest.generatedAt || "unknown",
    target: manifest.target || ".",
    dryRun: Boolean(manifest.dryRun),
    convertedFiles: converted,
    importRewrites,
    blockedFiles: blocked,
    protectedFiles: protectedCount,
    untouchedFiles: untouched,
    diffRenameOperations: Number(manifest?.diffPreview?.renameOperationCount || 0),
    diffRewriteOperations: Number(manifest?.diffPreview?.rewriteOperationCount || 0),
    diffDeleteOperations: Number(manifest?.diffPreview?.deleteOperationCount || 0),
    validationFailedChecks: manifest?.validation?.failedChecks || [],
    fidelityStatus: manifest?.fidelity?.status || "unknown",
    fidelityFailedChecks: manifest?.fidelity?.failedChecks || [],
    fidelityFailedProbes: manifest?.fidelity?.failedProbes || [],
  };
}

export async function runManifest(args = []) {
  const options = parseArgs(args);
  const { path, manifest } = loadConversionManifest(options.manifest);
  const summary = summarizeConversionManifest(manifest);

  if (options.out) {
    mkdirSync(dirname(options.out), { recursive: true });
    writeFileSync(options.out, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  }

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`manifest: ${normalize(relative(resolve("."), path))}`);
  console.log(`run: ${summary.runId} (${summary.mode})`);
  console.log(`target: ${summary.target}`);
  console.log(`converted: ${summary.convertedFiles}`);
  console.log(`import rewrites: ${summary.importRewrites}`);
  console.log(`blocked: ${summary.blockedFiles}`);
  console.log(`protected: ${summary.protectedFiles}`);
  console.log(`untouched: ${summary.untouchedFiles}`);
  console.log(`diff preview -> rename:${summary.diffRenameOperations} rewrite:${summary.diffRewriteOperations} delete:${summary.diffDeleteOperations}`);
  console.log(`validation failed checks: ${summary.validationFailedChecks.length}`);
  console.log(`fidelity: ${summary.fidelityStatus}`);
}
