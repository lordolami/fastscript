import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const appRoot = resolve("app");

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

assert.equal(existsSync(appRoot), true, "Missing app/ directory.");
const files = walk(appRoot);

const authoredJs = files
  .filter((file) => file.endsWith(".js"))
  .filter((file) => !file.includes(`${resolve("app").replace(/\\/g, "/")}/generated/`));

assert.equal(authoredJs.length, 0, `Expected zero authored .js files under app/, found ${authoredJs.length}\n${authoredJs.join("\n")}`);

console.log("test-v2-zero-js-app pass");
