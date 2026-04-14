import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const BENCH_MD = resolve("benchmarks", "latest-report.md");
const BENCH_JSON = resolve("benchmarks", "suite-latest.json");
const INTEROP_JSON = resolve("benchmarks", "interop-latest.json");
const INTEROP_MD = resolve("docs", "INTEROP_MATRIX.md");
const OUT_BENCH = resolve("benchmarks", "latest-proof-pack.md");
const OUT_DOCS = resolve("docs", "PROOF_PACK.md");

function readJson(path, fallback = {}) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function parseBudget(md) {
  const text = String(md || "");
  const js = /JS budget \(30KB\):\s*(PASS|FAIL)/.exec(text)?.[1] || "UNKNOWN";
  const css = /CSS budget \(10KB\):\s*(PASS|FAIL)/.exec(text)?.[1] || "UNKNOWN";
  return { js, css };
}

const benchMd = existsSync(BENCH_MD) ? readFileSync(BENCH_MD, "utf8") : "# FastScript Benchmark Report\n\nMissing benchmark report.\n";
const bench = readJson(BENCH_JSON, {});
const interop = readJson(INTEROP_JSON, { summary: { total: 0, pass: 0, fail: 0 }, cases: [] });
const budget = parseBudget(benchMd);

const failed = (interop.cases || []).filter((item) => item.status === "fail");
const failLines = failed.length
  ? failed.map((item) => `- \`${item.id}\` (${item.target}): ${item.error || "unknown error"}`).join("\n")
  : "- None";

const markdown = `# FastScript Proof Pack

- Generated: ${new Date().toISOString()}

## Summary
- Routes: ${bench.routes ?? "n/a"}
- JS gzip: ${bench.js ?? "n/a"} bytes
- CSS gzip: ${bench.css ?? "n/a"} bytes
- JS budget (30KB): ${budget.js}
- CSS budget (10KB): ${budget.css}
- Interop cases: ${interop.summary?.total ?? 0}
- Interop pass: ${interop.summary?.pass ?? 0}
- Interop fail: ${interop.summary?.fail ?? 0}

## Benchmark Report

${benchMd.trim()}

## Interop Matrix

See full matrix: \`docs/INTEROP_MATRIX.md\`

### Failed Interop Cases
${failLines}
`;

mkdirSync(resolve("benchmarks"), { recursive: true });
mkdirSync(resolve("docs"), { recursive: true });
writeFileSync(OUT_BENCH, markdown, "utf8");
writeFileSync(OUT_DOCS, markdown, "utf8");

if (existsSync(INTEROP_MD)) {
  const interopDoc = readFileSync(INTEROP_MD, "utf8");
  writeFileSync(OUT_DOCS, `${markdown}\n\n---\n\n${interopDoc}\n`, "utf8");
}

console.log(`proof pack written: ${OUT_BENCH}`);
console.log(`proof pack written: ${OUT_DOCS}`);

