# FastScript Known Limitations

- `vercel` and `cloudflare` deploy targets are starter adapters and require review before production.
- Runtime database in core server path is file-backed by default.
- CSS validation enforces token discipline for `app/styles.css` and class usage in route files; it is not a full CSS parser.
- LSP support is basic and focused on starter diagnostics.
- Router does not currently implement nested layout segments beyond global `_layout`.
- Type inference is intentionally conservative and flow-insensitive in v1 (`unknown` is used for dynamic cases).
