import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const docsDir = resolve("docs");
const outPath = resolve("docs", "search-index.json");

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
    path: `/docs/${name.replace(/\.md$/, "").toLowerCase()}`,
    summary: summary.trim(),
    terms,
  });
}

writeFileSync(outPath, JSON.stringify(items, null, 2), "utf8");
console.log(`docs search index built: ${outPath}`);
