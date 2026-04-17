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

const manifest = JSON.parse(readFileSync(resolve("dist", "fastscript-manifest.json"), "utf8"));
const assetManifest = JSON.parse(readFileSync(resolve("dist", "asset-manifest.json"), "utf8"));
const mappedRoute = manifest.routes.find((route) => {
  const logicalModule = String(route?.module || "").replace(/^\.\//, "");
  return logicalModule && assetManifest.mapping?.[logicalModule];
});
assert.equal(Boolean(mappedRoute), true);
assert.equal(/\.[a-f0-9]{8}\.[mc]?js$/i.test(String(mappedRoute?.module || "")), false);
const mappedRouteLogicalModule = String(mappedRoute?.module || "").replace(/^\.\//, "");
assert.equal(Boolean(assetManifest.mapping?.[mappedRouteLogicalModule]), true);

const worker = readFileSync(resolve("dist", "worker.js"), "utf8");
assert.equal(worker.includes("applySecurityHeaders"), true);
assert.equal(worker.includes("cache-control"), true);
assert.equal(worker.includes("FASTSCRIPT_RELOAD"), true);
assert.equal(worker.includes('navigator.serviceWorker.addEventListener("controllerchange", refresh)'), true);
assert.equal(worker.includes('assetPath("router.js")'), true);
assert.equal(worker.includes(`"${mappedRoute?.module}":`), true);
assert.equal(worker.includes(assetManifest.mapping?.[mappedRouteLogicalModule]), true);

const router = readFileSync(resolve("dist", "router.js"), "utf8");
assert.equal(router.includes('fetch("/asset-manifest.json", { cache: "no-store" })'), true);
assert.equal(router.includes("Failed to fetch dynamically imported module"), true);
assert.equal(router.includes("window.location.reload()"), true);

const serviceWorker = readFileSync(resolve("dist", "service-worker.js"), "utf8");
assert.equal(serviceWorker.includes("FASTSCRIPT_RELOAD"), true);
assert.equal(serviceWorker.includes("broadcastReload"), true);
assert.equal(serviceWorker.includes('const VOLATILE_PATHS = new Set(["/router.js", "/styles.css", "/fastscript-manifest.json", "/asset-manifest.json", "/manifest.webmanifest", "/service-worker.js"])'), true);
assert.equal(serviceWorker.includes("const isVolatile = isVolatileRequest(req);"), true);
assert.equal(serviceWorker.includes("if (isVolatile) {"), true);

console.log("test-deploy-adapters pass");
