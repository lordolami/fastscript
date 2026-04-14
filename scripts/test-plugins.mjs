import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { runBuild } from "../src/build.mjs";
import { runServer } from "../src/server-runtime.mjs";

const root = process.cwd();
const pluginFile = resolve(root, "fastscript.plugins.js");
const tmpDir = resolve(root, ".tmp-plugin-tests");
const eventsFile = join(tmpDir, "events.json");

function readEvents() {
  if (!existsSync(eventsFile)) return [];
  return JSON.parse(readFileSync(eventsFile, "utf8"));
}

function cleanup() {
  rmSync(pluginFile, { force: true });
  rmSync(tmpDir, { recursive: true, force: true });
}

cleanup();
mkdirSync(tmpDir, { recursive: true });

writeFileSync(
  pluginFile,
  `import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const eventsFile = resolve(".tmp-plugin-tests/events.json");
function push(name) {
  const prev = existsSync(eventsFile) ? JSON.parse(readFileSync(eventsFile, "utf8")) : [];
  mkdirSync(dirname(eventsFile), { recursive: true });
  prev.push(name);
  writeFileSync(eventsFile, JSON.stringify(prev), "utf8");
}

export default {
  name: "test-plugin",
  apiVersion: 1,
  setup(api) {
    api.hooks.onBuildStart(() => push("build_start"));
    api.hooks.onBuildEnd(() => push("build_end"));
    api.hooks.onRequestStart(() => push("request_start"));
    api.hooks.onRequestEnd(() => push("request_end"));
    api.hooks.middleware(async (ctx, next) => {
      ctx.res.setHeader("x-plugin-middleware", "1");
      return next();
    });
  }
};
`,
  "utf8",
);

let server;
try {
  await runBuild();
  const buildEvents = readEvents();
  assert.equal(buildEvents.includes("build_start"), true);
  assert.equal(buildEvents.includes("build_end"), true);

  server = await runServer({ mode: "development", watchMode: false, buildOnStart: false, port: 4177 });
  const start = Date.now();
  let res = null;
  while (!res && Date.now() - start < 10_000) {
    try {
      const candidate = await fetch("http://localhost:4177/api/hello", { headers: { accept: "application/json" } });
      if (candidate.status >= 200) res = candidate;
    } catch {}
    if (!res) await sleep(200);
  }
  assert.ok(res, "plugin test server did not become ready in time");
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("x-plugin-middleware"), "1");
  await res.json();

  await sleep(150);
  const reqEvents = readEvents();
  assert.equal(reqEvents.includes("request_start"), true);
  assert.equal(reqEvents.includes("request_end"), true);
  console.log("test-plugins pass");
} finally {
  if (server) {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
  cleanup();
}
