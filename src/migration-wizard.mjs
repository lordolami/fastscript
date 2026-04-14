import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeFastScript, stripTypeScriptHints } from "./fs-normalize.mjs";

export async function runMigrationWizard(args = []) {
  const pathArg = args[0] || "app/pages/index.js";
  const abs = resolve(pathArg);
  if (!existsSync(abs)) throw new Error(`migration wizard: file not found (${abs})`);
  const raw = readFileSync(abs, "utf8");
  let preview = raw;
  if (/\.(ts|tsx)$/.test(abs)) preview = stripTypeScriptHints(preview);
  preview = normalizeFastScript(preview, { file: abs, mode: "lenient" });
  console.log("=== migration preview ===");
  console.log(preview);
  console.log("=== end preview ===");
}
