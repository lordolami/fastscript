import { parse as acornParse, tokenizer as acornTokenizer } from "acorn";
import { resolveErrorMeta } from "./fs-error-codes.mjs";

export const FASTSCRIPT_AST_VERSION = "1.0.0";

const STATEMENT_BOUNDARY_TOKENS = new Set([";", "{", "}"]);
const TYPE_DECLARATION_KEYWORDS = new Set(["type", "interface", "enum"]);

function createLineStarts(source) {
  const text = String(source ?? "");
  const out = [0];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "\n") out.push(i + 1);
  }
  return out;
}

function binarySearchLine(lineStarts, offset) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = lineStarts[mid];
    const next = lineStarts[mid + 1] ?? Number.POSITIVE_INFINITY;
    if (offset < start) hi = mid - 1;
    else if (offset >= next) lo = mid + 1;
    else return mid;
  }
  return Math.max(0, Math.min(lineStarts.length - 1, lo));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function offsetToLineColumn(offset, lineStarts) {
  const clamped = clamp(offset, 0, Math.max(0, (lineStarts.at(-1) ?? 0) + 1_000_000));
  const index = binarySearchLine(lineStarts, clamped);
  return {
    line: index + 1,
    column: clamped - lineStarts[index] + 1,
    offset: clamped,
  };
}

function lineEndOffset(lineStarts, sourceLength, line) {
  const index = clamp(line - 1, 0, lineStarts.length - 1);
  return lineStarts[index + 1] ?? sourceLength;
}

function normalizeSpan(span, sourceLength) {
  if (!span) return { start: 0, end: 0 };
  const start = clamp(Number(span.start ?? 0), 0, sourceLength);
  const end = clamp(Number(span.end ?? start), start, sourceLength);
  return { start, end };
}

function createDiagnostic({
  source,
  lineStarts,
  file = "",
  code = "FS1005",
  message,
  hint,
  severity,
  span,
  related = [],
  fixes = [],
  recoverable = true,
}) {
  const meta = resolveErrorMeta(code);
  const sourceLength = String(source ?? "").length;
  const normalized = normalizeSpan(span, sourceLength);
  const start = offsetToLineColumn(normalized.start, lineStarts);
  const end = offsetToLineColumn(Math.max(normalized.start, normalized.end), lineStarts);
  return {
    code,
    severity: severity || meta.severity || "error",
    message: message || meta.message,
    hint: hint ?? meta.hint ?? "",
    file,
    span: normalized,
    line: start.line,
    column: start.column,
    endLine: end.line,
    endColumn: end.column,
    related: related
      .map((entry) => {
        const relSpan = normalizeSpan(entry.span, sourceLength);
        const relLoc = offsetToLineColumn(relSpan.start, lineStarts);
        return {
          message: entry.message || "Related location",
          file: entry.file || file,
          span: relSpan,
          line: relLoc.line,
          column: relLoc.column,
        };
      })
      .sort((a, b) => a.span.start - b.span.start),
    fixes,
    recoverable,
  };
}

function tokenTypeFromAcorn(token) {
  if (!token?.type) return "unknown";
  if (token.type.keyword) return "keyword";
  if (token.type.label === "name") return "identifier";
  if (token.type.label === "num") return "number";
  if (token.type.label === "string") return "string";
  if (token.type.label === "regexp") return "regex";
  if (token.type.label === "template") return "template";
  if (token.type.label === "eof") return "eof";
  return "symbol";
}

function makeToken({ type, value, start, end, file, lineStarts, channel = "syntax", label = "" }) {
  const startLoc = offsetToLineColumn(start, lineStarts);
  const endLoc = offsetToLineColumn(end, lineStarts);
  return {
    type,
    value,
    label,
    channel,
    start: startLoc,
    end: endLoc,
    range: [start, end],
    file,
  };
}

function pushTriviaToken(tokens, source, start, end, file, lineStarts) {
  if (end <= start) return;
  const value = source.slice(start, end);
  const text = value.replace(/\r/g, "");
  if (!text) return;

  if (/^\n+$/.test(text)) {
    tokens.push(makeToken({ type: "newline", value: text, start, end, file, lineStarts, channel: "trivia", label: "newline" }));
    return;
  }
  if (/^[ \t]+$/.test(text)) {
    tokens.push(makeToken({ type: "whitespace", value: text, start, end, file, lineStarts, channel: "trivia", label: "whitespace" }));
    return;
  }
  tokens.push(makeToken({ type: "trivia", value: text, start, end, file, lineStarts, channel: "trivia", label: "trivia" }));
}

