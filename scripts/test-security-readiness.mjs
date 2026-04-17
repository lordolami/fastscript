import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { runSecurityReadiness } from "../src/security-readiness.mjs";

const root = mkdtempSync(join(tmpdir(), "fastscript-security-readiness-"));

function write(rel, contents) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, "utf8");
}

try {
  write("fastscript.permissions.json", JSON.stringify({
    version: 1,
    preset: "secure",
    envAccess: {
      mode: "allow",
      allow: ["NODE_ENV", "PORT", "SESSION_SECRET", "WEBHOOK_SECRET", "MAX_BODY_BYTES", "REQUEST_TIMEOUT_MS"],
      deny: []
    }
  }, null, 2));
  write("app/env.schema.fs", `export const schema = {
  SESSION_SECRET: "string?",
  WEBHOOK_SECRET: "string?",
  MAX_BODY_BYTES: "int?",
  REQUEST_TIMEOUT_MS: "int?"
};
`);
  write("app/pages/index.fs", `export default function Home() {
  return \`<main><h1>Secure home</h1></main>\`;
}
`);
  write("app/api/session.fs", `export async function POST(ctx) {
  return ctx.helpers.json({ ok: true });
}
`);
  write("app/api/webhook.fs", `import {verifyWebhookRequest} from "../../../src/webhook.mjs";
export async function POST(ctx) {
  const result = await verifyWebhookRequest(ctx.req, {
    secret: process.env.WEBHOOK_SECRET || "dev-secret",
    replayDir: ".fastscript"
  });
  return ctx.helpers.json({ ok: result.ok });
}
`);

  const cleanReport = await runSecurityReadiness(["--path", root, "--mode", "report"]);
  assert.equal(cleanReport.diagnostics.length, 0);
  assert.equal(cleanReport.checks.securePreset, true);
  assert.equal(cleanReport.checks.envSchemaPresent, true);

  write("app/pages/leak.fs", `export default function Leak() {
  return \`<main>\${process.env.SESSION_SECRET}</main>\`;
}
`);

  let leaked = false;
  try {
    await runSecurityReadiness(["--path", root, "--mode", "fail"]);
  } catch (error) {
    leaked = true;
    assert.match(String(error.message || ""), /FS4301/);
  }
  assert.equal(leaked, true);
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log("test-security-readiness pass");
