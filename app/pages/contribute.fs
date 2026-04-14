export default function Contribute() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Community</p>
      <h1 class="h1">Contribution Guide</h1>
      <p class="page-sub">Everything you need to contribute code, docs, tests, or ideas to FastScript.</p>
    </div>

    <div class="prose-section reveal">
      <h2 class="h2">Quick start</h2>
      <div class="terminal">
        <div class="terminal-bar">
          <span class="terminal-dot-r"></span><span class="terminal-dot-y"></span><span class="terminal-dot-g"></span>
          <span class="terminal-title">setup</span>
        </div>
        <div class="terminal-body">
          <span class="t-cmt"># Fork the repo, then:</span><br>
          <span class="t-prompt">$ </span><span class="t-cmd">git clone https://github.com/YOUR_USERNAME/fastscript</span><br>
          <span class="t-prompt">$ </span><span class="t-cmd">cd fastscript &amp;&amp; npm install</span><br>
          <span class="t-prompt">$ </span><span class="t-cmd">npm run dev</span><br>
          <span class="t-out">&nbsp; ✓ dev server at http://localhost:4173</span>
        </div>
      </div>

      <h2 class="h2">Types of contributions</h2>
      <div class="feature-grid">
        <div class="feature-cell">
          <div class="feature-icon">&#128736;</div>
          <p class="feature-title">Bug fixes</p>
          <p class="feature-copy">Open an issue first to confirm the bug is reproducible, then submit a PR with a failing test case that your fix makes pass.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#127775;</div>
          <p class="feature-title">Features</p>
          <p class="feature-copy">Open a GitHub Discussion before writing code for large features. We want to align on design before you invest significant time.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#128196;</div>
          <p class="feature-title">Documentation</p>
          <p class="feature-copy">Docs live in <code class="ic">app/pages/docs/</code> as <code class="ic">.fs</code> files. Fix typos, improve examples, or add missing sections directly.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#9989;</div>
          <p class="feature-title">Tests</p>
          <p class="feature-copy">Test files live in <code class="ic">spec/</code>. We use a lightweight test runner built into the framework. Run <code class="ic">npm test</code>.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#128200;</div>
          <p class="feature-title">Benchmarks</p>
          <p class="feature-copy">Benchmark scripts are in <code class="ic">benchmarks/</code>. Reproducible numbers help us make performance decisions with confidence.</p>
        </div>
        <div class="feature-cell">
          <div class="feature-icon">&#128101;</div>
          <p class="feature-title">Community</p>
          <p class="feature-copy">Answer questions on GitHub Discussions and Discord. Good support is as valuable as code contributions.</p>
        </div>
      </div>

      <h2 class="h2">Pull request checklist</h2>
      <ul class="prose-list">
        <li>Run <code class="ic">npm run qa:all</code> &mdash; all checks must pass.</li>
        <li>Follow existing code style (no linter config changes without discussion).</li>
        <li>Add or update tests for any changed behaviour.</li>
        <li>Update <code class="ic">CHANGELOG.md</code> under the &ldquo;Unreleased&rdquo; section.</li>
        <li>Keep PRs focused &mdash; one logical change per PR.</li>
        <li>Link the related GitHub issue in your PR description.</li>
      </ul>

      <h2 class="h2">Code of conduct</h2>
      <p class="body-copy">FastScript follows the <a class="prose-link" href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/" target="_blank" rel="noreferrer">Contributor Covenant v2.1</a>. Be kind, assume good intent, and keep discussions technical and constructive.</p>

      <h2 class="h2">Getting help</h2>
      <p class="body-copy">Stuck? Open a <a class="prose-link" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">GitHub Discussion</a> or join <a class="prose-link" href="https://discord.gg/fastscript" target="_blank" rel="noreferrer">Discord</a>. Maintainers check both daily.</p>
    </div>
  `;
}


