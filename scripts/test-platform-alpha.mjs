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
const cookieJar = new Map();

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

function responseCookies(response) {
  if (typeof response.headers.getSetCookie === "function") return response.headers.getSetCookie();
  const single = response.headers.get("set-cookie");
  return single ? [single] : [];
}

function updateCookies(response) {
  for (const value of responseCookies(response)) {
    const pair = value.split(";")[0];
    const index = pair.indexOf("=");
    if (index === -1) continue;
    const name = pair.slice(0, index).trim();
    const cookieValue = pair.slice(index + 1).trim();
    cookieJar.set(name, cookieValue);
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

function csrfHeaders() {
  const headers = {
    cookie: cookieHeader(),
    accept: "application/json",
  };
  const token = cookieJar.get("fs_csrf");
  if (token) headers["x-csrf-token"] = token;
  return headers;
}

try {
  rmSync(distRoot, { recursive: true, force: true });
  await runNode([cliPath, "build"]);
  assert.equal(existsSync(join(distRoot, "fastscript-manifest.json")), true);

  const manifest = JSON.parse(readFileSync(join(distRoot, "fastscript-manifest.json"), "utf8"));
  for (const route of [
    "/buy",
    "/pricing",
    "/start-trial",
    "/account/billing",
    "/enterprise",
    "/ceo",
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
    "/platform/proof/:subjectType/:subjectId",
  ]) {
    assert.equal(manifest.routes.some((entry) => entry.path === route), true, `missing route ${route}`);
  }
  for (const api of [
    "/api/billing/checkout",
    "/api/billing/portal",
    "/api/billing/entitlement",
    "/api/billing/webhook",
    "/api/platform/datasets",
    "/api/platform/experiments",
    "/api/platform/runs",
    "/api/platform/runs/compare",
    "/api/platform/training/jobs",
    "/api/platform/evals/suites",
    "/api/platform/evals/runs",
    "/api/platform/models",
    "/api/platform/workspaces",
    "/api/platform/commands",
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

  await waitFor(`${baseUrl}/pricing`);

  const pricingRes = await fetch(`${baseUrl}/pricing`);
  const pricingHtml = await pricingRes.text();
  assert.equal(pricingRes.status, 200);
  assert.match(pricingHtml, /Built for startups shipping model-backed products/i);

  const buyRes = await fetch(`${baseUrl}/buy`);
  const buyHtml = await buyRes.text();
  assert.equal(buyRes.status, 200);
  assert.match(buyHtml, /Unlock the paid operator console/i);

  const ceoRes = await fetch(`${baseUrl}/ceo`);
  assert.equal(ceoRes.status, 200);
  assert.match(await ceoRes.text(), /Why I built FastScript under constraint/i);

  const platformRes = await fetch(`${baseUrl}/platform`);
  const platformHtml = await platformRes.text();
  assert.equal(platformRes.status, 200);
  assert.match(platformHtml, /guided buyer demo/i);

  const gatedPageRes = await fetch(`${baseUrl}/platform/models`, { redirect: "manual" });
  assert.equal(gatedPageRes.status, 302);
  assert.match(gatedPageRes.headers.get("location") || "", /\/buy/);

  const anonPlatformApiRes = await fetch(`${baseUrl}/api/platform/models`);
  assert.equal(anonPlatformApiRes.status, 402);

  const authRes = await fetch(`${baseUrl}/api/auth`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ name: "Founder", email: "founder@test-startup.ai" }),
  });
  assert.equal(authRes.status, 200);
  updateCookies(authRes);
  assert.ok(cookieHeader());

  const trialPageRes = await fetch(`${baseUrl}/start-trial`, {
    headers: { cookie: cookieHeader() },
  });
  assert.equal(trialPageRes.status, 200);
  updateCookies(trialPageRes);

  const preTrialEntitlementRes = await fetch(`${baseUrl}/api/billing/entitlement`, {
    headers: { ...csrfHeaders() },
  });
  const preTrialEntitlement = await preTrialEntitlementRes.json();
  assert.equal(preTrialEntitlementRes.status, 200);
  assert.equal(preTrialEntitlement.entitlement.state, "no-plan");

  const checkoutRes = await fetch(`${baseUrl}/api/billing/checkout`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ planId: "team", mode: "paid", nextPath: "/platform/models" }),
  });
  const checkoutJson = await checkoutRes.json();
  assert.equal(checkoutRes.status, 200);
  assert.equal(checkoutJson.ok, true);
  assert.equal(checkoutJson.account.state, "active");

  const postTrialEntitlementRes = await fetch(`${baseUrl}/api/billing/entitlement`, {
    headers: { ...csrfHeaders() },
  });
  const postTrialEntitlement = await postTrialEntitlementRes.json();
  assert.equal(postTrialEntitlement.entitlement.state, "active");

  const gatedWithTrialRes = await fetch(`${baseUrl}/platform/models`, {
    headers: { cookie: cookieHeader() },
  });
  assert.equal(gatedWithTrialRes.status, 200);
  assert.match(await gatedWithTrialRes.text(), /Model registry/i);

  const modelsRes = await fetch(`${baseUrl}/api/platform/models`, {
    headers: { ...csrfHeaders() },
  });
  const modelsJson = await modelsRes.json();
  assert.equal(modelsRes.status, 200);
  assert.equal(modelsJson.ok, true);

  const commandsRes = await fetch(`${baseUrl}/api/platform/commands`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ query: "show quality issues" }),
  });
  const commandsJson = await commandsRes.json();
  assert.equal(commandsRes.status, 200);
  assert.equal(commandsJson.ok, true);

  const cancelRes = await fetch(`${baseUrl}/api/billing/portal`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ action: "cancel" }),
  });
  const cancelJson = await cancelRes.json();
  assert.equal(cancelRes.status, 200);
  assert.equal(cancelJson.ok, true);
  assert.equal(cancelJson.account.state, "expired");

  const blockedAfterCancel = await fetch(`${baseUrl}/api/platform/commands`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ query: "show quality issues" }),
  });
  assert.equal(blockedAfterCancel.status, 402);

  console.log("test-platform-alpha pass");
} finally {
  if (proc) {
    proc.kill("SIGTERM");
    await sleep(500);
  }
}
