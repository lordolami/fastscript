export default function BenchmarksPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Benchmarks and proof</p>
        <h1 class="h1">What FastScript is actually measuring.</h1>
        <p class="lead">Benchmarks are not decorative charts here. They exist to show runtime truth, compatibility coverage, proof discipline, and the current signal from the full platform universe.</p>
      </header>
      <div class="story-grid">
        <div class="story-cell"><p class="story-cell-title">Runtime and build proof</p><p class="story-cell-copy">The compiler, router, layouts, and delivery outputs must stay stable because everything else depends on them.</p></div>
        <div class="story-cell"><p class="story-cell-title">Compatibility proof</p><p class="story-cell-copy">The support matrix and interop evidence keep the full-stack platform contract honest.</p></div>
        <div class="story-cell"><p class="story-cell-title">Platform proof</p><p class="story-cell-copy">Datasets, training, runs, eval suites, readiness assessments, and proof packs show whether the AI-substrate platform is actually getting stronger.</p></div>
        <div class="story-cell"><p class="story-cell-title">Why buyers care</p><p class="story-cell-copy">Teams need repeatability, not just demos. FastScript measures whether the substrate is trustworthy enough to build on.</p></div>
      </div>
      <div class="cta-actions"><a class="btn btn-primary btn-lg" href="/platform/proof/experiment/exp_fs_repo_repair">Open a proof page</a><a class="btn btn-secondary btn-lg" href="/docs/support">Open the support matrix</a></div>
    </section>
  `;
}
