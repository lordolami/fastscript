import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { loadCompatibilityArtifacts, loadCompatibilityRegistry, writeCompatibilityArtifacts } from "../src/compatibility-governance.mjs";

const BENCH_MD = resolve("benchmarks", "latest-report.md");
const BENCH_JSON = resolve("benchmarks", "suite-latest.json");
const INTEROP_JSON = resolve("benchmarks", "interop-latest.json");
const INTEROP_MD = resolve("docs", "INTEROP_MATRIX.md");
const OUT_BENCH = resolve("benchmarks", "latest-proof-pack.md");
const OUT_DOCS = resolve("docs", "PROOF_PACK.md");
const JS_TS_PROOF = resolve(".fastscript", "proofs", "js-ts-syntax-proof.json");
const FS_PARITY_PROOF = resolve(".fastscript", "proofs", "fs-parity-matrix.json");
const COMPATIBILITY_REPORT = resolve(".fastscript", "proofs", "compatibility-registry-report.json");
const AGENCY_RUNTIME_JSON = resolve("benchmarks", "agency-ops-runtime.json");

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
  const css = /CSS budget \(16KB\):\s*(PASS|FAIL)/.exec(text)?.[1] || "UNKNOWN";
  return { js, css };
}

const benchMd = existsSync(BENCH_MD) ? readFileSync(BENCH_MD, "utf8") : "# FastScript Benchmark Report\n\nMissing benchmark report.\n";
const bench = readJson(BENCH_JSON, {});
const interop = readJson(INTEROP_JSON, { summary: { total: 0, pass: 0, fail: 0 }, cases: [] });
const budget = parseBudget(benchMd);
const jsTsProof = readJson(JS_TS_PROOF, { status: "missing", cases: [] });
const fsParityProof = readJson(FS_PARITY_PROOF, {
  status: "missing",
  parserFrontendParity: { status: "missing", syntaxCases: 0 },
  runtimePlatformParity: { status: "missing", runtimeCases: 0, buildCorpus: 0 },
});
const registry = loadCompatibilityRegistry();
const pkg = readJson(resolve("package.json"), {});
const compatibilityArtifacts = loadCompatibilityArtifacts();
writeCompatibilityArtifacts({ registry, pkg, artifacts: compatibilityArtifacts });
const compatibilityReport = readJson(COMPATIBILITY_REPORT, { summary: { entries: 0, provenEntries: 0, byStatus: {} } });
const agencyRuntime = readJson(AGENCY_RUNTIME_JSON, null);
const agencyCorpus = (bench.corpora || []).find((item) => item.id === "example-agency-ops") || null;

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
- CSS budget (16KB): ${budget.css}
- Interop cases: ${interop.summary?.total ?? 0}
- Interop pass: ${interop.summary?.pass ?? 0}
- Interop fail: ${interop.summary?.fail ?? 0}
- JS/TS syntax proof: ${jsTsProof.status}
- JS/TS syntax cases: ${jsTsProof.cases?.length ?? 0}
- \`.fs\` parity proof: ${fsParityProof.status}
- Parser/frontend parity: ${fsParityProof.parserFrontendParity?.status ?? "missing"} (${fsParityProof.parserFrontendParity?.syntaxCases ?? 0} cases)
- Runtime/platform parity: ${fsParityProof.runtimePlatformParity?.status ?? "missing"} (${fsParityProof.runtimePlatformParity?.runtimeCases ?? 0} runtime cases, ${fsParityProof.runtimePlatformParity?.buildCorpus ?? 0} build corpus)
- Compatibility registry entries: ${compatibilityReport.summary?.entries ?? 0}
- Compatibility proven entries: ${compatibilityReport.summary?.provenEntries ?? 0}
- Framework proof rows: ${compatibilityReport.summary?.byCategory?.["framework-patterns"] ?? 0}
- Agency Ops warm build p95 trimmed: ${agencyCorpus?.timingsMs?.buildWarm?.p95Trimmed ?? "n/a"}ms
- Agency Ops cold build: ${agencyCorpus?.timingsMs?.buildCold?.ms ?? "n/a"}ms
- Agency Ops runtime /dashboard: ${agencyRuntime?.timingsMs?.dashboard ?? "n/a"}ms
- Launch line: FastScript v4
- Product contract: FastScript is the complete TypeScript platform, with ordinary JS/TS in \`.fs\` and valid JS/TS failures in \`.fs\` treated as FastScript compatibility bugs
- Release posture: source-available public repo, proprietary core, no AI-training use without permission

## Benchmark Report

${benchMd.trim()}

## Interop Matrix

See full matrix: \`docs/INTEROP_MATRIX.md\`

### Failed Interop Cases
${failLines}

## Agency Ops Speed Proof
- Benchmark corpus id: \`example-agency-ops\`
- Warm build p95 trimmed: ${agencyCorpus?.timingsMs?.buildWarm?.p95Trimmed ?? "n/a"}ms
- Cold build: ${agencyCorpus?.timingsMs?.buildCold?.ms ?? "n/a"}ms
- Runtime /: ${agencyRuntime?.timingsMs?.home ?? "n/a"}ms
- Runtime /dashboard: ${agencyRuntime?.timingsMs?.dashboard ?? "n/a"}ms
- Runtime /dashboard/clients: ${agencyRuntime?.timingsMs?.clientsPage ?? "n/a"}ms
- Runtime /api/session: ${agencyRuntime?.timingsMs?.sessionBootstrap ?? "n/a"}ms

## JS/TS Compatibility Proof
- Syntax proof artifact: \`.fastscript/proofs/js-ts-syntax-proof.json\`
- \`.fs\` parity artifact: \`.fastscript/proofs/fs-parity-matrix.json\`
- Compatibility registry artifact: \`.fastscript/proofs/compatibility-registry-report.json\`
- Product contract: valid JS/TS in \`.fs\` is the compatibility target; failures are treated as FastScript bugs.
- Current governed ecosystem sweep: Next pages/layouts/navigation/shared modules, React hooks/context/lazy/shared helpers, Node middleware/error/request-mutation flow, Vue composables/store/app utilities, and expanded npm export-condition interop are represented in the matrix.
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
