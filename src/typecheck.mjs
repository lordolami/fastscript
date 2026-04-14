import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { parseFastScript } from "./fs-parser.mjs";
import { resolveErrorMeta } from "./fs-error-codes.mjs";
import { inferRouteMeta, inferRouteParamTypes, sortRoutesByPriority } from "./routes.mjs";

const APP_DIR = resolve("app");
const PAGES_DIR = resolve("app/pages");
const OUT_DIR = resolve(".fastscript");
const TYPES_PATH = join(OUT_DIR, "route-params.d.ts");
const REPORT_PATH = join(OUT_DIR, "typecheck-report.json");

const T_ANY = Object.freeze({ kind: "any" });
const T_UNKNOWN = Object.freeze({ kind: "unknown" });
const T_VOID = Object.freeze({ kind: "void" });
const T_UNDEFINED = Object.freeze({ kind: "undefined" });
const T_NULL = Object.freeze({ kind: "null" });
const T_BOOLEAN = Object.freeze({ kind: "boolean" });
const T_NUMBER = Object.freeze({ kind: "number" });
const T_STRING = Object.freeze({ kind: "string" });
const T_OBJECT = Object.freeze({ kind: "object" });

let scopeCounter = 0;

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

function createLineStarts(source) {
  const text = String(source ?? "");
  const out = [0];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "\n") out.push(i + 1);
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

function spanFromNode(node, sourceLength = 0) {
  const start = Math.max(0, Math.min(sourceLength, Number(node?.fsRange?.[0] ?? node?.start ?? 0)));
  const end = Math.max(start, Math.min(sourceLength, Number(node?.fsRange?.[1] ?? node?.end ?? start)));
  return { start, end };
}

function createDiagnostic({ file, source, lineStarts, code, message, severity, hint, span, related = [] }) {
  const meta = resolveErrorMeta(code);
  const sourceLength = source.length;
  const start = Math.max(0, Math.min(sourceLength, Number(span?.start ?? 0)));
  const end = Math.max(start, Math.min(sourceLength, Number(span?.end ?? start + 1)));
  const loc = lineFromOffset(lineStarts, start);
  return {
    file,
    code,
    severity: severity || meta.severity || "error",
    message: message || meta.message,
    hint: hint || meta.hint || "",
    span: { start, end },
    line: loc.line,
    column: loc.column,
    related: related.map((entry) => {
      const relStart = Math.max(0, Math.min(sourceLength, Number(entry.span?.start ?? 0)));
      const relLoc = lineFromOffset(lineStarts, relStart);
      return {
        file: entry.file || file,
        message: entry.message || "Related location",
        line: relLoc.line,
        column: relLoc.column,
        span: {
          start: relStart,
          end: Math.max(relStart, Math.min(sourceLength, Number(entry.span?.end ?? relStart + 1))),
        },
      };
    }),
  };
}

