import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-inference-patterns");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const user = { name: "Alice", age: 30 }
const { name, age } = user
const [first, second] = [1, 2]

async function fetchUser(id) {
  const response = await fetch("/api/users/" + String(id))
  const data = await response.json()
  return data
}

function process(value) {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  if (Array.isArray(value)) {
    return value.length
  }
  return null
}

function getName(input) {
  return input?.name ?? "Unknown"
}

function twice(fn) {
  return (x) => fn(fn(x))
}

const addTwo = (n) => n + 2
const addFour = twice(addTwo)
const result = addFour(5)
const resolved = fetchUser(1)

export default function InferencePatterns() {
  return String(name) + ":" + String(age) + ":" + String(first + second) + ":" + String(process("x")) + ":" + String(getName(user)) + ":" + String(result) + ":" + String(resolved)
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const errors = (report.diagnostics || []).filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero type errors, got ${errors.length}`);

const symbols = (report.files || []).flatMap((f) => f.symbols || []);
const byName = new Map(symbols.map((s) => [s.name, s.type]));

assert.equal(byName.get("name"), "string");
assert.equal(byName.get("age"), "number");
assert.equal(byName.get("first"), "number");
assert.equal(byName.get("second"), "number");
assert.equal(byName.get("result"), "number");

rmSync(root, { recursive: true, force: true });
console.log("test-v2-inference-patterns pass");
