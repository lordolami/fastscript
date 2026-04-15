const {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  DiagnosticSeverity,
  SymbolKind,
  CompletionItemKind,
  CodeActionKind,
  Position,
  SemanticTokensBuilder,
} = require("vscode-languageserver/node");
const { TextDocument } = require("vscode-languageserver-textdocument");
const { existsSync } = require("node:fs");
const { dirname, extname, join, resolve } = require("node:path");
const { fileURLToPath, pathToFileURL } = require("node:url");

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const symbolIndex = new Map();

const tokenLegend = {
  tokenTypes: [
    "keyword",
    "variable",
    "parameter",
    "function",
    "property",
    "type",
    "comment",
    "string",
    "number",
    "operator",
  ],
  tokenModifiers: ["declaration", "readonly", "defaultLibrary"],
};

const SPACING_PROPS = new Set(["padding", "margin", "gap", "top", "right", "bottom", "left"]);
const COLOR_PROPS = new Set(["bg", "text", "border"]);
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
const IMPORT_EXTENSIONS = [".fs", ".js", ".mjs", ".cjs", ".json"];
const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function lineStarts(text) {
  const out = [0];
  for (let i = 0; i < text.length; i += 1) if (text[i] === "\n") out.push(i + 1);
  return out;
}

function offsetToPosition(starts, offset) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = starts[mid];
    const next = starts[mid + 1] ?? Number.POSITIVE_INFINITY;
    if (offset < start) hi = mid - 1;
    else if (offset >= next) lo = mid + 1;
    else return { line: mid, character: offset - start };
  }
  return { line: 0, character: 0 };
}

function makeDiagnostic({ severity, code, message, start, end, source = "fastscript-lsp" }) {
  return { severity, code, source, message, range: { start, end } };
}

function wordAt(line, character) {
  const left = line.slice(0, character + 1).match(/[A-Za-z_$][\w$]*$/);
  const right = line.slice(character + 1).match(/^[\w$]*/);
  return `${left ? left[0] : ""}${right ? right[0] : ""}`;
}

function uriToPath(uri) {
  if (!uri) return "";
  if (uri.startsWith("file://")) {
    try {
      return fileURLToPath(uri);
    } catch {
      return "";
    }
  }
  return uri;
}

function inferWorkspaceRoot() {
  for (const doc of documents.all()) {
    const path = uriToPath(doc.uri);
    if (!path) continue;
    const idx = path.replace(/\\/g, "/").toLowerCase().indexOf("/app/");
    if (idx > 0) return path.slice(0, idx);
  }
  return process.cwd();
}

function resolveImportTarget(filePath, specifier) {
  const spec = String(specifier || "");
  if (!filePath || !spec) return null;
  if (!spec.startsWith(".")) return null;

  const absBase = resolve(dirname(filePath), spec);
  const ext = extname(absBase);
  if (ext && existsSync(absBase)) return absBase;

  for (const candidateExt of IMPORT_EXTENSIONS) {
    const fileCandidate = ext ? absBase : `${absBase}${candidateExt}`;
    if (existsSync(fileCandidate)) return fileCandidate;
  }

  for (const candidateExt of IMPORT_EXTENSIONS) {
    const indexCandidate = join(absBase, `index${candidateExt}`);
    if (existsSync(indexCandidate)) return indexCandidate;
  }
  return null;
}

function extractTemplateRanges(text) {
  const ranges = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] !== "`") {
      i += 1;
      continue;
    }
    const start = i;
    i += 1;
    while (i < text.length) {
      if (text[i] === "\\") {
        i += 2;
        continue;
      }
      if (text[i] === "`") {
        const end = i;
        ranges.push({ start, end, contentStart: start + 1, contentEnd: end });
        i += 1;
        break;
      }
      i += 1;
    }
  }
  return ranges;
}

