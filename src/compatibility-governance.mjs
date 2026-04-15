import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REGISTRY_PATH = resolve("spec", "compatibility-registry.json");
const SUPPORT_MATRIX_PATH = resolve("docs", "SUPPORT_MATRIX.md");
const REPORT_PATH = resolve(".fastscript", "proofs", "compatibility-registry-report.json");
const GENERATED_DIR = resolve("src", "generated");
const GENERATED_MODULE_PATH = resolve(GENERATED_DIR, "compatibility-registry-report.mjs");
const VALID_STATUSES = new Set(["proven", "supported", "partial", "planned", "blocked"]);
const CATEGORY_ORDER = [
  "ecmascript",
  "typescript",
  "jsx-tsx",
  "fastscript-sugar",
  "modules-interop",
  "runtime-targets",
  "framework-patterns",
  "tooling",
  "deployment-adapters",
];
const CATEGORY_LABELS = {
  "ecmascript": "ECMAScript Syntax",
  "typescript": "TypeScript Syntax Erasure",
  "jsx-tsx": "JSX / TSX",
  "fastscript-sugar": "FastScript Sugar",
  "modules-interop": "Modules And Interop",
  "runtime-targets": "Runtime Targets",
  "framework-patterns": "Framework Patterns",
  "tooling": "Tooling",
  "deployment-adapters": "Deployment Adapters",
};

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function stableLineFromVersion(version) {
  const [major = "0", minor = "0"] = String(version || "0.0.0").split(".");
  return `${major}.${minor}.x`;
}

function formatProofId(id) {
  return `\`${String(id || "").replace(/^artifact:/, "").replace(/^script:/, "script:")}\``;
}

export function loadCompatibilityRegistry(path = REGISTRY_PATH) {
  const registry = readJson(path, {});
  return {
    governanceTrack: String(registry.governanceTrack || "4.0"),
    contract: String(registry.contract || ""),
    entries: Array.isArray(registry.entries) ? registry.entries : [],
  };
}

export function loadCompatibilityArtifacts() {
  return {
    jsTsProof: readJson(resolve(".fastscript", "proofs", "js-ts-syntax-proof.json"), { status: "missing", cases: [] }),
    fsParityProof: readJson(resolve(".fastscript", "proofs", "fs-parity-matrix.json"), { status: "missing", results: [] }),
    interop: readJson(resolve("benchmarks", "interop-latest.json"), { summary: { total: 0, pass: 0, fail: 0 }, cases: [] }),
  };
}

export function collectProofMap(pkg, artifacts = loadCompatibilityArtifacts()) {
  const map = new Map();
  const artifactIds = [];
  for (const scriptName of Object.keys(pkg.scripts || {})) {
    map.set(`script:${scriptName}`, { id: `script:${scriptName}`, status: "configured", kind: "script" });
  }

  for (const testCase of artifacts.jsTsProof.cases || []) {
    const id = `artifact:js-ts-syntax-proof:${testCase.id}`;
    map.set(id, { id, status: testCase.status, kind: "artifact", artifact: "js-ts-syntax-proof", label: testCase.id });
    if (testCase.status === "pass") artifactIds.push(id);
  }
  for (const result of artifacts.fsParityProof.results || []) {
    const id = `artifact:fs-parity:${result.id}`;
    map.set(id, { id, status: result.status, kind: "artifact", artifact: "fs-parity", label: result.id });
    if (result.status === "pass") artifactIds.push(id);
  }
  for (const item of artifacts.interop.cases || []) {
    const id = `artifact:interop:${item.id}`;
    map.set(id, { id, status: item.status, kind: "artifact", artifact: "interop", label: item.id });
    if (item.status === "pass") artifactIds.push(id);
  }

  return { map, artifactIds };
}

function summarizeByStatus(entries) {
  const out = {};
  for (const entry of entries) out[entry.status] = (out[entry.status] || 0) + 1;
  return out;
}