function dedupeDiagnostics(diagnostics) {
  const seen = new Set();
  const out = [];
  for (const diagnostic of diagnostics) {
    const key = `${diagnostic.file}|${diagnostic.code}|${diagnostic.severity}|${diagnostic.message}|${diagnostic.span.start}|${diagnostic.span.end}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(diagnostic);
  }
  out.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    if (a.span.start !== b.span.start) return a.span.start - b.span.start;
    if (a.code !== b.code) return a.code.localeCompare(b.code);
    return a.message.localeCompare(b.message);
  });
  return out;
}

function makeFnType(params, returnType, minArgs = params.length, maxArgs = params.length) {
  return { kind: "function", params, returnType: returnType || T_UNKNOWN, minArgs, maxArgs };
}

function makeArrayType(elementType = T_UNKNOWN) {
  return { kind: "array", elementType };
}

function makeObjectType(properties = {}) {
  return { kind: "object", properties: { ...properties } };
}

function typeFromLiteral(value) {
  if (value === null) return T_NULL;
  if (value === undefined) return T_UNDEFINED;
  const t = typeof value;
  if (t === "string") return T_STRING;
  if (t === "number") return T_NUMBER;
  if (t === "boolean") return T_BOOLEAN;
  if (t === "bigint") return { kind: "bigint" };
  return T_UNKNOWN;
}

function typeToString(type) {
  if (!type) return "unknown";
  if (type.kind === "union") return type.types.map(typeToString).join(" | ");
  if (type.kind === "array") return `${typeToString(type.elementType)}[]`;
  if (type.kind === "object") {
    const entries = Object.entries(type.properties || {});
    if (!entries.length) return "object";
    return `{ ${entries.map(([k, v]) => `${k}: ${typeToString(v)}`).join("; ")} }`;
  }
  if (type.kind === "function") {
    return `(${type.params.map(typeToString).join(", ")}) => ${typeToString(type.returnType)}`;
  }
  return type.kind;
}

function typeEquals(a, b) {
  if (!a || !b) return false;
  if (a.kind !== b.kind) return false;
  if (a.kind === "array") return typeEquals(a.elementType, b.elementType);
  if (a.kind === "function") {
    if (a.params.length !== b.params.length) return false;
    for (let i = 0; i < a.params.length; i += 1) {
      if (!typeEquals(a.params[i], b.params[i])) return false;
    }
    return typeEquals(a.returnType, b.returnType);
  }
  if (a.kind === "object") {
    const aKeys = Object.keys(a.properties || {}).sort();
    const bKeys = Object.keys(b.properties || {}).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i += 1) {
      if (aKeys[i] !== bKeys[i]) return false;
      if (!typeEquals(a.properties[aKeys[i]], b.properties[bKeys[i]])) return false;
    }
    return true;
  }
  if (a.kind === "union") {
    if (a.types.length !== b.types.length) return false;
    return a.types.every((candidate, index) => typeEquals(candidate, b.types[index]));
  }
  return true;
}

function unionTypes(types) {
  const expanded = [];
  for (const type of types) {
    if (!type) continue;
    if (type.kind === "union") expanded.push(...type.types);
    else expanded.push(type);
  }
  if (!expanded.length) return T_UNKNOWN;
  if (expanded.some((type) => type.kind === "any")) return T_ANY;

  const unique = [];
  for (const candidate of expanded) {
    if (!unique.some((existing) => typeEquals(existing, candidate))) unique.push(candidate);
  }
  if (unique.length === 1) return unique[0];
  return { kind: "union", types: unique.sort((a, b) => typeToString(a).localeCompare(typeToString(b))) };
}

function copyType(type) {
  if (!type || typeof type !== "object") return T_UNKNOWN;
  if (type.kind === "union") return unionTypes(type.types.map(copyType));
  if (type.kind === "array") return makeArrayType(copyType(type.elementType));
  if (type.kind === "object") {
    const out = {};
    for (const [key, value] of Object.entries(type.properties || {})) out[key] = copyType(value);
    return makeObjectType(out);
  }
  if (type.kind === "function") return makeFnType(type.params.map(copyType), copyType(type.returnType), type.minArgs, type.maxArgs);
  return { ...type };
}

function isAssignable(source, target) {
  if (!source || !target) return true;
  if (source.kind === "any" || target.kind === "any") return true;
  if (source.kind === "unknown" || target.kind === "unknown") return true;
  if (target.kind === "union") return target.types.some((candidate) => isAssignable(source, candidate));
  if (source.kind === "union") return source.types.every((candidate) => isAssignable(candidate, target));
  if (source.kind === target.kind) {
    if (source.kind === "array") return isAssignable(source.elementType, target.elementType);
    if (source.kind === "object") {
      const targetProps = target.properties || {};
      const sourceProps = source.properties || {};
      for (const [key, targetType] of Object.entries(targetProps)) {
        if (!(key in sourceProps)) return false;
        if (!isAssignable(sourceProps[key], targetType)) return false;
      }
      return true;
    }
    if (source.kind === "function") {
      if (source.minArgs > target.maxArgs) return false;
      if (source.maxArgs < target.minArgs) return false;
      return isAssignable(source.returnType, target.returnType);
    }
    return true;
  }
  if (source.kind === "null" && target.kind === "object") return true;
  return false;
}

class Scope {
  constructor(parent = null, kind = "block") {
    this.id = ++scopeCounter;
    this.parent = parent;
    this.kind = kind;
    this.symbols = new Map();
  }

  declare(symbol) {
    this.symbols.set(symbol.name, symbol);
    return symbol;
  }

  lookup(name) {
    if (this.symbols.has(name)) return this.symbols.get(name);
    if (this.parent) return this.parent.lookup(name);
    return null;
  }
}

function createSymbol({ name, type, kind, mutable, span, file }) {
  return { name, type: type || T_UNKNOWN, kind, mutable, span, file };
}

function collectPatternBindings(pattern, out = []) {
  if (!pattern) return out;
  switch (pattern.type) {
    case "Identifier":
      out.push({ name: pattern.name, node: pattern });
      break;
    case "AssignmentPattern":
      collectPatternBindings(pattern.left, out);
      break;
    case "RestElement":
      collectPatternBindings(pattern.argument, out);
      break;
    case "ArrayPattern":
      for (const element of pattern.elements || []) collectPatternBindings(element, out);
      break;
    case "ObjectPattern":
      for (const property of pattern.properties || []) {
        if (property.type === "RestElement") collectPatternBindings(property.argument, out);
        else collectPatternBindings(property.value || property.key, out);
      }
      break;
    default:
      break;
  }
  return out;
}

function declareBuiltins(scope, file) {
  scope.declare(createSymbol({ name: "Number", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_NUMBER, 1, 1) }));
  scope.declare(createSymbol({ name: "String", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_STRING, 1, 1) }));
  scope.declare(createSymbol({ name: "Boolean", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_BOOLEAN, 1, 1) }));
  scope.declare(createSymbol({ name: "JSON", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "Math", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "process", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "Buffer", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "location", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "navigator", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "console", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: T_OBJECT }));
  scope.declare(createSymbol({ name: "fetch", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_UNKNOWN, 1, Number.MAX_SAFE_INTEGER) }));
  scope.declare(createSymbol({ name: "atob", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_STRING, 1, 1) }));
  scope.declare(createSymbol({ name: "btoa", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_STRING, 1, 1) }));
  scope.declare(createSymbol({ name: "encodeURIComponent", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_STRING, 1, 1) }));
  scope.declare(createSymbol({ name: "decodeURIComponent", kind: "builtin", mutable: false, span: { start: 0, end: 0 }, file, type: makeFnType([T_UNKNOWN], T_STRING, 1, 1) }));
}

function symbolSuggestion(name, scope) {
  const candidates = [];
  let cursor = scope;
  while (cursor) {
    for (const candidate of cursor.symbols.keys()) candidates.push(candidate);
    cursor = cursor.parent;
  }
  const lowered = String(name || "").toLowerCase();
  const hits = [...new Set(candidates)]
    .filter((candidate) => candidate.toLowerCase().startsWith(lowered[0] || ""))
    .slice(0, 3);
  return hits.length ? hits.join(", ") : "";
}

function reportUnknownSymbol(identifier, scope, state) {
  const span = spanFromNode(identifier, state.source.length);
  const suggestion = symbolSuggestion(identifier.name, scope);
  state.diagnostics.push(
    createDiagnostic({
      file: state.file,
      source: state.source,
      lineStarts: state.lineStarts,
      code: "FS4101",
      span,
      message: `Unknown symbol \`${identifier.name}\`.`,
      hint: suggestion ? `Did you mean: ${suggestion}` : resolveErrorMeta("FS4101").hint,
    }),
  );
}

