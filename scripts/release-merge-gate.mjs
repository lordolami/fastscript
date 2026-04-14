import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function assertChecklistComplete(path) {
  if (!existsSync(path)) throw new Error(`Missing checklist: ${path}`);
  const raw = readFileSync(path, "utf8");
  const open = raw.split(/\r?\n/).filter((line) => /^\s*\d+\.\s+\[\s\]/.test(line));
  if (open.length) {
    throw new Error(`Release checklist has open items:\n${open.join("\n")}`);
  }
}

function assertFiles(paths) {
  for (const path of paths) {
    if (!existsSync(path)) throw new Error(`Missing required release artifact: ${path}`);
  }
}

function runVulnerabilityScan() {
  execSync("npm audit --omit=dev --audit-level=high", { stdio: "inherit" });
}

const checklist = resolve("spec", "STABLE_RELEASE_CHECKLIST.md");
assertChecklistComplete(checklist);
assertFiles([
  resolve("SECURITY.md"),
  resolve("docs", "THREAT_MODEL.md"),
  resolve("docs", "LTS_POLICY.md"),
  resolve("docs", "V1_FOREVER_READINESS.md"),
]);
runVulnerabilityScan();
console.log("release merge gate passed");
