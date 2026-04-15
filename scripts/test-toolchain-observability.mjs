import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runDiagnostics } from "../src/diagnostics.mjs";
import { runProfile } from "../src/profile.mjs";
import { runTrace } from "../src/trace.mjs";

const root = mkdtempSync(join(tmpdir(), "fastscript-toolchain-observability-"));

try {
  const appRoot = join(root, "app");
  mkdirSync(appRoot, { recursive: true });
  writeFileSync(join(appRoot, "ok.fs"), `state count = 0\nexport default function Page(){ return String(count) }\n`, "utf8");
  writeFileSync(join(appRoot, "bad.fs"), `~ bad\n`, "utf8");

  const diagOut = join(root, "diag.json");
  await runDiagnostics(["--path", appRoot, "--out", diagOut]);
  assert.equal(existsSync(diagOut), true);
  const diag = JSON.parse(readFileSync(diagOut, "utf8"));
  assert.equal(diag.summary.errors > 0, true);

  await assert.rejects(
    () => runDiagnostics(["--path", appRoot, "--out", diagOut, "--mode", "fail"]),
    /diagnostics failed/i,
  );

  const profileOut = join(root, "profile.json");
  await runProfile(["--command", "typecheck", "--runs", "1", "--out", profileOut]);
  assert.equal(existsSync(profileOut), true);
  const profile = JSON.parse(readFileSync(profileOut, "utf8"));
  assert.equal(profile.command, "typecheck");
  assert.equal(Array.isArray(profile.runs), true);
  assert.equal(profile.runs.length, 1);

  const traceOut = join(root, "trace.json");
  await runTrace(["--pipeline", "check,typecheck", "--out", traceOut]);
  assert.equal(existsSync(traceOut), true);
  const trace = JSON.parse(readFileSync(traceOut, "utf8"));
  assert.equal(trace.status, "pass");
  assert.equal(trace.spans.length, 2);

  console.log("test-toolchain-observability pass");
} finally {
  rmSync(root, { recursive: true, force: true });
}
