export default function NotFound({pathname}) {
  return `
    <section class="not-found">
      <p class="not-code">404</p>
      <h1 class="not-title">That route is not part of this FastScript app.</h1>
      <p class="not-copy">No matching file exists under <code>app/pages</code> for <code>${pathname || "/unknown"}</code>.</p>
      <div class="not-links">
        <a class="btn btn-primary" href="/">Back home</a>
        <a class="btn btn-ghost" href="/docs">Open docs</a>
        <a class="btn btn-outline" href="/showcase">View showcase</a>
      </div>
    </section>
  `;
}
