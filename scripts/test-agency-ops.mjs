import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const cliPath = resolve("src", "cli.mjs");
const exampleRoot = resolve("examples", "agency-ops");
const tempRoot = mkdtempSync(join(tmpdir(), "fastscript-agency-ops-"));
const appRoot = join(tempRoot, "agency-ops");
const baseUrl = "http://localhost:4173";

function runNode(args, cwd, extraEnv = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const proc = spawn(process.execPath, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, ...extraEnv }
    });
    proc.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${args.join(" ")} failed with code ${code}`));
    });
    proc.on("error", rejectRun);
  });
}

async function waitFor(url, ms = 20000) {
  const started = Date.now();
  while (Date.now() - started < ms) {
    try {
      const response = await fetch(url);
      if (response.status >= 200) return;
    } catch {}
    await sleep(300);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

const cookieJar = new Map();

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
    accept: "application/json"
  };
  const token = cookieJar.get("fs_csrf");
  if (token) headers["x-csrf-token"] = token;
  return headers;
}

let devProc = null;
let startProc = null;

try {
  cpSync(exampleRoot, appRoot, { recursive: true });
  rmSync(join(appRoot, "dist"), { recursive: true, force: true });
  rmSync(join(appRoot, ".fastscript"), { recursive: true, force: true });

  devProc = spawn(process.execPath, [cliPath, "dev"], {
    cwd: appRoot,
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "development",
      SESSION_SECRET: process.env.SESSION_SECRET || "agency-ops-dev-secret-0123456789abcdef"
    }
  });
  await waitFor(`${baseUrl}/`);
  const devHome = await fetch(`${baseUrl}/`);
  assert.equal(devHome.status, 200);
  devProc.kill("SIGTERM");
  await sleep(500);
  devProc = null;

  await runNode([cliPath, "build"], appRoot);
  await runNode([cliPath, "deploy", "--target", "cloudflare"], appRoot);

  assert.equal(existsSync(join(appRoot, "dist", "fastscript-manifest.json")), true);
  assert.equal(existsSync(join(appRoot, "wrangler.toml")), true);
  assert.equal(existsSync(join(appRoot, "dist", "worker.js")), true);

  const manifest = JSON.parse(readFileSync(join(appRoot, "dist", "fastscript-manifest.json"), "utf8"));
  for (const route of [
    "/",
    "/sign-in",
    "/dashboard",
    "/dashboard/clients",
    "/dashboard/team",
    "/dashboard/billing",
    "/dashboard/settings",
    "/dashboard/ops"
  ]) {
    assert.equal(manifest.routes.some((entry) => entry.path === route), true, `missing route ${route}`);
  }
  for (const route of [
    "/api/session",
    "/api/agency",
    "/api/clients",
    "/api/members",
    "/api/agency-settings",
    "/api/billing/checkout",
    "/api/notifications/retry"
  ]) {
    assert.equal(manifest.apiRoutes.some((entry) => entry.path === route), true, `missing api route ${route}`);
  }

  startProc = spawn(process.execPath, [cliPath, "start"], {
    cwd: appRoot,
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "production",
      SESSION_SECRET: process.env.SESSION_SECRET || "agency-ops-start-secret-0123456789abcdef"
    }
  });

  await waitFor(`${baseUrl}/`);

  const home = await fetch(`${baseUrl}/`);
  updateCookies(home);
  const homeText = await home.text();
  assert.equal(home.status, 200);
  assert.match(homeText, /Agency Ops SaaS/);
  assert.match(homeText, /Strict TypeScript in \.fs/i);

  const signIn = await fetch(`${baseUrl}/sign-in`);
  updateCookies(signIn);
  assert.equal(signIn.status, 200);

  const redirectedDashboard = await fetch(`${baseUrl}/dashboard`, { redirect: "manual" });
  assert.equal(String(redirectedDashboard.status).startsWith("3"), true);
  assert.match(redirectedDashboard.headers.get("location") || "", /\/sign-in$/);

  const sessionResponse = await fetch(`${baseUrl}/api/session`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      name: "Amina Founder",
      email: "amina@northstarops.dev",
      agencyName: "Northstar Client Ops"
    })
  });
  updateCookies(sessionResponse);
  const sessionJson = await sessionResponse.json();
  assert.equal(sessionResponse.status, 200);
  assert.equal(sessionJson.ok, true);
  assert.equal(Boolean(cookieJar.get("fs_session")), true, "missing auth cookie");

  const authedDashboard = await fetch(`${baseUrl}/dashboard`, {
    headers: { cookie: cookieHeader() }
  });
  updateCookies(authedDashboard);
  const dashboardHtml = await authedDashboard.text();
  assert.equal(authedDashboard.status, 200);
  assert.match(dashboardHtml, /Agency overview/);
  assert.match(dashboardHtml, /Northstar Client Ops/);

  const clientResponse = await fetch(`${baseUrl}/api/clients`, {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Atlas Dental",
      engagement: "SEO retainer",
      status: "active",
      monthlyRetainer: 2400,
      nextStep: "Review quarterly growth targets"
    })
  });
  updateCookies(clientResponse);
  const clientJson = await clientResponse.json();
  assert.equal(clientResponse.status, 200);
  assert.equal(clientJson.ok, true);

  const memberResponse = await fetch(`${baseUrl}/api/members`, {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email: "strategist@northstarops.dev",
      role: "strategist"
    })
  });
  updateCookies(memberResponse);
  const memberJson = await memberResponse.json();
  assert.equal(memberResponse.status, 200);
  assert.equal(memberJson.ok, true);

  const billingResponse = await fetch(`${baseUrl}/api/billing/checkout`, {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({ planId: "plan_growth" })
  });
  updateCookies(billingResponse);
  const billingJson = await billingResponse.json();
  assert.equal(billingResponse.status, 200);
  assert.equal(billingJson.ok, true);
  assert.equal(billingJson.plan.name, "Growth");

  const settingsResponse = await fetch(`${baseUrl}/api/agency-settings`, {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Northstar Client Ops HQ",
      specialty: "B2B growth operations",
      timezone: "Africa/Lagos",
      contactEmail: "finance@northstarops.dev"
    })
  });
  updateCookies(settingsResponse);
  const settingsJson = await settingsResponse.json();
  assert.equal(settingsResponse.status, 200);
  assert.equal(settingsJson.ok, true);

  const notifyResponse = await fetch(`${baseUrl}/api/notifications/retry`, {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({ kind: "support-follow-up" })
  });
  updateCookies(notifyResponse);
  const notifyJson = await notifyResponse.json();
  assert.equal(notifyResponse.status, 200);
  assert.equal(notifyJson.ok, true);

  const clientsPage = await fetch(`${baseUrl}/dashboard/clients`, { headers: { cookie: cookieHeader() } });
  updateCookies(clientsPage);
  const clientsHtml = await clientsPage.text();
  assert.equal(clientsPage.status, 200);
  assert.match(clientsHtml, /Atlas Dental/);
  assert.match(clientsHtml, /SEO retainer/);

  const teamPage = await fetch(`${baseUrl}/dashboard/team`, { headers: { cookie: cookieHeader() } });
  updateCookies(teamPage);
  const teamHtml = await teamPage.text();
  assert.equal(teamPage.status, 200);
  assert.match(teamHtml, /strategist@northstarops\.dev/);

  const billingPage = await fetch(`${baseUrl}/dashboard/billing`, { headers: { cookie: cookieHeader() } });
  updateCookies(billingPage);
  const billingHtml = await billingPage.text();
  assert.equal(billingPage.status, 200);
  assert.match(billingHtml, /Growth/);
  assert.match(billingHtml, /invoice trail/i);

  const opsPage = await fetch(`${baseUrl}/dashboard/ops`, { headers: { cookie: cookieHeader() } });
  updateCookies(opsPage);
  const opsHtml = await opsPage.text();
  assert.equal(opsPage.status, 200);
  assert.match(opsHtml, /support-follow-up/);

  console.log("test-agency-ops pass");
} finally {
  if (devProc) {
    devProc.kill("SIGTERM");
    await sleep(300);
  }
  if (startProc) {
    startProc.kill("SIGTERM");
    await sleep(300);
  }
  rmSync(tempRoot, { recursive: true, force: true });
}

