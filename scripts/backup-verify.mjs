import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const backupsRoot = resolve(".backups");
if (!existsSync(backupsRoot)) throw new Error("No backups found.");
const dirs = readdirSync(backupsRoot).sort();
const latest = join(backupsRoot, dirs[dirs.length - 1]);
const manifestPath = join(latest, "manifest.json");
if (!existsSync(manifestPath)) throw new Error("Latest backup missing manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
for (const source of manifest.sources || []) {
  const p = join(latest, source);
  if (!existsSync(p)) throw new Error(`Backup verification failed (missing ${source})`);
}
console.log(`backup verify pass: ${latest}`);
