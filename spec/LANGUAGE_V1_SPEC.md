# FastScript Language Specification v1.0

## Status
- Specification version: `1.0.0`
- Language status: Stable baseline for FastScript `v1`
- Applies to: `.fs` source modules compiled by FastScript CLI/runtime

## 1. Design Goals
- FastScript is a first-class language runtime with its own diagnostics, formatter/linter behavior, and compatibility guarantees.
- FastScript is source-compatible with ECMAScript module syntax and accepts normal JS/TS/JSX/TSX authoring inside `.fs`.
- FastScript adds dedicated declaration forms (`~`, `state`, `fn`) as optional sugar that compile to canonical JavaScript.

## 2. Source Model
- File unit: module (ESM semantics).
- Encoding: UTF-8.
- Line endings: `\n` or `\r\n` accepted.
- Comments: line (`//`) and block (`/* ... */`) comments are legal everywhere JavaScript allows them.

## 3. Lexical Elements
- Identifiers follow ECMAScript identifier rules.
- Literals follow ECMAScript literal grammar (string, number, bigint, boolean, null, template, regex).
- Tokens preserve source offsets and trivia for CST fidelity.

## 4. Core Grammar
FastScript v1 grammar is ECMAScript module grammar plus FastScript declaration forms:

```ebnf
Program            ::= ModuleItem*
ModuleItem         ::= Statement | ImportDecl | ExportDecl
Statement          ::= EcmaStatement
FastScriptState    ::= "state" Identifier "=" Expression
FastScriptReactive ::= "~" Identifier "=" Expression
FastScriptFunction ::= "fn" Identifier "(" ParamList? ")" FunctionBody
FastScriptExportFn ::= "export" "fn" Identifier "(" ParamList? ")" FunctionBody
```

Notes:
- `state` and `~` are declaration statements only.
- `fn` is a declaration form, not an expression form.
- Standard TypeScript type-only syntax in `.fs` erases during normalization and should not be rejected solely for being TypeScript-shaped.

## 5. Desugaring Semantics
- `state name = expr` desugars to `let name = expr`.
- `~name = expr` desugars to `let name = expr`.
- `fn name(...) { ... }` desugars to `function name(...) { ... }`.
- `export fn name(...) { ... }` desugars to `export function name(...) { ... }`.
- Type-only TS syntax erases during normalization through the JS/TS compatibility frontend.

## 6. Static Semantics (Type System v1)
- Typechecking is flow-insensitive with lexical scopes and symbol tables.
- Inference covers:
  - literals
  - variable initializers and assignments
  - function declarations/returns
  - function call arity
  - basic operator compatibility
- Type checker emits stable diagnostic codes in `FS4101`-`FS4107`.
- Unknown or dynamic values default to `unknown` and are tracked conservatively.

## 7. Diagnostics Contract
- Diagnostics are deterministic and sorted by `(file, offset, code)`.
- A diagnostic includes:
  - `code`, `severity`, `message`, `hint`
  - primary span (`line`, `column`, `span.start`, `span.end`)
  - optional related spans
  - optional fix-it edits
- Stable error-code ranges:
  - `FS100x`: parse/language errors
  - `FS300x`: lint
  - `FS400x`: route/typecheck compatibility
  - `FS410x`: semantic type system

## 8. Runtime and Build Assumptions
- FastScript compiles `.fs` to JavaScript before bundling.
- Source maps must map generated JavaScript back to original `.fs`.
- Build/runtime loaders consume normalized JavaScript plus inline source map chaining.
- Module format is ESM.

## 9. Compatibility Contract
- FastScript v1 guarantees:
  - `.fs` files that are valid under v1 grammar compile deterministically.
  - parser/token spans remain stable for formatter/linter/conformance tests.
  - diagnostics preserve stable codes across patch releases.
- Breaking changes require a major version and migration documentation.

## 10. Conformance Requirements
- Any language change must update:
  - parser behavior tests
  - diagnostics tests
  - source-map fidelity tests
  - formatter/linter idempotence tests
  - conformance snapshots in `spec/conformance/snapshots.json`
