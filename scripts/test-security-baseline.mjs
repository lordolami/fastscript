import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function must(path) {
  if (!existsSync(path)) throw new Error(`missing required file: ${path}`);
}

must(resolve("SECURITY.md"));
must(resolve("docs", "THREAT_MODEL.md"));
must(resolve("docs", "INCIDENT_PLAYBOOK.md"));
must(resolve("docs", "LTS_POLICY.md"));
must(resolve("docs", "V1_FOREVER_READINESS.md"));
must(resolve("docs", "REFERENCE_APPS.md"));
must(resolve("docs", "RUNTIME_PERMISSIONS.md"));
must(resolve("docs", "SBOM.json"));
must(resolve("fastscript.permissions.example.json"));
must(resolve("fastscript.permissions.json"));

const vercel = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));
const headers = (vercel.headers || []).flatMap((h) => h.headers || []).map((h) => `${h.key}:${h.value}`.toLowerCase());
for (const required of ["x-content-type-options:nosniff", "x-frame-options:sameorigin", "referrer-policy:strict-origin-when-cross-origin"]) {
  if (!headers.includes(required)) throw new Error(`missing security header: ${required}`);
}

const wrangler = readFileSync(resolve("wrangler.toml"), "utf8").toLowerCase();
if (!wrangler.includes("compatibility_flags = [\"nodejs_compat\"]")) throw new Error("wrangler missing nodejs_compat compatibility flag");
if (!wrangler.includes("fastscript_deploy_target = \"cloudflare\"")) throw new Error("wrangler missing deploy target variable");

const rootPolicy = JSON.parse(readFileSync(resolve("fastscript.permissions.json"), "utf8"));
if (String(rootPolicy.preset || "").toLowerCase() !== "secure") throw new Error("root fastscript.permissions.json must use secure preset");

const examplePolicy = JSON.parse(readFileSync(resolve("fastscript.permissions.example.json"), "utf8"));
if (String(examplePolicy.preset || "").toLowerCase() !== "secure") throw new Error("fastscript.permissions.example.json must use secure preset");

const envSchema = readFileSync(resolve("app", "env.schema.fs"), "utf8");
for (const key of ["SESSION_SECRET", "DATABASE_URL", "WEBHOOK_SECRET", "MAX_BODY_BYTES", "REQUEST_TIMEOUT_MS"]) {
  if (!envSchema.includes(key)) throw new Error(`env schema missing: ${key}`);
}

console.log("test-security-baseline pass");
