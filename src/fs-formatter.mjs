import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { generate } from "astring";
import { parseFastScript } from "./fs-parser.mjs";

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (st.isFile()) out.push(full);
  }
  return out;
}

function shouldThrowForFormat(diagnostics) {
  return diagnostics.some((diagnostic) => diagnostic.severity !== "warning");
}

export function formatFastScriptSource(source, { file = "" } = {}) {
  const parsed = parseFastScript(source, { file, mode: "lenient", recover: true });
  if (!parsed.estree || shouldThrowForFormat(parsed.diagnostics)) {
    return String(source ?? "");
  }

  const formatted = generate(parsed.estree, {
    comments: false,
    indent: "  ",
    lineEnd: "\n",
  });

  return formatted.endsWith("\n") ? formatted : `${formatted}\n`;
}

export async function runFormat(args = []) {
  let target = "app";
  let write = true;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--path") target = args[i + 1] || target;
    if (args[i] === "--check") write = false;
    if (args[i] === "--write") write = true;
  }

  const base = resolve(target);
  const files = walk(base).filter((file) => extname(file) === ".fs");
  let changed = 0;

  for (const file of files) {
    const current = readFileSync(file, "utf8");
    const next = formatFastScriptSource(current, { file });
    if (current !== next) {
      changed += 1;
      if (write) writeFileSync(file, next, "utf8");
    }
  }

  if (!write && changed > 0) {
    const error = new Error(`format check failed: ${changed} file(s) need formatting`);
    error.status = 1;
    throw error;
  }

  console.log(`format ${write ? "write" : "check"} complete: ${files.length} file(s), ${changed} changed`);
}
