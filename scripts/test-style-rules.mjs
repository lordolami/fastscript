import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ensureDesignSystem, validateAppStyles } from "../src/style-system.mjs";

const root = mkdtempSync(join(tmpdir(), "fastscript-style-rules-"));

function write(rel, content) {
  const full = join(root, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content, "utf8");
}

try {
  write("app/styles.css", "body{color:#111;background:#fff}.hero{border:1px solid #222}");
  write(
    "app/pages/index.fs",
    `export default function Page() {
  style {
    padding: 4px;
    color: red;
    @md {
      padding: 24px;
    }
  }
  return "<section class=\\"hero custom-card\\" style=\\"color:#123456;background:#abcdef\\">ok</section>"
}
`,
  );

  ensureDesignSystem({ root });
  validateAppStyles({ root });

  console.log("test-style-rules pass");
} finally {
  rmSync(root, { recursive: true, force: true });
}
