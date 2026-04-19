import {getCompletedLessonCount, getEarnedBadgeCount, getLegacySchoolStorageKey, getLessonCount, getMasterySummary, getModuleStats, getModules, getResumeFallback, getSchoolStorageKey, getTrackSummary, parseSchoolState, renderModulePills, serializeSchoolState} from "../../lib/learn-school.mjs";
function moduleCard(module) {
  const links = module.lessons.map(lesson => `<a class="docs-card-link" href="/learn/${module.slug}/${lesson.slug}">${lesson.title} &#8594;</a>`).join("");
  return `
    <article class="docs-card" data-school-module-card data-module-slug="${module.slug}">
      <p class="kicker">${module.level}</p>
      <p class="docs-card-title">${module.title}</p>
      <p class="docs-card-copy">${module.summary}</p>
      ${renderModulePills(module)}
      <p class="learn-path-note" data-module-status>0 of ${module.lessons.length} lessons completed</p>
      ${links}
      <a class="docs-card-link" href="/learn/${module.slug}">Open module overview &#8594;</a>
    </article>
  `;
}
export default function LearnSchoolPage() {
  const tracks = getTrackSummary().map(track => `
    <div class="docs-card">
      <p class="docs-card-title">${track.title}</p>
      <p class="docs-card-copy">${track.copy}</p>
      <a class="docs-card-link" href="${track.href}">Open track &#8594;</a>
    </div>
  `).join("");
  const stats = getModuleStats().map(([title, value]) => `
    <div class="docs-card">
      <p class="kicker">${title}</p>
      <p class="h3">${value}</p>
    </div>
  `).join("");
  const moduleCards = getModules().map(moduleCard).join("");
  return `
    <section class="learn-school">
      <header class="sec-header learn-hero">
        <p class="kicker">Builders course</p>
        <h1 class="h1">Learn FastScript as an AI-system workflow substrate.</h1>
        <p class="lead">This is not a zero-to-code school anymore. /learn now teaches builders, operators, and founders how FastScript owns full-stack delivery today and how datasets, training, proof, deployments, and operations fit inside one sellable platform.</p>
      </header>

      <div class="docs-card-grid">${stats}</div>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">How the course works</p>
            <p class="learn-sidebar-copy">Start from the runtime mental model if you are new to FastScript. Jump straight into the operator modules if you already ship TS, platform, or AI product work. Progress stays in your browser unless you export it.</p>
            <div class="learn-progress" data-school-progress>
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-school-progress-fill></div></div>
              <p class="learn-progress-label" data-school-progress-label>0 of ${getLessonCount()} lessons completed</p>
            </div>
            <p class="learn-path-note" data-school-badge-count>0 badges earned</p>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="${getResumeFallback()}" data-school-continue>Resume the course</a>
              <a class="btn btn-secondary btn-lg" href="/platform">Inspect the platform</a>
              <a class="btn btn-ghost btn-lg" href="/buy">Buy FastScript</a>
              <a class="btn btn-ghost btn-lg" href="/learn/capstone">Capstone and proof hub</a>
              <a class="btn btn-ghost btn-lg" href="/learn/mastery-summary">Mastery summary</a>
              <button type="button" class="btn btn-ghost btn-lg" data-school-export>Export progress</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-import>Import progress</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-reset>Reset local progress</button>
            </div>
            <input hidden type="file" accept="application/json" data-school-import-input />
            <p class="learn-path-note" data-school-import-note>Progress export/import works entirely in your browser.</p>
          </div>
        </aside>

        <div>
          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Two entry tracks</p>
              <h2 class="h2">Start with foundations or jump into proof and operations, then unlock the real console.</h2>
            </header>
            <div class="docs-card-grid">${tracks}</div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Curriculum</p>
              <h2 class="h2">Nine modules built around product delivery, experiments, and proof.</h2>
            </header>
            <div class="docs-card-grid">${moduleCards}</div>
          </section>
        </div>
      </div>
    </section>
  `;
}
export function hydrate({root}) {
  const storageKey = getSchoolStorageKey();
  const legacyStorageKey = getLegacySchoolStorageKey();
  const progressFill = root.querySelector("[data-school-progress-fill]");
  const progressLabel = root.querySelector("[data-school-progress-label]");
  const badgeCount = root.querySelector("[data-school-badge-count]");
  const continueLink = root.querySelector("[data-school-continue]");
  const note = root.querySelector("[data-school-import-note]");
  const moduleCards = [...root.querySelectorAll("[data-school-module-card]")];
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
    anchor.download = "fastscript-builders-course-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  };
  const render = () => {
    const state = readState();
    const totalLessons = getLessonCount();
    const completed = getCompletedLessonCount(state);
    const percent = totalLessons ? Math.round(completed / totalLessons * 100) : 0;
    const summary = getMasterySummary(state);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${completed} of ${totalLessons} lessons completed`;
    if (badgeCount) badgeCount.textContent = `${getEarnedBadgeCount(state)} badges earned`;
    if (continueLink) continueLink.setAttribute("href", summary.resumeHref || getResumeFallback());
    moduleCards.forEach(card => {
      const moduleSlug = card.getAttribute("data-module-slug") || "";
      const module = getModules().find(entry => entry.slug === moduleSlug);
      const node = card.querySelector("[data-module-status]");
      if (!node || !module) return;
      const done = module.lessons.filter(lesson => summary.moduleBadges.find(badge => badge.slug === module.slug)?.earned || false).length;
      const moduleSummary = summary.moduleBadges.find(badge => badge.slug === module.slug);
      node.textContent = `${moduleSummary?.completed || 0} of ${moduleSummary?.total || module.lessons.length} lessons completed`;
    });
  };
  root.querySelector("[data-school-export]")?.addEventListener("click", () => {
    downloadProgress(readState());
    if (note) note.textContent = "Progress exported as JSON.";
  });
  root.querySelector("[data-school-reset]")?.addEventListener("click", () => {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(legacyStorageKey);
    render();
    if (note) note.textContent = "Local progress reset.";
  });
  root.querySelector("[data-school-import]")?.addEventListener("click", () => {
    root.querySelector("[data-school-import-input]")?.click();
  });
  root.querySelector("[data-school-import-input]")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const state = parseSchoolState(text);
    window.localStorage.setItem(storageKey, serializeSchoolState(state));
    render();
    if (note) note.textContent = "Progress imported.";
  });
  render();
}
