import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const cliPath = resolve("src", "cli.mjs");
const appRoot = resolve("app");
const distRoot = resolve("dist");
let startProc = null;

function runNode(args, cwd) {
  return new Promise((resolveRun, rejectRun) => {
    const proc = spawn(process.execPath, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test" }
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

try {
  rmSync(distRoot, { recursive: true, force: true });
  await runNode([cliPath, "build"], resolve("."));

  assert.equal(existsSync(join(distRoot, "fastscript-manifest.json")), true);
  const manifest = JSON.parse(readFileSync(join(distRoot, "fastscript-manifest.json"), "utf8"));
  for (const route of ["/learn", "/learn/capstone", "/learn/:module", "/learn/:module/:lesson"]) {
    assert.equal(manifest.routes.some((entry) => entry.path === route), true, `missing route ${route}`);
  }

  startProc = spawn(process.execPath, [cliPath, "start"], {
    cwd: resolve("."),
    stdio: "ignore",
    env: {
      ...process.env,
      NODE_ENV: "production",
      SESSION_SECRET: process.env.SESSION_SECRET || "learn-school-production-secret-0123456789abcdef"
    }
  });

  await waitFor("http://localhost:4173/learn");

  const learn = await fetch("http://localhost:4173/learn");
  const learnHtml = await learn.text();
  assert.equal(learn.status, 200);
  assert.match(learnHtml, /FastScript school/);
  assert.match(learnHtml, /From zero knowledge to FastScript mastery/);
  assert.match(learnHtml, /data-school-progress/);

  const beginner = await fetch("http://localhost:4173/learn/beginner");
  const beginnerHtml = await beginner.text();
  assert.equal(beginner.status, 200);
  assert.match(beginnerHtml, /Programming and web basics/);
  assert.match(beginnerHtml, /What code, the browser, and the web actually do/);
  assert.match(beginnerHtml, /Browser requests, forms, and user actions/);

  const capstone = await fetch("http://localhost:4173/learn/capstone");
  const capstoneHtml = await capstone.text();
  assert.equal(capstone.status, 200);
  assert.match(capstoneHtml, /Capstone hub/);
  assert.match(capstoneHtml, /startup-mvp/);
  assert.match(capstoneHtml, /agency-ops/);

  const migration = await fetch("http://localhost:4173/learn/migration/dry-run-convert-rollback");
  const migrationHtml = await migration.text();
  assert.equal(migration.status, 200);
  assert.match(migrationHtml, /Dry-run, convert, rollback/);
  assert.match(migrationHtml, /data-school-lab/);
  assert.match(migrationHtml, /data-school-complete/);
  assert.match(migrationHtml, /data-school-share/);
  assert.match(migrationHtml, /data-school-export/);

  const mastery = await fetch("http://localhost:4173/learn/mastery/delivery-checklist-and-release-readiness");
  const masteryHtml = await mastery.text();
  assert.equal(mastery.status, 200);
  assert.match(masteryHtml, /delivery checklist/i);
  assert.match(masteryHtml, /Capstone hub/);

  console.log("test-learn-school pass");
} finally {
  if (startProc) {
    startProc.kill("SIGTERM");
    await sleep(500);
  }
}