function parseSymbols(document) {
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  const symbols = [];
  const definitions = new Map();
  const duplicates = [];
  const imports = [];

  lines.forEach((line, idx) => {
    const importFrom = line.match(/^\s*import\s+(.+?)\s+from\s+["']([^"']+)["']/);
    const sideEffectImport = line.match(/^\s*import\s+["']([^"']+)["']/);

    if (importFrom) {
      const clause = importFrom[1].trim();
      const specifier = importFrom[2];
      const specChar = line.indexOf(specifier);
      const importEntry = {
        line: idx,
        specifier,
        specifierRange: {
          start: { line: idx, character: Math.max(0, specChar) },
          end: { line: idx, character: Math.max(0, specChar) + specifier.length },
        },
        locals: [],
      };

      const registerLocal = (name) => {
        if (!name) return;
        const clean = String(name).trim();
        if (!clean) return;
        const character = line.indexOf(clean);
        const range = {
          start: { line: idx, character },
          end: { line: idx, character: character + clean.length },
        };
        symbols.push({ name: clean, kind: SymbolKind.Variable, range, selectionRange: range });
        if (definitions.has(clean)) duplicates.push({ name: clean, range, first: definitions.get(clean) });
        else definitions.set(clean, range.start);
        importEntry.locals.push({ name: clean, range });
      };

      const clauseParts = clause.split(",").map((part) => part.trim()).filter(Boolean);
      if (clauseParts.length && !clauseParts[0].startsWith("{") && !clauseParts[0].startsWith("*")) {
        registerLocal(clauseParts[0]);
      }
      const nsMatch = clause.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/);
      if (nsMatch) registerLocal(nsMatch[1]);
      const namedMatch = clause.match(/\{([^}]*)\}/);
      if (namedMatch) {
        for (const raw of namedMatch[1].split(",")) {
          const segment = raw.trim();
          if (!segment) continue;
          const alias = segment.match(/\bas\s+([A-Za-z_$][\w$]*)$/);
          if (alias) registerLocal(alias[1]);
          else registerLocal(segment.replace(/^type\s+/, "").trim());
        }
      }
      imports.push(importEntry);
      return;
    }

    if (sideEffectImport) {
      const specifier = sideEffectImport[1];
      const specChar = line.indexOf(specifier);
      imports.push({
        line: idx,
        specifier,
        specifierRange: {
          start: { line: idx, character: Math.max(0, specChar) },
          end: { line: idx, character: Math.max(0, specChar) + specifier.length },
        },
        locals: [],
      });
      return;
    }

    const fnMatch = line.match(/^\s*(export\s+)?fn\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (fnMatch) {
      const name = fnMatch[2];
      const character = line.indexOf(name);
      const range = {
        start: { line: idx, character },
        end: { line: idx, character: character + name.length },
      };
      symbols.push({ name, kind: SymbolKind.Function, range, selectionRange: range });
      if (definitions.has(name)) duplicates.push({ name, range, first: definitions.get(name) });
      else definitions.set(name, range.start);
    }

    const reactive = line.match(/^\s*(~|state\s+)([A-Za-z_$][\w$]*)\s*=/);
    if (reactive) {
      const name = reactive[2];
      const character = line.indexOf(name);
      const range = {
        start: { line: idx, character },
        end: { line: idx, character: character + name.length },
      };
      symbols.push({ name, kind: SymbolKind.Variable, range, selectionRange: range });
      if (definitions.has(name)) duplicates.push({ name, range, first: definitions.get(name) });
      else definitions.set(name, range.start);
    }
  });

  return { symbols, definitions, duplicates, imports };
}

function extractStyleBlocks(text) {
  const blocks = [];
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
      blocks.push({ start: open + 1, end: text.length, broken: true });
      continue;
    }
    blocks.push({ start: open + 1, end: close, broken: false });
    matcher.lastIndex = close + 1;
  }
  return blocks;
}

function validateStyleDecl(prop, value) {
  const key = String(prop || "").trim();
  const raw = String(value || "").trim();
  if (!ALLOWED_STYLE_PROPERTIES.has(key)) return `Unsupported style property "${key}"`;
  if (SPACING_PROPS.has(key)) return ALLOWED_SPACING_VALUES.has(raw) ? null : `Style "${key}" must be one of 0..13`;
  if (COLOR_PROPS.has(key)) {
    const m = /^([a-z]+)-(\d{2,3})$/.exec(raw);
    if (!m || !ALLOWED_COLOR_NAMES.has(m[1]) || !ALLOWED_COLOR_SHADES.has(m[2])) {
      return `Style "${key}" must match {color}-{shade} using approved tokens`;
    }
    return null;
  }
  if (key === "size") return ALLOWED_TEXT_SIZES.has(raw) ? null : `Style "size" uses invalid token "${raw}"`;
  if (key === "weight") return ALLOWED_FONT_WEIGHTS.has(raw) ? null : `Style "weight" uses invalid token "${raw}"`;
  if (key === "display") return ALLOWED_DISPLAYS.has(raw) ? null : `Style "display" uses invalid token "${raw}"`;
  if (key === "direction") return ALLOWED_DIRECTIONS.has(raw) ? null : `Style "direction" uses invalid token "${raw}"`;
  if (key === "align") return ALLOWED_ALIGN.has(raw) ? null : `Style "align" uses invalid token "${raw}"`;
  if (key === "justify") return ALLOWED_JUSTIFY.has(raw) ? null : `Style "justify" uses invalid token "${raw}"`;
  return null;
}

