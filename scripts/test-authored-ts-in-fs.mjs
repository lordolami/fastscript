import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

const root = mkdtempSync(join(tmpdir(), "fastscript-authored-ts-fs-"));
const typecheckPath = pathToFileURL(resolve("src", "typecheck.mjs")).href;
const buildPath = pathToFileURL(resolve("src", "build.mjs")).href;

try {
  write(
    root,
    "app/pages/index.fs",
    `type CardProps = {
  title: string;
  count: number;
};

function renderCard(props: CardProps): string {
  return \`<article><h1>\${props.title}</h1><p>\${props.count}</p></article>\`;
}

export async fn load(): Promise<CardProps> {
  const count: number = 3;
  return { title: "TS in .fs", count };
}

export default fn Page(props: CardProps) {
  return renderCard(props);
}
`,
  );

  write(
    root,
    "app/pages/about.fs",
    `interface AboutData {
  headline: string;
  tags: string[];
}

const data: AboutData = {
  headline: "Still TypeScript-shaped",
  tags: ["fast", "fs", "typed"],
};

export default fn About() {
  return \`<section><h2>\${data.headline}</h2><p>\${data.tags.join(", ")}</p></section>\`;
}
`,
  );

  const previousCwd = process.cwd();
  process.chdir(root);
  try {
    const { runTypeCheck } = await import(typecheckPath);
    const { runBuild } = await import(buildPath);
    await runTypeCheck(["--mode", "fail"]);
    await runBuild();
  } finally {
    process.chdir(previousCwd);
  }

  assert.equal(existsSync(join(root, "dist", "fastscript-manifest.json")), true);
  const manifest = JSON.parse(readFileSync(join(root, "dist", "fastscript-manifest.json"), "utf8"));
  assert.equal(Array.isArray(manifest.routes), true);
  assert.equal(manifest.routes.length, 2);

  console.log("test-authored-ts-in-fs pass");
} finally {
  try {
    rmSync(root, { recursive: true, force: true });
  } catch {}
}
