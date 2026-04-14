import { formatDiagnostic, parseFastScript } from "./fs-parser.mjs";

function displayPath(file) {
  return file || "<memory>";
}

function safeLine(lines, line) {
  const index = Math.max(0, Math.min(lines.length - 1, line - 1));
  return lines[index] ?? "";
}

function renderPrimarySnippet(diagnostic, source) {
  if (!source || !diagnostic) return "";
  const lines = String(source).split(/\r?\n/);
  const lineText = safeLine(lines, diagnostic.line);
  const markerStart = Math.max(1, diagnostic.column || 1);
  const markerEnd = Math.max(markerStart, diagnostic.endColumn || markerStart);
  const width = Math.max(1, markerEnd - markerStart);
  const pointer = `${" ".repeat(markerStart - 1)}${"^".repeat(width)}`;
  return `${String(diagnostic.line).padStart(4, " ")} | ${lineText}\n     | ${pointer}`;
}

export function formatDiagnosticsReport(diagnostics, { source = "" } = {}) {
  if (!diagnostics?.length) return "";
  const ordered = [...diagnostics].sort((a, b) => {
    const startA = a.span?.start ?? 0;
    const startB = b.span?.start ?? 0;
    if (startA !== startB) return startA - startB;
    return a.code.localeCompare(b.code);
  });

  return ordered
    .map((diagnostic) => {
      const details = [formatDiagnostic(diagnostic)];
      const snippet = renderPrimarySnippet(diagnostic, source);
      if (snippet) details.push(snippet);
      for (const related of diagnostic.related || []) {
        details.push(
          `  related ${displayPath(related.file)}:${related.line}:${related.column} ${related.message}`,
        );
      }
      for (const fix of diagnostic.fixes || []) {
        const text = String(fix.text ?? "").replace(/\n/g, "\\n");
        details.push(`  fix ${fix.message || "Apply fix"} -> ${text}`);
      }
      return details.join("\n");
    })
    .join("\n\n");
}

export function analyzeFastScript(source, { file = "", mode = "lenient" } = {}) {
  const ast = parseFastScript(source, { file, mode, recover: true });
  return ast.diagnostics;
}

export function assertFastScript(source, { file = "", mode = "strict" } = {}) {
  const diagnostics = analyzeFastScript(source, { file, mode: "lenient" });
  if (!diagnostics.length) return;
  const blocking = diagnostics.filter((diagnostic) => diagnostic.severity !== "warning");
  if (!blocking.length && mode !== "strict") return;

  const primary = (blocking.length ? blocking : diagnostics)[0];
  const report = formatDiagnosticsReport(diagnostics, { source });
  const path = displayPath(primary.file);
  const error = new Error(`${path}:${primary.line}:${primary.column} ${primary.code} ${primary.message}\n${report}`);
  error.status = 1;
  error.details = diagnostics;
  error.report = report;
  throw error;
}
