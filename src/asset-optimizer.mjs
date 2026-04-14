import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function hashFile(path) {
  return createHash("sha1").update(readFileSync(path)).digest("hex").slice(0, 8);
}

export async function optimizeImageAssets({ appDir = "app", distDir = "dist" } = {}) {
  const sourceRoot = resolve(appDir, "assets", "images");
  const targetRoot = resolve(distDir, "assets", "images");
  mkdirSync(targetRoot, { recursive: true });
  const files = walk(sourceRoot).filter((file) => [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(extname(file).toLowerCase()));
  const manifest = {};

  for (const file of files) {
    const rel = relative(sourceRoot, file).replace(/\\/g, "/");
    const ext = extname(rel);
    const base = rel.slice(0, -ext.length);
    const hashed = `${base}.${hashFile(file)}${ext}`;
    const out = join(targetRoot, hashed);
    mkdirSync(dirname(out), { recursive: true });
    cpSync(file, out);
    manifest[`/assets/images/${rel}`] = `/assets/images/${hashed}`;
  }

  writeFileSync(resolve(distDir, "image-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  return manifest;
}

export async function optimizeFontAssets({ appDir = "app", distDir = "dist" } = {}) {
  const sourceRoot = resolve(appDir, "assets", "fonts");
  const targetRoot = resolve(distDir, "assets", "fonts");
  mkdirSync(targetRoot, { recursive: true });
  const files = walk(sourceRoot).filter((file) => [".woff2", ".woff", ".ttf", ".otf"].includes(extname(file).toLowerCase()));
  const manifest = {};
  const css = [];

  for (const file of files) {
    const rel = relative(sourceRoot, file).replace(/\\/g, "/");
    const ext = extname(rel);
    const base = rel.slice(0, -ext.length);
    const hashed = `${base}.${hashFile(file)}${ext}`;
    const out = join(targetRoot, hashed);
    mkdirSync(dirname(out), { recursive: true });
    cpSync(file, out);
    manifest[`/assets/fonts/${rel}`] = `/assets/fonts/${hashed}`;
    const family = base.split("/").pop().replace(/[-_]/g, " ");
    css.push(`@font-face{font-family:"${family}";src:url('/assets/fonts/${hashed}') format('${ext.replace(".", "")}');font-display:swap;}`);
  }

  writeFileSync(resolve(distDir, "font-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  if (css.length) writeFileSync(resolve(distDir, "fonts.generated.css"), `${css.join("\n")}\n`, "utf8");
  return manifest;
}