function validateStyleBlocks(text, starts) {
  const diagnostics = [];
  for (const block of extractStyleBlocks(text)) {
    if (block.broken) {
      diagnostics.push(
        makeDiagnostic({
          severity: DiagnosticSeverity.Error,
          code: "FS3301",
          message: "style block is missing closing \"}\"",
          start: offsetToPosition(starts, Math.max(0, block.start - 1)),
          end: offsetToPosition(starts, Math.max(0, block.start)),
        }),
      );
      continue;
    }

    const content = text.slice(block.start, block.end);
    let i = 0;
    while (i < content.length) {
      while (i < content.length && /\s/.test(content[i])) i += 1;
      if (i >= content.length) break;
      if (content[i] === "}") {
        i += 1;
        continue;
      }

      const chunk = content.slice(i);
      const bp = /^@([a-zA-Z][\w-]*)\s*\{/.exec(chunk);
      if (bp) {
        if (!ALLOWED_BREAKPOINTS.has(bp[1])) {
          const startOffset = block.start + i;
          diagnostics.push(
            makeDiagnostic({
              severity: DiagnosticSeverity.Error,
              code: "FS3302",
              message: `Invalid breakpoint "@${bp[1]}" (use @sm @md @lg @xl)`,
              start: offsetToPosition(starts, startOffset),
              end: offsetToPosition(starts, startOffset + bp[0].length),
            }),
          );
        }
        i += bp[0].length;
        continue;
      }

      const decl = /^([a-zA-Z][\w-]*)\s*:\s*([^@;{}\n]+)\s*;?/.exec(chunk);
      if (decl) {
        const error = validateStyleDecl(decl[1], decl[2]);
        if (error) {
          const startOffset = block.start + i;
          diagnostics.push(
            makeDiagnostic({
              severity: DiagnosticSeverity.Error,
              code: "FS3303",
              message: error,
              start: offsetToPosition(starts, startOffset),
              end: offsetToPosition(starts, startOffset + decl[0].length),
            }),
          );
        }
        i += decl[0].length;
        continue;
      }

      const startOffset = block.start + i;
      diagnostics.push(
        makeDiagnostic({
          severity: DiagnosticSeverity.Error,
          code: "FS3304",
          message: "Invalid style block syntax",
          start: offsetToPosition(starts, startOffset),
          end: offsetToPosition(starts, startOffset + Math.min(8, chunk.length)),
        }),
      );
      const lineBreak = chunk.indexOf("\n");
      i += lineBreak < 0 ? chunk.length : lineBreak + 1;
    }
  }
  return diagnostics;
}

function validateImports(document, parsed, starts) {
  const diagnostics = [];
  const filePath = uriToPath(document.uri);
  for (const entry of parsed.imports || []) {
    const specifier = String(entry.specifier || "");
    if (!specifier.startsWith(".")) continue;
    const resolved = resolveImportTarget(filePath, specifier);
    if (resolved) continue;

    const possible = IMPORT_EXTENSIONS.map((ext) => `${specifier}${ext}`);
    diagnostics.push(makeDiagnostic({
      severity: DiagnosticSeverity.Error,
      code: "FS3401",
      message: `Cannot resolve import "${specifier}". Try ${possible.join(" or ")}.`,
      start: entry.specifierRange?.start || offsetToPosition(starts, 0),
      end: entry.specifierRange?.end || offsetToPosition(starts, 1),
    }));
  }
  return diagnostics;
}

function validateTemplateMarkup(text, starts) {
  const diagnostics = [];
  for (const range of extractTemplateRanges(text)) {
    const template = text.slice(range.contentStart, range.contentEnd);
    const stack = [];
    const tagRegex = /<\/?([A-Za-z][A-Za-z0-9:-]*)\b[^>]*>/g;
    let match = null;
    while ((match = tagRegex.exec(template)) !== null) {
      const full = match[0];
      const name = match[1];
      const lower = name.toLowerCase();
      const absolute = range.contentStart + match.index;
      const isClosing = full.startsWith("</");
      const selfClosing = /\/>$/.test(full) || VOID_ELEMENTS.has(lower);

      if (isClosing) {
        const top = stack.pop();
        if (!top || top.name !== lower) {
          diagnostics.push(makeDiagnostic({
            severity: DiagnosticSeverity.Warning,
            code: "FS3306",
            message: `Unexpected closing tag </${name}> in template literal.`,
            start: offsetToPosition(starts, absolute),
            end: offsetToPosition(starts, absolute + full.length),
          }));
        }
        continue;
      }

      if (!selfClosing) {
        stack.push({ name: lower, absolute, length: full.length });
      }
    }

    for (const open of stack) {
      diagnostics.push(makeDiagnostic({
        severity: DiagnosticSeverity.Warning,
        code: "FS3307",
        message: `Tag <${open.name}> is not closed in template literal.`,
        start: offsetToPosition(starts, open.absolute),
        end: offsetToPosition(starts, open.absolute + open.length),
      }));
    }
  }
  return diagnostics;
}

function validateBracketBalance(text, starts) {
  const diagnostics = [];
  const opens = new Set(["(", "[", "{"]);
  const closes = new Map([[")", "("], ["]", "["], ["}", "{"]]);
  const stack = [];
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate && ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate && ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && text[i - 1] !== "\\") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inTemplate && ch === "\"" && text[i - 1] !== "\\") {
      inDouble = !inDouble;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`" && text[i - 1] !== "\\") {
      inTemplate = !inTemplate;
      continue;
    }
    if (inSingle || inDouble || inTemplate) continue;

    if (opens.has(ch)) {
      stack.push({ ch, offset: i });
      continue;
    }
    if (closes.has(ch)) {
      const expected = closes.get(ch);
      const top = stack.pop();
      if (!top || top.ch !== expected) {
        diagnostics.push(
          makeDiagnostic({
            severity: DiagnosticSeverity.Error,
            code: "FS1010",
            message: `Unmatched "${ch}"`,
            start: offsetToPosition(starts, i),
            end: offsetToPosition(starts, i + 1),
          }),
        );
      }
    }
  }

  for (const entry of stack) {
    diagnostics.push(
      makeDiagnostic({
        severity: DiagnosticSeverity.Error,
        code: "FS1010",
        message: `Unclosed "${entry.ch}"`,
        start: offsetToPosition(starts, entry.offset),
        end: offsetToPosition(starts, entry.offset + 1),
      }),
    );
  }

  return diagnostics;
}

function buildDiagnostics(document, parsed) {
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  const starts = lineStarts(text);
  const diagnostics = [];

  lines.forEach((line, i) => {
    if (line.includes("TODO_ERROR")) {
      const start = line.indexOf("TODO_ERROR");
      diagnostics.push(
        makeDiagnostic({
          severity: DiagnosticSeverity.Error,
          code: "FS3001",
          message: "Remove TODO_ERROR token",
          start: { line: i, character: start },
          end: { line: i, character: start + "TODO_ERROR".length },
        }),
      );
    }
    if (/^\s*var\s+/.test(line)) {
      const start = line.indexOf("var");
      diagnostics.push(
        makeDiagnostic({
          severity: DiagnosticSeverity.Warning,
          code: "FS3002",
          message: "Prefer let/const in FastScript files",
          start: { line: i, character: start },
          end: { line: i, character: start + 3 },
        }),
      );
    }
    if (/\bstyle\s*=/.test(line)) {
      const start = line.indexOf("style");
      diagnostics.push(
        makeDiagnostic({
          severity: DiagnosticSeverity.Error,
          code: "FS3305",
          message: "Inline style attributes are not allowed; use style { ... } blocks",
          start: { line: i, character: start },
          end: { line: i, character: start + 5 },
        }),
      );
    }
  });

  for (const dup of parsed.duplicates || []) {
    diagnostics.push(
      makeDiagnostic({
        severity: DiagnosticSeverity.Error,
        code: "FS4100",
        message: `Duplicate declaration for "${dup.name}"`,
        start: dup.range.start,
        end: dup.range.end,
      }),
    );
  }

  diagnostics.push(...validateImports(document, parsed, starts));
  diagnostics.push(...validateStyleBlocks(text, starts));
  diagnostics.push(...validateTemplateMarkup(text, starts));
  diagnostics.push(...validateBracketBalance(text, starts));
  return diagnostics;
}

function pushRegexTokens(builder, lineNumber, text, regex, tokenType, tokenModifier = 0) {
  let match = null;
  while ((match = regex.exec(text)) !== null) {
    const value = match[0];
    if (!value) continue;
    builder.push(lineNumber, match.index, value.length, tokenType, tokenModifier);
    if (regex.lastIndex === match.index) regex.lastIndex += 1;
  }
}

function buildSemanticTokens(document) {
  const builder = new SemanticTokensBuilder();
  const lines = document.getText().split(/\r?\n/);

  lines.forEach((line, i) => {
    pushRegexTokens(builder, i, line, /\/\/.*$/g, 6);
    pushRegexTokens(builder, i, line, /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, 7);
    pushRegexTokens(builder, i, line, /\b\d+(?:\.\d+)?\b/g, 8);
    pushRegexTokens(builder, i, line, /(\+\+|--|===|!==|==|!=|<=|>=|&&|\|\||\?\?|=>|[+\-*/%=!<>?:|&])/g, 9);
    pushRegexTokens(builder, i, line, /\b(export|default|function|fn|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|async|await|import|from|as|state|const|let|var|class|extends)\b/g, 0);
    pushRegexTokens(builder, i, line, /\b(str|string|int|float|number|bool|boolean|void|unknown|any|array)\b/g, 5);
    pushRegexTokens(builder, i, line, /~[A-Za-z_$][\w$]*/g, 1);
    pushRegexTokens(builder, i, line, /<\/?[A-Za-z][A-Za-z0-9:-]*/g, 5);
    pushRegexTokens(builder, i, line, /\bon:[A-Za-z][A-Za-z0-9:-]*(?=\s*=)/g, 4);
    pushRegexTokens(builder, i, line, /\b[A-Za-z_:][A-Za-z0-9_:.-]*(?=\s*=)/g, 4);

    const fnDecl = /(?:^|\s)(?:export\s+)?fn\s+([A-Za-z_$][\w$]*)\s*\(/g;
    let m = null;
    while ((m = fnDecl.exec(line)) !== null) {
      const name = m[1];
      const start = m.index + m[0].indexOf(name);
      builder.push(i, start, name.length, 3, 1);
    }
    const stateDecl = /(?:^|\s)(?:state\s+|~)([A-Za-z_$][\w$]*)\s*=/g;
    while ((m = stateDecl.exec(line)) !== null) {
      const name = m[1];
      const start = m.index + m[0].indexOf(name);
      builder.push(i, start, name.length, 1, 1);
    }
  });
  return builder.build();
}

function refreshDocument(document) {
  const parsed = parseSymbols(document);
  symbolIndex.set(document.uri, parsed);
  connection.sendDiagnostics({ uri: document.uri, diagnostics: buildDiagnostics(document, parsed) });
}

function importAtPosition(entry, position) {
  for (const item of entry?.imports || []) {
    const start = item.specifierRange?.start;
    const end = item.specifierRange?.end;
    if (!start || !end) continue;
    if (position.line !== start.line) continue;
    if (position.character < start.character || position.character > end.character) continue;
    return item;
  }
  return null;
}

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: documents.syncKind,
    documentSymbolProvider: true,
    hoverProvider: true,
    completionProvider: { resolveProvider: false, triggerCharacters: [".", " ", "<", ":"] },
    renameProvider: true,
    definitionProvider: true,
    referencesProvider: true,
    codeActionProvider: true,
    documentLinkProvider: { resolveProvider: false },
    semanticTokensProvider: {
      legend: tokenLegend,
      full: true,
    },
  },
}));

documents.onDidOpen((change) => refreshDocument(change.document));
documents.onDidChangeContent((change) => refreshDocument(change.document));
documents.onDidClose((change) => {
  symbolIndex.delete(change.document.uri);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics: [] });
});

connection.onDocumentSymbol(({ textDocument }) => symbolIndex.get(textDocument.uri)?.symbols || []);

connection.onHover(({ textDocument, position }) => {
  const doc = documents.get(textDocument.uri);
  if (!doc) return null;
  const line = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_SAFE_INTEGER },
  });
  const token = wordAt(line, position.character);
  if (!token) return null;
  if (token === "state" || token === "fn") {
    return { contents: { kind: "markdown", value: "`state` and `fn` are FastScript language keywords." } };
  }
  const entry = symbolIndex.get(textDocument.uri);
  if (entry?.definitions?.has(token)) {
    return { contents: { kind: "markdown", value: `FastScript symbol \`${token}\`` } };
  }
  return null;
});

