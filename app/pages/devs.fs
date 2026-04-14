const TEAM = [{
  name: "Olamilekan Akinuli",
  role: "Founder - Product + Platform",
  copy: "Leads language design, full-stack strategy, ecosystem positioning, and production shipping cadence."
}, {
  name: "Compiler lane",
  role: "Parser + Typecheck",
  copy: "Owns route typing, diagnostics, source maps, and stability of .fs to JavaScript compilation."
}, {
  name: "Runtime lane",
  role: "Server + Deploy",
  copy: "Owns middleware, auth, storage, worker orchestration, and deploy adapters for Node/Vercel/Cloudflare."
}, {
  name: "DX lane",
  role: "Editor + Docs",
  copy: "Owns VS Code language support, documentation quality, and adoption loops for developers and AI systems."
}];
export default function DevsPage() {
  return `
    <section class="section">
      <header class="section-head">
        <p class="section-kicker">About the builders</p>
        <h1 class="section-title">Team architecture behind FastScript.</h1>
        <p class="section-copy">FastScript is built as a product system, not just a compiler experiment. Each lane ships against measurable output: test evidence, runtime parity, and deploy reliability.</p>
      </header>

      <div class="dev-grid">
        ${TEAM.map(member => `
          <article class="dev-card">
            <h3 class="dev-name">${member.name}</h3>
            <span class="dev-role">${member.role}</span>
            <p class="dev-copy">${member.copy}</p>
          </article>
        `).join("")}
      </div>

      <div class="hero-actions">
        <a class="btn btn-primary" href="/changelog">Release history</a>
        <a class="btn btn-ghost" href="https://github.com/lordolami/fastscript" target="_blank" rel="noreferrer">GitHub source</a>
      </div>
    </section>
  `;
}
