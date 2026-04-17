export default function DocsInterop() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Interop</p>
        <h1 class="h1">JavaScript ecosystem compatibility in practice.</h1>
        <p class="lead">FastScript v4.0 keeps <code class="ic">.fs</code> as the source of truth while still working with npm packages, mixed JS/FS modules, and incremental migration paths across frontend and backend code. The governed support matrix and interop proof suite make those claims visible instead of vague.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">What works today</p>
          <p class="docs-card-copy">ESM, CJS, dynamic import, JSON import, JS importing FS output, mixed bundles, framework package surfaces, and export-condition subpaths are all covered by the interop proof suite.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">How to adopt gradually</p>
          <p class="docs-card-copy">Keep existing JavaScript modules where needed, move route by route into <code class="ic">.fs</code>, and preserve one app boundary while you migrate.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Proof pack</p>
          <p class="docs-card-copy">The benchmark and interop evidence lives in the proof pack, while this page explains what those passing cases mean for real projects.</p>
          <a class="docs-card-link" href="/benchmarks">Open benchmarks + proof &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Interop matrix</p>
          <h2 class="h2">Current guaranteed lanes.</h2>
        </header>
        <div class="compare-table compare-table-3">
          <div class="compare-header">
            <div class="compare-col-head">Case</div>
            <div class="compare-col-head is-ours">Status</div>
            <div class="compare-col-head">Meaning</div>
          </div>
          <div class="compare-row">
            <div class="compare-cell is-label">.fs imports .fs</div>
            <div class="compare-cell is-ours"><span class="check">&#10003;</span> Supported</div>
            <div class="compare-cell">Direct native FastScript module boundaries.</div>
          </div>
          <div class="compare-row">
            <div class="compare-cell is-label">.fs imports ESM npm</div>
            <div class="compare-cell is-ours"><span class="check">&#10003;</span> Supported</div>
            <div class="compare-cell">Use standard ecosystem packages without wrappers.</div>
          </div>
          <div class="compare-row">
            <div class="compare-cell is-label">.fs imports CJS npm</div>
            <div class="compare-cell is-ours"><span class="check">&#10003;</span> Supported</div>
            <div class="compare-cell">Compatibility shims cover CommonJS packages where needed.</div>
          </div>
          <div class="compare-row">
            <div class="compare-cell is-label">JS imports compiled FS output</div>
            <div class="compare-cell is-ours"><span class="check">&#10003;</span> Supported</div>
            <div class="compare-cell">Mixed codebases can adopt FastScript incrementally.</div>
          </div>
          <div class="compare-row">
            <div class="compare-cell is-label">Dynamic import + JSON import</div>
            <div class="compare-cell is-ours"><span class="check">&#10003;</span> Supported</div>
            <div class="compare-cell">Runtime loading and asset-style module usage are part of the proof suite.</div>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Migration</p>
          <h2 class="h2">Use interop to move without a rewrite cliff.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Start with routes</p>
            <p class="docs-card-copy">Convert pages, APIs, and middleware into <code class="ic">.fs</code> first while leaving deeper JS helpers in place.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Keep libraries</p>
            <p class="docs-card-copy">Preserve npm dependencies and existing utility modules instead of replacing them during the first migration pass.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Proof before rewrite</p>
            <p class="docs-card-copy">Use the proof suite and benchmarks to verify compatibility before collapsing the remaining bridge layer.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Report a missing edge case</p>
            <p class="docs-card-copy">If valid JS/TS, a framework pattern, or a migration lane breaks in <code class="ic">.fs</code>, use the dedicated compatibility issue path so the gap is treated as product work.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Open compatibility issue &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