connection.onCompletion(() => ([
  { label: "fn", kind: CompletionItemKind.Keyword, detail: "FastScript function declaration" },
  { label: "state", kind: CompletionItemKind.Keyword, detail: "FastScript state declaration" },
  { label: "~", kind: CompletionItemKind.Keyword, detail: "Reactive declaration" },
  { label: "export fn", kind: CompletionItemKind.Snippet, insertText: 'export fn ${1:name}(${2:args}) {\\n  $0\\n}', insertTextFormat: 2 },
  { label: "<section>", kind: CompletionItemKind.Snippet, insertText: '<section class="${1:section}">$0</section>', insertTextFormat: 2 },
  { label: "on:click", kind: CompletionItemKind.Property, insertText: 'on:click={${1:handler}}', insertTextFormat: 2 },
]));

connection.onDefinition(({ textDocument, position }) => {
  const doc = documents.get(textDocument.uri);
  const entry = symbolIndex.get(textDocument.uri);
  if (!doc || !entry) return null;
  const importAtCursor = importAtPosition(entry, position);
  if (importAtCursor?.specifier?.startsWith(".")) {
    const resolved = resolveImportTarget(uriToPath(textDocument.uri), importAtCursor.specifier);
    if (resolved) {
      return {
        uri: pathToFileURL(resolved).href,
        range: {
          start: Position.create(0, 0),
          end: Position.create(0, 0),
        },
      };
    }
  }
  const line = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_SAFE_INTEGER },
  });
  const token = wordAt(line, position.character);
  if (!token) return null;
  const def = entry.definitions.get(token);
  if (!def) return null;
  return {
    uri: textDocument.uri,
    range: { start: def, end: Position.create(def.line, def.character + token.length) },
  };
});

