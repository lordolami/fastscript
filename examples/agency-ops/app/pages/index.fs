import { getAgencyOpsConfig } from "../lib/agency.fs";

function card(title, copy) {
  return `
    <section class="list-card">
      <h3>${title}</h3>
      <p>${copy}</p>
    </section>
  `;
}

export default function Home() {
  const config = getAgencyOpsConfig();
  return `
    <section class="agency-hero">
      <div class="saas-chip">Internal product track · ${config.appName}</div>
      <div class="hero-grid">
        <section class="list-card">
          <p class="detail-label">Strict TypeScript in .fs</p>
          <h1>Run client operations, retainers, billing, and support follow-up in one runtime.</h1>
          <p>This app is authored in normal TypeScript inside <code>.fs</code> files so the product story is simple: the filename changes, not the language you write every day.</p>
          <p class="mini-note">Primary region: ${config.primaryRegion} · Support contact: ${config.supportEmail}</p>
          <div class="inline-actions">
            <a class="btn-inline" href="/sign-in">Create agency</a>
            <a class="btn-inline btn-secondary" href="/dashboard">Open dashboard</a>
          </div>
        </section>
        <section class="list-card">
          <p class="detail-label">What it proves</p>
          <div class="detail-list">
            <div><div class="detail-label">Frontend</div><div class="detail-value">Marketing + agency dashboard routes</div></div>
            <div><div class="detail-label">Backend</div><div class="detail-value">Agency, clients, billing, work-item, and notification APIs</div></div>
            <div><div class="detail-label">Jobs</div><div class="detail-value">Invoice receipts and ops follow-up queue flow</div></div>
            <div><div class="detail-label">Deploy</div><div class="detail-value">Cloudflare-ready adapter generation + custom Node/container handoff</div></div>
          </div>
        </section>
      </div>
      <div class="metric-grid">
        ${card("Clients + retainers", "Seeded client records, engagement status, and monthly retainer value live inside one app boundary.")}
        ${card("Team workload", "Invite strategists, operators, and finance teammates without leaving the same runtime contract.")}
        ${card("Ops visibility", "Track invoices, work items, queued jobs, and follow-up actions from the same product dashboard.")}
      </div>
    </section>
  `;
}

