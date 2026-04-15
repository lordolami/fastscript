export default function DocsV3() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Current line v3</p>
        <h1 class="h1">FastScript v3</h1>
        <p class="lead">FastScript v3 positions <code class="ic">.fs</code> as a universal JS/TS container for the FastScript runtime, with optional FastScript sugar, full-stack frontend/backend usage, and proof-backed speed claims.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Public compatibility contract</p>
          <p class="docs-card-copy">Write normal JS, TS, JSX, and TSX in <code class="ic">.fs</code>. If valid JS/TS fails in <code class="ic">.fs</code>, that is a FastScript compatibility bug.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/FASTSCRIPT_COMPATIBILITY_FIRST_RUNTIME_SPEC.md" target="_blank" rel="noreferrer">Open compatibility spec &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Language baseline</p>
          <p class="docs-card-copy">The stable language spec now describes <code class="ic">.fs</code> as a JS/TS-first source container with optional <code class="ic">fn</code>, <code class="ic">state</code>, and <code class="ic">~</code> sugar.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/spec/LANGUAGE_V1_SPEC.md" target="_blank" rel="noreferrer">Open language spec &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Proof-backed speed</p>
          <p class="docs-card-copy">Current public proof pack reports 702.98ms builds, 2.71KB first-load JS gzip, and 13/13 interop passing, alongside JS/TS parity artifacts.</p>
          <a class="docs-card-link" href="/benchmarks">Open benchmarks &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Parity artifacts</p>
          <p class="docs-card-copy">Release proof now includes JS/TS syntax proof and <code class="ic">.fs</code> parity matrices so the public website and release process tell the same story.</p>
          <a class="docs-card-link" href="https://github.com/lordolami/fastscript/blob/main/benchmarks/latest-proof-pack.md" target="_blank" rel="noreferrer">Open proof pack &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Developer adoption guide</p>
          <p class="docs-card-copy">Read the full developer story: how FastScript fits JS/TS workflows, how to migrate existing code, and why teams adopt it across frontend and backend work.</p>
          <a class="docs-card-link" href="/why-fastscript">Open guide &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">What v3 means</p>
          <h2 class="h2">The current public promise.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Universal JS/TS container</p>
            <p class="docs-card-copy"><code class="ic">.fs</code> is the runtime-native container, not a demand that teams abandon normal JavaScript or TypeScript habits.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Optional sugar</p>
            <p class="docs-card-copy">FastScript-specific forms are still supported, but they are optional. Standard JS/TS authoring is first-class in v3 messaging and proof.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Speed through the toolchain</p>
            <p class="docs-card-copy">FastScript wins on page speed and build speed through the runtime, compiler, and execution model, not by rewriting the developer's identity.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Frontend + backend together</p>
            <p class="docs-card-copy">Use FastScript for pages, APIs, middleware, jobs, and deploy adapters in one runtime instead of treating it like a thin syntax wrapper on top of another framework.</p>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Historical tracks remain</p>
            <p class="docs-card-copy">v1, v1.1, and v2 remain available for historical reference, ratification history, and earlier migration context.</p>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Need an edge case?</p>
          <h2 class="h2">Compatibility gaps are public product work.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Open a compatibility issue</p>
            <p class="docs-card-copy">If valid JS/TS or a real framework pattern fails in <code class="ic">.fs</code>, report it through the public compatibility lane with a source snippet and reproduction details.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Report compatibility gap &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">Talk through an edge case</p>
            <p class="docs-card-copy">Use Discussions when the edge case needs design clarification, migration help, or framework-specific context before it turns into implementation work.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Open discussion &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
