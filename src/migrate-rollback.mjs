import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, isAbsolute } from "node:path";
import { loadConversionManifest } from "./conversion-manifest.mjs";

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function sha256(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function parseArgs(args = []) {
  const options = {
    manifest: resolve(".fastscript", "conversion", "latest", "conversion-manifest.json"),
    dryRun: false,
    out: resolve(".fastscript", "conversion", "rollback-latest.json"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--manifest") {
      options.manifest = resolve(args[i + 1] || options.manifest);
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || options.out);
      i += 1;
      continue;
    }
  }

  return options;
}

function pathStartsWith(child, parent) {
  const rel = relative(parent, child);
  if (!rel) return true;
  return !rel.startsWith("..") && !isAbsolute(rel);
}

function safeResolve(root, relPath) {
  const abs = resolve(root, relPath);
  if (!pathStartsWith(abs, root)) {
    throw new Error(`rollback denied path escape: ${relPath}`);
  }
  return abs;
}

export async function runMigrateRollback(args = []) {
  const options = parseArgs(args);
  const { path: manifestPath, manifest } = loadConversionManifest(options.manifest);

  const targetRoot = resolve(manifest?.projectRoot || ".", manifest?.target || ".");
  const operations = Array.isArray(manifest?.rollback?.operations) ? manifest.rollback.operations : [];

  const report = {
    generatedAt: new Date().toISOString(),
    manifestPath,
    targetRoot,
    dryRun: options.dryRun,
    attempted: operations.length,
    applied: 0,
    skipped: 0,
    failures: [],
  };

  if (!operations.length) {
    mkdirSync(dirname(options.out), { recursive: true });
    writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log("rollback complete: applied=0, skipped=0");
    console.log(`rollback report: ${normalize(relative(resolve("."), options.out))}`);
    return;
  }

  for (const operation of operations) {
    try {
      if (operation.type === "rename") {
        const fromAbs = safeResolve(targetRoot, operation.from);
        const toAbs = safeResolve(targetRoot, operation.to);

        if (!existsSync(fromAbs)) {
          report.skipped += 1;
          continue;
        }

        if (existsSync(toAbs)) {
          throw new Error(`destination exists: ${normalize(operation.to)}`);
        }

        if (!options.dryRun) {
          mkdirSync(dirname(toAbs), { recursive: true });
          renameSync(fromAbs, toAbs);
        }

        report.applied += 1;
        continue;
      }

      if (operation.type === "restore-content") {
        const fileAbs = safeResolve(targetRoot, operation.file);
        if (typeof operation.contents !== "string") {
          throw new Error(`restore-content missing contents payload for ${operation.file}`);
        }

        if (!existsSync(fileAbs)) {
          throw new Error(`restore-content target missing: ${operation.file}`);
        }

        if (!options.dryRun) {
          writeFileSync(fileAbs, operation.contents, "utf8");
        }

        const actualHash = sha256(readFileSync(fileAbs, "utf8"));
        if (operation.toHash && actualHash !== operation.toHash) {
          throw new Error(`restore-content hash mismatch: ${operation.file}`);
        }

        report.applied += 1;
        continue;
      }

      report.skipped += 1;
    } catch (error) {
      report.failures.push({ operation, error: String(error?.message || error) });
    }
  }

  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (report.failures.length > 0) {
    throw new Error(`rollback failed: ${report.failures.length} operation(s) failed`);
  }

  console.log(`rollback complete: applied=${report.applied}, skipped=${report.skipped}`);
  console.log(`rollback report: ${normalize(relative(resolve("."), options.out))}`);
}
