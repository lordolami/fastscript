import { runDeploy as runPrivateDeploy } from "@fastscript/core-private/deploy";
import { rewritePublicMetaShell } from "./public-meta.mjs";

export async function runDeploy(args = []) {
  const result = await runPrivateDeploy(args);
  rewritePublicMetaShell();
  return result;
}

export * from "@fastscript/core-private/deploy";
