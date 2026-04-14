import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-runtime-scope-diag");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });
mkdirSync(join(root, "api"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const envName = process?.env?.NODE_ENV || "dev"
const host = window?.location?.host || ""
export default function Page() { return envName + ":" + host }`,
  "utf8",
);

writeFileSync(
  join(root, "pages", "browser.client.fs"),
  `const envName = process?.env?.NODE_ENV || "dev"
export default function BrowserOnly() { return envName }`,
  "utf8",
);

writeFileSync(
  join(root, "api", "status.fs"),
  `export async function GET() {
  return { ok: Boolean(window) }
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const diagnostics = report.diagnostics || [];
const fs4201 = diagnostics.filter((d) => d.code === "FS4201");

assert.equal(fs4201.length, 2, "Expected exactly two runtime-scope diagnostics (FS4201).");
assert.equal(
  fs4201.some((d) => String(d.file || "").includes("browser.client.fs") && String(d.message || "").includes("process")),
  true,
  "Expected process misuse to be reported for .client.fs context.",
);
assert.equal(
  fs4201.some((d) => String(d.file || "").replace(/\\/g, "/").includes("api/status.fs") && String(d.message || "").includes("window")),
  true,
  "Expected window misuse to be reported for api/server context.",
);

rmSync(root, { recursive: true, force: true });
console.log("test-runtime-scope-diagnostics pass");
