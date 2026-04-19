import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const cliPath = resolve("src", "cli.mjs");
const distRoot = resolve("dist");
const port = Number(process.env.TEST_PLATFORM_ALPHA_PORT || 4194);
const baseUrl = `http://127.0.0.1:${port}`;
let proc = null;

function runNode(args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, args, {
      cwd: resolve("."),
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test" },
    });
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${args.join(" ")} failed with code ${code}`));
    });
    child.on("error", rejectRun);
  });
}

async function waitFor(url, ms = 20000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const response = await fetch(url);
      if (response.status >= 200) return;
    } catch {}
    await sleep(300);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

try {
  rmSync(distRoot, { recursive: true, force: true });
  await runNode([cliPath, "build"]);
  assert.equal(existsSync(join(distRoot, "fastscript-manifest.json")), true);

  const manifest = JSON.parse(readFileSync(join(distRoot, "fastscript-manifest.json"), "utf8"));
  for (const route of [
    "/platform",
    "/platform/datasets",
    "/platform/experiments",
    "/platform/experiments/:id",
    "/platform/runs/:id",
    "/platform/training",
    "/platform/training/:id",
    "/platform/checkpoints/:id",
    "/platform/evals",
    "/platform/evals/:id",
    "/platform/models",
    "/platform/models/:id",
    "/platform/deployments",
    "/platform/workspaces",
    "/platform/audit",
    "/platform/incidents",
    "/platform/costs",
    "/platform/commands",
    "/platform/proof/:subjectType/:subjectId"
  ]) {
    assert.equal(manifest.routes.some((entry) => entry.path === route), true, `missing route ${route}`);
  }
  for (const api of [
    "/api/platform/datasets",
    "/api/platform/experiments",
    "/api/platform/runs",
    "/api/platform/runs/compare",
    "/api/platform/training/jobs",
    "/api/platform/evals/suites",
    "/api/platform/evals/runs",
    "/api/platform/models",
    "/api/platform/workspaces",
    "/api/platform/commands"
  ]) {
    assert.equal(manifest.apiRoutes.some((entry) => entry.path === api), true, `missing api ${api}`);
  }

  proc = spawn(process.execPath, [cliPath, "start"], {
    cwd: resolve("."),
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      SESSION_SECRET: process.env.SESSION_SECRET || "platform-alpha-production-secret-0123456789abcdef",
    },
  });

  await waitFor(`${baseUrl}/platform`);

  const platformRes = await fetch(`${baseUrl}/platform`);
  const platformHtml = await platformRes.text();
  assert.equal(platformRes.status, 200);
  assert.match(platformHtml, /FastScript platform/i);
  assert.match(platformHtml, /Full universe console/i);

  const datasetsRes = await fetch(`${baseUrl}/api/platform/datasets`);
  const datasetsJson = await datasetsRes.json();
  assert.equal(datasetsRes.status, 200);
  assert.equal(datasetsJson.ok, true);
  assert.ok(Array.isArray(datasetsJson.items));
  assert.ok(datasetsJson.items.length >= 2);

  const datasetId = datasetsJson.items[0].id;
  const datasetDetailRes = await fetch(`${baseUrl}/api/platform/datasets/${datasetId}`);
  const datasetDetailJson = await datasetDetailRes.json();
  assert.equal(datasetDetailRes.status, 200);
  assert.equal(datasetDetailJson.ok, true);
  assert.ok(datasetDetailJson.lineage.dataset);

  const experimentsRes = await fetch(`${baseUrl}/api/platform/experiments`);
  const experimentsJson = await experimentsRes.json();
  assert.equal(experimentsRes.status, 200);
  assert.equal(experimentsJson.ok, true);
  assert.ok(Array.isArray(experimentsJson.items));
  assert.ok(experimentsJson.items.length >= 2);

  const experimentId = experimentsJson.items[0].id;
  const detailRes = await fetch(`${baseUrl}/api/platform/experiments/${experimentId}`);
  const detailJson = await detailRes.json();
  assert.equal(detailRes.status, 200);
  assert.equal(detailJson.ok, true);
  assert.ok(Array.isArray(detailJson.runs));

  const compareRes = await fetch(`${baseUrl}/api/platform/runs/compare`);
  const compareJson = await compareRes.json();
  assert.equal(compareRes.status, 200);
  assert.equal(compareJson.ok, true);
  assert.ok(Array.isArray(compareJson.comparison.metrics));

  const trainingRes = await fetch(`${baseUrl}/api/platform/training/jobs`);
  const trainingJson = await trainingRes.json();
  assert.equal(trainingRes.status, 200);
  assert.equal(trainingJson.ok, true);
  assert.ok(Array.isArray(trainingJson.items));
  assert.ok(trainingJson.items.length >= 1);

  const suitesRes = await fetch(`${baseUrl}/api/platform/evals/suites`);
  const suitesJson = await suitesRes.json();
  assert.equal(suitesRes.status, 200);
  assert.equal(suitesJson.ok, true);
  assert.ok(Array.isArray(suitesJson.items));

  const suiteId = suitesJson.items[0].id;
  const suiteDetailRes = await fetch(`${baseUrl}/api/platform/evals/suites/${suiteId}`);
  const suiteDetailJson = await suiteDetailRes.json();
  assert.equal(suiteDetailRes.status, 200);
  assert.equal(suiteDetailJson.ok, true);

  const createdEvalRes = await fetch(`${baseUrl}/api/platform/evals/runs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ suiteId, runId: "run_repo_repair_v2" }),
  });
  const createdEvalJson = await createdEvalRes.json();
  assert.equal(createdEvalRes.status, 200);
  assert.equal(createdEvalJson.ok, true);

  const evalRunRes = await fetch(`${baseUrl}/api/platform/evals/runs/${createdEvalJson.evalRun.id}`);
  const evalRunJson = await evalRunRes.json();
  assert.equal(evalRunRes.status, 200);
  assert.equal(evalRunJson.ok, true);
  assert.ok(Array.isArray(evalRunJson.results));

  const proofRes = await fetch(`${baseUrl}/api/platform/proof/experiment/${experimentId}`);
  const proofJson = await proofRes.json();
  assert.equal(proofRes.status, 200);
  assert.equal(proofJson.ok, true);
  assert.ok(Array.isArray(proofJson.proof.sections));

  const modelsRes = await fetch(`${baseUrl}/api/platform/models`);
  const modelsJson = await modelsRes.json();
  assert.equal(modelsRes.status, 200);
  assert.equal(modelsJson.ok, true);
  assert.ok(Array.isArray(modelsJson.items));

  const workspaceRes = await fetch(`${baseUrl}/api/platform/workspaces`);
  const workspaceJson = await workspaceRes.json();
  assert.equal(workspaceRes.status, 200);
  assert.equal(workspaceJson.ok, true);
  assert.ok(Array.isArray(workspaceJson.items));

  const commandRes = await fetch(`${baseUrl}/api/platform/commands`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "show quality issues" }),
  });
  const commandJson = await commandRes.json();
  assert.equal(commandRes.status, 200);
  assert.equal(commandJson.ok, true);
  assert.ok(commandJson.response.headline);

  console.log("test-platform-alpha pass");
} finally {
  if (proc) {
    proc.kill("SIGTERM");
    await sleep(500);
  }
}
