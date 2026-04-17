import { extname } from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import { normalizeFastScript } from "./fs-normalize.mjs";
import { assertFastScript } from "./fs-diagnostics.mjs";
import { createPermissionRuntime } from "./runtime-permissions.mjs";

let cachedPermissionRuntime = null;

function getPermissionRuntime() {
  if (process.env.FASTSCRIPT_RUNTIME_PERMISSIONS === "0") return null;
  if (!cachedPermissionRuntime) cachedPermissionRuntime = createPermissionRuntime();
  return cachedPermissionRuntime;
}

function fsLoaderPlugin() {
  const rawCompilerMode = (process.env.FASTSCRIPT_COMPILER_MODE || "lenient").toLowerCase();
  const compilerMode = rawCompilerMode === "strict" ? "strict" : "lenient";
  return {
    name: "fastscript-fs-loader",
    setup(build) {
      build.onLoad({ filter: /\.fs$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        assertFastScript(raw, { file: args.path, mode: compilerMode });
        return {
          contents: normalizeFastScript(raw, { file: args.path, mode: compilerMode, sourceMap: "inline" }),
          loader: "js",
        };
      });
    },
  };
}

export async function importSourceModule(filePath, { platform = "node" } = {}) {
  const ext = extname(filePath).toLowerCase();
  const permissionRuntime = getPermissionRuntime();
  permissionRuntime?.assert({ kind: "dynamicImportAccess", resource: filePath, details: { platform } });
  if (ext !== ".fs") {
    return import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
  }

  const result = await esbuild.build({
    entryPoints: [filePath],
    bundle: true,
    platform,
    format: "esm",
    write: false,
    logLevel: "silent",
    resolveExtensions: [".fs", ".js", ".mjs", ".cjs", ".json"],
    plugins: [fsLoaderPlugin()],
    loader: { ".fs": "js" },
  });

  const code = result.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  permissionRuntime?.assert({ kind: "dynamicImportAccess", resource: dataUrl, details: { platform, source: filePath } });
  return import(dataUrl);
}
