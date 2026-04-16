import {getModule, getSchoolStorageKey, renderModulePills} from "../../lib/learn-school.mjs";
export async function load(ctx) {
  const module = getModule(ctx.params.module);
  if (!module) return null;
  return {
    module
  };
}
export default function LearnModulePage({module}) {
  if (!module) {
    return `
      <div class="not-found">
        <p class="not-found-code">404</p>
        <h1 class="not-found-title">Learning level not found</h1>
        <p class="not-found-copy">This level does not exist or has been moved.</p>
        <div class="not-found-actions">
          <a class="btn btn-primary" href="/learn">Back to school</a>
        </div>
      </div>
    `;
  }
  const lesson = module.lesson;
  const checkpoints = lesson.checkpoints.map(item => `<li>${item}</li>`).join("");
  const outcomes = module.outcomes.map(item => `<li>${item}</li>`).join("");
  return `
    <section class="learn-lesson-page">
      <header class="sec-header learn-lesson-top">
        <p class="kicker">${module.level}</p>
        <h1 class="h1">${module.title}</h1>
        <p class="lead">${module.summary}</p>
        ${renderModulePills(module)}
      </header>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">Level progress</p>
            <div class="learn-progress" data-module-progress data-module-slug="${module.slug}">
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-module-progress-fill></div></div>
              <p class="learn-progress-label" data-module-progress-label>Lesson not started yet</p>
            </div>
            <a class="btn btn-primary btn-lg" href="/learn/${module.slug}/${lesson.slug}">Start lesson</a>
            <a class="btn btn-ghost btn-lg" href="/learn">Back to school</a>
          </div>
        </aside>

        <div>
          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">What you will master</p>
              <h2 class="h2">This level focuses on one high-leverage learning outcome.</h2>
            </header>
            <div class="story-grid">
              <div class="story-cell">
                <p class="story-cell-title">Outcome</p>
                <ul class="prose-list">${outcomes}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Flagship lesson</p>
                <p class="story-cell-copy">${lesson.title}</p>
                <p class="story-cell-copy">${lesson.summary}</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Checkpoint focus</p>
                <ul class="prose-list">${checkpoints}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Why this matters</p>
                <p class="story-cell-copy">FastScript mastery means understanding the concept and then applying it in one runtime boundary with pages, APIs, styling, data, and shipping discipline.</p>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Lesson route</p>
              <h2 class="h2">Go hands-on with the interactive lesson.</h2>
            </header>
            <div class="docs-card-grid">
              <div class="docs-card">
                <p class="docs-card-title">${lesson.title}</p>
                <p class="docs-card-copy">${lesson.summary}</p>
                <a class="docs-card-link" href="/learn/${module.slug}/${lesson.slug}">Open lesson &#8594;</a>
              </div>
              <div class="docs-card">
                <p class="docs-card-title">Related proof apps</p>
                <p class="docs-card-copy">Connect this level back to the real product-shaped references: <code class="ic">startup-mvp</code> for greenfield flow and <code class="ic">agency-ops</code> for strict TypeScript in <code class="ic">.fs</code>.</p>
                <a class="docs-card-link" href="/docs/agency-ops">Study Agency Ops &#8594;</a>
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
  const moduleSlug = root.querySelector("[data-module-slug]")?.getAttribute("data-module-slug");
  const fill = root.querySelector("[data-module-progress-fill]");
  const label = root.querySelector("[data-module-progress-label]");
  if (!moduleSlug) return;
  let state = {};
  try {
    state = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
  } catch (_) {}
  const entry = state.lessons?.[moduleSlug];
  if (entry?.complete) {
    if (fill) fill.style.width = "100%";
    if (label) label.textContent = "Lesson completed";
  } else if (entry) {
    if (fill) fill.style.width = "50%";
    if (label) label.textContent = "Lesson started";
  } else {
    if (fill) fill.style.width = "0%";
    if (label) label.textContent = "Lesson not started yet";
  }
}
