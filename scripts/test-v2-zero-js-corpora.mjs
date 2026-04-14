import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

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

function findAuthoredJsUnderApp(rootRel) {
  const appRoot = resolve(rootRel, "app");
  if (!existsSync(appRoot)) {
    return { skipped: true, authoredJs: [] };
  }
  const files = walk(appRoot);
  const generatedPrefix = `${resolve(rootRel, "app", "generated").replace(/\\/g, "/")}/`;
  const authoredJs = files
    .filter((file) => file.endsWith(".js"))
    .filter((file) => !file.replace(/\\/g, "/").startsWith(generatedPrefix));
  return { skipped: false, authoredJs };
}

const targets = [
  ".",
  "yomiru",
  "examples/startup-mvp",
  "examples/fullstack"
];

for (const target of targets) {
  const { skipped, authoredJs } = findAuthoredJsUnderApp(target);
  if (skipped) {
    console.log(`test-v2-zero-js-corpora skip: missing ${target}/app`);
    continue;
  }
  assert.equal(
    authoredJs.length,
    0,
    `Expected zero authored .js files under ${target}/app, found ${authoredJs.length}\n${authoredJs.join("\n")}`
  );
}

console.log("test-v2-zero-js-corpora pass");
