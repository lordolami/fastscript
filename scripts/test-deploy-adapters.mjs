import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { runBuild } from "../src/build.mjs";
import { runDeploy } from "../src/deploy.mjs";

await runBuild();
await runDeploy(["--target", "vercel"]);
await runDeploy(["--target", "cloudflare"]);
await runDeploy(["--target", "node"]);

assert.equal(existsSync(resolve("vercel.json")), true);
assert.equal(existsSync(resolve("wrangler.toml")), true);
assert.equal(existsSync(resolve("api", "[[...fastscript]].mjs")), true);
assert.equal(existsSync(resolve("dist", "worker.js")), true);
assert.equal(existsSync(resolve("Dockerfile")), true);
assert.equal(existsSync(resolve("ecosystem.config.cjs")), true);
assert.equal(existsSync(resolve("vercel.env.example")), true);
assert.equal(existsSync(resolve(".dev.vars.example")), true);

const vercel = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));
assert.equal(Boolean(vercel?.headers?.length), true);
assert.equal(vercel.routes.some((route) => route.src === "/fastscript-manifest.json"), true);
assert.equal(vercel.routes.some((route) => route.src === "/asset-manifest.json"), true);
assert.equal(vercel.functions?.["api/[[...fastscript]].mjs"]?.runtime, "nodejs20.x");

const wrangler = readFileSync(resolve("wrangler.toml"), "utf8");
assert.equal(wrangler.includes("FASTSCRIPT_DEPLOY_TARGET = \"cloudflare\""), true);
assert.equal(wrangler.includes("[observability.logs]"), true);

const worker = readFileSync(resolve("dist", "worker.js"), "utf8");
assert.equal(worker.includes("applySecurityHeaders"), true);
assert.equal(worker.includes("cache-control"), true);

console.log("test-deploy-adapters pass");