function splitAndPushTrivia(tokens, source, start, end, file, lineStarts) {
  if (end <= start) return;
  let cursor = start;
  while (cursor < end) {
    const ch = source[cursor];
    if (ch === "\r") {
      cursor += 1;
      continue;
    }
    if (ch === "\n") {
      const begin = cursor;
      cursor += 1;
      while (cursor < end && source[cursor] === "\n") cursor += 1;
      pushTriviaToken(tokens, source, begin, cursor, file, lineStarts);
      continue;
    }
    if (ch === " " || ch === "\t") {
      const begin = cursor;
      cursor += 1;
      while (cursor < end && (source[cursor] === " " || source[cursor] === "\t")) cursor += 1;
      pushTriviaToken(tokens, source, begin, cursor, file, lineStarts);
      continue;
    }
    const begin = cursor;
    cursor += 1;
    while (cursor < end && !["\r", "\n", " ", "\t"].includes(source[cursor])) cursor += 1;
    pushTriviaToken(tokens, source, begin, cursor, file, lineStarts);
  }
}

function tokenizeWithAcorn(source, { file = "", lineStarts }) {
  const significant = [];
  const comments = [];
  let lexicalError = null;

  const onComment = (block, text, start, end, startLoc, endLoc) => {
    comments.push({
      kind: "comment",
      block,
      text,
      start,
      end,
      startLoc,
      endLoc,
      value: source.slice(start, end),
    });
  };

  try {
    const stream = acornTokenizer(source, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
      ranges: true,
      allowHashBang: true,
      onComment,
    });

    while (true) {
      const token = stream.getToken();
      const value = source.slice(token.start, token.end);
      significant.push(
        makeToken({
          type: tokenTypeFromAcorn(token),
          value,
          start: token.start,
          end: token.end,
          file,
          lineStarts,
          label: token.type.label,
          channel: "syntax",
        }),
      );
      if (token.type.label === "eof") break;
    }
  } catch (error) {
    lexicalError = error;
  }

  return { significant, comments, lexicalError };
}

function mergeTriviaAndTokens(source, { file = "", lineStarts, significant, comments }) {
  const out = [];
  const events = [
    ...comments.map((comment) => ({ kind: "comment", start: comment.start, end: comment.end, value: comment.value })),
    ...significant.filter((token) => token.type !== "eof").map((token) => ({ kind: "token", start: token.range[0], end: token.range[1], token })),
  ].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.kind === b.kind) return a.end - b.end;
    return a.kind === "comment" ? -1 : 1;
  });

  let cursor = 0;
  for (const event of events) {
    if (event.start > cursor) {
      splitAndPushTrivia(out, source, cursor, event.start, file, lineStarts);
    }

    if (event.kind === "comment") {
      out.push(
        makeToken({
          type: "comment",
          value: event.value,
          start: event.start,
          end: event.end,
          file,
          lineStarts,
          label: "comment",
          channel: "trivia",
        }),
      );
    } else {
      out.push(event.token);
    }

    cursor = Math.max(cursor, event.end);
  }

  if (cursor < source.length) splitAndPushTrivia(out, source, cursor, source.length, file, lineStarts);

  out.push(
    makeToken({
      type: "eof",
      value: "",
      start: source.length,
      end: source.length,
      file,
      lineStarts,
      label: "eof",
      channel: "syntax",
    }),
  );

  return out;
}

function previousSignificant(tokens, idx) {
  for (let i = idx - 1; i >= 0; i -= 1) {
    if (tokens[i].type !== "eof") return tokens[i];
  }
  return null;
}

function nextSignificant(tokens, idx, offset = 1) {
  const nextIdx = idx + offset;
  if (nextIdx < 0 || nextIdx >= tokens.length) return null;
  const token = tokens[nextIdx];
  if (!token || token.type === "eof") return null;
  return token;
}

function isIdentifierToken(token) {
  return Boolean(token) && token.type === "identifier";
}