function inferFunctionFromNode(node, scope, state) {
  const params = [];
  let required = 0;
  for (const param of node.params || []) {
    if (param.type === "AssignmentPattern") {
      params.push(T_UNKNOWN);
      continue;
    }
    required += 1;
    params.push(T_UNKNOWN);
  }

  const fnScope = new Scope(scope, "function");
  state.scopes.push(fnScope);
  for (const param of node.params || []) {
    const bindings = collectPatternBindings(param);
    for (const binding of bindings) {
      fnScope.declare(createSymbol({
        name: binding.name,
        type: T_UNKNOWN,
        kind: "param",
        mutable: true,
        span: spanFromNode(binding.node, state.source.length),
        file: state.file,
      }));
    }
  }

  const fnContext = { returns: [] };
  if (node.body?.type === "BlockStatement") {
    for (const statement of node.body.body || []) {
      analyzeStatement(statement, fnScope, state, fnContext);
    }
  } else if (node.body) {
    fnContext.returns.push(inferExpression(node.body, fnScope, state, fnContext));
  }

  const returnType = fnContext.returns.length ? unionTypes(fnContext.returns) : T_VOID;
  return makeFnType(params, returnType, required, params.length);
}

function hoistDeclarations(body, scope, state) {
  for (const statement of body || []) {
    if (statement.type === "FunctionDeclaration" && statement.id?.name) {
      scope.declare(createSymbol({
        name: statement.id.name,
        type: makeFnType(new Array(statement.params?.length || 0).fill(T_UNKNOWN), T_UNKNOWN),
        kind: "function",
        mutable: false,
        span: spanFromNode(statement.id, state.source.length),
        file: state.file,
      }));
    }

    if (statement.type === "VariableDeclaration" && statement.kind === "var") {
      for (const declaration of statement.declarations || []) {
        const bindings = collectPatternBindings(declaration.id);
        for (const binding of bindings) {
          if (scope.symbols.has(binding.name)) continue;
          scope.declare(createSymbol({
            name: binding.name,
            type: T_UNKNOWN,
            kind: "var",
            mutable: true,
            span: spanFromNode(binding.node, state.source.length),
            file: state.file,
          }));
        }
      }
    }
  }
}

