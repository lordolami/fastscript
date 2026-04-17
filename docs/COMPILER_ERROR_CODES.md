# FastScript Compiler Error Codes

## Parse + Compiler

- `FS1001`: Invalid reactive declaration (`~name = expression` expected).
- `FS1002`: Invalid state declaration (`state name = expression` expected).
- `FS1003`: Invalid function declaration (`fn name(...)` expected).
- `FS1004`: Reserved legacy compatibility code for runtime/frontend type-surface conflicts. Current JS/TS-compatible `.fs` parsing should not emit this for ordinary `type`/`interface`/`enum` usage.
- `FS1005`: Parse error.
- `FS1006`: Invalid identifier.
- `FS1010`: Unterminated token.
- `FS1101`: Unsupported directive.

## Lint

- `FS3002`: `var` declaration warning.
- `FS3003`: Inline script warning.
- `FS3004`: Binding can be `const`.

## Typecheck + Semantics

- `FS4001`: Duplicate route mapping.
- `FS4002`: Route param not referenced.
- `FS4101`: Unknown symbol.
- `FS4102`: Assignment/update to immutable binding.
- `FS4103`: Type mismatch.
- `FS4104`: Function argument count mismatch.
- `FS4105`: Return type mismatch.
- `FS4106`: Non-callable value invoked.
- `FS4107`: Invalid operator operand types.
- `FS4201`: Symbol used outside available runtime context.

## Modes

- `strict`: warnings and errors are reported; errors fail compilation.
- `lenient`: compiler recovers where possible; warnings do not fail build.