function isStatementStart(tokens, idx) {
  const token = tokens[idx];
  const prev = previousSignificant(tokens, idx);
  if (!token) return false;
  if (!prev) return true;
  if (prev.end.line < token.start.line) return true;
  if (STATEMENT_BOUNDARY_TOKENS.has(prev.value)) return true;
  return false;
}

function declarationSpanFromKeyword(source, lineStarts, sourceLength, tokens, idx) {
  const token = tokens[idx];
  if (!token) return { start: 0, end: 0 };

  if (token.value === "type") {
    let end = lineEndOffset(lineStarts, sourceLength, token.start.line);
    let depth = 0;
    for (let i = idx + 1; i < tokens.length; i += 1) {
      const current = tokens[i];
      if (!current || current.type === "eof") break;
      if (depth === 0 && current.start.line > token.start.line) break;
      if (current.value === "{" || current.value === "(" || current.value === "[") depth += 1;
      if (current.value === "}" || current.value === ")" || current.value === "]") depth = Math.max(0, depth - 1);
      end = current.range[1];
      if (depth === 0 && current.value === ";") break;
    }
    return { start: token.range[0], end };
  }

  let openBrace = null;
  for (let i = idx + 1; i < tokens.length; i += 1) {
    const current = tokens[i];
    if (!current || current.type === "eof") break;
    if (current.value === "{") {
      openBrace = i;
      break;
    }
    if (current.end.line > token.start.line && token.value === "interface") break;
  }

  if (openBrace == null) {
    return {
      start: token.range[0],
      end: lineEndOffset(lineStarts, sourceLength, token.start.line),
    };
  }

  let depth = 0;
  let end = tokens[openBrace].range[1];
  for (let i = openBrace; i < tokens.length; i += 1) {
    const current = tokens[i];
    if (!current || current.type === "eof") break;
    if (current.value === "{") depth += 1;
    if (current.value === "}") {
      depth -= 1;
      if (depth === 0) {
        end = current.range[1];
        const maybeSemicolon = nextSignificant(tokens, i, 1);
        if (maybeSemicolon?.value === ";") end = maybeSemicolon.range[1];
        break;
      }
    }
    end = current.range[1];
  }
  return { start: token.range[0], end };
}

function operation(start, end, replacement, kind) {
  return { start, end, replacement, kind };
}

