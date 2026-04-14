import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function rankDocs(index = [], query = "", { limit = 20 } = {}) {
  const q = tokenize(query);
  if (!q.length) return index.slice(0, limit);
  return index
    .map((item) => {
      const terms = item.terms || {};
      let score = 0;
      for (const token of q) score += Number(terms[token] || 0);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function loadDocsIndex(path = "docs/search-index.json") {
  const full = resolve(path);
  if (!existsSync(full)) return [];
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch {
    return [];
  }
}