function inferExpression(node, scope, state, fnContext) {
  if (!node) return T_UNKNOWN;

  switch (node.type) {
    case "Literal":
      return typeFromLiteral(node.value);
    case "TemplateLiteral":
      for (const expression of node.expressions || []) inferExpression(expression, scope, state, fnContext);
      return T_STRING;
    case "Identifier": {
      const symbol = scope.lookup(node.name);
      if (!symbol) {
        reportUnknownSymbol(node, scope, state);
        return T_UNKNOWN;
      }
      return copyType(symbol.type);
    }
    case "ArrayExpression": {
      const elementTypes = (node.elements || []).filter(Boolean).map((element) => inferExpression(element, scope, state, fnContext));
      return makeArrayType(elementTypes.length ? unionTypes(elementTypes) : T_UNKNOWN);
    }
    case "ObjectExpression": {
      const props = {};
      for (const property of node.properties || []) {
        if (property.type === "Property") {
          let keyName = null;
          if (property.computed) {
            inferExpression(property.key, scope, state, fnContext);
          } else if (property.key.type === "Identifier") {
            keyName = property.key.name;
          } else if (property.key.type === "Literal") {
            keyName = String(property.key.value);
          }
          const valueType = inferExpression(property.value, scope, state, fnContext);
          if (keyName) props[keyName] = valueType;
        }
      }
      return makeObjectType(props);
    }
    case "UnaryExpression": {
      const argType = inferExpression(node.argument, scope, state, fnContext);
      if (["+", "-", "~"].includes(node.operator)) {
        if (!isAssignable(argType, T_NUMBER)) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4107",
            span: spanFromNode(node.argument, state.source.length),
            message: `Operator \`${node.operator}\` expects a numeric operand, got ${typeToString(argType)}.`,
          }));
        }
        return T_NUMBER;
      }
      if (node.operator === "!") return T_BOOLEAN;
      if (node.operator === "typeof") return T_STRING;
      if (node.operator === "void") return T_UNDEFINED;
      return T_UNKNOWN;
    }
    case "BinaryExpression": {
      const leftType = inferExpression(node.left, scope, state, fnContext);
      const rightType = inferExpression(node.right, scope, state, fnContext);
      if (node.operator === "+") {
        if (leftType.kind === "string" || rightType.kind === "string") return T_STRING;
        if (!isAssignable(leftType, T_NUMBER) || !isAssignable(rightType, T_NUMBER)) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4107",
            span: spanFromNode(node, state.source.length),
            message: `Operator \`+\` expected number or string-compatible operands, got ${typeToString(leftType)} and ${typeToString(rightType)}.`,
          }));
        }
        return T_NUMBER;
      }
      if (["-", "*", "/", "%", "**", "<", ">", "<=", ">="].includes(node.operator)) {
        if (!isAssignable(leftType, T_NUMBER) || !isAssignable(rightType, T_NUMBER)) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4107",
            span: spanFromNode(node, state.source.length),
            message: `Operator \`${node.operator}\` requires numeric operands, got ${typeToString(leftType)} and ${typeToString(rightType)}.`,
          }));
        }
        return ["<", ">", "<=", ">="].includes(node.operator) ? T_BOOLEAN : T_NUMBER;
      }
      if (["==", "!=", "===", "!=="].includes(node.operator)) return T_BOOLEAN;
      return T_UNKNOWN;
    }
    case "LogicalExpression": {
      const leftType = inferExpression(node.left, scope, state, fnContext);
      const rightType = inferExpression(node.right, scope, state, fnContext);
      if (node.operator === "&&" || node.operator === "||" || node.operator === "??") return unionTypes([leftType, rightType]);
      return T_UNKNOWN;
    }
    case "ConditionalExpression": {
      inferExpression(node.test, scope, state, fnContext);
      return unionTypes([
        inferExpression(node.consequent, scope, state, fnContext),
        inferExpression(node.alternate, scope, state, fnContext),
      ]);
    }
    case "AssignmentExpression": {
      const valueType = inferExpression(node.right, scope, state, fnContext);
      if (node.left.type === "Identifier") {
        const symbol = scope.lookup(node.left.name);
        if (!symbol) {
          reportUnknownSymbol(node.left, scope, state);
          return valueType;
        }
        if (!symbol.mutable) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4102",
            span: spanFromNode(node.left, state.source.length),
            message: `Cannot assign to constant binding \`${node.left.name}\`.`,
            related: [{ message: `\`${node.left.name}\` was declared here.`, span: symbol.span, file: symbol.file }],
          }));
          return valueType;
        }
        if (symbol.type.kind !== "unknown" && symbol.type.kind !== "any" && !isAssignable(valueType, symbol.type)) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4103",
            span: spanFromNode(node.right, state.source.length),
            message: `Cannot assign ${typeToString(valueType)} to \`${symbol.name}\` (${typeToString(symbol.type)}).`,
            related: [{ message: `\`${symbol.name}\` declared with type ${typeToString(symbol.type)}.`, span: symbol.span, file: symbol.file }],
          }));
        } else if (symbol.type.kind === "unknown") {
          symbol.type = valueType;
        } else {
          symbol.type = unionTypes([symbol.type, valueType]);
        }
      } else if (node.left.type === "MemberExpression") {
        const objectType = inferExpression(node.left.object, scope, state, fnContext);
        const propName = !node.left.computed && node.left.property?.type === "Identifier"
          ? node.left.property.name
          : (node.left.property?.type === "Literal" ? String(node.left.property.value) : null);
        if (propName && objectType.kind === "object") {
          const current = objectType.properties[propName];
          objectType.properties[propName] = current ? unionTypes([current, valueType]) : valueType;
        } else if (objectType.kind === "array" && propName === "length" && !isAssignable(valueType, T_NUMBER)) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4103",
            span: spanFromNode(node.right, state.source.length),
            message: `Cannot assign ${typeToString(valueType)} to array length (number).`,
          }));
        }
      } else {
        inferExpression(node.left, scope, state, fnContext);
      }
      return valueType;
    }
    case "UpdateExpression": {
      if (node.argument.type === "Identifier") {
        const symbol = scope.lookup(node.argument.name);
        if (!symbol) reportUnknownSymbol(node.argument, scope, state);
        else if (!symbol.mutable) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4102",
            span: spanFromNode(node.argument, state.source.length),
            message: `Cannot update constant binding \`${node.argument.name}\`.`,
            related: [{ message: "Declared here.", span: symbol.span, file: symbol.file }],
          }));
        }
      }
      inferExpression(node.argument, scope, state, fnContext);
      return T_NUMBER;
    }
    case "CallExpression": {
      const argTypes = (node.arguments || []).map((arg) => inferExpression(arg, scope, state, fnContext));
      if (node.callee?.type === "MemberExpression") {
        const objectType = inferExpression(node.callee.object, scope, state, fnContext);
        const propName = !node.callee.computed && node.callee.property?.type === "Identifier"
          ? node.callee.property.name
          : (node.callee.property?.type === "Literal" ? String(node.callee.property.value) : null);
        if (objectType.kind === "array" && propName) {
          if (propName === "push") {
            for (let i = 0; i < argTypes.length; i += 1) {
              if (!isAssignable(argTypes[i], objectType.elementType)) {
                state.diagnostics.push(createDiagnostic({
                  file: state.file,
                  source: state.source,
                  lineStarts: state.lineStarts,
                  code: "FS4103",
                  span: spanFromNode(node.arguments[i], state.source.length),
                  message: `Array push expects ${typeToString(objectType.elementType)}, got ${typeToString(argTypes[i])}.`,
                }));
              }
            }
            return T_NUMBER;
          }
          if (propName === "map") return makeArrayType(T_UNKNOWN);
          if (propName === "filter") return makeArrayType(objectType.elementType);
          if (propName === "slice") return makeArrayType(objectType.elementType);
          if (propName === "join") return T_STRING;
          if (propName === "includes") return T_BOOLEAN;
          if (propName === "pop") return unionTypes([objectType.elementType, T_UNDEFINED]);
        }
      }
      const calleeType = inferExpression(node.callee, scope, state, fnContext);
      if (calleeType.kind !== "function") {
        if (calleeType.kind !== "unknown" && calleeType.kind !== "any") {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4106",
            span: spanFromNode(node.callee, state.source.length),
            message: `Attempted to call value of type ${typeToString(calleeType)}.`,
          }));
        }
        return T_UNKNOWN;
      }
      if (argTypes.length < calleeType.minArgs || argTypes.length > calleeType.maxArgs) {
        const expected = calleeType.minArgs === calleeType.maxArgs ? `${calleeType.minArgs}` : `${calleeType.minArgs}-${calleeType.maxArgs}`;
        state.diagnostics.push(createDiagnostic({
          file: state.file,
          source: state.source,
          lineStarts: state.lineStarts,
          code: "FS4104",
          span: spanFromNode(node, state.source.length),
          message: `Expected ${expected} argument(s), got ${argTypes.length}.`,
        }));
      }
      for (let i = 0; i < Math.min(argTypes.length, calleeType.params.length); i += 1) {
        if (!isAssignable(argTypes[i], calleeType.params[i])) {
          state.diagnostics.push(createDiagnostic({
            file: state.file,
            source: state.source,
            lineStarts: state.lineStarts,
            code: "FS4103",
            span: spanFromNode(node.arguments[i], state.source.length),
            message: `Argument ${i + 1} expects ${typeToString(calleeType.params[i])}, got ${typeToString(argTypes[i])}.`,
          }));
        }
      }
      return copyType(calleeType.returnType);
    }
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      return inferFunctionFromNode(node, scope, state);
    case "MemberExpression":
      {
        const objectType = inferExpression(node.object, scope, state, fnContext);
        if (node.computed) {
          const propType = inferExpression(node.property, scope, state, fnContext);
          if (objectType.kind === "array" && isAssignable(propType, T_NUMBER)) return objectType.elementType;
          return T_UNKNOWN;
        }
        const propName = node.property?.type === "Identifier" ? node.property.name : null;
        if (!propName) return T_UNKNOWN;
        if (objectType.kind === "array") {
          if (propName === "length") return T_NUMBER;
          return T_UNKNOWN;
        }
        if (objectType.kind === "string" && propName === "length") return T_NUMBER;
        if (objectType.kind === "object" && objectType.properties?.[propName]) {
          return copyType(objectType.properties[propName]);
        }
        return T_UNKNOWN;
      }
    case "AwaitExpression":
      return inferExpression(node.argument, scope, state, fnContext);
    case "NewExpression":
      inferExpression(node.callee, scope, state, fnContext);
      for (const arg of node.arguments || []) inferExpression(arg, scope, state, fnContext);
      return T_OBJECT;
    case "SequenceExpression":
      if (!node.expressions?.length) return T_UNKNOWN;
      for (let i = 0; i < node.expressions.length - 1; i += 1) inferExpression(node.expressions[i], scope, state, fnContext);
      return inferExpression(node.expressions[node.expressions.length - 1], scope, state, fnContext);
    case "ChainExpression":
      return inferExpression(node.expression, scope, state, fnContext);
    default:
      return T_UNKNOWN;
  }
}

