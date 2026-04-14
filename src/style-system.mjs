import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const TOKENS_PATH = join("app", "design", "tokens.json");
const CLASS_ALLOWLIST_PATH = join("app", "design", "class-allowlist.json");
const GENERATED_CSS_PATH = join("app", "styles.generated.css");

const DEFAULT_TOKENS = {
  color: {
    bg: "#050505",
    surface: "#090909",
    text: "#ffffff",
    muted: "#8a8a8a",
    border: "#1f1f1f",
    accent: "#9f92ff",
    accentSoft: "#d3d3ff",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },
  shadow: {
    soft: "0 10px 40px rgba(0,0,0,0.22)",
  },
};

const DEFAULT_CLASS_ALLOWLIST = [
  "nav",
  "page",
  "footer",
  "hero",
  "eyebrow",
  "hero-links",
  "grid",
];

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function toCssVars(tokens, prefix) {
  return Object.entries(tokens || {})
    .map(([name, value]) => `  --fs-${prefix}-${name}: ${value};`)
    .join("\n");
}

function utilityRules(tokens) {
  const lines = [];
  for (const key of Object.keys(tokens?.color || {})) {
    lines.push(`.u-text-${key} { color: var(--fs-color-${key}); }`);
    lines.push(`.u-bg-${key} { background: var(--fs-color-${key}); }`);
    lines.push(`.u-border-${key} { border-color: var(--fs-color-${key}); }`);
  }
  for (const key of Object.keys(tokens?.space || {})) {
    lines.push(`.u-m-${key} { margin: var(--fs-space-${key}); }`);
    lines.push(`.u-mt-${key} { margin-top: var(--fs-space-${key}); }`);
    lines.push(`.u-mb-${key} { margin-bottom: var(--fs-space-${key}); }`);
    lines.push(`.u-p-${key} { padding: var(--fs-space-${key}); }`);
    lines.push(`.u-gap-${key} { gap: var(--fs-space-${key}); }`);
  }
  for (const key of Object.keys(tokens?.radius || {})) {
    lines.push(`.u-radius-${key} { border-radius: var(--fs-radius-${key}); }`);
  }
  return lines.join("\n");
}

function classNamesIn(source) {
  const out = [];
  const regex = /class\s*=\s*["'`]([^"'`]+)["'`]/g;
  let m = null;
  while ((m = regex.exec(source)) !== null) {
    const value = (m[1] || "").trim();
    if (!value) continue;
    out.push(...value.split(/\s+/g));
  }
  return out;
}

export function ensureDesignSystem({ root = process.cwd() } = {}) {
  const tokenPath = resolve(root, TOKENS_PATH);
  const allowlistPath = resolve(root, CLASS_ALLOWLIST_PATH);
  const generatedPath = resolve(root, GENERATED_CSS_PATH);

  if (!existsSync(tokenPath)) {
    mkdirSync(resolve(tokenPath, ".."), { recursive: true });
    writeFileSync(tokenPath, JSON.stringify(DEFAULT_TOKENS, null, 2), "utf8");
  }
  if (!existsSync(allowlistPath)) {
    mkdirSync(resolve(allowlistPath, ".."), { recursive: true });
    writeFileSync(allowlistPath, JSON.stringify(DEFAULT_CLASS_ALLOWLIST, null, 2), "utf8");
  }

  const tokens = readJson(tokenPath, DEFAULT_TOKENS);
  const css = `:root {\n${toCssVars(tokens.color, "color")}\n${toCssVars(tokens.space, "space")}\n${toCssVars(tokens.radius, "radius")}\n${toCssVars(tokens.shadow, "shadow")}\n}\n\n${utilityRules(tokens)}\n`;
  writeFileSync(generatedPath, css, "utf8");
  return { tokenPath, allowlistPath, generatedPath, tokens };
}

export function validateAppStyles({ root = process.cwd() } = {}) {
  const allowlist = new Set(readJson(resolve(root, CLASS_ALLOWLIST_PATH), DEFAULT_CLASS_ALLOWLIST));
  const files = [
    ...walk(resolve(root, "app", "pages")).filter((f) => /\.(fs|js|mjs|cjs)$/.test(f)),
    ...walk(resolve(root, "app", "api")).filter((f) => /\.(fs|js|mjs|cjs)$/.test(f)),
  ];
  const stylesheetFiles = [
    resolve(root, "app", "styles.css"),
  ].filter((p) => existsSync(p));

  const errors = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (/\bstyle\s*=/.test(source)) {
      errors.push(`${file}: inline style attributes are not allowed`);
    }
    const classes = classNamesIn(source);
    for (const cls of classes) {
      if (cls.startsWith("u-")) continue;
      if (!allowlist.has(cls)) errors.push(`${file}: class "${cls}" is not in app/design/class-allowlist.json`);
    }
  }

  for (const file of stylesheetFiles) {
    const source = readFileSync(file, "utf8");
    const rawHex = source.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    if (rawHex.length) {
      errors.push(`${file}: raw hex colors are not allowed (${[...new Set(rawHex)].join(", ")})`);
    }
  }

  if (errors.length) {
    const error = new Error(`Style validation failed:\n${errors.join("\n")}`);
    error.status = 1;
    throw error;
  }
}
