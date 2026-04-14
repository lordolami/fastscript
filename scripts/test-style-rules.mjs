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
  write("app/styles.css", "body{color:var(--fs-color-text);background:var(--fs-color-bg)}");
  write(
    "app/pages/index.fs",
    `export default function Page() {
  style {
    padding: 4
    margin: 2
    gap: 3
    bg: primary-500
    text: neutral-900
    border: accent-300
    size: lg
    weight: semibold
    display: flex
    direction: row
    align: center
    justify: between
    @md {
      padding: 6
    }
  }
  return "<section>ok</section>"
}
`,
  );

  ensureDesignSystem({ root });
  validateAppStyles({ root });

  write(
    "app/pages/invalid.fs",
    `export default function Bad() {
  style {
    padding: 17
    bg: purple-123
    @tablet {
      justify: middle
    }
  }
  return "<section>bad</section>"
}
`,
  );

  assert.throws(
    () => validateAppStyles({ root }),
    (err) =>
      /padding.+0\.\.13|primary-500|breakpoint "@tablet"|justify/.test(String(err?.message || "")),
  );

  console.log("test-style-rules pass");
} finally {
  rmSync(root, { recursive: true, force: true });
}