function analyzeVariableDeclaration(node, scope, state, fnContext) {
  for (const declaration of node.declarations || []) {
    const initType = declaration.init ? inferExpression(declaration.init, scope, state, fnContext) : T_UNKNOWN;
    const bindings = collectPatternBindings(declaration.id);
    for (const binding of bindings) {
      const existing = node.kind === "var" ? scope.lookup(binding.name) : scope.symbols.get(binding.name);
      if (existing && node.kind !== "var") {
        existing.type = unionTypes([existing.type, initType]);
        continue;
      }
      scope.declare(createSymbol({
        name: binding.name,
        type: initType,
        kind: node.kind,
        mutable: node.kind !== "const",
        span: spanFromNode(binding.node, state.source.length),
        file: state.file,
      }));
    }
  }
}

function analyzeStatement(node, scope, state, fnContext) {
  if (!node) return;
  switch (node.type) {
    case "BlockStatement": {
      const blockScope = new Scope(scope, "block");
      state.scopes.push(blockScope);
      for (const statement of node.body || []) analyzeStatement(statement, blockScope, state, fnContext);
      break;
    }
    case "VariableDeclaration":
      analyzeVariableDeclaration(node, scope, state, fnContext);
      break;
    case "ExpressionStatement":
      inferExpression(node.expression, scope, state, fnContext);
      break;
    case "ReturnStatement":
      if (fnContext) {
        const returnType = node.argument ? inferExpression(node.argument, scope, state, fnContext) : T_VOID;
        fnContext.returns.push(returnType);
      }
      break;
    case "IfStatement":
      inferExpression(node.test, scope, state, fnContext);
      analyzeStatement(node.consequent, new Scope(scope, "if"), state, fnContext);
      if (node.alternate) analyzeStatement(node.alternate, new Scope(scope, "else"), state, fnContext);
      break;
    case "ForStatement": {
      const forScope = new Scope(scope, "for");
      state.scopes.push(forScope);
      if (node.init) {
        if (node.init.type === "VariableDeclaration") analyzeVariableDeclaration(node.init, forScope, state, fnContext);
        else inferExpression(node.init, forScope, state, fnContext);
      }
      if (node.test) inferExpression(node.test, forScope, state, fnContext);
      if (node.update) inferExpression(node.update, forScope, state, fnContext);
      analyzeStatement(node.body, forScope, state, fnContext);
      break;
    }
    case "ForInStatement":
    case "ForOfStatement": {
      const forScope = new Scope(scope, "for");
      state.scopes.push(forScope);
      if (node.left?.type === "VariableDeclaration") analyzeVariableDeclaration(node.left, forScope, state, fnContext);
      else if (node.left) inferExpression(node.left, forScope, state, fnContext);
      inferExpression(node.right, forScope, state, fnContext);
      analyzeStatement(node.body, forScope, state, fnContext);
      break;
    }
    case "WhileStatement":
    case "DoWhileStatement":
      inferExpression(node.test, scope, state, fnContext);
      analyzeStatement(node.body, new Scope(scope, "loop"), state, fnContext);
      break;
    case "FunctionDeclaration": {
      if (node.id?.name) {
        const symbol = scope.lookup(node.id.name) || scope.declare(createSymbol({
          name: node.id.name,
          type: T_UNKNOWN,
          kind: "function",
          mutable: false,
          span: spanFromNode(node.id, state.source.length),
          file: state.file,
        }));
        symbol.type = inferFunctionFromNode(node, scope, state);
      } else {
        inferFunctionFromNode(node, scope, state);
      }
      break;
    }
    case "ImportDeclaration":
      for (const specifier of node.specifiers || []) {
        const local = specifier.local;
        if (!local?.name) continue;
        scope.declare(createSymbol({
          name: local.name,
          type: T_UNKNOWN,
          kind: "import",
          mutable: false,
          span: spanFromNode(local, state.source.length),
          file: state.file,
        }));
      }
      break;
    case "ExportNamedDeclaration":
    case "ExportDefaultDeclaration":
      if (node.declaration) analyzeStatement(node.declaration, scope, state, fnContext);
      break;
    case "SwitchStatement":
      inferExpression(node.discriminant, scope, state, fnContext);
      for (const switchCase of node.cases || []) {
        if (switchCase.test) inferExpression(switchCase.test, scope, state, fnContext);
        for (const statement of switchCase.consequent || []) analyzeStatement(statement, new Scope(scope, "switch"), state, fnContext);
      }
      break;
    case "TryStatement":
      analyzeStatement(node.block, new Scope(scope, "try"), state, fnContext);
      if (node.handler) {
        const catchScope = new Scope(scope, "catch");
        state.scopes.push(catchScope);
        if (node.handler.param?.type === "Identifier") {
          catchScope.declare(createSymbol({
            name: node.handler.param.name,
            type: T_UNKNOWN,
            kind: "catch",
            mutable: true,
            span: spanFromNode(node.handler.param, state.source.length),
            file: state.file,
          }));
        }
        analyzeStatement(node.handler.body, catchScope, state, fnContext);
      }
      if (node.finalizer) analyzeStatement(node.finalizer, new Scope(scope, "finally"), state, fnContext);
      break;
    case "ThrowStatement":
      if (node.argument) inferExpression(node.argument, scope, state, fnContext);
      break;
    case "ClassDeclaration":
      if (node.id?.name) {
        scope.declare(createSymbol({
          name: node.id.name,
          type: T_OBJECT,
          kind: "class",
          mutable: false,
          span: spanFromNode(node.id, state.source.length),
          file: state.file,
        }));
      }
      break;
    default:
      break;
  }
}

