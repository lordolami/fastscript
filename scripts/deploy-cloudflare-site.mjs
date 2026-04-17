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

function formatInvocation(command, args) {
  return `${command} ${args.join(" ")}`.trim();
}

function quoteWindowsArg(value) {
  if (!/[ \t"]/u.test(value)) return value;
  return `"${value.replace(/"/gu, '\\"')}"`;
}

function run(stepName, command, args) {
  const invocation = formatInvocation(command, args);
  console.log(`[deploy:cloudflare] ${stepName}: ${invocation}`);
  const resolved = resolveCommand(command);
  const result = process.platform === "win32" && resolved.endsWith(".cmd")
    ? spawnSync(
        process.env.ComSpec || "cmd.exe",
        ["/d", "/s", "/c", `${quoteWindowsArg(resolved)} ${args.map(quoteWindowsArg).join(" ")}`],
        { stdio: "inherit" }
      )
    : spawnSync(resolved, args, { stdio: "inherit" });
  if (result.error) {
    console.error(
      `[deploy:cloudflare] ${stepName} failed to start: ${result.error.message}`
    );
    process.exit(1);
  }
  if (result.status !== 0 || result.signal) {
    const exitDetail = result.signal
      ? `signal=${result.signal}`
      : `exit=${result.status ?? "unknown"}`;
    console.error(
      `[deploy:cloudflare] ${stepName} failed (${exitDetail}) while running: ${invocation}`
    );
    process.exit(result.status || 1);
  }
}

run("build", "npm", ["run", "build"]);
run("adapter deploy prep", "node", ["./src/cli.mjs", "deploy", "--target", "cloudflare"]);
run("wrangler deploy", "npx", ["wrangler", "deploy"]);
