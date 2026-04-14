import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".backups");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = join(root, stamp);
mkdirSync(out, { recursive: true });

const sources = ["app", ".fastscript", "dist"].filter((name) => existsSync(resolve(name)));
for (const source of sources) {
  cpSync(resolve(source), join(out, source), { recursive: true });
}
writeFileSync(
  join(out, "manifest.json"),
  JSON.stringify({ createdAt: new Date().toISOString(), sources }, null, 2),
  "utf8",
);

console.log(`backup complete: ${out}`);
