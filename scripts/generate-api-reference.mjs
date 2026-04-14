import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const srcDir = resolve("src");
const outPath = resolve("docs", "API_REFERENCE.md");
if (!existsSync(srcDir)) throw new Error("Missing src directory");

const files = readdirSync(srcDir).filter((name) => name.endsWith(".mjs")).sort();
const lines = ["# API Reference", "", "Auto-generated from `src/*.mjs`.", ""];

for (const file of files) {
  const path = join(srcDir, file);
  const raw = readFileSync(path, "utf8");
  const exports = [];
  for (const match of raw.matchAll(/export\s+(async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
    exports.push(match[2]);
  }
  for (const match of raw.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)\s*=/g)) {
    exports.push(match[1]);
  }
  if (!exports.length) continue;
  lines.push(`## ${file}`);
  lines.push("");
  for (const name of [...new Set(exports)].sort()) {
    lines.push(`- \`${name}\``);
  }
  lines.push("");
}

writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`api reference generated: ${outPath}`);