function summarizeByCategory(entries) {
  const out = {};
  for (const entry of entries) out[entry.category] = (out[entry.category] || 0) + 1;
  return out;
}

function normalizeReportForCompare(report) {
  const clone = JSON.parse(JSON.stringify(report || {}));
  delete clone.generatedAt;
  return clone;
}

function normalizeSupportMatrixForCompare(markdown) {
  return String(markdown || "").replace(/^- Generated: .*\r?\n/m, "- Generated: <normalized>\n");
}

export function buildCompatibilityReport({ registry, pkg, artifacts }) {
  const { map: proofMap } = collectProofMap(pkg, artifacts);
  const resolvedEntries = registry.entries.map((entry) => ({
    ...entry,
    proofDetails: (entry.proofIds || []).map((proofId) => proofMap.get(proofId) || { id: proofId, status: "missing", kind: "unknown" }),
  }));
  return {
    generatedAt: new Date().toISOString(),
    governanceTrack: registry.governanceTrack,
    stableLine: stableLineFromVersion(pkg.version),
    packageVersion: pkg.version,
    contract: registry.contract,
    summary: {
      entries: resolvedEntries.length,
      byStatus: summarizeByStatus(resolvedEntries),
      byCategory: summarizeByCategory(resolvedEntries),
      provenEntries: resolvedEntries.filter((entry) => entry.status === "proven").length,
    },
    artifacts: {
      jsTsSyntaxCases: (artifacts.jsTsProof.cases || []).length,
      fsParityCases: (artifacts.fsParityProof.results || []).length,
      interopCases: (artifacts.interop.cases || []).length,
    },
    entries: resolvedEntries,
  };
}

export function generateSupportMatrixMarkdown(report) {
  const lines = [
    "# FastScript Compatibility Matrix",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Current stable line: \`${report.stableLine}\``,
    `- Governance track: FastScript \`${report.governanceTrack}\` compatibility system`,
    `- Product contract: ${report.contract}`,
    `- Proven means: linked automated coverage and CI-enforced release discipline`,
    "",
    "## Status Legend",
    "- `proven`: linked automated coverage exists and release gates fail on regression",
    "- `supported`: intended support surface with some proof or operational confidence, but not yet fully governed as `proven`",
    "- `partial`: some known working coverage exists, but not enough to claim full contract safety",
    "- `planned`: visible compatibility lane targeted for future proof coverage",
    "- `blocked`: explicitly unsupported or blocked pending design/runtime work",
    "",
    "## Summary",
    `- Registry entries: ${report.summary.entries}`,
    `- Proven entries: ${report.summary.provenEntries}`,
    `- JS/TS syntax proof cases: ${report.artifacts.jsTsSyntaxCases}`,
    `- .fs parity cases: ${report.artifacts.fsParityCases}`,
    `- Interop cases: ${report.artifacts.interopCases}`,
    "",
  ];

  for (const category of CATEGORY_ORDER) {
    const items = report.entries.filter((entry) => entry.category === category);
    if (!items.length) continue;
    lines.push(`## ${CATEGORY_LABELS[category] || category}`);
    lines.push("| Feature | Status | Proof | Notes |");
    lines.push("|---|---|---|---|");
    for (const entry of items) {
      const proof = entry.proofIds && entry.proofIds.length
        ? entry.proofIds.map((proofId) => formatProofId(proofId)).join(", ")
        : "-";
      const note = entry.docsNote || entry.contractNote || "";
      lines.push(`| ${entry.feature} | ${entry.status} | ${proof} | ${note.replace(/\|/g, "\\|")} |`);
    }
    lines.push("");
  }

  lines.push("## Compatibility Request Lane");
  lines.push("If valid JS/TS, a framework pattern, or a real migration case fails in `.fs`, treat it as a FastScript compatibility bug and report it through the compatibility intake workflow.");
  lines.push("");
  return `${lines.join("\n").trim()}\n`;
}