function collectRewriteOperations(source, { file = "", lineStarts, significant }) {
  const diagnostics = [];
  const ops = [];
  const sourceLength = source.length;

  for (let idx = 0; idx < significant.length; idx += 1) {
    const token = significant[idx];
    if (!token || token.type === "eof") continue;

    if (token.value === "~" && isStatementStart(significant, idx)) {
      const nameToken = nextSignificant(significant, idx, 1);
      const assignToken = nextSignificant(significant, idx, 2);
      if (isIdentifierToken(nameToken) && assignToken?.value === "=") {
        ops.push(operation(token.range[0], token.range[1], "let ", "reactive"));
      } else if (isIdentifierToken(nameToken)) {
        diagnostics.push(
          createDiagnostic({
            source,
            lineStarts,
            file,
            code: "FS1001",
            span: { start: token.range[0], end: (assignToken || nameToken).range[1] },
            fixes: [
              {
                message: "Insert assignment operator after reactive variable name.",
                span: { start: nameToken.range[1], end: nameToken.range[1] },
                text: " = <expression>",
              },
            ],
          }),
        );
      }
      continue;
    }

    if (token.value === "state" && token.type === "identifier" && isStatementStart(significant, idx)) {
      const nameToken = nextSignificant(significant, idx, 1);
      const assignToken = nextSignificant(significant, idx, 2);
      if (isIdentifierToken(nameToken) && assignToken?.value === "=") {
        ops.push(operation(token.range[0], token.range[1], "let", "state"));
      } else if (isIdentifierToken(nameToken)) {
        diagnostics.push(
          createDiagnostic({
            source,
            lineStarts,
            file,
            code: "FS1002",
            span: { start: token.range[0], end: nameToken.range[1] },
            fixes: [
              {
                message: "Convert to a complete state declaration.",
                span: { start: nameToken.range[1], end: nameToken.range[1] },
                text: " = <expression>",
              },
            ],
          }),
        );
      }
      continue;
    }

    if (token.value === "fn" && token.type === "identifier") {
      const prev = previousSignificant(significant, idx);
      const startsStatement = isStatementStart(significant, idx);
      const followsExport = prev?.value === "export" && prev.end.line === token.start.line;
      if (startsStatement || followsExport) {
        const nameToken = nextSignificant(significant, idx, 1);
        const openParenToken = nextSignificant(significant, idx, 2);
        if (isIdentifierToken(nameToken) && openParenToken?.value === "(") {
          ops.push(operation(token.range[0], token.range[1], "function", "function"));
        } else {
          diagnostics.push(
            createDiagnostic({
              source,
              lineStarts,
              file,
              code: "FS1003",
              span: { start: token.range[0], end: (nameToken || token).range[1] },
              fixes: [
                {
                  message: "Use `fn name(...)` syntax.",
                  span: { start: token.range[0], end: token.range[1] },
                  text: "fn <name>",
                },
              ],
            }),
          );
        }
      }
      continue;
    }

    if (TYPE_DECLARATION_KEYWORDS.has(token.value) && token.type === "identifier" && isStatementStart(significant, idx)) {
      const nextToken = nextSignificant(significant, idx, 1);
      if (!isIdentifierToken(nextToken)) continue;
      const shouldHandleType = token.value === "type" && nextSignificant(significant, idx, 2)?.value === "=";
      const shouldHandleBlock = (token.value === "interface" || token.value === "enum") && nextSignificant(significant, idx, 2);
      if (!shouldHandleType && !shouldHandleBlock) continue;

      const span = declarationSpanFromKeyword(source, lineStarts, sourceLength, significant, idx);
      const snippet = source.slice(span.start, span.end).trim();
      diagnostics.push(
        createDiagnostic({
          source,
          lineStarts,
          file,
          code: "FS1004",
          span,
          fixes: [
            {
              message: "Remove declaration from runtime source.",
              span,
              text: "",
            },
          ],
        }),
      );
      ops.push(
        operation(
          span.start,
          span.end,
          `/* ${snippet || token.value} (removed by fastscript compiler) */`,
          "erase-type",
        ),
      );
    }
  }

  const lexicalTodoPattern = /\bTODO_ERROR\b/g;
  for (const match of source.matchAll(lexicalTodoPattern)) {
    diagnostics.push(
      createDiagnostic({
        source,
        lineStarts,
        file,
        code: "FS1007",
        span: { start: match.index ?? 0, end: (match.index ?? 0) + match[0].length },
      }),
    );
  }

  return { ops, diagnostics };
}

function applyRewriteOperations(source, ops) {
  if (!ops.length) {
    const mapping = [];
    for (let i = 0; i < source.length; i += 1) mapping.push(i);
    mapping.push(source.length);
    return {
      code: source,
      mapGeneratedToSource: mapping,
      rewrites: [],
    };
  }

  const sorted = [...ops]
    .sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    })
    .filter((entry) => Number.isFinite(entry.start) && Number.isFinite(entry.end) && entry.start <= entry.end);

  const normalized = [];
  let cursor = 0;
  for (const op of sorted) {
    if (op.start < cursor) continue;
    normalized.push(op);
    cursor = op.end;
  }

  const outputParts = [];
  const mapGeneratedToSource = [];
  const rewrites = [];
  let readCursor = 0;
  let generatedCursor = 0;

  function pushCopied(start, end) {
    if (end <= start) return;
    outputParts.push(source.slice(start, end));
    for (let offset = start; offset < end; offset += 1) mapGeneratedToSource.push(offset);
    generatedCursor += end - start;
  }

  function pushReplacement(op) {
    const replacement = String(op.replacement ?? "");
    outputParts.push(replacement);
    const sourceLength = Math.max(1, op.end - op.start);
    const generatedStart = generatedCursor;
    for (let i = 0; i < replacement.length; i += 1) {
      const mapped = op.start + Math.min(i, sourceLength - 1);
      mapGeneratedToSource.push(mapped);
    }
    generatedCursor += replacement.length;
    rewrites.push({
      kind: op.kind,
      source: { start: op.start, end: op.end },
      generated: { start: generatedStart, end: generatedCursor },
      replacement,
    });
  }

  for (const op of normalized) {
    pushCopied(readCursor, op.start);
    pushReplacement(op);
    readCursor = op.end;
  }

  pushCopied(readCursor, source.length);

  const code = outputParts.join("");
  mapGeneratedToSource.push(source.length);

  return { code, mapGeneratedToSource, rewrites };
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function encodeVlq(value) {
  let num = value < 0 ? ((-value) << 1) + 1 : value << 1;
  let out = "";
  do {
    let digit = num & 31;
    num >>>= 5;
    if (num > 0) digit |= 32;
    out += BASE64[digit];
  } while (num > 0);
  return out;
}