function analyzeFileTypes(file, source) {
  const lineStarts = createLineStarts(source);
  const parsed = parseFastScript(source, { file, mode: "lenient", recover: true });
  const diagnostics = [...parsed.diagnostics];

  if (!parsed.estree || !Array.isArray(parsed.estree.body)) {
    return { file, diagnostics, scopes: [], symbols: [], astVersion: parsed.version };
  }

  scopeCounter = 0;
  const rootScope = new Scope(null, "module");
  const state = { file, source, lineStarts, diagnostics, scopes: [rootScope] };

  declareBuiltins(rootScope, file);
  hoistDeclarations(parsed.estree.body, rootScope, state);
  for (const statement of parsed.estree.body) analyzeStatement(statement, rootScope, state, null);

  const symbols = [];
  for (const scope of state.scopes) {
    for (const symbol of scope.symbols.values()) {
      symbols.push({
        scopeId: scope.id,
        scopeKind: scope.kind,
        name: symbol.name,
        kind: symbol.kind,
        mutable: symbol.mutable,
        type: typeToString(symbol.type),
        span: symbol.span,
      });
    }
  }

  return {
    file,
    diagnostics: dedupeDiagnostics(state.diagnostics),
    scopes: state.scopes.map((scope) => ({
      id: scope.id,
      kind: scope.kind,
      parentId: scope.parent?.id || null,
      symbols: [...scope.symbols.values()].map((symbol) => ({
        name: symbol.name,
        kind: symbol.kind,
        mutable: symbol.mutable,
        type: typeToString(symbol.type),
        span: symbol.span,
      })),
    })),
    symbols,
    astVersion: parsed.version,
  };
}

