import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createPermissionRuntime,
  evaluateRuntimePermission,
  loadPermissionPolicy,
  permissionAwareEnvGet,
  permissionAwareReadFile,
  permissionAwareSpawn,
  permissionAwareFetch,
  permissionAwarePluginAccess,
} from "../src/runtime-permissions.mjs";
import { importSourceModule } from "../src/module-loader.mjs";

const root = mkdtempSync(join(tmpdir(), "fastscript-runtime-permissions-"));

try {
  const policyPath = join(root, "permissions.json");
  writeFileSync(
    policyPath,
    JSON.stringify(
      {
        preset: "compat",
        fileAccess: { mode: "allow", allow: ["**"], deny: ["**/blocked/**"] },
        envAccess: { mode: "allow", allow: ["FASTSCRIPT_*"], deny: ["FASTSCRIPT_SECRET"] },
        networkAccess: { mode: "allow", allowHosts: ["api.fastscript.dev"], denyHosts: ["blocked.fastscript.dev"] },
        subprocessExecution: { mode: "allow", allowPrefixes: ["node ./scripts/safe.mjs"], denyPrefixes: ["node ./scripts/unsafe.mjs"] },
        dynamicImports: { mode: "allow", allowKinds: ["relative", "absolute", "fileUrl", "dataUrl"], denyKinds: ["package", "httpUrl", "httpsUrl"] },
        pluginAccess: { mode: "allow", allow: ["plugin.safe"], deny: ["plugin.blocked"] },
      },
      null,
      2,
    ),
    "utf8",
  );

  const loaded = loadPermissionPolicy({ root, policyPath });
  const runtime = createPermissionRuntime({ root, policyPath });

  const envAllow = evaluateRuntimePermission(loaded.policy, { kind: "envAccess", resource: "FASTSCRIPT_MODE" });
  const envDeny = evaluateRuntimePermission(loaded.policy, { kind: "envAccess", resource: "FASTSCRIPT_SECRET" });
  assert.equal(envAllow.allowed, true);
  assert.equal(envDeny.allowed, false);

  const subprocessAllow = runtime.check({ kind: "subprocessExecution", resource: "node ./scripts/safe.mjs" });
  const subprocessDeny = runtime.check({ kind: "subprocessExecution", resource: "node ./scripts/unsafe.mjs" });
  assert.equal(subprocessAllow.allowed, true);
  assert.equal(subprocessDeny.allowed, false);

  const dynRelative = runtime.check({ kind: "dynamicImportAccess", resource: "./local.mjs" });
  const dynPackage = runtime.check({ kind: "dynamicImportAccess", resource: "react" });
  assert.equal(dynRelative.allowed, true);
  assert.equal(dynPackage.allowed, false);

  process.env.FASTSCRIPT_MODE = "test";
  assert.equal(permissionAwareEnvGet("FASTSCRIPT_MODE", { runtime }), "test");
  assert.throws(() => permissionAwareEnvGet("FASTSCRIPT_SECRET", { runtime }), /permission denied/i);

  const allowedFile = join(root, "allowed.txt");
  const blockedDir = join(root, "blocked");
  mkdirSync(blockedDir, { recursive: true });
  const blockedFile = join(blockedDir, "denied.txt");
  writeFileSync(allowedFile, "ok", "utf8");
  writeFileSync(blockedFile, "nope", "utf8");
  assert.equal(permissionAwareReadFile(allowedFile, { runtime }), "ok");
  assert.throws(() => permissionAwareReadFile(blockedFile, { runtime }), /permission denied/i);

  const deniedSpawn = () => permissionAwareSpawn("node", ["./scripts/unsafe.mjs"], { stdio: "ignore" }, { runtime });
  assert.throws(deniedSpawn, /permission denied/i);

  await assert.rejects(
    () => permissionAwareFetch("https://blocked.fastscript.dev/health", {}, { runtime }),
    /permission denied/i,
  );

  assert.equal(permissionAwarePluginAccess("plugin.safe", { runtime }), true);
  assert.throws(() => permissionAwarePluginAccess("plugin.blocked", { runtime }), /permission denied/i);

  const moduleFile = join(root, "local-module.js");
  writeFileSync(moduleFile, "export const ok = true;\n", "utf8");

  process.env.FASTSCRIPT_PERMISSION_POLICY_PATH = policyPath;
  let blocked = false;
  try {
    await importSourceModule("react");
  } catch (error) {
    blocked = true;
    assert.equal(String(error.code || ""), "FS7101");
  }
  assert.equal(blocked, true);

  const loadedLocal = await importSourceModule(moduleFile);
  assert.equal(loadedLocal.ok, true);

  console.log("test-runtime-permissions pass");
} finally {
  delete process.env.FASTSCRIPT_PERMISSION_POLICY_PATH;
  rmSync(root, { recursive: true, force: true });
}
