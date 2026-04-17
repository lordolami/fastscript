import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { runMigrate } from "../src/migrate.mjs";

function write(rel, content, root) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const root = mkdtempSync(join(tmpdir(), "fastscript-compat-first-"));
const reports = mkdtempSync(join(tmpdir(), "fastscript-compat-first-reports-"));

try {
  write("pages/index.ts", `import { sum } from "./lib/util.js"
import("./chunk.jsx")
export default function Home(){ return "<h1>" + String(sum(1,2)) + "</h1>" }
`, root);
  write("pages/lib/util.js", `export function sum(a, b){ return a + b }\n`, root);
  write("pages/chunk.jsx", `export default function Chunk(){ return "ok" }\n`, root);
  write("styles.css", "body{color:#111}\n", root);
  write("design/tokens.json", `{"primary":"#111"}\n`, root);

  const styleBefore = readFileSync(join(root, "styles.css"), "utf8");
  const tokensBefore = readFileSync(join(root, "design/tokens.json"), "utf8");

  await runMigrate([root, "--fidelity-level", "off", "--report-dir", reports]);

  assert.equal(existsSync(join(root, "pages/index.fs")), true);
  assert.equal(existsSync(join(root, "pages/lib/util.fs")), true);
  assert.equal(existsSync(join(root, "pages/chunk.fs")), true);
  assert.equal(existsSync(join(root, "pages/index.ts")), false);
  assert.equal(existsSync(join(root, "pages/lib/util.js")), false);
  assert.equal(existsSync(join(root, "pages/chunk.jsx")), false);

  const indexAfter = readFileSync(join(root, "pages/index.fs"), "utf8");
  assert.equal(indexAfter.includes("./lib/util.fs"), true);
  assert.equal(indexAfter.includes("./chunk.fs"), true);

  assert.equal(readFileSync(join(root, "styles.css"), "utf8"), styleBefore);
  assert.equal(readFileSync(join(root, "design/tokens.json"), "utf8"), tokensBefore);

  const manifestPath = resolve(reports, "latest", "conversion-manifest.json");
  const diffPreviewPath = resolve(reports, "latest", "diff-preview.json");
  const validationPath = resolve(reports, "latest", "validation-report.json");
  const fidelityPath = resolve(reports, "latest", "fidelity-report.json");

  const manifest = readJson(manifestPath);
  const diffPreview = readJson(diffPreviewPath);
  const validation = readJson(validationPath);
  const fidelity = readJson(fidelityPath);

  assert.equal(manifest.mode, "rename-only");
  assert.equal(manifest.summary.renameCount, 3);
  assert.equal(manifest.summary.importRewriteCount >= 2, true);
  assert.equal(Array.isArray(manifest.convertedFiles), true);
  assert.equal(Array.isArray(manifest.protectedFiles), true);
  assert.equal(manifest?.trustWorkflow?.artifacts?.diffPreview, "diff-preview.json");
  assert.equal(diffPreview.summary.renameOperationCount, 3);
  assert.equal(diffPreview.summary.importRewriteCount >= 2, true);
  assert.equal(Array.isArray(diffPreview.rewriteOperations), true);

  assert.equal(validation.checks.every((item) => item.status === "pass"), true);
  assert.equal(fidelity.status, "pass");

  await runMigrate([root, "--fidelity-level", "off", "--report-dir", reports]);
  const manifestSecond = readJson(manifestPath);
  assert.equal(manifestSecond.summary.renameCount, 0);
  assert.equal(manifestSecond.summary.rewriteCount, 0);

  const rootBlocked = mkdtempSync(join(tmpdir(), "fastscript-compat-first-blocked-"));
  const reportsBlocked = mkdtempSync(join(tmpdir(), "fastscript-compat-first-blocked-reports-"));
  const rootScope = mkdtempSync(join(tmpdir(), "fastscript-compat-first-scope-"));
  const reportsScope = mkdtempSync(join(tmpdir(), "fastscript-compat-first-scope-reports-"));

  try {
    const protectedCandidate = write("pages/secure.ts", `export default function Secure(){ return "ok" }\n`, rootBlocked);
    const configPath = join(rootBlocked, "compat-config.json");
    writeFileSync(
      configPath,
      `${JSON.stringify({ protectedFiles: [protectedCandidate] }, null, 2)}\n`,
      "utf8",
    );

    await assert.rejects(
      () => runMigrate([rootBlocked, "--fidelity-level", "off", "--report-dir", reportsBlocked, "--config", configPath]),
      /rename-only conversion blocked by protected\/blocked files/i,
    );

    write("pages/index.ts", `import { theme } from "./theme.js"
export default function Home(){ const layout = theme; return "<section id=\\"hero\\">" + layout + "</section>" }\n`, rootScope);
    write("pages/theme.js", `export const theme = "base"\n`, rootScope);
    const scopeConfigPath = join(rootScope, "compat-config.json");
    writeFileSync(
      scopeConfigPath,
      `${JSON.stringify({ protectedConfigKeys: ["layout"], protectedMarkupRegions: ["hero"] }, null, 2)}\n`,
      "utf8",
    );

    await assert.rejects(
      () => runMigrate([rootScope, "--fidelity-level", "off", "--report-dir", reportsScope, "--config", scopeConfigPath]),
      /rename-only conversion blocked by protected\/blocked files/i,
    );

    const blockedManifest = readJson(join(reportsScope, "latest", "conversion-manifest.json"));
    const blockedDiff = readJson(join(reportsScope, "latest", "diff-preview.json"));
    assert.equal(Array.isArray(blockedManifest.protectedScopeViolations), true);
    assert.equal(blockedManifest.protectedScopeViolations.length >= 2, true);
    assert.equal(blockedDiff.summary.blockedCount >= 2, true);
  } finally {
    rmSync(rootBlocked, { recursive: true, force: true });
    rmSync(reportsBlocked, { recursive: true, force: true });
    rmSync(rootScope, { recursive: true, force: true });
    rmSync(reportsScope, { recursive: true, force: true });
  }

  console.log("test-compatibility-first-runtime pass");
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(reports, { recursive: true, force: true });
}
