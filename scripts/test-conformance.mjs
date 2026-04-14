import assert from "node:assert/strict";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { compileFastScript, parseFastScript } from "../src/fs-parser.mjs";
import { formatFastScriptSource } from "../src/fs-formatter.mjs";

const ROOT = resolve("spec", "conformance");
const FIXTURES_DIR = join(ROOT, "fixtures");
const SNAPSHOT_PATH = join(ROOT, "snapshots.json");
const update = process.argv.includes("--update");

function normalizeNewlines(text) {
  return String(text ?? "").replace(/\r\n/g, "\n");
}

function fixtureNames() {
  if (!existsSync(FIXTURES_DIR)) return [];
  return readdirSync(FIXTURES_DIR)
    .filter((name) => name.endsWith(".fs"))
    .sort();
}

function evaluateFixture(name) {
  const file = join(FIXTURES_DIR, name);
  const source = normalizeNewlines(readFileSync(file, "utf8"));
  const parsed = parseFastScript(source, { file: name, mode: "lenient", recover: true });
  const compiled = compileFastScript(source, { file: name, mode: "lenient", recover: true });
  const reparsed = parseFastScript(compiled.code, { file: `${name}.normalized`, mode: "lenient", recover: true });
  const formatted = formatFastScriptSource(source, { file: name });
  const formattedTwice = formatFastScriptSource(formatted, { file: name });

  return {
    diagnostics: parsed.diagnostics.map((diagnostic) => diagnostic.code),
    diagnosticSeverities: parsed.diagnostics.map((diagnostic) => diagnostic.severity),
    bodyTypes: parsed.body.map((node) => node.type),
    rewriteKinds: parsed.rewrites.map((rewrite) => rewrite.kind),
    normalized: normalizeNewlines(compiled.code),
    reparseDiagnostics: reparsed.diagnostics.map((diagnostic) => diagnostic.code),
    sourceMapSources: compiled.map.sources,
    formatterIdempotent: formatted === formattedTwice,
  };
}

const fixtures = fixtureNames();
assert.equal(fixtures.length > 0, true, "No conformance fixtures found.");

const actual = {};
for (const name of fixtures) {
  actual[name] = evaluateFixture(name);
}

if (update || !existsSync(SNAPSHOT_PATH)) {
  mkdirSync(ROOT, { recursive: true });
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(actual, null, 2)}\n`, "utf8");
  console.log(`test-conformance snapshot updated: ${SNAPSHOT_PATH}`);
  process.exit(0);
}

const expected = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
assert.deepEqual(actual, expected);
console.log("test-conformance pass");
