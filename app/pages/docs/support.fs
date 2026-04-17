import {COMPATIBILITY_REPORT} from "../../../src/generated/compatibility-registry-report.mjs";
const CATEGORY_LABELS = {
  "ecmascript": "ECMAScript Syntax",
  "typescript": "TypeScript Syntax Erasure",
  "jsx-tsx": "JSX / TSX",
  "fastscript-sugar": "FastScript Sugar",
  "modules-interop": "Modules And Interop",
  "runtime-targets": "Runtime Targets",
  "framework-patterns": "Framework Patterns",
  "tooling": "Tooling",
  "deployment-adapters": "Deployment Adapters"
};
const CATEGORY_ORDER = ["ecmascript", "typescript", "jsx-tsx", "fastscript-sugar", "modules-interop", "runtime-targets", "framework-patterns", "tooling", "deployment-adapters"];
function proofPreview(entry) {
  const ids = (entry.proofIds || []).slice(0, 3);
  if (!ids.length) return "No linked proof yet.";
  const list = ids.map(id => id.replace(/^artifact:/, "").replace(/^script:/, "script:")).join(", ");
  return ids.length < (entry.proofIds || []).length ? `${list}, ...` : list;
}
export default function DocsSupportPage() {
  const report = COMPATIBILITY_REPORT || ({
    summary: {
      byStatus: {}
    },
    entries: [],
    stableLine: "4.0.x",
    governanceTrack: "4.0",
    contract: ""
  });
  return `
    <section class="docs-latest-page">
      <header class="sec-header">
        <p class="kicker">Compatibility matrix</p>
        <h1 class="h1">One governed source of truth for what FastScript proves.</h1>
        <p class="lead">FastScript ${report.governanceTrack} treats <code class="ic">proven</code> as a release-blocking claim. This page is generated from the compatibility registry and linked proof artifacts, and the current 4.0.x line ships that governed matrix publicly.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Current stable line</p>
          <p class="docs-card-copy"><code class="ic">${report.stableLine}</code> remains the active public stable line, and the compatibility system is now part of the current platform contract instead of a future promise.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Registry scale</p>
          <p class="docs-card-copy">${report.summary?.entries || 0} entries, ${(report.summary?.byStatus || ({})).proven || 0} marked <code class="ic">proven</code>, all tied to CI-visible proof across syntax, frameworks, runtime targets, tooling, and npm/package interop.</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Product contract</p>
          <p class="docs-card-copy">${report.contract}</p>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Workflow rule</p>
          <p class="docs-card-copy">Every accepted compatibility bug should map to a matrix row. Every fix should add proof. Anything unresolved stays visible as partial, planned, or blocked.</p>
        </div>
      </div>

      ${CATEGORY_ORDER.map(category => {
    const items = (report.entries || []).filter(entry => entry.category === category);
    if (!items.length) return "";
    return `
          <section class="docs-syntax">
            <header class="sec-header-sm">
              <p class="kicker">${CATEGORY_LABELS[category] || category}</p>
            </header>
            <div class="docs-card-grid">
              ${items.map(entry => `
                <div class="docs-card">
                  <p class="docs-card-title">${entry.feature}</p>
                  <p class="docs-card-copy"><strong>Status:</strong> ${entry.status}</p>
                  <p class="docs-card-copy">${entry.docsNote || entry.contractNote}</p>
                  <p class="docs-card-copy"><strong>Proof:</strong> ${proofPreview(entry)}</p>
                </div>
              `).join("")}
            </div>
          </section>
        `;
  }).join("")}

      <section class="docs-syntax">
        <header class="sec-header-sm">
          <p class="kicker">Compatibility lane</p>
          <h2 class="h2">Missing valid JS/TS coverage is product work.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card">
            <p class="docs-card-title">Report a compatibility gap</p>
            <p class="docs-card-copy">Use the public issue template with the source snippet, expected behavior, framework/runtime context, and exact reproduction steps.</p>
            <a class="docs-card-link" href="https://github.com/lordolami/fastscript/issues/new?template=compatibility-gap.yml" target="_blank" rel="noreferrer">Open compatibility lane &#8594;</a>
          </div>
          <div class="docs-card">
            <p class="docs-card-title">See release proof</p>
            <p class="docs-card-copy">The support matrix, proof pack, and registry artifact are generated from the same governed source for release discipline.</p>
            <a class="docs-card-link" href="/benchmarks">Open proof pack &#8594;</a>
          </div>
        </div>
      </section>
    </section>
  `;
}
