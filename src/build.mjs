import { runBuild as runPrivateBuild } from "@fastscript/core-private/build";
import { rewritePublicMetaShell } from "./public-meta.mjs";

export async function runBuild(options = {}) {
  await runPrivateBuild(options);
  rewritePublicMetaShell();
}

export * from "@fastscript/core-private/build";
