import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = mkdtempSync(join(tmpdir(), "fastscript-style-primitives-"));
const previousCwd = process.cwd();

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
  return \`
    <Screen pad="6" surface="panel">
      <Container>
        <Stack gap="4" pad="5" radius="lg" shadow="soft" surface="card">
          <Heading size="2xl" tone="primary">FastScript primitives</Heading>
          <Text tone="muted" size="lg">Readable by humans and predictable for AI.</Text>
          <Row gap="3" justify="between" align="center">
            <Button tone="primary" size="lg">Get Started</Button>
            <Button tone="ghost" href="/docs">Read Docs</Button>
          </Row>
        </Stack>
      </Container>
    </Screen>
  \`;
}
`,
  );

  process.chdir(root);
  const { runBuild } = await import("../src/build.mjs");
  await runBuild({ mode: "ssg" });

  const html = readFileSync(join(root, "dist", "static", "index.html"), "utf8");
  const assetManifestPath = join(root, "dist", "asset-manifest.json");
  const assetManifest = existsSync(assetManifestPath) ? JSON.parse(readFileSync(assetManifestPath, "utf8")) : { mapping: {} };
  const stylesAsset = assetManifest.mapping["styles.css"] || "styles.css";
  const css = readFileSync(join(root, "dist", stylesAsset), "utf8");

  assert.ok(!html.includes("<Stack"), "expected Stack primitive to be compiled away");
  assert.ok(!html.includes("<Button"), "expected Button primitive to be compiled away");
  assert.match(html, /class="[^"]*fs-stack/, "expected fs-stack class in rendered HTML");
  assert.match(html, /class="[^"]*fs-button[^"]*fs-button-tone-primary/, "expected button tone classes");
  assert.match(html, /class="[^"]*fs-heading[^"]*fs-heading-size-2xl/, "expected heading primitive classes");
  assert.match(css, /\.fs-stack\{display:flex;flex-direction:column;\}/, "expected primitive CSS to be generated");
  assert.match(css, /\.fs-button-tone-primary\{/, "expected button tone CSS to be generated");

  console.log("test-style-primitives pass");
} finally {
  process.chdir(previousCwd);
  try {
    rmSync(root, { recursive: true, force: true });
  } catch {}
}