function buildTypeFile(routes) {
  const lines = [];
  lines.push("/* auto-generated by fastscript typecheck */");
  lines.push("export type FastScriptRouteParams = {");
  for (const route of routes) {
    const params = inferRouteParamTypes(route.routePath, route.paramTypes);
    const body = Object.keys(params).length
      ? `{ ${Object.entries(params).map(([k, v]) => `${k}: ${v}`).join("; ")} }`
      : "{}";
    lines.push(`  \"${route.routePath}\": ${body};`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export type FastScriptRouteLoaderData = {");
  for (const route of routes) {
    lines.push(`  \"${route.routePath}\": ${route.loaderDataType || "{}"};`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export type FastScriptRouteContext<P extends keyof FastScriptRouteParams = keyof FastScriptRouteParams> = {");
  lines.push("  path: P;");
  lines.push("  params: FastScriptRouteParams[P];");
  lines.push("  data: FastScriptRouteLoaderData[P];");
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

function routeConflicts(routes) {
  const seen = new Map();
  const conflicts = [];
  for (const route of routes) {
    const key = `${route.routePath}|${route.slot || "default"}`;
    const previous = seen.get(key);
    if (previous) {
      conflicts.push({
        code: "FS4001",
        severity: "error",
        message: `Duplicate route mapping: ${route.routePath} (${route.slot || "default"})`,
        file: route.file,
        line: 1,
        column: 1,
        span: { start: 0, end: 1 },
        related: [{ file: previous.file, line: 1, column: 1, message: "First route declared here.", span: { start: 0, end: 1 } }],
      });
    } else {
      seen.set(key, route);
    }
  }
  return conflicts;
}

function usageHints(routes) {
  const hints = [];
  for (const route of routes) {
    let source = "";
    try {
      source = readFileSync(route.file, "utf8");
    } catch {
      source = "";
    }
    for (const param of route.params) {
      if (source.includes(`params.${param}`)) continue;
      hints.push({
        code: "FS4002",
        severity: "warning",
        message: `Route param \`${param}\` is declared but not referenced in ${route.file}.`,
        file: route.file,
        line: 1,
        column: 1,
        span: { start: 0, end: 1 },
        related: [],
      });
    }
  }
  return hints;
}

function mergePropertyType(map, key, type) {
  const existing = map[key];
  if (!existing) {
    map[key] = type;
    return;
  }
  if (existing === type) return;
  const left = existing.split("|").map((part) => part.trim()).filter(Boolean);
  const right = String(type).split("|").map((part) => part.trim()).filter(Boolean);
  map[key] = [...new Set([...left, ...right])].sort().join(" | ");
}

function astTypeLiteral(node) {
  if (!node) return "unknown";
  switch (node.type) {
    case "Literal":
      if (node.value === null) return "null";
      if (typeof node.value === "string") return "string";
      if (typeof node.value === "number") return "number";
      if (typeof node.value === "boolean") return "boolean";
      return "unknown";
    case "TemplateLiteral":
      return "string";
    case "ArrayExpression": {
      const itemTypes = (node.elements || []).filter(Boolean).map((entry) => astTypeLiteral(entry));
      const unique = [...new Set(itemTypes)];
      return `${(unique.length ? unique.join(" | ") : "unknown")}[]`;
    }
    case "ObjectExpression": {
      const props = [];
      for (const property of node.properties || []) {
        if (property.type !== "Property") continue;
        let key = null;
        if (!property.computed && property.key?.type === "Identifier") key = property.key.name;
        else if (property.key?.type === "Literal") key = String(property.key.value);
        if (!key) continue;
        props.push(`${key}: ${astTypeLiteral(property.value)}`);
      }
      if (!props.length) return "{}";
      return `{ ${props.join("; ")} }`;
    }
    case "Identifier":
      if (node.name === "undefined") return "undefined";
      return "unknown";
    case "UnaryExpression":
      if (node.operator === "!") return "boolean";
      if (node.operator === "typeof") return "string";
      if (["+", "-", "~"].includes(node.operator)) return "number";
      return astTypeLiteral(node.argument);
    case "BinaryExpression":
      if (["==", "!=", "===", "!==", "<", ">", "<=", ">="].includes(node.operator)) return "boolean";
      if (node.operator === "+" && (astTypeLiteral(node.left) === "string" || astTypeLiteral(node.right) === "string")) return "string";
      return "number";
    case "LogicalExpression":
      return `${astTypeLiteral(node.left)} | ${astTypeLiteral(node.right)}`;
    case "ConditionalExpression":
      return `${astTypeLiteral(node.consequent)} | ${astTypeLiteral(node.alternate)}`;
    case "ArrowFunctionExpression":
    case "FunctionExpression":
      return "function";
    case "NewExpression":
      return "object";
    default:
      return "unknown";
  }
}

function collectReturnObjects(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (node.type === "ReturnStatement" && node.argument?.type === "ObjectExpression") {
    out.push(node.argument);
  }
  for (const value of Object.values(node)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const entry of value) collectReturnObjects(entry, out);
    } else if (typeof value === "object") {
      collectReturnObjects(value, out);
    }
  }
  return out;
}

function inferRouteLoaderDataShape(file) {
  let source = "";
  try {
    source = readFileSync(file, "utf8");
  } catch {
    return { hasLoader: false, typeLiteral: "unknown", fields: {} };
  }

  let ast = null;
  try {
    ast = parseFastScript(source, { file, mode: "lenient", recover: true });
  } catch {
    return { hasLoader: false, typeLiteral: "unknown", fields: {} };
  }

  const body = ast?.estree?.body || [];
  let loadNode = null;
  for (const node of body) {
    if (node.type === "ExportNamedDeclaration") {
      const decl = node.declaration;
      if (decl?.type === "FunctionDeclaration" && decl.id?.name === "load") {
        loadNode = decl;
        break;
      }
      if (decl?.type === "VariableDeclaration") {
        for (const entry of decl.declarations || []) {
          if (entry.id?.type === "Identifier" && entry.id.name === "load" && entry.init && ["ArrowFunctionExpression", "FunctionExpression"].includes(entry.init.type)) {
            loadNode = entry.init;
            break;
          }
        }
      }
    }
    if (node.type === "FunctionDeclaration" && node.id?.name === "load") {
      loadNode = node;
      break;
    }
  }

  if (!loadNode) return { hasLoader: false, typeLiteral: "{}", fields: {} };

  const returns = collectReturnObjects(loadNode.body || loadNode, []);
  if (!returns.length) return { hasLoader: true, typeLiteral: "unknown", fields: {} };

  const fields = {};
  for (const objectNode of returns) {
    for (const property of objectNode.properties || []) {
      if (property.type !== "Property") continue;
      let key = null;
      if (!property.computed && property.key?.type === "Identifier") key = property.key.name;
      else if (property.key?.type === "Literal") key = String(property.key.value);
      if (!key) continue;
      mergePropertyType(fields, key, astTypeLiteral(property.value));
    }
  }

  const entries = Object.entries(fields);
  if (!entries.length) return { hasLoader: true, typeLiteral: "{}", fields };
  const typeLiteral = `{ ${entries.map(([key, value]) => `${key}: ${value}`).join("; ")} }`;
  return { hasLoader: true, typeLiteral, fields };
}

function formatTypeDiagnostic(diagnostic) {
  const path = diagnostic.file || "<memory>";
  const base = `${path}:${diagnostic.line || 1}:${diagnostic.column || 1} ${diagnostic.code} ${diagnostic.severity || "error"} ${diagnostic.message}`;
  const hint = diagnostic.hint ? ` hint=${diagnostic.hint}` : "";
  const related = (diagnostic.related || [])
    .map((entry) => ` related=${entry.file}:${entry.line}:${entry.column} ${entry.message}`)
    .join("");
  return `${base}${hint}${related}`;
}

function parseArgs(args) {
  const out = { mode: "fail", path: APP_DIR };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--mode") out.mode = (args[i + 1] || out.mode).toLowerCase();
    if (args[i] === "--path") out.path = resolve(args[i + 1] || out.path);
  }
  return out;
}

function summarizeSeverity(diagnostics) {
  const summary = { error: 0, warning: 0 };
  for (const diagnostic of diagnostics) {
    if (diagnostic.severity === "warning") summary.warning += 1;
    else summary.error += 1;
  }
  return summary;
}

export async function runTypeCheck(args = []) {
  const options = parseArgs(args);
  if (!existsSync(options.path)) {
    throw new Error(`Missing typecheck path: ${options.path}`);
  }

  const files = walk(options.path).filter((file) => extname(file) === ".fs");
  const fileReports = [];
  const diagnostics = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const report = analyzeFileTypes(file, source);
    fileReports.push(report);
    diagnostics.push(...report.diagnostics);
  }

  const candidatePagesDir = join(options.path, "pages");
  const pagesDir = existsSync(candidatePagesDir) ? candidatePagesDir : PAGES_DIR;
  const pageFiles = walk(pagesDir).filter((file) => [".fs", ".js"].includes(extname(file)));
  const routes = pageFiles
    .filter((file) => !file.endsWith("_layout.fs") && !file.endsWith("_layout.js"))
    .filter((file) => !file.endsWith("404.fs") && !file.endsWith("404.js"))
    .map((file) => {
      const route = inferRouteMeta(file, pagesDir);
      const loader = inferRouteLoaderDataShape(file);
      return {
        ...route,
        hasLoader: loader.hasLoader,
        loaderDataType: loader.typeLiteral,
        loaderDataFields: loader.fields,
      };
    });

  const sortedRoutes = sortRoutesByPriority(routes.map((route) => ({ ...route, path: route.routePath })))
    .map((route) => ({ ...route, routePath: route.path }));

  diagnostics.push(...routeConflicts(sortedRoutes), ...usageHints(sortedRoutes));
  const dedupedDiagnostics = dedupeDiagnostics(diagnostics);
  const severity = summarizeSeverity(dedupedDiagnostics);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(TYPES_PATH, buildTypeFile(sortedRoutes), "utf8");

  const report = {
    mode: options.mode,
    generatedAt: new Date().toISOString(),
    files: fileReports,
    routes: sortedRoutes,
    diagnostics: dedupedDiagnostics,
    summary: {
      files: files.length,
      routeCount: sortedRoutes.length,
      errors: severity.error,
      warnings: severity.warning,
    },
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  for (const diagnostic of dedupedDiagnostics) {
    console.log(formatTypeDiagnostic(diagnostic));
  }

  if (severity.error > 0 && options.mode !== "pass") {
    const error = new Error(`typecheck failed: ${severity.error} error(s), ${severity.warning} warning(s)`);
    error.status = 1;
    error.details = dedupedDiagnostics;
    throw error;
  }

  console.log(`typecheck complete: files=${files.length}, routes=${sortedRoutes.length}, errors=${severity.error}, warnings=${severity.warning}, mode=${options.mode}`);
}
