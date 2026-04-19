export default function ShowcasePage() {
  return `
    <section class="docs-latest-page showcase-page">
      <header class="sec-header">
        <p class="kicker">Showcase</p>
        <h1 class="h1">Proof surfaces exercising the FastScript contract.</h1>
        <p class="lead">We are not marketing a constellation of products. We are showing the surfaces that prove FastScript already owns the substrate beneath real product work.</p>
      </header>
      <div class="docs-card-grid">
        <div class="docs-card"><p class="docs-card-title">Public website</p><p class="docs-card-copy">This site is built and shipped with FastScript, including the full platform, docs, and builders course.</p></div>
        <div class="docs-card"><p class="docs-card-title">Platform console</p><p class="docs-card-copy">The full AI-system workflow surface now lives under /platform, with the public overview leading into a gated operator product.</p><a class="docs-card-link" href="/platform">Open /platform &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Reference applications</p><p class="docs-card-copy">startup-mvp and agency-ops prove the runtime can deliver serious application work while the AI-substrate story grows from the same core.</p><a class="docs-card-link" href="/docs/adoption">Read the adoption guide &#8594;</a></div>
      </div>
    </section>
  `;
}
