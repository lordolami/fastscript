import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(".env");
const current = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const lines = current.split(/\r?\n/);

function nextSecret() {
  return randomBytes(32).toString("hex");
}

function upsert(key, value) {
  const idx = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (idx >= 0) lines[idx] = `${key}=${value}`;
  else lines.push(`${key}=${value}`);
}

upsert("SESSION_SECRET", nextSecret());
upsert("STORAGE_SIGNING_SECRET", nextSecret());
upsert("WEBHOOK_SECRET", nextSecret());
upsert("ROTATED_AT", new Date().toISOString());

writeFileSync(envPath, `${lines.filter((line, i) => !(line === "" && i === lines.length - 1)).join("\n")}\n`, "utf8");
console.log("secret rotation complete (.env updated)");
