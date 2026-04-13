import { extname } from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";
import { normalizeFastScript } from "./fs-normalize.mjs";

function fsLoaderPlugin() {
  return {
    name: "fastscript-fs-loader",
    setup(build) {
      build.onLoad({ filter: /\.fs$/ }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const raw = await readFile(args.path, "utf8");
        return { contents: normalizeFastScript(raw), loader: "js" };
      });
    },
  };
}

export async function importSourceModule(filePath, { platform = "node" } = {}) {
  const ext = extname(filePath).toLowerCase();
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
  return import(dataUrl);
}
