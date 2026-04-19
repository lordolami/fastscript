import {getCapstonePresets, getLegacySchoolStorageKey, getMasterySummary, getPrintableCapstonePlan, getResumeFallback, getSchoolStorageKey, parseSchoolState, serializeSchoolState} from "../../lib/learn-school.mjs";
function badgeCard(badge) {
  return `
    <article class="docs-card">
      <p class="kicker">${badge.level}</p>
      <p class="docs-card-title">${badge.title}</p>
      <p class="docs-card-copy">${badge.earned ? "Badge earned" : `${badge.completed} of ${badge.total} lessons complete`}</p>
    </article>
  `;
}
export default function LearnMasterySummaryPage() {
  return `
    <section class="learn-school">
      <header class="sec-header learn-hero">
        <p class="kicker">Mastery summary</p>
        <h1 class="h1">Print or export your FastScript progress.</h1>
        <p class="lead">See completed modules, earned badges, your next capstone, and the lesson to resume next, all from local browser state.</p>
      </header>

      <div class="docs-card-grid" data-school-summary-stats>
        <div class="docs-card">
          <p class="kicker">Lessons</p>
          <p class="h3" data-school-summary-lessons>0 / 0</p>
        </div>
        <div class="docs-card">
          <p class="kicker">Assessments</p>
          <p class="h3" data-school-summary-assessments>0 / 0</p>
        </div>
        <div class="docs-card">
          <p class="kicker">Badges</p>
          <p class="h3" data-school-summary-badges>0 / 0</p>
        </div>
        <div class="docs-card">
          <p class="kicker">Proof track</p>
          <p class="h3" data-school-summary-capstone>Loading…</p>
        </div>
      </div>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">Actions</p>
            <p class="learn-sidebar-copy">Keep this browser-only summary as a printable build record and next-step guide.</p>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="/learn" data-school-summary-resume>Resume learning</a>
              <a class="btn btn-secondary btn-lg" href="/learn/capstone" data-school-summary-capstone-link>Open capstone hub</a>
              <button type="button" class="btn btn-ghost btn-lg" data-school-summary-print>Print summary</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-summary-print-capstone>Print capstone plan</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-summary-export>Export progress JSON</button>
            </div>
            <p class="learn-path-note" data-school-summary-note>No account needed. Everything stays in this browser unless you export it yourself.</p>
          </div>
        </aside>

        <div>
          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Badges</p>
              <h2 class="h2">Earn one badge per module and one mastery badge at the end.</h2>
            </header>
            <div class="docs-card-grid" data-school-summary-badge-grid></div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Next move</p>
              <h2 class="h2">Turn your progress into the right capstone plan.</h2>
            </header>
            <div class="docs-card-grid">
              <div class="docs-card">
                <p class="docs-card-title">Recommended preset</p>
                <p class="docs-card-copy" data-school-summary-preset>Loading…</p>
              </div>
              <div class="docs-card">
                <p class="docs-card-title">Resume lesson</p>
                <p class="docs-card-copy" data-school-summary-resume-copy>Loading…</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;
}
export function hydrate({root}) {
  const storageKey = getSchoolStorageKey();
  const legacyStorageKey = getLegacySchoolStorageKey();
  const lessonStat = root.querySelector("[data-school-summary-lessons]");
  const assessmentStat = root.querySelector("[data-school-summary-assessments]");
  const badgeStat = root.querySelector("[data-school-summary-badges]");
  const capstoneStat = root.querySelector("[data-school-summary-capstone]");
  const badgeGrid = root.querySelector("[data-school-summary-badge-grid]");
  const presetCopy = root.querySelector("[data-school-summary-preset]");
  const resumeCopy = root.querySelector("[data-school-summary-resume-copy]");
  const resumeLink = root.querySelector("[data-school-summary-resume]");
  const capstoneLink = root.querySelector("[data-school-summary-capstone-link]");
  const printButton = root.querySelector("[data-school-summary-print]");
  const printCapstoneButton = root.querySelector("[data-school-summary-print-capstone]");
  const exportButton = root.querySelector("[data-school-summary-export]");
  const note = root.querySelector("[data-school-summary-note]");
  const readState = () => {
    const current = window.localStorage.getItem(storageKey);
    const legacy = current ? "" : window.localStorage.getItem(legacyStorageKey);
    const state = parseSchoolState(current || legacy || "");
    if (!current && legacy) {
      window.localStorage.setItem(storageKey, serializeSchoolState(state));
      window.localStorage.removeItem(legacyStorageKey);
    }
    return state;
  };
  const downloadProgress = state => {
    const blob = new Blob([serializeSchoolState(state)], {
      type: "application/json"
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "fastscript-school-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  };
  const render = () => {
    const state = readState();
    const summary = getMasterySummary(state);
    const presets = getCapstonePresets();
    const preset = presets.find(entry => entry.slug === summary.recommendedPreset) || presets[0];
    if (lessonStat) lessonStat.textContent = `${summary.completedLessons} / ${summary.totalLessons}`;
    if (assessmentStat) assessmentStat.textContent = `${summary.assessmentCount} / ${summary.totalAssessments}`;
    if (badgeStat) badgeStat.textContent = `${summary.earnedBadges + (summary.masteryBadgeEarned ? 1 : 0)} / ${summary.totalBadges}`;
    if (capstoneStat) capstoneStat.textContent = summary.recommendedCapstone;
    if (badgeGrid) {
      const masteryCard = `
        <article class="docs-card">
          <p class="kicker">Final badge</p>
          <p class="docs-card-title">FastScript mastery</p>
          <p class="docs-card-copy">${summary.masteryBadgeEarned ? "Badge earned" : "Finish every module to unlock the mastery badge."}</p>
        </article>
      `;
      badgeGrid.innerHTML = `${summary.moduleBadges.map(badgeCard).join("")}${masteryCard}`;
    }
    if (presetCopy) presetCopy.textContent = `${preset.title}: ${preset.copy}`;
    if (resumeCopy) resumeCopy.textContent = `Resume from ${summary.resumeHref || getResumeFallback()} and move into ${summary.recommendedCapstone}.`;
    if (resumeLink) resumeLink.setAttribute("href", summary.resumeHref || getResumeFallback());
    if (capstoneLink) capstoneLink.setAttribute("href", `/learn/capstone#${summary.recommendedPreset}`);
  };
  printButton?.addEventListener("click", () => {
    window.print();
  });
  printCapstoneButton?.addEventListener("click", () => {
    const plan = getPrintableCapstonePlan(readState());
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) {
      if (note) note.textContent = "Pop-up blocked. Allow pop-ups to print the capstone plan.";
      return;
    }
    popup.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${plan.presetTitle} capstone plan</title>
    <style>
      body { font-family: Georgia, serif; margin: 40px; color: #111; line-height: 1.5; }
      h1, h2 { margin-bottom: 12px; }
      p, li { font-size: 16px; }
      ul { padding-left: 20px; }
      .meta { margin-bottom: 24px; }
    </style>
  </head>
  <body>
    <h1>${plan.presetTitle}</h1>
    <div>
      <p><strong>Recommended capstone:</strong> ${plan.capstoneTitle}</p>
      <p><strong>Recommended baseline:</strong> ${plan.recommendedBaseline}</p>
      <p><strong>Proof command:</strong> ${plan.proofCommand}</p>
      <p><strong>Resume lesson:</strong> ${plan.resumeHref}</p>
    </div>
    <h2>Plan summary</h2>
    <p>${plan.summary}</p>
    <h2>Checklist</h2>
    <ul>${plan.checklist.map(item => `<li>${item}</li>`).join("")}</ul>
  </body>
</html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  });
  exportButton?.addEventListener("click", () => {
    downloadProgress(readState());
    if (note) note.textContent = "Progress exported as JSON.";
  });
  render();
}
