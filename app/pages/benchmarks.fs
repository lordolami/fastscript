export default function Benchmarks() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">Benchmarks</p>
        <h1 class="section-title">Metrics that reflect real production pressure.</h1>
        <p class="section-copy">FastScript benchmark reports are generated from build artifacts and interop checks, then packed into a proof bundle for release signoff.</p>
      </header>

      <div class="bench-grid">
        <article class="bench-card">
          <h3 class="bench-heading">Bundle budget profile</h3>
          <div class="bar-list">
            <div class="bar-row"><span class="bar-label">React baseline</span><div class="bar-track"><span class="bar-fill bar-fill-react"></span></div><span class="bar-value">142 KB</span></div>
            <div class="bar-row"><span class="bar-label">Next app shell</span><div class="bar-track"><span class="bar-fill bar-fill-next"></span></div><span class="bar-value">89 KB</span></div>
            <div class="bar-row"><span class="bar-label">FastScript runtime</span><div class="bar-track"><span class="bar-fill bar-fill-fastscript"></span></div><span class="bar-value">1.8 KB</span></div>
          </div>
          <p class="feature-text">FastScript keeps client runtime minimal and shifts work to compile/runtime orchestration where possible.</p>
        </article>

        <article class="bench-card">
          <h3 class="bench-heading">Build loop speed</h3>
          <div class="bar-list">
            <div class="bar-row"><span class="bar-label">Next webpack build</span><div class="bar-track"><span class="bar-fill bar-fill-nextbuild"></span></div><span class="bar-value">18.0 s</span></div>
            <div class="bar-row"><span class="bar-label">Vite + React</span><div class="bar-track"><span class="bar-fill bar-fill-vite"></span></div><span class="bar-value">2.8 s</span></div>
            <div class="bar-row"><span class="bar-label">FastScript build</span><div class="bar-track"><span class="bar-fill bar-fill-fsbuild"></span></div><span class="bar-value">&lt; 1.0 s</span></div>
          </div>
          <p class="feature-text">Warm builds stay under one second on the reference machine for this website project profile.</p>
        </article>
      </div>

      <div class="docs-grid">
        <article class="docs-card">
          <h3 class="docs-title">What is measured</h3>
          <p class="docs-copy">JS/CSS gzip budgets, route counts, API route counts, and interop case pass/fail outcomes.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">How it is validated</h3>
          <p class="docs-copy">qa:all runs test core, smoke tests, benchmark suite, interop report, proof publish, and backup verification.</p>
        </article>
        <article class="docs-card">
          <h3 class="docs-title">Where to inspect</h3>
          <p class="docs-copy">See benchmarks/latest-proof-pack.md and docs/PROOF_PACK.md for release evidence.</p>
        </article>
      </div>
    </section>
  `;
}
