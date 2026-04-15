import assert from "node:assert/strict";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const cliPath = resolve("src", "cli.mjs");
const exampleRoot = resolve("examples", "agency-ops");
const tempRoot = mkdtempSync(join(tmpdir(), "fastscript-agency-ops-runtime-"));
const appRoot = join(tempRoot, "agency-ops");
const outPath = resolve("benchmarks", "agency-ops-runtime.json");
const outMdPath = resolve("benchmarks", "agency-ops-runtime.md");
const baseUrl = "http://localhost:4173";

function runNode(args, cwd, extraEnv = {}, stdio = "inherit") {
  return new Promise((resolveRun, rejectRun) => {
    const proc = spawn(process.execPath, args, {
      cwd,
      stdio,
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
    cookieJar.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

function csrfHeaders() {
  const headers = { cookie: cookieHeader(), accept: "application/json" };
  const token = cookieJar.get("fs_csrf");
  if (token) headers["x-csrf-token"] = token;
  return headers;
}

async function timedFetch(url, options) {
  const t0 = performance.now();
  const response = await fetch(url, options);
  const t1 = performance.now();
  updateCookies(response);
  return { response, ms: Number((t1 - t0).toFixed(2)) };
}

let startProc = null;

try {
  cpSync(exampleRoot, appRoot, { recursive: true });
  rmSync(join(appRoot, "dist"), { recursive: true, force: true });
  rmSync(join(appRoot, ".fastscript"), { recursive: true, force: true });

  await runNode([cliPath, "build"], appRoot, { NODE_ENV: "production" });

  startProc = spawn(process.execPath, [cliPath, "start"], {
    cwd: appRoot,
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "production",
      SESSION_SECRET: process.env.SESSION_SECRET || "agency-ops-runtime-secret-0123456789abcdef"
    }
  });

  await waitFor(`${baseUrl}/`);

  const home = await timedFetch(`${baseUrl}/`);
  assert.equal(home.response.status, 200);

  const signIn = await timedFetch(`${baseUrl}/sign-in`);
  assert.equal(signIn.response.status, 200);

  const session = await timedFetch(`${baseUrl}/api/session`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      name: "Amina Founder",
      email: "amina@northstarops.dev",
      agencyName: "Northstar Client Ops"
    })
  });
  assert.equal(session.response.status, 200);

  const dashboard = await timedFetch(`${baseUrl}/dashboard`, {
    headers: { cookie: cookieHeader() }
  });
  assert.equal(dashboard.response.status, 200);

  const clients = await timedFetch(`${baseUrl}/dashboard/clients`, {
    headers: { cookie: cookieHeader() }
  });
  assert.equal(clients.response.status, 200);

  const apiClients = await timedFetch(`${baseUrl}/api/clients`, {
    method: "POST",
    headers: { ...csrfHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      name: "Atlas Dental",
      engagement: "SEO retainer",
      status: "active",
      monthlyRetainer: 2400,
      nextStep: "Review growth targets"
    })
  });
  assert.equal(apiClients.response.status, 200);

  const report = {
    generatedAt: new Date().toISOString(),
    app: "agency-ops",
    timingsMs: {
      home: home.ms,
      signIn: signIn.ms,
      sessionBootstrap: session.ms,
      dashboard: dashboard.ms,
      clientsPage: clients.ms,
      clientsApiMutation: apiClients.ms
    }
  };

  const markdown = `# Agency Ops Runtime Timing\n\n- Generated: ${report.generatedAt}\n- Home /: ${report.timingsMs.home}ms\n- Sign-in /sign-in: ${report.timingsMs.signIn}ms\n- Session bootstrap /api/session: ${report.timingsMs.sessionBootstrap}ms\n- Dashboard /dashboard: ${report.timingsMs.dashboard}ms\n- Clients /dashboard/clients: ${report.timingsMs.clientsPage}ms\n- Clients mutation /api/clients: ${report.timingsMs.clientsApiMutation}ms\n`;

  await import('node:fs').then(({ writeFileSync, mkdirSync }) => {
    mkdirSync(resolve("benchmarks"), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(outMdPath, markdown, "utf8");
  });

  console.log(`agency-ops runtime proof written: ${outPath}`);
} finally {
  if (startProc) {
    startProc.kill("SIGTERM");
    await sleep(300);
  }
  rmSync(tempRoot, { recursive: true, force: true });
}
