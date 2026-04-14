import { execFileSync } from "node:child_process";
import { chmodSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const prePush = resolve(".githooks", "pre-push");

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
} catch (error) {
  console.error("failed to configure git hooks path (.githooks).");
  console.error(error?.message || String(error));
  process.exit(1);
}

if (existsSync(prePush)) {
  try {
    chmodSync(prePush, 0o755);
  } catch {}
}

console.log("hooks installed: core.hooksPath=.githooks");
console.log("pre-push will run: npm run qa:all");
