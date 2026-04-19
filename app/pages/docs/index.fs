const ENTRY_CARDS = [["Current contract", "Read the current platform line and the AI-substrate framing that now leads the company story.", "/docs/latest"], ["Pricing", "See who FastScript is for, what it costs, and how the gated product works.", "/pricing"], ["Platform", "Inspect the public platform overview before unlocking the operator console.", "/platform"], ["Builders course", "Use /learn as the practical entrypoint for shipping with FastScript and understanding the platform center.", "/learn"]];
export default function DocsIndexPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Documentation</p>
        <h1 class="h1">Start with the product truth.</h1>
        <p class="lead">FastScript is documented first as the structured substrate for AI-system workflows, and now as a sellable startup product with public proof, a guided demo, and a clear paid operator console.</p>
      </header>

      <div class="docs-card-grid">
        ${ENTRY_CARDS.map(([title, copy, href]) => `<div class="docs-card"><p class="docs-card-title">${title}</p><p class="docs-card-copy">${copy}</p><a class="docs-card-link" href="${href}">Open &#8594;</a></div>`).join("")}
      </div>

      <section class="docs-syntax">
        <header class="sec-header-sm"><p class="kicker">Documentation map</p><h2 class="h2">Use the docs in this order.</h2></header>
        <div class="story-grid">
          <div class="story-cell"><p class="story-cell-title">1. Thesis</p><p class="story-cell-copy">Understand the AI-substrate claim and why FastScript owning the runtime matters.</p></div>
          <div class="story-cell"><p class="story-cell-title">2. Proof</p><p class="story-cell-copy">Inspect the platform, reference apps, and benchmarks to see what is already implemented.</p></div>
          <div class="story-cell"><p class="story-cell-title">3. Adoption</p><p class="story-cell-copy">Read the support, interop, and deploy guides to understand the real current contract.</p></div>
          <div class="story-cell"><p class="story-cell-title">4. Buy and build</p><p class="story-cell-copy">Use pricing and the paid checkout flow to unlock the operator system, then ship inside the same runtime boundary.</p></div>
        </div>
      </section>
    </section>
  `;
}
