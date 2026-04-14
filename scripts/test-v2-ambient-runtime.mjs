import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-ambient-runtime");
const strict = process.argv.includes("--strict");

rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const nums = Array.from([1, 2, 3])
const isList = Array.isArray(nums)
const entries = Object.entries({ a: 1 })
const now = Date.now()
const parsed = JSON.parse("{\\"ok\\":true}")
const biggest = Math.max(now, 0)
const all = Promise.all([Promise.resolve(1), Promise.resolve(2)])

const g = globalThis
const headers = new Headers()
const form = new FormData()
const timer = setTimeout(() => "ok", 1)
clearTimeout(timer)

export default function Probe() {
  return String(isList) + ":" + String(entries.length) + ":" + String(parsed.ok) + ":" + String(biggest) + ":" + String(all) + ":" + String(Boolean(g)) + ":" + String(headers) + ":" + String(form)
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);

const reportPath = resolve(".fastscript", "typecheck-report.json");
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const diagnostics = report?.diagnostics || [];
const errors = diagnostics.filter((d) => d.severity === "error");

console.log(
  `v2 ambient/runtime probe -> files=${report?.summary?.files ?? 0}, errors=${errors.length}, warnings=${report?.summary?.warnings ?? 0}`,
);

if (errors.length > 0) {
  const preview = errors.slice(0, 12).map((d) => `${d.code} ${d.message}`).join("\n");
  console.log(preview);
}

rmSync(root, { recursive: true, force: true });

if (strict && errors.length > 0) {
  process.exitCode = 1;
}
