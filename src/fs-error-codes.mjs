export const FS_ERROR_CODES = Object.freeze({
  FS1001: {
    severity: "error",
    message: "Invalid reactive declaration.",
    hint: "Reactive declarations must be `~name = expression`.",
  },
  FS1002: {
    severity: "error",
    message: "Invalid state declaration.",
    hint: "State declarations must be `state name = expression`.",
  },
  FS1003: {
    severity: "error",
    message: "Invalid function declaration.",
    hint: "Function declarations must use `fn name(...) { ... }` or `export fn ...`.",
  },
  FS1004: {
    severity: "error",
    message: "Type declarations are not valid runtime FastScript syntax.",
    hint: "Move `type`, `interface`, and `enum` definitions to `.d.ts` files or remove them from `.fs` files.",
  },
  FS1005: {
    severity: "error",
    message: "FastScript parse error.",
    hint: "Check punctuation and statement structure near the reported location.",
  },
  FS1006: {
    severity: "error",
    message: "Invalid identifier.",
    hint: "Identifiers must start with a letter, `_`, or `$`.",
  },
  FS1007: {
    severity: "warning",
    message: "Suspicious `TODO_ERROR` token found.",
    hint: "Remove placeholder tokens before shipping.",
  },
  FS1010: {
    severity: "error",
    message: "Unterminated token.",
    hint: "Close the string, template, regex, or comment that starts near this location.",
  },
  FS1101: {
    severity: "warning",
    message: "Unsupported language directive.",
    hint: "Use directives listed in the FastScript language specification.",
  },
  FS2001: {
    severity: "warning",
    message: "Prefer `const` when a binding is never reassigned.",
    hint: "Use lint autofix to rewrite `let` to `const` when safe.",
  },
  FS2002: {
    severity: "warning",
    message: "Avoid inline `<script>` tags in templates.",
    hint: "Move script behavior into module functions or hydration handlers.",
  },
  FS3001: {
    severity: "error",
    message: "`TODO_ERROR` token is not allowed in committed code.",
    hint: "Delete placeholder tokens before merging.",
  },
  FS3002: {
    severity: "warning",
    message: "`var` is discouraged in FastScript modules.",
    hint: "Replace `var` with `let` or `const`.",
  },
  FS3003: {
    severity: "warning",
    message: "Inline `<script>` tag detected in template literal.",
    hint: "Use external module code instead of embedding scripts in markup strings.",
  },
  FS3004: {
    severity: "warning",
    message: "Binding can be `const`.",
    hint: "Apply the autofix to preserve intent and reduce accidental reassignment.",
  },
  FS4001: {
    severity: "error",
    message: "Duplicate route mapping detected.",
    hint: "Ensure each route path+slot pair is unique.",
  },
  FS4002: {
    severity: "warning",
    message: "Route param is declared but not referenced.",
    hint: "Use `params.<name>` or remove the dynamic segment.",
  },
  FS4101: {
    severity: "error",
    message: "Unknown symbol.",
    hint: "Declare the symbol before use or import it from another module.",
  },
  FS4102: {
    severity: "error",
    message: "Cannot reassign `const` binding.",
    hint: "Change the declaration to `let` or remove the assignment.",
  },
  FS4103: {
    severity: "error",
    message: "Type mismatch in assignment.",
    hint: "Align assigned expression type with the declared/inferred variable type.",
  },
  FS4104: {
    severity: "error",
    message: "Incorrect function argument count.",
    hint: "Pass the required number of arguments or update the function signature.",
  },
  FS4105: {
    severity: "error",
    message: "Incompatible return type.",
    hint: "Ensure all return paths in the function resolve to compatible types.",
  },
  FS4106: {
    severity: "error",
    message: "Attempted to call a non-function value.",
    hint: "Ensure the callee resolves to a function.",
  },
  FS4107: {
    severity: "error",
    message: "Invalid operand types for operator.",
    hint: "Use operands compatible with the operator semantics.",
  },
});

export function resolveErrorMeta(code) {
  return FS_ERROR_CODES[code] || { severity: "error", message: "FastScript compiler error." };
}
