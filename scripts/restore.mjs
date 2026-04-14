import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const backupsRoot = resolve(".backups");
if (!existsSync(backupsRoot)) throw new Error("No backups found.");

const dirs = readdirSync(backupsRoot).sort();
const target = process.argv[2] ? resolve(process.argv[2]) : join(backupsRoot, dirs[dirs.length - 1]);
if (!existsSync(target)) throw new Error(`Backup not found: ${target}`);

const manifestPath = join(target, "manifest.json");
if (!existsSync(manifestPath)) throw new Error(`Missing backup manifest: ${manifestPath}`);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const source of manifest.sources || []) {
  const src = join(target, source);
  const dst = resolve(source);
  rmSync(dst, { recursive: true, force: true });
  cpSync(src, dst, { recursive: true });
}

console.log(`restore complete: ${target}`);
