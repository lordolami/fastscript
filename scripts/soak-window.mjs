import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const cycles = Number(process.env.SOAK_CYCLES || 3);
const soakRoot = resolve(".release", "soak-window");
const reportPath = resolve(soakRoot, "report.json");
const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  throw new Error("npm_execpath is not available; run this script through npm.");
}

function runCommand(command, args, label) {
  const startedAt = Date.now();
  return new Promise((resolveResult) => {
    const proc = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        SESSION_SECRET: process.env.SESSION_SECRET || "soak-window-session-secret-0123456789abcdef0123456789",
      },
    });

    proc.on("exit", (code) => {
      resolveResult({
        label,
        ok: code === 0,
        exitCode: code ?? 1,
        durationMs: Date.now() - startedAt,
      });
    });
  });
}

mkdirSync(soakRoot, { recursive: true });

const runbook = [];
for (let i = 1; i <= cycles; i += 1) {
  // Soak window exercises both production and dev smoke paths.
  runbook.push(
    await runCommand(process.execPath, [npmExecPath, "run", "smoke:start"], `cycle_${i}_smoke_start`),
  );
  runbook.push(
    await runCommand(process.execPath, [npmExecPath, "run", "smoke:dev"], `cycle_${i}_smoke_dev`),
  );
}

const failed = runbook.filter((step) => !step.ok);
const report = {
  date: new Date().toISOString(),
  cycles,
  steps: runbook,
  criticalRegressions: failed.map((f) => f.label),
  result: failed.length === 0 ? "pass" : "fail",
};

writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

if (failed.length > 0) {
  const list = failed.map((f) => `${f.label} (exit ${f.exitCode})`).join(", ");
  throw new Error(`soak window failed: ${list}. See ${reportPath}`);
}

console.log(`soak window pass: ${reportPath}`);
