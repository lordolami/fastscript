import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("docs");
const outPath = resolve("docs", "SBOM.json");
mkdirSync(outDir, { recursive: true });

const raw = execSync("npm ls --all --json", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const tree = JSON.parse(raw);

const report = {
  generatedAt: new Date().toISOString(),
  tool: "npm ls --all --json",
  name: tree.name,
  version: tree.version,
  dependencies: tree.dependencies || {},
};

writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`sbom written: ${outPath}`);
