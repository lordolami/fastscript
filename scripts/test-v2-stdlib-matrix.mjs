import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-stdlib-matrix");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const arr = Array.of(1, 2, 3)
const from = Array.from(arr)
const isArr = Array.isArray(from)
const mapped = from.map((n) => n + 1)
const filtered = mapped.filter((n) => n > 1)
const reduced = filtered.reduce((acc, n) => acc + n, 0)
const found = filtered.find((n) => n > 1)
const some = filtered.some((n) => n > 2)
const every = filtered.every((n) => n > 0)
const idx = filtered.indexOf(2)

const obj = { a: 1, b: 2 }
const keys = Object.keys(obj)
const vals = Object.values(obj)
const entries = Object.entries(obj)
const assigned = Object.assign({}, obj)
const fromEntries = Object.fromEntries(entries)
const hasOwn = Object.hasOwn(obj, "a")

const str = " Hello "
const trim = str.trim().toUpperCase()
const starts = trim.startsWith("H")
const split = trim.split(" ")

const finite = Number.isFinite(10)
const parsedF = Number.parseFloat("1.2")
const parsedI = Number.parseInt("42")

const now = Date.now()
const parsedDate = Date.parse("2025-01-01T00:00:00.000Z")
const utc = Date.UTC(2025, 0, 1)

const p1 = Promise.resolve(1)
const p2 = Promise.resolve("x")
const pall = Promise.all([p1, p2])
const prace = Promise.race([p1, p2])

const set = new Set([1, 2, 3])
set.add(4)
const hasSet = set.has(2)
const map = new Map([["a", 1]])
map.set("b", 2)
const got = map.get("a")

const err = new Error("bad")
const rex = new RegExp("a", "g")
const ok = rex.test("abc")
const exec = rex.exec("abc")

const url = new URL("https://example.com?a=1")
const usp = new URLSearchParams(url.search)
usp.set("a", "2")
const href = url.toString()
const q = usp.toString()

const dtf = new Intl.DateTimeFormat("en-US")
const nf = new Intl.NumberFormat("en-US")
const te = new TextEncoder()
const td = new TextDecoder()
const bytes = te.encode("hello")
const text = td.decode(bytes)

export default function StdlibMatrix() {
  return [
    String(isArr),
    String(reduced),
    String(found),
    String(some),
    String(every),
    String(idx),
    String(keys.length),
    String(vals.length),
    String(entries.length),
    String(Boolean(assigned && fromEntries)),
    String(hasOwn),
    trim,
    String(starts),
    String(split.length),
    String(finite),
    String(parsedF + parsedI),
    String(now + parsedDate + utc),
    String(Boolean(pall && prace)),
    String(hasSet),
    String(got),
    String(err.message),
    String(ok),
    String(Boolean(exec)),
    href,
    q,
    String(Boolean(dtf && nf)),
    text
  ].join(":")
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const errors = (report.diagnostics || []).filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero type errors, got ${errors.length}`);

rmSync(root, { recursive: true, force: true });
console.log("test-v2-stdlib-matrix pass");
