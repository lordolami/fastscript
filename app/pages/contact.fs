export default function ContactPage() {
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Contact</p>
        <h1 class="h1">Talk to the FastScript team about adoption, proof, or the platform direction.</h1>
        <p class="lead">Use contact channels when you need help evaluating the current runtime contract, the full platform, or the broader AI-substrate roadmap.</p>
      </header>
      <div class="docs-card-grid">
        <div class="docs-card"><p class="docs-card-title">Product and adoption</p><p class="docs-card-copy">Use this lane for launch feedback, adoption help, or questions about how the shipped platform maps to the broader FastScript universe.</p><a class="docs-card-link" href="mailto:hello@fastscript.dev">hello@fastscript.dev &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Security</p><p class="docs-card-copy">Use the security lane for disclosure and operational concerns tied to the runtime contract.</p><a class="docs-card-link" href="/security">Open security page &#8594;</a></div>
        <div class="docs-card"><p class="docs-card-title">Source and issues</p><p class="docs-card-copy">The public repo remains the best place to inspect code, proof surfaces, and compatibility issues.</p><a class="docs-card-link" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">Open GitHub &#8594;</a></div>
      </div>
    </section>
  `;
}
