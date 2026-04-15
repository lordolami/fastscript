import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(".");
const tmpRoot = resolve(".tmp-real-world-adoption");
const greenfieldRoot = join(tmpRoot, "app");
const migrationRoot = join(tmpRoot, "migration");
const reportRoot = join(tmpRoot, "reports");
const cwdBefore = process.cwd();

function write(rel, content, root) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

try {
  rmSync(tmpRoot, { recursive: true, force: true });
  mkdirSync(tmpRoot, { recursive: true });
  process.chdir(tmpRoot);
  const { createApp } = await import("../src/create.mjs");
  await createApp("app");
  assert.equal(existsSync(join(greenfieldRoot, "pages", "index.fs")), true);
  assert.equal(existsSync(join(greenfieldRoot, "api", "hello.js")), true);
  assert.equal(existsSync(join(greenfieldRoot, "middleware.fs")), true);

  process.chdir(tmpRoot);
  const { runBuild } = await import(`../src/build.mjs?cwd=${Date.now()}`);
  await runBuild();
  assert.equal(existsSync(join(tmpRoot, "dist", "fastscript-manifest.json")), true);

  mkdirSync(migrationRoot, { recursive: true });
  write("app/pages/index.ts", `import { sum } from "./lib/util.js"
import("./chunk.jsx")
export default function Home(){ return "<h1>" + String(sum(1,2)) + "</h1>" }
`, migrationRoot);
  write("app/pages/lib/util.js", `export function sum(a, b){ return a + b }\n`, migrationRoot);
  write("app/pages/chunk.jsx", `export default function Chunk(){ return "ok" }\n`, migrationRoot);
  write("app/styles.css", "body{color:#111}\n", migrationRoot);
  write("app/design/tokens.json", `{"primary":"#111"}\n`, migrationRoot);

  const { runMigrate } = await import(`../src/migrate.mjs?cwd=${Date.now()}`);
  await runMigrate([join(migrationRoot, "app"), "--report-dir", reportRoot, "--fidelity-level", "off"]);
  assert.equal(existsSync(join(migrationRoot, "app", "pages", "index.fs")), true);
  assert.equal(existsSync(join(migrationRoot, "app", "pages", "lib", "util.fs")), true);
  assert.equal(existsSync(join(migrationRoot, "app", "pages", "chunk.fs")), true);
  await runMigrate([join(migrationRoot, "app"), "--report-dir", reportRoot, "--fidelity-level", "off"]);

  const manifest = JSON.parse(readFileSync(join(reportRoot, "latest", "conversion-manifest.json"), "utf8"));
  const diffPreview = JSON.parse(readFileSync(join(reportRoot, "latest", "diff-preview.json"), "utf8"));
  const validation = JSON.parse(readFileSync(join(reportRoot, "latest", "validation-report.json"), "utf8"));

  assert.equal(manifest.mode, "strict");
  assert.equal(manifest.summary.renameCount, 0);
  assert.equal(manifest.summary.rewriteCount, 0);
  assert.equal(diffPreview.summary.renameOperationCount, 0);
  assert.equal(validation.checks.every((entry) => entry.status === "pass"), true);

  console.log("test-real-world-adoption pass");
} finally {
  process.chdir(cwdBefore);
  try {
    rmSync(tmpRoot, { recursive: true, force: true });
  } catch (_) {}
}
