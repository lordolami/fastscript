export default function Layout({content, pathname, user}) {
  return `
    <header class="nav">
      <a href="/">FastScript</a>
      <nav>
        <a href="/">Home</a>
        <a href="/docs">Docs</a>
        <a href="/learn">Learn</a>
        <a href="/examples">Examples</a>
        <a href="/changelog">Changelog</a>
        <a href="/benchmarks">Benchmarks</a>
        <a href="/showcase">Showcase</a>
        <a href="/private">Private</a>
      </nav>
      <small>${user ? "Signed in" : "Guest"}</small>
    </header>
    <main class="page">${content}</main>
    <footer class="footer">Built with FastScript • JS-first • .fs-native</footer>
  `;
}
