import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { validatePrimitiveMarkup } from "@fastscript/core-private/style-primitives";

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

function primitiveRules(tokens) {
  const lines = [
    ".fs-box,.fs-stack,.fs-row,.fs-grid,.fs-section,.fs-container,.fs-screen,.fs-card,.fs-panel,.fs-field,.fs-alert,.fs-empty{box-sizing:border-box;min-width:0;}",
    ".fs-stack{display:flex;flex-direction:column;}",
    ".fs-row{display:flex;flex-direction:row;}",
    ".fs-grid{display:grid;grid-template-columns:repeat(var(--fs-grid-cols,1),minmax(0,1fr));}",
    ".fs-container{width:min(100%,72rem);margin-inline:auto;}",
    ".fs-screen{min-height:100dvh;}",
    ".fs-text,.fs-label,.fs-badge,.fs-link,.fs-code{margin:0;color:var(--fs-color-text);}",
    ".fs-heading{margin:0;color:var(--fs-color-text);line-height:1.05;letter-spacing:-0.03em;}",
    ".fs-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}",
    ".fs-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.18rem .55rem;border-radius:999px;border:1px solid var(--fs-color-border);background:var(--fs-color-surface);font-size:.78rem;}",
    ".fs-link{text-decoration:none;color:var(--fs-color-accent);}",
    ".fs-link:hover{text-decoration:underline;}",
    ".fs-card,.fs-panel,.fs-field,.fs-alert,.fs-empty{border:1px solid var(--fs-color-border);background:var(--fs-color-surface);border-radius:var(--fs-radius-md);}",
    ".fs-card,.fs-panel{box-shadow:var(--fs-shadow-soft);}",
    ".fs-alert{border-color:var(--fs-color-accent);}",
    ".fs-input,.fs-textarea,.fs-select{width:100%;border:1px solid var(--fs-color-border);background:var(--fs-color-surface);color:var(--fs-color-text);border-radius:var(--fs-radius-md);padding:.82rem 1rem;outline:none;}",
    ".fs-input:focus,.fs-textarea:focus,.fs-select:focus{border-color:var(--fs-color-accent);box-shadow:0 0 0 3px rgba(159,146,255,.18);}",
    ".fs-textarea{min-height:8rem;resize:vertical;}",
    ".fs-button{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;border-radius:999px;border:1px solid transparent;font-weight:600;text-decoration:none;cursor:pointer;transition:transform .18s ease,background .18s ease,border-color .18s ease,box-shadow .18s ease,color .18s ease;}",
    ".fs-button:hover{transform:translateY(-1px);}",
    ".fs-button-tone-primary{background:var(--fs-color-accent);color:var(--fs-color-bg);box-shadow:var(--fs-shadow-soft);}",
    ".fs-button-tone-secondary{background:var(--fs-color-surface);color:var(--fs-color-text);border-color:var(--fs-color-border);}",
    ".fs-button-tone-accent{background:var(--fs-color-accentSoft,var(--fs-color-accent));color:var(--fs-color-bg);}",
    ".fs-button-tone-success{background:var(--fs-color-green,var(--fs-color-accent));color:var(--fs-color-bg);}",
    ".fs-button-tone-warning{background:var(--fs-color-amber,var(--fs-color-accent));color:var(--fs-color-bg);}",
    ".fs-button-tone-error{background:var(--fs-color-danger,var(--fs-color-accent));color:var(--fs-color-bg);}",
    ".fs-button-tone-ghost{background:transparent;color:var(--fs-color-text);border-color:var(--fs-color-border);}",
    ".fs-button-tone-muted{background:var(--fs-color-surface);color:var(--fs-color-muted);border-color:var(--fs-color-border);}",
    ".fs-button-size-xs{padding:.45rem .72rem;font-size:.78rem;}",
    ".fs-button-size-sm{padding:.58rem .9rem;font-size:.88rem;}",
    ".fs-button-size-md{padding:.78rem 1.15rem;font-size:.98rem;}",
    ".fs-button-size-lg{padding:.95rem 1.35rem;font-size:1.05rem;}",
    ".fs-button-size-xl{padding:1.08rem 1.55rem;font-size:1.12rem;}",
    ".fs-align-start{align-items:flex-start;}",
    ".fs-align-center{align-items:center;}",
    ".fs-align-end{align-items:flex-end;}",
    ".fs-align-stretch{align-items:stretch;}",
    ".fs-justify-start{justify-content:flex-start;}",
    ".fs-justify-center{justify-content:center;}",
    ".fs-justify-end{justify-content:flex-end;}",
    ".fs-justify-between{justify-content:space-between;}",
    ".fs-justify-around{justify-content:space-around;}",
    ".fs-surface-plain{background:transparent;border-color:transparent;box-shadow:none;}",
    ".fs-surface-subtle{background:var(--fs-color-surface2,var(--fs-color-surface));}",
    ".fs-surface-panel{background:var(--fs-color-surface);}",
    ".fs-surface-card{background:var(--fs-color-surface2,var(--fs-color-surface));}",
    ".fs-surface-elevated{background:var(--fs-color-surface3,var(--fs-color-surface));box-shadow:var(--fs-shadow-glow,var(--fs-shadow-soft));}",
    ".fs-surface-inverted{background:var(--fs-color-text);color:var(--fs-color-bg);}",
    ".fs-tone-default{color:var(--fs-color-text);}",
    ".fs-tone-muted{color:var(--fs-color-muted);}",
    ".fs-tone-primary,.fs-tone-accent{color:var(--fs-color-accent);}",
    ".fs-tone-secondary{color:var(--fs-color-accentSoft,var(--fs-color-accent));}",
    ".fs-tone-success{color:var(--fs-color-green,var(--fs-color-accent));}",
    ".fs-tone-warning{color:var(--fs-color-amber,var(--fs-color-accent));}",
    ".fs-tone-error{color:var(--fs-color-danger,var(--fs-color-accent));}",
    ".fs-tone-inverse{color:var(--fs-color-bg);}",
    ".fs-weight-thin{font-weight:100;}",
    ".fs-weight-light{font-weight:300;}",
    ".fs-weight-normal{font-weight:400;}",
    ".fs-weight-medium{font-weight:500;}",
    ".fs-weight-semibold{font-weight:600;}",
    ".fs-weight-bold{font-weight:700;}",
    ".fs-weight-extrabold{font-weight:800;}",
    ".fs-weight-black{font-weight:900;}",
    ".fs-heading-size-xs{font-size:1rem;}",
    ".fs-heading-size-sm{font-size:1.15rem;}",
    ".fs-heading-size-md{font-size:1.35rem;}",
    ".fs-heading-size-lg{font-size:1.7rem;}",
    ".fs-heading-size-xl{font-size:2.15rem;}",
    ".fs-heading-size-2xl{font-size:2.75rem;}",
    ".fs-heading-size-3xl{font-size:3.4rem;}",
    ".fs-heading-size-4xl{font-size:4.35rem;}",
    ".fs-heading-size-5xl{font-size:5.5rem;}",
    ".fs-text-size-xs{font-size:.75rem;line-height:1.45;}",
    ".fs-text-size-sm{font-size:.9rem;line-height:1.55;}",
    ".fs-text-size-md{font-size:1rem;line-height:1.65;}",
    ".fs-text-size-lg{font-size:1.1rem;line-height:1.7;}",
    ".fs-text-size-xl{font-size:1.25rem;line-height:1.75;}",
    ".fs-text-size-2xl{font-size:1.5rem;line-height:1.45;}",
    ".fs-text-size-3xl{font-size:1.85rem;line-height:1.35;}",
    ".fs-text-size-4xl{font-size:2.3rem;line-height:1.25;}",
    ".fs-text-size-5xl{font-size:3rem;line-height:1.15;}",
    ".fs-enter-fade{animation:fs-fade-in .35s ease both;}",
    ".fs-enter-fade-up{animation:fs-fade-up .45s cubic-bezier(.16,1,.3,1) both;}",
    ".fs-enter-scale-in{animation:fs-scale-in .35s ease both;}",
    ".fs-enter-slide{animation:fs-slide-in .42s cubic-bezier(.16,1,.3,1) both;}",
    ".fs-hover-lift{transition:transform .18s ease,box-shadow .18s ease;}",
    ".fs-hover-lift:hover{transform:translateY(-2px);box-shadow:var(--fs-shadow-glow,var(--fs-shadow-soft));}",
    ".fs-hover-pulse:hover{animation:fs-pulse 1.2s ease infinite;}",
    ".fs-loader{display:inline-flex;width:1.1rem;height:1.1rem;border-radius:999px;border:2px solid var(--fs-color-border);border-top-color:var(--fs-color-accent);animation:fs-spin .8s linear infinite;}",
    ".fs-spacer{flex:1 1 auto;}",
    "@keyframes fs-fade-in{from{opacity:0}to{opacity:1}}",
    "@keyframes fs-fade-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}",
    "@keyframes fs-scale-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}",
    "@keyframes fs-slide-in{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}",
    "@keyframes fs-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}",
    "@keyframes fs-spin{to{transform:rotate(360deg)}}",
  ];

  for (const key of Object.keys(tokens?.space || {})) {
    lines.push(`.fs-pad-${key}{padding:var(--fs-space-${key});}`);
    lines.push(`.fs-gap-${key}{gap:var(--fs-space-${key});}`);
  }
  for (const key of Object.keys(tokens?.radius || {})) {
    lines.push(`.fs-radius-${key}{border-radius:var(--fs-radius-${key});}`);
  }
  for (const key of Object.keys(tokens?.shadow || {})) {
    lines.push(`.fs-shadow-${key}{box-shadow:var(--fs-shadow-${key});}`);
  }
  for (let cols = 1; cols <= 12; cols += 1) {
    lines.push(`.fs-grid-cols-${cols}{--fs-grid-cols:${cols};}`);
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
  const css = `:root {\n${toCssVars(tokens.color, "color")}\n${toCssVars(tokens.space, "space")}\n${toCssVars(tokens.radius, "radius")}\n${toCssVars(tokens.shadow, "shadow")}\n}\n\n${utilityRules(tokens)}\n\n${primitiveRules(tokens)}\n`;
  const current = existsSync(generatedPath) ? readFileSync(generatedPath, "utf8") : null;
  if (current !== css) {
    writeFileSync(generatedPath, css, "utf8");
  }
  return { tokenPath, allowlistPath, generatedPath, tokens };
}

export function validateAppStyles({ root = process.cwd() } = {}) {
  const tokens = readJson(resolve(root, TOKENS_PATH), DEFAULT_TOKENS);
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
    validatePrimitiveMarkup(source, file, tokens, errors);
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