export function validateCompatibilityGovernance({ registry, pkg, artifacts, supportMatrix = null, reportJson = null }) {
  const errors = [];
  const { map: proofMap, artifactIds } = collectProofMap(pkg, artifacts);
  const referencedArtifactIds = new Set();

  for (const entry of registry.entries) {
    if (!entry.id || !entry.category || !entry.feature) errors.push(`registry entry missing id/category/feature: ${JSON.stringify(entry)}`);
    if (!VALID_STATUSES.has(entry.status)) errors.push(`registry entry has invalid status: ${entry.id} -> ${entry.status}`);
    if (!Array.isArray(entry.proofIds)) errors.push(`registry entry proofIds must be an array: ${entry.id}`);
    for (const proofId of entry.proofIds || []) {
      const resolved = proofMap.get(proofId);
      if (!resolved) {
        errors.push(`registry proof id does not resolve: ${entry.id} -> ${proofId}`);
        continue;
      }
      if (proofId.startsWith("artifact:")) referencedArtifactIds.add(proofId);
      if (entry.status === "proven" && resolved.status !== "pass" && resolved.status !== "configured") {
        errors.push(`proven registry entry links to non-passing proof: ${entry.id} -> ${proofId} (${resolved.status})`);
      }
    }
    if (entry.status === "proven" && (!entry.proofIds || entry.proofIds.length === 0)) {
      errors.push(`proven registry entry must link proof ids: ${entry.id}`);
    }
  }

  for (const artifactId of artifactIds) {
    if (!referencedArtifactIds.has(artifactId)) {
      errors.push(`passing proof artifact is unregistered in compatibility registry: ${artifactId}`);
    }
  }

  const expectedReport = buildCompatibilityReport({ registry, pkg, artifacts });
  const expectedSupportMatrix = generateSupportMatrixMarkdown(expectedReport);
  const actualSupportMatrix = supportMatrix ?? (existsSync(SUPPORT_MATRIX_PATH) ? readFileSync(SUPPORT_MATRIX_PATH, "utf8") : "");
  if (normalizeSupportMatrixForCompare(actualSupportMatrix) !== normalizeSupportMatrixForCompare(expectedSupportMatrix)) {
    errors.push("docs/SUPPORT_MATRIX.md is stale relative to the compatibility registry");
  }

  const actualReportJson = reportJson ?? readJson(REPORT_PATH, null);
  if (JSON.stringify(normalizeReportForCompare(actualReportJson || {})) !== JSON.stringify(normalizeReportForCompare(expectedReport))) {
    errors.push(".fastscript/proofs/compatibility-registry-report.json is stale relative to the compatibility registry");
  }

  return { errors, expectedReport, expectedSupportMatrix };
}

export function writeCompatibilityArtifacts({ registry, pkg, artifacts }) {
  const report = buildCompatibilityReport({ registry, pkg, artifacts });
  const supportMatrix = generateSupportMatrixMarkdown(report);
  mkdirSync(resolve("docs"), { recursive: true });
  mkdirSync(resolve(".fastscript", "proofs"), { recursive: true });
  mkdirSync(GENERATED_DIR, { recursive: true });
  writeFileSync(SUPPORT_MATRIX_PATH, supportMatrix, "utf8");
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(GENERATED_MODULE_PATH, `export const COMPATIBILITY_REPORT = ${JSON.stringify(report, null, 2)};\nexport default COMPATIBILITY_REPORT;\n`, "utf8");
  return { report, supportMatrix };
}

export async function runCompatibilityGovernanceCheck() {
  const registry = loadCompatibilityRegistry();
  const pkg = readJson(resolve("package.json"), {});
  const artifacts = loadCompatibilityArtifacts();
  const { errors } = validateCompatibilityGovernance({ registry, pkg, artifacts });
  if (errors.length) {
    const error = new Error(`compatibility governance failed:\n- ${errors.join("\n- ")}`);
    error.status = 1;
    throw error;
  }
  console.log("compatibility governance pass");
}

