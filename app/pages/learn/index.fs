import { getLessonCount, getModuleStats, getModules, getResumeFallback, getSchoolStorageKey, getTrackSummary, renderModulePills } from "../../lib/learn-school.mjs";

function moduleCard(module) {
  return `
    <article class="docs-card">
      <p class="kicker">${module.level}</p>
      <p class="docs-card-title">${module.title}</p>
      <p class="docs-card-copy">${module.summary}</p>
      ${renderModulePills(module)}
      <a class="docs-card-link" href="/learn/${module.slug}">Open level &#8594;</a>
    </article>
  `;
}

export default function LearnSchoolPage() {
  const tracks = getTrackSummary().map((track) => `
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
        <p class="lead">Learn full-stack development inside FastScript through guided lessons, interactive examples, local checkpoints, and product-shaped capstones. No signup, no paywall, no hidden account system.</p>
      </header>

      <div class="docs-card-grid">${stats}</div>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">How this school works</p>
            <p class="learn-sidebar-copy">Start with the beginner track if you are brand new. Start with the professional track if you already ship TS/JS and want secure migration and production adoption. Progress stays in your browser only.</p>
            <div class="learn-progress" data-school-progress>
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-school-progress-fill></div></div>
              <p class="learn-progress-label" data-school-progress-label>0 of ${getLessonCount()} lessons completed</p>
            </div>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="${getResumeFallback()}" data-school-continue>Start the first lesson</a>
              <button type="button" class="btn btn-ghost btn-lg" data-school-reset>Reset local progress</button>
            </div>
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
              <h2 class="h2">Nine levels, one full-stack ladder.</h2>
            </header>
            <div class="docs-card-grid">${moduleCards}</div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">What mastery means</p>
              <h2 class="h2">Graduates should be able to ship real FastScript products.</h2>
            </header>
            <div class="story-grid">
              <div class="story-cell">
                <p class="story-cell-title">Beginner outcome</p>
                <p class="story-cell-copy">You understand the browser, routes, CSS, APIs, data, and shipping flow well enough to build your first complete product-shaped app in FastScript.</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Professional outcome</p>
                <p class="story-cell-copy">You can migrate TS/JS into <code class="ic">.fs</code> safely, use dry-runs and rollback, and adopt only through governed support lanes.</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Full-stack outcome</p>
                <p class="story-cell-copy">You can structure pages, APIs, middleware, jobs, CSS, persistence, QA, and deploy handoff inside one runtime boundary without guessing.</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Capstone outcome</p>
                <p class="story-cell-copy">You know when to use <code class="ic">startup-mvp</code>, when to study <code class="ic">agency-ops</code>, and how to ship with <code class="ic">validate</code>, <code class="ic">qa:all</code>, and <a class="prose-link" href="/docs/support">/docs/support</a> as your contract.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;
}

export function hydrate({ root }) {
  const storageKey = getSchoolStorageKey();
  const continueLink = root.querySelector("[data-school-continue]");
  const progressFill = root.querySelector("[data-school-progress-fill]");
  const progressLabel = root.querySelector("[data-school-progress-label]");
  const resetButton = root.querySelector("[data-school-reset]");
  const totalLessons = getLessonCount();

  const readState = () => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    } catch (_) {
      return {};
    }
  };

  const writeState = (state) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  };

  const render = () => {
    const state = readState();
    const completed = Object.values(state.lessons || {}).filter((entry) => entry && entry.complete).length;
    const percent = totalLessons ? Math.round(completed / totalLessons * 100) : 0;
    const nextHref = state.lastLesson || getResumeFallback();
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${completed} of ${totalLessons} lessons completed`;
    if (continueLink) continueLink.setAttribute("href", nextHref);
    if (continueLink) continueLink.textContent = completed > 0 ? "Resume where you left off" : "Start the first lesson";
  };

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      writeState({});
      render();
    });
  }

  render();
}
