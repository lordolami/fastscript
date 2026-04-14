export default function Benchmarks() {
  return `
    <section class="bench-page">
      <header class="sec-header">
        <p class="kicker">Benchmarks</p>
        <h1 class="h1">Metrics that reflect real production pressure.</h1>
        <p class="lead">Benchmark reports are generated from build artifacts and interop checks, then packed into a proof bundle for every release signoff.</p>
      </header>

      <div class="split-section">
        <div class="split-cell">
          <p class="kicker">Bundle size budget</p>
          <h2 class="h3">First-load JS gzip comparison</h2>
          <div class="bar-chart bench-chart">
            <div class="bar-row">
              <span class="bar-label">React baseline</span>
              <div class="bar-track"><div class="bar-fill bar-w-100"></div></div>
              <span class="bar-value">142 KB</span>
            </div>
            <div class="bar-row">
              <span class="bar-label">Next app shell</span>
              <div class="bar-track"><div class="bar-fill bar-w-63"></div></div>
              <span class="bar-value">89 KB</span>
            </div>
            <div class="bar-row">
              <span class="bar-label">FastScript first load</span>
              <div class="bar-track"><div class="bar-fill is-ours bar-w-2"></div></div>
              <span class="bar-value is-ours">2.71 KB</span>
            </div>
          </div>
          <div class="highlight-box">
            <p class="highlight-box-label">FastScript wins by</p>
            <p class="highlight-box-value">52x</p>
            <p class="highlight-box-note">smaller than a 142 KB React-style baseline on the current reference build.</p>
          </div>
        </div>
        <div class="split-cell">
          <p class="kicker">Build loop speed</p>
          <h2 class="h3">Warm build time single project</h2>
          <div class="bar-chart bench-chart">
            <div class="bar-row">
              <span class="bar-label">Next webpack build</span>
              <div class="bar-track"><div class="bar-fill bar-w-100"></div></div>
              <span class="bar-value">18.0 s</span>
            </div>
            <div class="bar-row">
              <span class="bar-label">Vite + React</span>
              <div class="bar-track"><div class="bar-fill bar-w-16"></div></div>
              <span class="bar-value">2.8 s</span>
            </div>
            <div class="bar-row">
              <span class="bar-label">FastScript build</span>
              <div class="bar-track"><div class="bar-fill is-ours bar-w-6"></div></div>
              <span class="bar-value is-ours">702.98 ms</span>
            </div>
          </div>
          <div class="highlight-box">
            <p class="highlight-box-label">Measured result</p>
            <p class="highlight-box-value">25.6x</p>
            <p class="highlight-box-note">faster than the 18.0 s webpack-style baseline on the current reference run.</p>
          </div>
        </div>
      </div>

      <div class="docs-card-grid bench-method">
        <div class="docs-card">
          <p class="docs-card-title">What is measured</p>
          <p class="docs-card-copy">First-load JS/CSS gzip budgets, route counts, API route counts, and interop case pass/fail outcomes. Generated from actual build artifacts.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">How it is validated</p>
          <p class="docs-card-copy">qa:all runs test core, smoke tests, benchmark suite, interop report, proof publish, and backup verification atomically.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Current proof points</p>
          <p class="docs-card-copy">Current reference report: 702.98 ms build, 2.71 KB first-load JS gzip, 13/13 interop passing. See benchmarks/latest-report.md and benchmarks/interop-latest.json.</p>
        </div>
      </div>
    </section>

    <hr class="section-divider">

    <section class="bench-interop">
      <header class="sec-header-sm">
        <p class="kicker">Interop matrix</p>
        <h2 class="h2">13/13 ESM, CJS, .fs combinations passing.</h2>
      </header>

      <div class="compare-table compare-table-4">
        <div class="compare-header">
          <div class="compare-col-head">Combination</div>
          <div class="compare-col-head is-ours">Status</div>
          <div class="compare-col-head">Notes</div>
          <div class="compare-col-head">Mode</div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">.fs imports .fs</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Direct module boundary</div>
          <div class="compare-cell"><span class="tag">strict</span></div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">.fs imports ESM npm</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Resolved by esbuild</div>
          <div class="compare-cell"><span class="tag">strict</span></div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">.fs imports CJS npm</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Interop shim applied</div>
          <div class="compare-cell"><span class="tag">lenient</span></div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">JS imports .fs</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Compiled output consumed</div>
          <div class="compare-cell"><span class="tag">strict</span></div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Mixed bundles</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Chunked correctly</div>
          <div class="compare-cell"><span class="tag">strict</span></div>
        </div>
        <div class="compare-row">
          <div class="compare-cell is-label">Dynamic import .fs</div>
          <div class="compare-cell is-ours"><span class="check">Pass</span></div>
          <div class="compare-cell">Cache-busted URL</div>
          <div class="compare-cell"><span class="tag">strict</span></div>
        </div>
      </div>
    </section>
  `;
}