connection.onRenameRequest(({ textDocument, position, newName }) => {
  const doc = documents.get(textDocument.uri);
  if (!doc) return null;
  const lines = doc.getText().split(/\r?\n/);
  const line = lines[position.line] || "";
  const target = wordAt(line, position.character);
  if (!target || !/^[A-Za-z_$][\w$]*$/.test(newName)) return null;

  const edits = [];
  const re = new RegExp(`\\b${target}\\b`, "g");
  lines.forEach((text, idx) => {
    let match = null;
    while ((match = re.exec(text)) !== null) {
      edits.push({
        range: {
          start: { line: idx, character: match.index },
          end: { line: idx, character: match.index + target.length },
        },
        newText: newName,
      });
    }
  });
  return { changes: { [textDocument.uri]: edits } };
});

connection.onReferences(({ textDocument, position }) => {
  const doc = documents.get(textDocument.uri);
  if (!doc) return [];
  const lines = doc.getText().split(/\r?\n/);
  const line = lines[position.line] || "";
  const target = wordAt(line, position.character);
  if (!target) return [];

  const out = [];
  const re = new RegExp(`\\b${target}\\b`, "g");
  lines.forEach((text, idx) => {
    let match = null;
    while ((match = re.exec(text)) !== null) {
      out.push({
        uri: textDocument.uri,
        range: {
          start: { line: idx, character: match.index },
          end: { line: idx, character: match.index + target.length },
        },
      });
    }
  });
  return out;
});

