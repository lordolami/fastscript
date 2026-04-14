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

const ALLOWED_STYLE_PROPERTIES = new Set([
  "padding",
  "margin",
  "gap",
  "top",
  "right",
  "bottom",
  "left",
  "bg",
  "text",
  "border",
  "size",
  "weight",
  "display",
  "direction",
  "align",
  "justify",
]);

const SPACING_PROPS = new Set(["padding", "margin", "gap", "top", "right", "bottom", "left"]);
const COLOR_PROPS = new Set(["bg", "text", "border"]);
const ALLOWED_SPACING_VALUES = new Set(Array.from({ length: 14 }, (_, i) => String(i)));
const ALLOWED_COLOR_NAMES = new Set(["primary", "secondary", "accent", "neutral", "success", "warning", "error"]);
const ALLOWED_COLOR_SHADES = new Set(["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]);
const ALLOWED_TEXT_SIZES = new Set(["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"]);
const ALLOWED_FONT_WEIGHTS = new Set(["thin", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"]);
const ALLOWED_DISPLAYS = new Set(["flex", "grid", "block", "inline", "inline-block", "none"]);
const ALLOWED_DIRECTIONS = new Set(["row", "column"]);
const ALLOWED_ALIGN = new Set(["start", "center", "end", "stretch"]);
const ALLOWED_JUSTIFY = new Set(["start", "center", "end", "between", "around"]);
const ALLOWED_BREAKPOINTS = new Set(["sm", "md", "lg", "xl"]);

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

function extractStyleBlocks(source) {
  const blocks = [];
  const text = String(source || "");
  const matcher = /\bstyle\s*\{/g;
  let match = null;
  while ((match = matcher.exec(text)) !== null) {
    const open = text.indexOf("{", match.index);
    if (open < 0) continue;
    let depth = 0;
    let close = -1;
    for (let i = open; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === "{") depth += 1;
      else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }
    if (close < 0) {
      blocks.push({ content: text.slice(open + 1), broken: true });
      continue;
    }
    blocks.push({ content: text.slice(open + 1, close), broken: false });
    matcher.lastIndex = close + 1;
  }
  return blocks;
}

function validateStyleDeclaration(prop, value, file, errors) {
  const key = String(prop || "").trim();
  const raw = String(value || "").trim();
  if (!ALLOWED_STYLE_PROPERTIES.has(key)) {
    errors.push(`${file}: style block uses unsupported property "${key}"`);
    return;
  }

  if (SPACING_PROPS.has(key)) {
    if (!ALLOWED_SPACING_VALUES.has(raw)) {
      errors.push(`${file}: style "${key}" must be one of 0..13 (got "${raw}")`);
    }
    return;
  }

  if (COLOR_PROPS.has(key)) {
    const m = /^([a-z]+)-(\d{2,3})$/.exec(raw);
    if (!m || !ALLOWED_COLOR_NAMES.has(m[1]) || !ALLOWED_COLOR_SHADES.has(m[2])) {
      errors.push(`${file}: style "${key}" must match {color}-{shade} using approved tokens (got "${raw}")`);
    }
    return;
  }

  if (key === "size" && !ALLOWED_TEXT_SIZES.has(raw)) {
    errors.push(`${file}: style "size" must be one of ${[...ALLOWED_TEXT_SIZES].join(", ")} (got "${raw}")`);
    return;
  }
  if (key === "weight" && !ALLOWED_FONT_WEIGHTS.has(raw)) {
    errors.push(`${file}: style "weight" must be one of ${[...ALLOWED_FONT_WEIGHTS].join(", ")} (got "${raw}")`);
    return;
  }
  if (key === "display" && !ALLOWED_DISPLAYS.has(raw)) {
    errors.push(`${file}: style "display" must be one of ${[...ALLOWED_DISPLAYS].join(", ")} (got "${raw}")`);
    return;
  }
  if (key === "direction" && !ALLOWED_DIRECTIONS.has(raw)) {
    errors.push(`${file}: style "direction" must be one of ${[...ALLOWED_DIRECTIONS].join(", ")} (got "${raw}")`);
    return;
  }
  if (key === "align" && !ALLOWED_ALIGN.has(raw)) {
    errors.push(`${file}: style "align" must be one of ${[...ALLOWED_ALIGN].join(", ")} (got "${raw}")`);
    return;
  }
  if (key === "justify" && !ALLOWED_JUSTIFY.has(raw)) {
    errors.push(`${file}: style "justify" must be one of ${[...ALLOWED_JUSTIFY].join(", ")} (got "${raw}")`);
  }
}

function validateStyleBlockContent(content, file, errors) {
  const text = String(content || "");
  let i = 0;

  function skipWs() {
    while (i < text.length && /\s/.test(text[i])) i += 1;
  }

  function parseBlock(expectClose) {
    while (i < text.length) {
      skipWs();
      if (i >= text.length) break;

      if (text[i] === "}") {
        if (!expectClose) {
          errors.push(`${file}: style block has unexpected "}"`);
        }
        i += 1;
        return;
      }

      const chunk = text.slice(i);
      const bp = /^@([a-zA-Z][\w-]*)\s*\{/.exec(chunk);
      if (bp) {
        const name = bp[1];
        if (!ALLOWED_BREAKPOINTS.has(name)) {
          errors.push(`${file}: style breakpoint "@${name}" is invalid (allowed: @sm @md @lg @xl)`);
        }
        i += bp[0].length;
        parseBlock(true);
        continue;
      }

      const decl = /^([a-zA-Z][\w-]*)\s*:\s*([^@;{}\n]+)\s*;?/.exec(chunk);
      if (decl) {
        validateStyleDeclaration(decl[1], decl[2], file, errors);
        i += decl[0].length;
        continue;
      }

      let lineEnd = text.indexOf("\n", i);
      if (lineEnd < 0) lineEnd = text.length;
      const snippet = text.slice(i, Math.min(i + 60, lineEnd)).trim();
      if (snippet) errors.push(`${file}: invalid style syntax near "${snippet}"`);
      i = lineEnd === i ? i + 1 : lineEnd + 1;
    }

    if (expectClose) {
      errors.push(`${file}: style breakpoint block is missing closing "}"`);
    }
  }

  parseBlock(false);
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
    const styleBlocks = extractStyleBlocks(source);
    for (const block of styleBlocks) {
      if (block.broken) {
        errors.push(`${file}: style block is missing closing "}"`);
        continue;
      }
      validateStyleBlockContent(block.content, file, errors);
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
