import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runMigrate } from "../src/migrate.mjs";
import { runMigrateRollback } from "../src/migrate-rollback.mjs";
import { loadConversionManifest, summarizeConversionManifest } from "../src/conversion-manifest.mjs";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

const root = mkdtempSync(join(tmpdir(), "fastscript-convert-rollback-"));
const reports = mkdtempSync(join(tmpdir(), "fastscript-convert-reports-"));

try {
  const original = {
    indexTs: `import { util } from "./util.js"\nexport default function Home(){ return util() }\n`,
    utilJs: `export function util(){ return "ok" }\n`,
    entryMjs: `import Home from "./pages/index.ts"\nexport default Home\n`,
  };

  write(root, "pages/index.ts", original.indexTs);
  write(root, "pages/util.js", original.utilJs);
  write(root, "entry.mjs", original.entryMjs);

  await runMigrate([root, "--fidelity-level", "off", "--report-dir", reports]);

  assert.equal(existsSync(join(root, "pages/index.fs")), true);
  assert.equal(existsSync(join(root, "pages/util.fs")), true);
  assert.equal(existsSync(join(root, "pages/index.ts")), false);
  assert.equal(existsSync(join(root, "pages/util.js")), false);

  const entryAfter = readFileSync(join(root, "entry.mjs"), "utf8");
  assert.equal(entryAfter.includes("./pages/index.fs"), true);

  const manifestPath = join(reports, "latest", "conversion-manifest.json");
  const loaded = loadConversionManifest(manifestPath);
  const summary = summarizeConversionManifest(loaded.manifest);
  assert.equal(summary.convertedFiles, 2);
  assert.equal(summary.importRewrites >= 2, true);
  assert.equal(summary.diffRenameOperations, 2);

  const rollbackOut = join(reports, "rollback-report.json");
  await runMigrateRollback(["--manifest", manifestPath, "--out", rollbackOut]);

  assert.equal(existsSync(join(root, "pages/index.ts")), true);
  assert.equal(existsSync(join(root, "pages/util.js")), true);
  assert.equal(existsSync(join(root, "pages/index.fs")), false);
  assert.equal(existsSync(join(root, "pages/util.fs")), false);

  assert.equal(readFileSync(join(root, "pages/index.ts"), "utf8"), original.indexTs);
  assert.equal(readFileSync(join(root, "pages/util.js"), "utf8"), original.utilJs);
  assert.equal(readFileSync(join(root, "entry.mjs"), "utf8"), original.entryMjs);

  console.log("test-conversion-rollback-manifest pass");
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(reports, { recursive: true, force: true });
}
