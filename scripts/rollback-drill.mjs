import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const drillRoot = resolve(".release", "rollback-drill");
const previousArtifact = resolve(drillRoot, "previous");
const candidateArtifact = resolve(drillRoot, "candidate");
const reportPath = resolve(drillRoot, "report.json");
const port = Number(process.env.ROLLBACK_DRILL_PORT || 4191);

async function runNodeCommand(args, label) {
  const proc = spawn(process.execPath, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env },
  });

  const code = await new Promise((resolveCode) => {
    proc.on("exit", (exitCode) => resolveCode(exitCode ?? 1));
  });

  if (code !== 0) {
    throw new Error(`${label} failed with exit code ${code}`);
  }
}

async function waitFor(url, timeoutMs = 12000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status >= 200 && res.status < 600) return res;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function probeRuntime({ expectSuccess, label }) {
  const proc = spawn(process.execPath, ["./src/cli.mjs", "start"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      SESSION_SECRET: process.env.SESSION_SECRET || "rollback-drill-session-secret-0123456789abcdef0123456789",
    },
  });

  let output = "";
  proc.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  proc.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const status = {
    label,
    expectSuccess,
    ok: false,
    message: "",
  };

  try {
    await waitFor(`http://localhost:${port}/`, 10000);

    const home = await fetch(`http://localhost:${port}/`);
    const api = await fetch(`http://localhost:${port}/api/hello`, {
      headers: { accept: "application/json" },
    });

    const good = home.status === 200 && api.status === 200;
    if (expectSuccess && !good) {
      throw new Error(`Probe failed (home=${home.status}, api=${api.status})`);
    }
    if (!expectSuccess && good) {
      throw new Error("Runtime unexpectedly succeeded when failure was expected");
    }

    status.ok = true;
    status.message = expectSuccess ? "runtime passed health probes" : "runtime failed as expected";
  } catch (error) {
    if (!expectSuccess) {
      status.ok = true;
      status.message = `runtime failed as expected: ${error.message}`;
    } else {
      status.ok = false;
      status.message = `runtime failed unexpectedly: ${error.message}`;
    }
  } finally {
    proc.kill("SIGTERM");
    await sleep(300);
  }

  if (!status.ok) {
    status.message += `\nCaptured output:\n${output.slice(-4000)}`;
  }

  return status;
}

function replaceDistFrom(artifactDir) {
  rmSync(resolve("dist"), { recursive: true, force: true });
  cpSync(artifactDir, resolve("dist"), { recursive: true });
}

mkdirSync(drillRoot, { recursive: true });
rmSync(previousArtifact, { recursive: true, force: true });
rmSync(candidateArtifact, { recursive: true, force: true });

await runNodeCommand(["./src/cli.mjs", "build"], "build for rollback drill");
cpSync(resolve("dist"), previousArtifact, { recursive: true });
cpSync(previousArtifact, candidateArtifact, { recursive: true });

// Simulate a bad deployment artifact to prove rollback path.
writeFileSync(resolve(candidateArtifact, "fastscript-manifest.json"), "{ invalid_json", "utf8");

replaceDistFrom(candidateArtifact);
const badDeployProbe = await probeRuntime({ expectSuccess: false, label: "candidate_bad_deploy" });

replaceDistFrom(previousArtifact);
const rollbackProbe = await probeRuntime({ expectSuccess: true, label: "rollback_previous_artifact" });

const report = {
  date: new Date().toISOString(),
  port,
  steps: [
    {
      action: "build_previous_artifact",
      ok: true,
    },
    badDeployProbe,
    rollbackProbe,
  ],
  result: badDeployProbe.ok && rollbackProbe.ok ? "pass" : "fail",
};

writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

if (report.result !== "pass") {
  throw new Error(`rollback drill failed. See ${reportPath}`);
}

console.log(`rollback drill pass: ${reportPath}`);
