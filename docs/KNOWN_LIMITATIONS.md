# FastScript Known Limitations

- Runtime database in core server path is file-backed by default.
- CSS validation enforces token discipline for `app/styles.css` and class usage in route files; it is not a full CSS parser.
- LSP still does not perform full project-wide type analysis; it is document-centric.
- Type inference remains conservative for highly dynamic metaprogramming patterns.
