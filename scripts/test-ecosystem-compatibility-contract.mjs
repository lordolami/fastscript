import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import esbuild from "esbuild";
import { normalizeFastScript } from "../src/fs-normalize.mjs";
import { assertFastScript } from "../src/fs-diagnostics.mjs";

function write(root, rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

function fsLoaderPlugin() {
  return {
    name: "fastscript-fs-loader",
    setup(build) {
      build.onLoad({ filter: /\.fs$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        assertFastScript(raw, { file: args.path, mode: "strict" });
        return {
          contents: normalizeFastScript(raw, { file: args.path, mode: "strict", sourceMap: "inline" }),
          loader: "js",
        };
      });
    },
  };
}

const root = mkdtempSync(join(tmpdir(), "fastscript-ecosystem-compat-"));

try {
  write(root, "app/main.fs", `import entry from "pkg-exports"\nimport feature from "pkg-exports/feature"\nimport shared from "@ws/shared"\nconst mod = await import("legacy-cjs")\nexport default function run(){ return [entry(), feature(), shared(), mod.default()].join(":") }\n`);

  write(root, "node_modules/pkg-exports/package.json", JSON.stringify({
    name: "pkg-exports",
    version: "1.0.0",
    type: "module",
    exports: {
      ".": "./index.js",
      "./feature": "./feature.js"
    }
  }, null, 2));
  write(root, "node_modules/pkg-exports/index.js", "export default function(){ return 'exports-root'; }\n");
  write(root, "node_modules/pkg-exports/feature.js", "export default function(){ return 'exports-feature'; }\n");

  write(root, "packages/shared/package.json", JSON.stringify({
    name: "@ws/shared",
    version: "1.0.0",
    type: "module",
    exports: "./index.js"
  }, null, 2));
  write(root, "packages/shared/index.js", "export default function(){ return 'workspace-shared'; }\n");

  mkdirSync(join(root, "node_modules", "@ws"), { recursive: true });
  symlinkSync(join(root, "packages", "shared"), join(root, "node_modules", "@ws", "shared"), "junction");

  write(root, "node_modules/legacy-cjs/package.json", JSON.stringify({
    name: "legacy-cjs",
    version: "1.0.0",
    main: "index.cjs"
  }, null, 2));
  write(root, "node_modules/legacy-cjs/index.cjs", "module.exports = function(){ return 'cjs-ok'; };\n");

  const result = await esbuild.build({
    absWorkingDir: root,
    entryPoints: ["app/main.fs"],
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
    logLevel: "silent",
    resolveExtensions: [".fs", ".js", ".mjs", ".cjs", ".json"],
    plugins: [fsLoaderPlugin()],
    loader: { ".fs": "js" },
  });

  const output = result.outputFiles[0].text;
  assert.equal(output.includes("exports-root"), true);
  assert.equal(output.includes("exports-feature"), true);
  assert.equal(output.includes("workspace-shared"), true);
  assert.equal(output.includes("cjs-ok"), true);

  console.log("test-ecosystem-compatibility-contract pass");
} finally {
  rmSync(root, { recursive: true, force: true });
}
