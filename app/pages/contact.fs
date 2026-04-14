export default function Contact() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Get in touch</p>
      <h1 class="h1">Contact &amp; Support</h1>
      <p class="page-sub">Find the right channel for your question &mdash; we monitor all of them actively.</p>
    </div>

    <div class="contact-grid reveal">
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#128172;</div>
        <p class="contact-card-title">GitHub Discussions</p>
        <p class="contact-card-copy">The best place for questions, ideas, and general conversation. Searchable and public, so your answer helps the next person too.</p>
        <a class="btn btn-secondary btn-sm" href="https://github.com/lordolami/fastscript/discussions" target="_blank" rel="noreferrer">Open a discussion &rarr;</a>
      </div>
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#128030;</div>
        <p class="contact-card-title">Bug Reports</p>
        <p class="contact-card-copy">Found a bug? Open a GitHub issue with a minimal reproduction. Include your FastScript version, OS, and Node.js version.</p>
        <a class="btn btn-secondary btn-sm" href="https://github.com/lordolami/fastscript/issues/new" target="_blank" rel="noreferrer">File an issue &rarr;</a>
      </div>
      <div class="contact-card">
        <div class="contact-card-icon" aria-hidden="true">&#127926;</div>
        <p class="contact-card-title">Discord</p>
        <p class="contact-card-copy">Live chat with the community and core team. Good for quick questions, showing off your project, or just hanging out.</p>
        <a class="btn btn-secondary btn-sm" href="https://discord.gg/fastscript" target="_blank" rel="noreferrer">Join Discord &rarr;</a>
      </div>
    </div>

    <section class="reveal">
      <header class="sec-header">
        <p class="kicker">Direct contact</p>
        <h2 class="h2">Email addresses</h2>
      </header>
      <div class="list-items">
        <div class="list-item">
          <div class="list-item-meta">
            <p class="list-item-version">Security</p>
          </div>
          <div class="list-item-body">
            <p class="list-item-copy"><a class="prose-link" href="mailto:security@fastscript.dev">security@fastscript.dev</a> &mdash; Vulnerability disclosures only. See our <a class="prose-link" href="/security">Security Policy</a>.</p>
          </div>
        </div>
        <div class="list-item">
          <div class="list-item-meta">
            <p class="list-item-version">Privacy</p>
          </div>
          <div class="list-item-body">
            <p class="list-item-copy"><a class="prose-link" href="mailto:privacy@fastscript.dev">privacy@fastscript.dev</a> &mdash; GDPR and privacy requests.</p>
          </div>
        </div>
        <div class="list-item">
          <div class="list-item-meta">
            <p class="list-item-version">Legal</p>
          </div>
          <div class="list-item-body">
            <p class="list-item-copy"><a class="prose-link" href="mailto:legal@fastscript.dev">legal@fastscript.dev</a> &mdash; Licensing, trademark, and legal inquiries.</p>
          </div>
        </div>
        <div class="list-item">
          <div class="list-item-meta">
            <p class="list-item-version">Press</p>
          </div>
          <div class="list-item-body">
            <p class="list-item-copy"><a class="prose-link" href="mailto:press@fastscript.dev">press@fastscript.dev</a> &mdash; Media kit, interviews, and partnership enquiries.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="home-cta reveal">
      <div class="cta-block">
        <h2 class="cta-title">Support policy</h2>
        <p class="cta-copy">Bug reports on the latest stable version (v2.x) receive priority. Legacy pre-stable versions are not actively maintained. Production support agreements are available for enterprise teams &mdash; contact us.</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/docs">Browse docs</a>
          <a class="btn btn-secondary btn-lg" href="/contribute">Contribution guide</a>
        </div>
      </div>
    </section>
  `;
}
