import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execSync } from "node:child_process";

const ROOT = resolve(".");
const PRIVATE_ROOT = resolve(process.env.FASTSCRIPT_PRIVATE_ROOT || resolve("..", "fastscript-core-private"));
const OUT = resolve(".release", "npm-public");
const VENDORED_CORE = join(OUT, "node_modules", "@fastscript", "core-private");
const MODE = process.argv[2] || "";

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function copyIntoOut(relPath) {
  const from = join(ROOT, relPath);
  if (!existsSync(from)) return;
  const to = join(OUT, relPath);
  ensureDir(dirname(to));
  cpSync(from, to, { recursive: true });
}

function copyPrivateFiles() {
  const privatePkg = JSON.parse(readFileSync(join(PRIVATE_ROOT, "package.json"), "utf8"));
  const include = privatePkg.files || ["src", "package.json", "README.md"];
  for (const relPath of include) {
    const from = join(PRIVATE_ROOT, relPath);
    if (!existsSync(from)) continue;
    const to = join(VENDORED_CORE, relPath);
    ensureDir(dirname(to));
    cpSync(from, to, { recursive: true });
  }
  return privatePkg;
}

function prepareReleaseDir() {
  rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  const publicPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const privatePkg = copyPrivateFiles();

  const files = publicPkg.files || ["src", "README.md", "LICENSE", "CHANGELOG.md"];
  for (const relPath of files) copyIntoOut(relPath);

  const releasePkg = {
    ...publicPkg,
    dependencies: {
      ...publicPkg.dependencies,
      "@fastscript/core-private": privatePkg.version
    },
    bundleDependencies: ["@fastscript/core-private"],
    private: false
  };

  delete releasePkg.scripts?.["publish:npm"];

  writeJson(join(OUT, "package.json"), releasePkg);
  writeFileSync(
    join(OUT, ".npm-release-readme.txt"),
    [
      "Generated npm release bundle for FastScript.",
      "This directory is build output. Do not edit manually.",
      "Source development still happens in the split public/private repos."
    ].join("\n"),
    "utf8"
  );
}

function runNpm(args) {
  const command = `npm ${args.join(" ")}`;
  execSync(command, {
    cwd: OUT,
    stdio: "inherit"
  });
}

prepareReleaseDir();
console.log(`npm release prepared: ${OUT}`);

if (MODE === "--pack-dry-run") {
  runNpm(["pack", "--dry-run"]);
} else if (MODE === "--pack") {
  runNpm(["pack"]);
}
