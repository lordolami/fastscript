import {getCompletedLessonCount, getLegacySchoolStorageKey, getLessonCount, getModuleCompletion, getModuleStats, getModules, getResumeFallback, getSchoolStorageKey, getTrackSummary, parseSchoolState, renderModulePills, serializeSchoolState} from "../../lib/learn-school.mjs";

function moduleCard(module) {
  const links = module.lessons.map(lesson => `
    <a class="docs-card-link" href="/learn/${module.slug}/${lesson.slug}">${lesson.title} &#8594;</a>
  `).join("");
  return `
    <article class="docs-card" data-school-module-card data-module-slug="${module.slug}">
      <p class="kicker">${module.level}</p>
      <p class="docs-card-title">${module.title}</p>
      <p class="docs-card-copy">${module.summary}</p>
      ${renderModulePills(module)}
      <p class="learn-path-note" data-module-status>0 of ${module.lessons.length} lessons completed</p>
      ${links}
      <a class="docs-card-link" href="/learn/${module.slug}">Open level overview &#8594;</a>
    </article>
  `;
}

export default function LearnSchoolPage() {
  const tracks = getTrackSummary().map(track => `
    <div class="docs-card">
      <p class="docs-card-title">${track.title}</p>
      <p class="docs-card-copy">${track.copy}</p>
      <a class="docs-card-link" href="${track.href}">Start track &#8594;</a>
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
        <p class="kicker">FastScript school</p>
        <h1 class="h1">From zero knowledge to FastScript mastery.</h1>
        <p class="lead">Learn full-stack development inside FastScript through guided lessons, interactive examples, local checkpoints, capstones, and a browser-only progress system. No signup, no paywall, no hidden account system.</p>
      </header>

      <div class="docs-card-grid">${stats}</div>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">How this school works</p>
            <p class="learn-sidebar-copy">Start with the beginner track if you are brand new. Start with the professional track if you already ship TS/JS and want secure migration and production adoption. Progress stays in your browser unless you export it.</p>
            <div class="learn-progress" data-school-progress>
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-school-progress-fill></div></div>
              <p class="learn-progress-label" data-school-progress-label>0 of ${getLessonCount()} lessons completed</p>
            </div>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="${getResumeFallback()}" data-school-continue>Start the first lesson</a>
              <a class="btn btn-secondary btn-lg" href="/learn/capstone">Open capstone hub</a>
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
              <p class="kicker">Two ways in</p>
              <h2 class="h2">Start from zero or switch from production TS/JS safely.</h2>
            </header>
            <div class="docs-card-grid">${tracks}</div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Curriculum</p>
              <h2 class="h2">Nine levels, eighteen lessons, one full-stack ladder.</h2>
            </header>
            <div class="docs-card-grid">${moduleCards}</div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Capstones</p>
              <h2 class="h2">Use the dedicated capstone hub to turn lessons into shipped work.</h2>
            </header>
            <div class="docs-card-grid">
              <div class="docs-card">
                <p class="docs-card-title">Capstone hub</p>
                <p class="docs-card-copy">Choose a capstone track, study the completion checklist, and jump directly into the best reference app for the job.</p>
                <a class="docs-card-link" href="/learn/capstone">Open capstone hub &#8594;</a>
              </div>
              <div class="docs-card">
                <p class="docs-card-title">Reference products</p>
                <p class="docs-card-copy"><code class="ic">startup-mvp</code> stays the stable greenfield baseline. <code class="ic">agency-ops</code> stays the strict TypeScript proving-ground app.</p>
                <a class="docs-card-link" href="/docs/team-dashboard-saas">Study startup-mvp &#8594;</a>
                <a class="docs-card-link" href="/docs/agency-ops">Study agency-ops &#8594;</a>
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
  const continueLink = root.querySelector("[data-school-continue]");
  const progressFill = root.querySelector("[data-school-progress-fill]");
  const progressLabel = root.querySelector("[data-school-progress-label]");
  const resetButton = root.querySelector("[data-school-reset]");
  const exportButton = root.querySelector("[data-school-export]");
  const importButton = root.querySelector("[data-school-import]");
  const importInput = root.querySelector("[data-school-import-input]");
  const importNote = root.querySelector("[data-school-import-note]");
  const totalLessons = getLessonCount();
  const moduleCards = [...root.querySelectorAll("[data-school-module-card]")];

  const writeState = state => {
    try {
      window.localStorage.setItem(storageKey, serializeSchoolState(state));
      window.localStorage.removeItem(legacyStorageKey);
    } catch (_) {}
  };
  const readState = () => {
    const current = window.localStorage.getItem(storageKey);
    const legacy = current ? "" : window.localStorage.getItem(legacyStorageKey);
    const state = parseSchoolState(current || legacy || "");
    if (!current && legacy) {
      writeState(state);
      window.localStorage.removeItem(legacyStorageKey);
    }
    return state;
  };
  const downloadProgress = state => {
    const blob = new Blob([serializeSchoolState(state)], { type: "application/json" });
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
    const completed = getCompletedLessonCount(state);
    const percent = totalLessons ? Math.round(completed / totalLessons * 100) : 0;
    const nextHref = state.lastLesson || getResumeFallback();
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${completed} of ${totalLessons} lessons completed`;
    if (continueLink) continueLink.setAttribute("href", nextHref);
    if (continueLink) continueLink.textContent = completed > 0 ? "Resume where you left off" : "Start the first lesson";
    moduleCards.forEach(card => {
      const slug = card.getAttribute("data-module-slug") || "";
      const status = card.querySelector("[data-module-status]");
      const summary = getModuleCompletion(state, slug);
      if (status) status.textContent = `${summary.completed} of ${summary.total} lessons completed`;
    });
  };

  resetButton?.addEventListener("click", () => {
    writeState(parseSchoolState(""));
    window.localStorage.removeItem(legacyStorageKey);
    if (importNote) importNote.textContent = "Local progress reset. You can start again or import a backup.";
    render();
  });
  exportButton?.addEventListener("click", () => {
    downloadProgress(readState());
    if (importNote) importNote.textContent = "Progress exported as JSON.";
  });
  importButton?.addEventListener("click", () => importInput?.click());
  importInput?.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const state = parseSchoolState(text);
      writeState(state);
      if (importNote) importNote.textContent = "Progress imported successfully.";
      render();
    } catch (_) {
      if (importNote) importNote.textContent = "Import failed. Use a progress JSON file exported from this school.";
    } finally {
      importInput.value = "";
    }
  });

  render();
}
