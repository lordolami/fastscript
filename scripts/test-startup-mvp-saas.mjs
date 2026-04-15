import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const cliPath = resolve("src", "cli.mjs");
const exampleRoot = resolve("examples", "startup-mvp");
const tempRoot = mkdtempSync(join(tmpdir(), "fastscript-startup-mvp-saas-"));
const appRoot = join(tempRoot, "startup-mvp");

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
      SESSION_SECRET: process.env.SESSION_SECRET || "startup-mvp-saas-dev-secret-0123456789abcdef"
    }
  });
  await waitFor("http://localhost:4173/");
  const devHome = await fetch("http://localhost:4173/");
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
    "/dashboard/projects",
    "/dashboard/team",
    "/dashboard/billing",
    "/dashboard/settings",
    "/dashboard/admin"
  ]) {
    assert.equal(manifest.routes.some((entry) => entry.path === route), true, `missing route ${route}`);
  }
  for (const route of [
    "/api/session",
    "/api/workspaces",
    "/api/projects",
    "/api/members",
    "/api/workspace-settings",
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
      SESSION_SECRET: process.env.SESSION_SECRET || "startup-mvp-saas-start-secret-0123456789abcdef"
    }
  });

  await waitFor("http://localhost:4173/");

  const home = await fetch("http://localhost:4173/");
  updateCookies(home);
  const homeText = await home.text();
  assert.equal(home.status, 200);
  assert.match(homeText, /Team dashboard SaaS/);

  const signIn = await fetch("http://localhost:4173/sign-in");
  updateCookies(signIn);
  assert.equal(signIn.status, 200);

  const redirectedDashboard = await fetch("http://localhost:4173/dashboard", { redirect: "manual" });
  assert.equal(String(redirectedDashboard.status).startsWith("3"), true);
  assert.match(redirectedDashboard.headers.get("location") || "", /\/sign-in$/);

  const sessionResponse = await fetch("http://localhost:4173/api/session", {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      name: "Amina Founder",
      email: "amina@acmeops.dev",
      workspaceName: "Acme Ops"
    })
  });
  updateCookies(sessionResponse);
  const sessionJson = await sessionResponse.json();
  assert.equal(sessionResponse.status, 200);
  assert.equal(sessionJson.ok, true);
  assert.equal(Boolean(cookieJar.get("fs_session")), true, "missing auth cookie");

  const authedDashboard = await fetch("http://localhost:4173/dashboard", {
    headers: { cookie: cookieHeader() }
  });
  updateCookies(authedDashboard);
  const dashboardHtml = await authedDashboard.text();
  assert.equal(authedDashboard.status, 200);
  assert.match(dashboardHtml, /Workspace overview/);

  const projectResponse = await fetch("http://localhost:4173/api/projects", {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Churn rescue automation",
      client: "Northwind Labs",
      status: "active"
    })
  });
  updateCookies(projectResponse);
  const projectJson = await projectResponse.json();
  assert.equal(projectResponse.status, 200);
  assert.equal(projectJson.ok, true);

  const memberResponse = await fetch("http://localhost:4173/api/members", {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email: "ops@northwindlabs.dev",
      role: "manager"
    })
  });
  updateCookies(memberResponse);
  const memberJson = await memberResponse.json();
  assert.equal(memberResponse.status, 200);
  assert.equal(memberJson.ok, true);

  const billingResponse = await fetch("http://localhost:4173/api/billing/checkout", {
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

  const settingsResponse = await fetch("http://localhost:4173/api/workspace-settings", {
    method: "POST",
    headers: {
      ...csrfHeaders(),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Acme Ops HQ",
      industry: "B2B SaaS",
      timezone: "Africa/Lagos",
      notificationEmail: "finance@acmeops.dev"
    })
  });
  updateCookies(settingsResponse);
  const settingsJson = await settingsResponse.json();
  assert.equal(settingsResponse.status, 200);
  assert.equal(settingsJson.ok, true);

  const notifyResponse = await fetch("http://localhost:4173/api/notifications/retry", {
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

  const projectsPage = await fetch("http://localhost:4173/dashboard/projects", { headers: { cookie: cookieHeader() } });
  updateCookies(projectsPage);
  const projectsHtml = await projectsPage.text();
  assert.equal(projectsPage.status, 200);
  assert.match(projectsHtml, /Churn rescue automation/);

  const teamPage = await fetch("http://localhost:4173/dashboard/team", { headers: { cookie: cookieHeader() } });
  updateCookies(teamPage);
  const teamHtml = await teamPage.text();
  assert.equal(teamPage.status, 200);
  assert.match(teamHtml, /ops@northwindlabs\.dev/);

  const billingPage = await fetch("http://localhost:4173/dashboard/billing", { headers: { cookie: cookieHeader() } });
  updateCookies(billingPage);
  const billingHtml = await billingPage.text();
  assert.equal(billingPage.status, 200);
  assert.match(billingHtml, /Growth/);

  const adminPage = await fetch("http://localhost:4173/dashboard/admin", { headers: { cookie: cookieHeader() } });
  updateCookies(adminPage);
  const adminHtml = await adminPage.text();
  assert.equal(adminPage.status, 200);
  assert.match(adminHtml, /support-follow-up/);

  console.log("test-startup-mvp-saas pass");
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
