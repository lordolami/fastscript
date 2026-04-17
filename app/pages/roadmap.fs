export default function Roadmap() {
  return `
    <div class="page-hero reveal">
      <p class="kicker">Roadmap</p>
      <h1 class="h1">Where the FastScript platform is heading next.</h1>
      <p class="page-sub">FastScript v4 locks the complete platform line. The roadmap now focuses on deepening that platform with better runtime targets, stronger operational surfaces, and broader proof-backed interoperability.</p>
    </div>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#9679; In progress - post-v4</h2>
      <div class="roadmap-list">
        <div class="roadmap-item"><div class="roadmap-status status-active">Active</div><div class="roadmap-body"><p class="roadmap-title">Streaming SSR</p><p class="roadmap-copy">Progressive response streaming for heavier routes while preserving the same FastScript route and validation model.</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-active">Active</div><div class="roadmap-body"><p class="roadmap-title">Postgres driver hardening</p><p class="roadmap-copy">Deeper parity for migrations, seeds, query helpers, and operational safety around Postgres-backed products.</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-active">Active</div><div class="roadmap-body"><p class="roadmap-title">Reference app deepening</p><p class="roadmap-copy">Expand the SaaS and ops proof apps so more platform pillars stay exercised by real product work instead of isolated tests alone.</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-active">Active</div><div class="roadmap-body"><p class="roadmap-title">Support matrix expansion</p><p class="roadmap-copy">Broaden governed proof coverage across framework patterns, SDKs, runtime targets, and ecosystem edge cases without weakening the public contract.</p></div></div>
      </div>
    </section>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#9675; Planned</h2>
      <div class="roadmap-list">
        <div class="roadmap-item"><div class="roadmap-status status-planned">Planned</div><div class="roadmap-body"><p class="roadmap-title">Edge middleware runtime</p><p class="roadmap-copy">Keep one FastScript mental model from origin to edge, starting with Cloudflare-first middleware surfaces.</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-planned">Planned</div><div class="roadmap-body"><p class="roadmap-title">Realtime and event surfaces</p><p class="roadmap-copy">Deepen first-party event and realtime patterns so product teams can keep notifications, ops dashboards, and live updates inside the same platform boundary.</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-planned">Planned</div><div class="roadmap-body"><p class="roadmap-title">Mobile and desktop targets</p><p class="roadmap-copy">Extend the platform adapter model beyond web and server so more FastScript code can move across surfaces without a rewrite cliff.</p></div></div>
      </div>
    </section>

    <section class="roadmap-section reveal">
      <h2 class="h2 roadmap-phase">&#10003; Shipped in the current platform line</h2>
      <div class="roadmap-list roadmap-done">
        <div class="roadmap-item"><div class="roadmap-status status-done">Done</div><div class="roadmap-body"><p class="roadmap-title">Ordinary TS in .fs</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-done">Done</div><div class="roadmap-body"><p class="roadmap-title">Node, Vercel, and Cloudflare deploy adapters</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-done">Done</div><div class="roadmap-body"><p class="roadmap-title">Auth, sessions, and OAuth</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-done">Done</div><div class="roadmap-body"><p class="roadmap-title">Jobs, retries, and dead-letter replay</p></div></div>
        <div class="roadmap-item"><div class="roadmap-status status-done">Done</div><div class="roadmap-body"><p class="roadmap-title">Browser-first /learn proof surface</p></div></div>
      </div>
    </section>
  `;
}
