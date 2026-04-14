export default function DocsV1() {
  return `
    <section class="docs-v1-page">
      <header class="sec-header">
        <p class="kicker">Language spec v1</p>
        <h1 class="h1">FastScript Language v1 Specification.</h1>
        <p class="lead">Defines the grammar, desugaring rules, diagnostic contracts, and stability guarantees for the first stable FastScript baseline.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Grammar + declarations</p>
          <p class="docs-card-copy">Three new declaration forms on top of ESM: fn, state, and ~. All compile to standard JavaScript with no runtime cost.</p>
          <a class="docs-card-link" href="/learn">See quickstart &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Diagnostic codes</p>
          <p class="docs-card-copy">All compiler diagnostics use stable, versioned codes in the FS1000-FS9999 range. Stable across patch releases.</p>
          <a class="docs-card-link" href="/benchmarks">View proof pack &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Formatter contract</p>
          <p class="docs-card-copy">Formatter output is idempotent and stable. Running the formatter twice always produces the same result.</p>
          <a class="docs-card-link" href="/docs/v1.1">See v1.1 additions &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Core syntax</p>
          <h2 class="h2">Three new forms. Everything else is ESM.</h2>
        </header>
        <div class="code-pair">
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">source.fs</span>
              <span class="code-block-lang">.fs</span>
            </div>
            <div class="code-block-body"><span class="code-kw">state</span> count = 0
<span class="code-fs">~</span>doubled = count * 2
<span class="code-fn">fn</span> <span class="code-fn">increment</span>() { count += 1 }
<span class="code-kw">export</span> <span class="code-fn">fn</span> <span class="code-fn">load</span>(ctx) {
  <span class="code-kw">return</span> ctx.db.get(<span class="code-str">"data"</span>)
}</div>
          </div>
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-file">compiled.js</span>
              <span class="code-block-lang">.js</span>
            </div>
            <div class="code-block-body"><span class="code-kw">let</span> count = 0
<span class="code-kw">let</span> doubled = count * 2
<span class="code-kw">function</span> <span class="code-fn">increment</span>() { count += 1 }
<span class="code-kw">export</span> <span class="code-kw">function</span> <span class="code-fn">load</span>(ctx) {
  <span class="code-kw">return</span> ctx.db.get(<span class="code-str">"data"</span>)
}</div>
          </div>
        </div>
      </section>
    </section>
  `;
}