function offsetToZeroBased(offset, lineStarts, sourceLength) {
  const safe = clamp(offset, 0, sourceLength);
  const lineIndex = binarySearchLine(lineStarts, safe);
  return {
    line: lineIndex,
    column: safe - lineStarts[lineIndex],
  };
}

function mapGeneratedOffsetToSourceOffset(mapGeneratedToSource, generatedOffset, sourceLength) {
  if (!mapGeneratedToSource.length) return 0;
  const safeGenerated = clamp(generatedOffset, 0, mapGeneratedToSource.length - 1);
  const mapped = mapGeneratedToSource[safeGenerated];
  return clamp(Number(mapped ?? 0), 0, sourceLength);
}

function buildSourceMap({ source, generated, mapGeneratedToSource, file = "" }) {
  const sourceText = String(source ?? "");
  const generatedText = String(generated ?? "");
  const sourceLineStarts = createLineStarts(sourceText);
  const sourceLength = sourceText.length;

  let mappings = "";
  let previousSourceLine = 0;
  let previousSourceColumn = 0;
  let generatedColumn = 0;
  let previousGeneratedColumn = 0;
  let lineStarted = false;

  for (let i = 0; i <= generatedText.length; i += 1) {
    const isLineBreak = i === generatedText.length || generatedText[i] === "\n";
    if (!isLineBreak) {
      const sourceOffset = mapGeneratedOffsetToSourceOffset(mapGeneratedToSource, i, sourceLength);
      const sourceLoc = offsetToZeroBased(sourceOffset, sourceLineStarts, sourceLength);
      const segment =
        encodeVlq(generatedColumn - previousGeneratedColumn) +
        encodeVlq(0) +
        encodeVlq(sourceLoc.line - previousSourceLine) +
        encodeVlq(sourceLoc.column - previousSourceColumn);
      mappings += lineStarted ? `,${segment}` : segment;
      lineStarted = true;
      previousGeneratedColumn = generatedColumn;
      previousSourceLine = sourceLoc.line;
      previousSourceColumn = sourceLoc.column;
      generatedColumn += 1;
      continue;
    }

    if (i < generatedText.length) {
      mappings += ";";
      generatedColumn = 0;
      previousGeneratedColumn = 0;
      lineStarted = false;
    }
  }

  return {
    version: 3,
    file,
    sources: [file || "<memory>"],
    sourcesContent: [sourceText],
    names: [],
    mappings,
  };
}

function remapAstNodeLocations(estree, source, lineStarts, mapGeneratedToSource) {
  if (!estree || typeof estree !== "object") return;
  const stack = [estree];
  const sourceLength = source.length;

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;

    if (typeof node.start === "number" && typeof node.end === "number") {
      const mappedStart = mapGeneratedOffsetToSourceOffset(mapGeneratedToSource, node.start, sourceLength);
      const mappedEndBase = mapGeneratedOffsetToSourceOffset(mapGeneratedToSource, Math.max(node.start, node.end - 1), sourceLength);
      const mappedEnd = clamp(mappedEndBase + (node.end > node.start ? 1 : 0), mappedStart, sourceLength);
      const startLoc = offsetToLineColumn(mappedStart, lineStarts);
      const endLoc = offsetToLineColumn(mappedEnd, lineStarts);
      node.fsRange = [mappedStart, mappedEnd];
      node.fsLoc = { start: startLoc, end: endLoc };
      node.line = startLoc.line;
      node.column = startLoc.column;
    }

    for (const value of Object.values(node)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === "object") stack.push(item);
        }
      } else if (typeof value === "object") {
        stack.push(value);
      }
    }
  }
}

function findTokenIndicesForSpan(tokens, start, end) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token || token.type === "eof") continue;
    const tStart = token.range[0];
    const tEnd = token.range[1];
    if (tEnd <= start || tStart >= end) continue;
    if (first < 0) first = i;
    last = i;
  }
  return { first, last };
}

