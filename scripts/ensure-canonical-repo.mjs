import { execSync } from "node:child_process";

const expected = "github.com/lordolami/fastscript";

if (process.env.FASTSCRIPT_ALLOW_FORK === "1") {
  console.log("canonical repo check skipped: FASTSCRIPT_ALLOW_FORK=1");
  process.exit(0);
}

let remote = "";
try {
  remote = String(execSync("git config --get remote.origin.url", { stdio: ["ignore", "pipe", "ignore"] })).trim();
} catch {
  throw new Error("canonical repo check failed: unable to read git remote.origin.url");
}

if (!remote.includes(expected)) {
  throw new Error(`canonical repo check failed: expected origin containing "${expected}", got "${remote || "<empty>"}"`);
}

console.log(`canonical repo locked: ${remote}`);

