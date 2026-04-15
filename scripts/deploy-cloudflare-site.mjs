#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function resolveCommand(command) {
  if (process.platform === "win32") {
    if (command === "npm") return "npm.cmd";
    if (command === "npx") return "npx.cmd";
    if (command === "node") return "node.exe";
  }
  return command;
}

function run(command, args) {
  const result = spawnSync(resolveCommand(command), args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run("npm", ["run", "build"]);
run("node", ["./src/cli.mjs", "deploy", "--target", "cloudflare"]);
run("npx", ["wrangler", "deploy"]);