function buildCst({ source, file, lineStarts, tokens, estree }) {
  const statements = [];
  const body = Array.isArray(estree?.body) ? estree.body : [];
  for (const node of body) {
    const start = node?.fsRange?.[0] ?? 0;
    const end = node?.fsRange?.[1] ?? start;
    const tokenRange = findTokenIndicesForSpan(tokens, start, end);
    statements.push({
      type: "StatementCST",
      kind: node.type,
      range: [start, end],
      loc: node.fsLoc || {
        start: offsetToLineColumn(start, lineStarts),
        end: offsetToLineColumn(end, lineStarts),
      },
      raw: source.slice(start, end),
      tokenStart: tokenRange.first,
      tokenEnd: tokenRange.last,
    });
  }

  return {
    type: "ProgramCST",
    file,
    range: [0, source.length],
    tokens,
    statements,
  };
}

function sortAndDedupeDiagnostics(diagnostics) {
  const deduped = [];
  const seen = new Set();
  for (const diagnostic of diagnostics) {
    const key = [
      diagnostic.code,
      diagnostic.severity,
      diagnostic.message,
      diagnostic.file || "",
      diagnostic.span?.start ?? 0,
      diagnostic.span?.end ?? 0,
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(diagnostic);
  }

  deduped.sort((a, b) => {
    const offsetA = a.span?.start ?? 0;
    const offsetB = b.span?.start ?? 0;
    if (offsetA !== offsetB) return offsetA - offsetB;
    if (a.code !== b.code) return a.code.localeCompare(b.code);
    return a.message.localeCompare(b.message);
  });

  return deduped;
}

export function tokenizeFastScript(source, { file = "" } = {}) {
  const text = String(source ?? "");
  const lineStarts = createLineStarts(text);
  const { significant, comments } = tokenizeWithAcorn(text, { file, lineStarts });
  return mergeTriviaAndTokens(text, { file, lineStarts, significant, comments });
}

function parseGeneratedJavaScript(generated, { file = "" } = {}) {
  const parseTokens = [];
  const parseComments = [];
  try {
    const estree = acornParse(generated, {
      ecmaVersion: "latest",
      sourceType: "module",
      allowHashBang: true,
      locations: true,
      ranges: true,
      onToken: parseTokens,
      onComment: parseComments,
    });
    return { estree, parseTokens, parseComments, error: null };
  } catch (error) {
    return { estree: null, parseTokens, parseComments, error };
  }
}

function ensureProgramShape(program) {
  if (!program || typeof program !== "object") {
    return {
      type: "Program",
      sourceType: "module",
      body: [],
      start: 0,
      end: 0,
    };
  }
  if (!Array.isArray(program.body)) program.body = [];
  return program;
}

function createParserError({ source, file, diagnostics }) {
  const primary = diagnostics.find((diagnostic) => diagnostic.severity !== "warning") || diagnostics[0];
  const lines = diagnostics.map((diagnostic) => formatDiagnostic(diagnostic));
  const head = `${primary.file || file || "<memory>"}:${primary.line}:${primary.column} ${primary.code} ${primary.message}`;
  const error = new Error(`${head}\n${lines.join("\n")}`);
  error.code = primary.code || "FS1000";
  error.status = 1;
  error.details = diagnostics;
  error.source = source;
  return error;
}

export function parseFastScript(source, { file = "", mode = "lenient", recover = true } = {}) {
  const text = String(source ?? "");
  const lineStarts = createLineStarts(text);

  const tokenization = tokenizeWithAcorn(text, { file, lineStarts });
  const tokens = mergeTriviaAndTokens(text, {
    file,
    lineStarts,
    significant: tokenization.significant,
    comments: tokenization.comments,
  });

  const diagnostics = [];

  if (tokenization.lexicalError) {
    const loc = tokenization.lexicalError.loc || { line: 1, column: 0 };
    const lineStart = lineStarts[clamp((loc.line || 1) - 1, 0, lineStarts.length - 1)] ?? 0;
    const offset = clamp(lineStart + (loc.column || 0), 0, text.length);
    diagnostics.push(
      createDiagnostic({
        source: text,
        lineStarts,
        file,
        code: "FS1010",
        span: { start: offset, end: offset + 1 },
        message: tokenization.lexicalError.message || resolveErrorMeta("FS1010").message,
      }),
    );
  }

  const rewrites = collectRewriteOperations(text, {
    file,
    lineStarts,
    significant: tokenization.significant,
  });
  diagnostics.push(...rewrites.diagnostics);

  const transformed = applyRewriteOperations(text, rewrites.ops);
  const parsedGenerated = parseGeneratedJavaScript(transformed.code, { file });

  if (parsedGenerated.error) {
    const parseOffset = clamp(parsedGenerated.error.pos ?? 0, 0, transformed.code.length);
    const sourceOffset = mapGeneratedOffsetToSourceOffset(transformed.mapGeneratedToSource, parseOffset, text.length);
    diagnostics.push(
      createDiagnostic({
        source: text,
        lineStarts,
        file,
        code: "FS1005",
        span: { start: sourceOffset, end: Math.min(sourceOffset + 1, text.length) },
        message: parsedGenerated.error.message.replace(/ \(\d+:\d+\)$/, ""),
      }),
    );
  }

  const estree = ensureProgramShape(parsedGenerated.estree);
  remapAstNodeLocations(estree, text, lineStarts, transformed.mapGeneratedToSource);

  const cst = buildCst({ source: text, file, lineStarts, tokens, estree });
  const sourceMap = buildSourceMap({
    source: text,
    generated: transformed.code,
    mapGeneratedToSource: transformed.mapGeneratedToSource,
    file,
  });

  const normalizedDiagnostics = sortAndDedupeDiagnostics(diagnostics);

  const body = Array.isArray(estree.body)
    ? estree.body.map((node) => ({
        ...node,
        line: node?.fsLoc?.start?.line ?? node?.loc?.start?.line ?? 1,
      }))
    : [];

  const program = {
    type: "Program",
    version: FASTSCRIPT_AST_VERSION,
    file,
    mode,
    body,
    estree,
    cst,
    tokens,
    diagnostics: normalizedDiagnostics,
    transformedCode: transformed.code,
    sourceMap,
    mapGeneratedToSource: transformed.mapGeneratedToSource,
    rewrites: transformed.rewrites,
    source: text,
  };

  const blocking = normalizedDiagnostics.filter((diagnostic) => diagnostic.severity !== "warning");
  if (mode === "strict" && blocking.length > 0) {
    throw createParserError({ source: text, file, diagnostics: normalizedDiagnostics });
  }

  if (!recover && normalizedDiagnostics.length > 0) {
    throw createParserError({ source: text, file, diagnostics: normalizedDiagnostics });
  }

  return program;
}

export function buildInlineSourceMapComment(map) {
  const payload = Buffer.from(JSON.stringify(map), "utf8").toString("base64");
  return `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${payload}`;
}

export function compileFastScript(source, { file = "", mode = "lenient", recover = true, inlineSourceMap = false } = {}) {
  const ast = parseFastScript(source, { file, mode, recover });
  const map = ast.sourceMap;
  const mapText = JSON.stringify(map);
  const inlineComment = buildInlineSourceMapComment(map);
  const code = inlineSourceMap ? `${ast.transformedCode}\n${inlineComment}` : ast.transformedCode;

  return {
    code,
    map,
    mapText,
    inlineSourceMap: inlineComment,
    ast,
    cst: ast.cst,
    diagnostics: ast.diagnostics,
    rewrites: ast.rewrites,
  };
}

function fixText(fix) {
  if (!fix) return "";
  const replacement = String(fix.text ?? "").replace(/\n/g, "\\n");
  return replacement.length > 32 ? `${replacement.slice(0, 29)}...` : replacement;
}

export function formatDiagnostic(diagnostic) {
  const path = diagnostic.file || "<memory>";
  const base = `${path}:${diagnostic.line}:${diagnostic.column} ${diagnostic.code} ${diagnostic.severity} ${diagnostic.message}`;
  const hint = diagnostic.hint ? ` hint=${diagnostic.hint}` : "";
  const related = (diagnostic.related || [])
    .map((entry) => ` related=${entry.file || path}:${entry.line}:${entry.column} ${entry.message}`)
    .join("");
  const fixes = (diagnostic.fixes || [])
    .map((fix) => {
      const start = fix.span?.start ?? 0;
      const end = fix.span?.end ?? start;
      return ` fix=[${start}-${end}]=>${fixText(fix)}`;
    })
    .join("");
  return `${base}${hint}${related}${fixes}`.trimEnd();
}
