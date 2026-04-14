import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { parseFastScript } from "./fs-parser.mjs";

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (st.isFile()) out.push(full);
  }
  return out;
}

function spanFromNode(node, sourceLength) {
  const start = Math.max(0, Math.min(sourceLength, Number(node?.fsRange?.[0] ?? node?.start ?? 0)));
  const end = Math.max(start, Math.min(sourceLength, Number(node?.fsRange?.[1] ?? node?.end ?? start)));
  return { start, end };
}

function createIssue({ file, source, lineStarts, code, severity, message, span, fix = null }) {
  const start = Math.max(0, Math.min(source.length, span?.start ?? 0));
  const end = Math.max(start, Math.min(source.length, span?.end ?? start + 1));
  const loc = lineFromOffset(lineStarts, start);
  return {
    file,
    line: loc.line,
    column: loc.column,
    span: { start, end },
    code,
    severity,
    message,
    fix,
  };
}

function createLineStarts(source) {
  const out = [0];
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === "\n") out.push(i + 1);
  }
  return out;
}

function lineFromOffset(lineStarts, offset) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = lineStarts[mid];
    const next = lineStarts[mid + 1] ?? Number.POSITIVE_INFINITY;
    if (offset < start) hi = mid - 1;
    else if (offset >= next) lo = mid + 1;
    else return { line: mid + 1, column: offset - start + 1 };
  }
  return { line: 1, column: 1 };
}

function traverse(node, visitor, parent = null) {
  if (!node || typeof node !== "object") return;
  visitor(node, parent);
  for (const value of Object.values(node)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object") traverse(item, visitor, node);
      }
    } else if (typeof value === "object" && typeof value.type === "string") {
      traverse(value, visitor, node);
    }
  }
}

function collectReassignedNames(estree) {
  const names = new Set();
  traverse(estree, (node) => {
    if (node.type === "AssignmentExpression" && node.left?.type === "Identifier") {
      names.add(node.left.name);
    }
    if (node.type === "UpdateExpression" && node.argument?.type === "Identifier") {
      names.add(node.argument.name);
    }
  });
  return names;
}

function declarationKeywordFixSpan(source, declaration, keyword) {
  const span = spanFromNode(declaration, source.length);
  const window = source.slice(span.start, Math.min(span.end, span.start + 64));
  const pattern = new RegExp(`\\b${keyword}\\b`);
  const match = pattern.exec(window);
  if (!match) return null;
  return {
    start: span.start + match.index,
    end: span.start + match.index + keyword.length,
  };
}

function applyFixes(source, fixes) {
  if (!fixes.length) return source;
  const sorted = [...fixes]
    .filter((fix) => fix && Number.isFinite(fix.start) && Number.isFinite(fix.end) && fix.start <= fix.end)
    .sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    });

  const nonOverlapping = [];
  let cursor = -1;
  for (const fix of sorted) {
    if (fix.start < cursor) continue;
    nonOverlapping.push(fix);
    cursor = fix.end;
  }

  let output = source;
  for (let i = nonOverlapping.length - 1; i >= 0; i -= 1) {
    const fix = nonOverlapping[i];
    output = `${output.slice(0, fix.start)}${fix.text}${output.slice(fix.end)}`;
  }
  return output;
}

function lintSource(source, { file }) {
  const text = String(source ?? "");
  const lineStarts = createLineStarts(text);
  const parsed = parseFastScript(text, { file, mode: "lenient", recover: true });
  const issues = [];
  const fixes = [];

  for (const diagnostic of parsed.diagnostics) {
    issues.push(
      createIssue({
        file,
        source: text,
        lineStarts,
        code: diagnostic.code,
        severity: diagnostic.severity || "error",
        message: diagnostic.message,
        span: diagnostic.span,
      }),
    );
  }

  const todoPattern = /\bTODO_ERROR\b/g;
  for (const match of text.matchAll(todoPattern)) {
    const start = match.index ?? 0;
    issues.push(
      createIssue({
        file,
        source: text,
        lineStarts,
        code: "FS3001",
        severity: "error",
        message: "Remove TODO_ERROR token.",
        span: { start, end: start + match[0].length },
      }),
    );
  }

  if (!parsed.estree) return { issues, fixes };

  const reassignedNames = collectReassignedNames(parsed.estree);
  traverse(parsed.estree, (node) => {
    if (node.type === "VariableDeclaration") {
      if (node.kind === "var") {
        const fixSpan = declarationKeywordFixSpan(text, node, "var");
        const fix = fixSpan ? { ...fixSpan, text: "let" } : null;
        issues.push(
          createIssue({
            file,
            source: text,
            lineStarts,
            code: "FS3002",
            severity: "warning",
            message: "Prefer `let` or `const` over `var`.",
            span: spanFromNode(node, text.length),
            fix,
          }),
        );
        if (fix) fixes.push(fix);
      }

      if (node.kind === "let") {
        const names = [];
        for (const declaration of node.declarations || []) {
          if (declaration.id?.type === "Identifier") names.push(declaration.id.name);
        }
        if (names.length > 0 && names.every((name) => !reassignedNames.has(name))) {
          const fixSpan = declarationKeywordFixSpan(text, node, "let");
          const fix = fixSpan ? { ...fixSpan, text: "const" } : null;
          issues.push(
            createIssue({
              file,
              source: text,
              lineStarts,
              code: "FS3004",
              severity: "warning",
              message: "Binding can be `const`.",
              span: spanFromNode(node, text.length),
              fix,
            }),
          );
          if (fix) fixes.push(fix);
        }
      }
    }

    if (node.type === "TemplateElement" && /<script[\s>]/i.test(node.value?.raw || "")) {
      issues.push(
        createIssue({
          file,
          source: text,
          lineStarts,
          code: "FS3003",
          severity: "warning",
          message: "Avoid inline <script> tags in template literals.",
          span: spanFromNode(node, text.length),
        }),
      );
    }
  });

  return { issues, fixes };
}

export async function runLint(args = []) {
  let target = "app";
  let mode = "fail";
  let fix = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--path") target = args[i + 1] || target;
    if (args[i] === "--mode") mode = (args[i + 1] || mode).toLowerCase();
    if (args[i] === "--fix") fix = true;
  }

  const base = resolve(target);
  const files = walk(base).filter((file) => extname(file) === ".fs");
  const issues = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const result = lintSource(source, { file });
    let next = source;
    if (fix && result.fixes.length > 0) {
      next = applyFixes(source, result.fixes);
      if (next !== source) writeFileSync(file, next, "utf8");
    }
    issues.push(...result.issues);
  }

  issues.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    if (a.span.start !== b.span.start) return a.span.start - b.span.start;
    if (a.code !== b.code) return a.code.localeCompare(b.code);
    return a.message.localeCompare(b.message);
  });

  for (const issue of issues) {
    console.log(`${issue.file}:${issue.line}:${issue.column} ${issue.code} ${issue.severity} ${issue.message}`);
  }

  const blocking = issues.filter((issue) => issue.severity === "error");
  if (blocking.length > 0 && mode !== "pass") {
    const error = new Error(`lint failed: ${blocking.length} blocking issue(s)`);
    error.status = 1;
    error.details = blocking;
    throw error;
  }

  console.log(`lint complete: ${files.length} file(s), ${issues.length} issue(s), mode=${mode}, fix=${fix}`);
}
