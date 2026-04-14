const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = resolve(__dirname, "..");
const serverPath = resolve(root, "lsp", "server.cjs");
const grammarPath = resolve(root, "syntaxes", "fastscript.tmLanguage.json");
const pkgPath = resolve(root, "package.json");

assert(existsSync(serverPath), "missing lsp/server.cjs");
assert(existsSync(grammarPath), "missing syntaxes/fastscript.tmLanguage.json");
assert(existsSync(pkgPath), "missing package.json");

const syntaxCheck = spawnSync(process.execPath, ["--check", serverPath], { encoding: "utf8" });
assert(syntaxCheck.status === 0, `server syntax check failed:\n${syntaxCheck.stderr || syntaxCheck.stdout}`);

const grammar = JSON.parse(readFileSync(grammarPath, "utf8"));
assert(grammar.scopeName === "source.fastscript", "unexpected grammar scopeName");
assert(Array.isArray(grammar.patterns), "grammar patterns missing");
assert(Boolean(grammar.repository?.templateHtmlTag), "templateHtmlTag repository missing");
assert(Boolean(grammar.repository?.templateHtmlEvent), "templateHtmlEvent repository missing");
assert(Boolean(grammar.repository?.importPath), "importPath repository missing");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
assert(pkg.main === "./extension.js", "extension main entry invalid");
assert(pkg.contributes?.languages?.[0]?.extensions?.includes(".fs"), ".fs extension registration missing");

console.log("fastscript lsp smoke test pass");
