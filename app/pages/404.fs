export default function NotFound({pathname}) {
  return `
    <div class="not-found">
      <p class="not-found-code">404</p>
      <h1 class="not-found-title">Page not found</h1>
      <p class="not-found-copy">The page <code class="nf-ic">${pathname || ""}</code> does not exist or has been moved.</p>
      <div class="not-found-actions">
        <a class="btn btn-primary" href="/">Go home</a>
        <a class="btn btn-ghost" href="/docs">Documentation</a>
        <a class="btn btn-ghost" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  `;
}
