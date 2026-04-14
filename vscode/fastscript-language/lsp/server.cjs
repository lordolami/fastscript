const {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  DiagnosticSeverity,
  SymbolKind,
  CompletionItemKind,
  Position,
} = require("vscode-languageserver/node");
const { TextDocument } = require("vscode-languageserver-textdocument");

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

const symbolIndex = new Map();

function parseSymbols(document) {
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  const symbols = [];
  const definitions = new Map();

  lines.forEach((line, idx) => {
    const fnMatch = line.match(/^\s*(export\s+)?fn\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (fnMatch) {
      const name = fnMatch[2];
      const character = line.indexOf(name);
      const range = {
        start: { line: idx, character },
        end: { line: idx, character: character + name.length },
      };
      symbols.push({
        name,
        kind: SymbolKind.Function,
        range,
        selectionRange: range,
      });
      definitions.set(name, range.start);
    }
    const stateMatch = line.match(/^\s*(~|state\s+)([A-Za-z_$][\w$]*)\s*=/);
    if (stateMatch) {
      const name = stateMatch[2];
      const character = line.indexOf(name);
      const range = {
        start: { line: idx, character },
        end: { line: idx, character: character + name.length },
      };
      symbols.push({
        name,
        kind: SymbolKind.Variable,
        range,
        selectionRange: range,
      });
      definitions.set(name, range.start);
    }
  });

  return { symbols, definitions };
}

function wordAt(line, character) {
  const left = line.slice(0, character + 1).match(/[A-Za-z_$][\w$]*$/);
  const right = line.slice(character + 1).match(/^[\w$]*/);
  return `${left ? left[0] : ""}${right ? right[0] : ""}`;
}

function buildDiagnostics(document) {
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  const diagnostics = [];

  lines.forEach((line, i) => {
    if (line.includes("TODO_ERROR")) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: { start: { line: i, character: line.indexOf("TODO_ERROR") }, end: { line: i, character: line.indexOf("TODO_ERROR") + "TODO_ERROR".length } },
        message: "Remove TODO_ERROR token",
        source: "fastscript-lsp",
        code: "FS3001",
      });
    }
    if (/^\s*(interface|type|enum)\b/.test(line)) {
      const start = Math.max(0, line.search(/\S/));
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: { start: { line: i, character: start }, end: { line: i, character: start + 8 } },
        message: "Type declarations are not part of FastScript runtime semantics",
        source: "fastscript-lsp",
        code: "FS1004",
      });
    }
    if (/^\s*var\s+/.test(line)) {
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: { start: { line: i, character: line.indexOf("var") }, end: { line: i, character: line.indexOf("var") + 3 } },
        message: "Prefer let/const in FastScript files",
        source: "fastscript-lsp",
        code: "FS3002",
      });
    }
  });

  return diagnostics;
}

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: documents.syncKind,
    documentSymbolProvider: true,
    hoverProvider: true,
    completionProvider: { resolveProvider: false, triggerCharacters: [".", " "] },
    renameProvider: true,
    definitionProvider: true,
  },
}));

documents.onDidOpen((change) => {
  const parsed = parseSymbols(change.document);
  symbolIndex.set(change.document.uri, parsed);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics: buildDiagnostics(change.document) });
});

documents.onDidChangeContent((change) => {
  const parsed = parseSymbols(change.document);
  symbolIndex.set(change.document.uri, parsed);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics: buildDiagnostics(change.document) });
});

connection.onDocumentSymbol(({ textDocument }) => {
  return symbolIndex.get(textDocument.uri)?.symbols || [];
});

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
  { label: "export fn", kind: CompletionItemKind.Snippet, insertText: "export fn ${1:name}(${2:args}) {\\n  $0\\n}", insertTextFormat: 2 },
]));

connection.onDefinition(({ textDocument, position }) => {
  const doc = documents.get(textDocument.uri);
  const entry = symbolIndex.get(textDocument.uri);
  if (!doc || !entry) return null;
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
    let match;
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

documents.listen(connection);
connection.listen();