connection.onCodeAction(({ textDocument, context }) => {
  const actions = [];
  for (const diagnostic of context.diagnostics || []) {
    if (diagnostic.code === "FS3002") {
      actions.push({
        title: "Replace var with let",
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [textDocument.uri]: [
              {
                range: diagnostic.range,
                newText: "let",
              },
            ],
          },
        },
      });
    }

    if (diagnostic.code === "FS3305") {
      actions.push({
        title: "Replace inline style with class",
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [textDocument.uri]: [
              {
                range: diagnostic.range,
                newText: "class",
              },
            ],
          },
        },
      });
    }
  }
  return actions;
});

connection.onDocumentLinks(({ textDocument }) => {
  const entry = symbolIndex.get(textDocument.uri);
  if (!entry) return [];
  const filePath = uriToPath(textDocument.uri);
  const links = [];
  for (const imported of entry.imports || []) {
    if (!imported.specifier?.startsWith(".")) continue;
    const target = resolveImportTarget(filePath, imported.specifier);
    if (!target) continue;
    links.push({
      range: imported.specifierRange,
      target: pathToFileURL(target).href,
      tooltip: "Open imported module",
    });
  }
  return links;
});

connection.onRequest("textDocument/semanticTokens/full", ({ textDocument }) => {
  const doc = documents.get(textDocument.uri);
  if (!doc) return { data: [] };
  return buildSemanticTokens(doc);
});

documents.listen(connection);
connection.listen();
