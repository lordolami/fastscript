import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { loadCompatibilityArtifacts, loadCompatibilityRegistry, writeCompatibilityArtifacts } from "../src/compatibility-governance.mjs";

const docsDir = resolve("docs");
const outPath = resolve("docs", "search-index.json");
const generatedDir = resolve("src", "generated");
const moduleOutPath = resolve(generatedDir, "docs-search-index.mjs");

const registry = loadCompatibilityRegistry();
const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const artifacts = loadCompatibilityArtifacts();
writeCompatibilityArtifacts({ registry, pkg, artifacts });

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

if (!existsSync(docsDir)) throw new Error("Missing docs directory");

const files = readdirSync(docsDir).filter((name) => name.endsWith(".md"));
const items = [];
const PATH_OVERRIDES = {
  "support_matrix": "/docs/support",
  "real_world_adoption": "/docs/adoption",
  "team_dashboard_saas": "/docs/team-dashboard-saas",
  "agency_ops_guide": "/docs/agency-ops",
};

for (const name of files) {
  const path = join(docsDir, name);
  const raw = readFileSync(path, "utf8");
  const lines = raw.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : name.replace(/\.md$/, "");
  const summary = lines.slice(1).find((line) => line.trim() && !line.startsWith("#")) || "";
  const tokens = tokenize(`${title} ${summary} ${raw}`);
  const terms = {};
  for (const token of tokens) terms[token] = (terms[token] || 0) + 1;
  items.push({
    id: name.replace(/\.md$/, "").toLowerCase(),
    title,
    path: PATH_OVERRIDES[name.replace(/\.md$/, "").toLowerCase()] || `/docs/${name.replace(/\.md$/, "").toLowerCase()}`,
    summary: summary.trim(),
    terms,
  });
}

writeFileSync(outPath, JSON.stringify(items, null, 2), "utf8");
mkdirSync(generatedDir, { recursive: true });
writeFileSync(
  moduleOutPath,
  `export const DOC_SEARCH_INDEX = ${JSON.stringify(items, null, 2)};\nexport default DOC_SEARCH_INDEX;\n`,
  "utf8",
);
console.log(`docs search index built: ${outPath}`);
console.log(`docs search module built: ${moduleOutPath}`);
