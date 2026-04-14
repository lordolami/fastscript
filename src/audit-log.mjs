import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function sha(input) {
  return createHash("sha256").update(input).digest("hex");
}

function readLines(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean);
}

export function createAuditLog({ file = ".fastscript/audit.log" } = {}) {
  const path = resolve(file);
  mkdirSync(dirname(path), { recursive: true });

  function append(event) {
    const lines = readLines(path);
    let prevHash = "genesis";
    if (lines.length) {
      const last = JSON.parse(lines[lines.length - 1]);
      prevHash = last.hash || "genesis";
    }
    const record = {
      ts: new Date().toISOString(),
      prevHash,
      ...event,
    };
    record.hash = sha(JSON.stringify({ ...record, hash: undefined }));
    lines.push(JSON.stringify(record));
    writeFileSync(path, `${lines.join("\n")}\n`, "utf8");
    return record;
  }

  function verify() {
    const lines = readLines(path);
    let prevHash = "genesis";
    for (const line of lines) {
      const row = JSON.parse(line);
      if (row.prevHash !== prevHash) return { ok: false, row };
      const expected = sha(JSON.stringify({ ...row, hash: undefined }));
      if (row.hash !== expected) return { ok: false, row };
      prevHash = row.hash;
    }
    return { ok: true, count: lines.length };
  }

  return { append, verify, file: path };
}
