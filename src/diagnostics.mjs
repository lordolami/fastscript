import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { analyzeFastScript } from "./fs-diagnostics.mjs";

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", "dist", ".fastscript"].includes(entry.name)) continue;
      out.push(...walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function parseArgs(args = []) {
  const options = {
    path: resolve("app"),
    mode: "report",
    out: resolve(".fastscript", "diagnostics-report.json"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--path") {
      options.path = resolve(args[i + 1] || options.path);
      i += 1;
      continue;
    }
    if (arg === "--out") {
      options.out = resolve(args[i + 1] || options.out);
      i += 1;
      continue;
    }
    if (arg === "--mode") {
      const next = (args[i + 1] || "report").toLowerCase();
      options.mode = next === "fail" ? "fail" : "report";
      i += 1;
    }
  }

  return options;
}

export async function runDiagnostics(args = []) {
  const options = parseArgs(args);
  const files = walk(options.path).filter((file) => file.endsWith(".fs"));
  const diagnostics = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const issues = analyzeFastScript(source, { file, mode: "lenient" });
    for (const issue of issues) {
      diagnostics.push({
        file: normalizePath(file),
        code: issue.code,
        severity: issue.severity,
        message: issue.message,
        line: issue.line,
        column: issue.column,
      });
    }
  }

  const summary = diagnostics.reduce(
    (acc, item) => {
      if (item.severity === "warning") acc.warnings += 1;
      else acc.errors += 1;
      acc.byCode[item.code] = (acc.byCode[item.code] || 0) + 1;
      return acc;
    },
    { errors: 0, warnings: 0, byCode: {} },
  );

  const report = {
    generatedAt: new Date().toISOString(),
    root: normalizePath(options.path),
    filesScanned: files.length,
    summary,
    diagnostics,
  };

  mkdirSync(dirname(options.out), { recursive: true });
  writeFileSync(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (options.mode === "fail" && summary.errors > 0) {
    throw new Error(`diagnostics failed: ${summary.errors} blocking issue(s)`);
  }

  console.log(`diagnostics complete: files=${files.length}, errors=${summary.errors}, warnings=${summary.warnings}`);
  console.log(`diagnostics report: ${normalizePath(relative(resolve("."), options.out))}`);
}

function normalizePath(path) {
  return String(path || "").replace(/\\/g, "/");
}
