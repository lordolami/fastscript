import {getLegacySchoolStorageKey, getModule, getModuleCompletion, getSchoolStorageKey, parseSchoolState, renderModulePills, serializeSchoolState} from "../../lib/learn-school.mjs";

export async function load(ctx) {
  const module = getModule(ctx.params.module);
  if (!module) return null;
  return { module };
}

function lessonCard(module, lesson) {
  return `
    <div class="docs-card">
      <p class="kicker">${lesson.minutes} min</p>
      <p class="docs-card-title">${lesson.title}</p>
      <p class="docs-card-copy">${lesson.summary}</p>
      <p class="learn-path-note">${lesson.checkpoints.length} checkpoints</p>
      <a class="docs-card-link" href="/learn/${module.slug}/${lesson.slug}">Open lesson &#8594;</a>
    </div>
  `;
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
  const outcomes = module.outcomes.map(item => `<li>${item}</li>`).join("");
  const lessonCards = module.lessons.map(lesson => lessonCard(module, lesson)).join("");
  const firstLesson = module.lessons[0];
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
              <p class="learn-progress-label" data-module-progress-label>0 of ${module.lessons.length} lessons completed</p>
            </div>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="/learn/${module.slug}/${firstLesson.slug}">Start level</a>
              <a class="btn btn-secondary btn-lg" href="/learn/capstone">Capstone hub</a>
              <a class="btn btn-ghost btn-lg" href="/learn">Back to school</a>
            </div>
          </div>
        </aside>

        <div>
          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">What you will master</p>
              <h2 class="h2">This level now has two linked lessons: concept first, application second.</h2>
            </header>
            <div class="story-grid">
              <div class="story-cell">
                <p class="story-cell-title">Outcomes</p>
                <ul class="prose-list">${outcomes}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Lesson 1</p>
                <p class="story-cell-copy">${module.lessons[0].title}</p>
                <p class="story-cell-copy">${module.lessons[0].summary}</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Lesson 2</p>
                <p class="story-cell-copy">${module.lessons[1].title}</p>
                <p class="story-cell-copy">${module.lessons[1].summary}</p>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Why this matters</p>
                <p class="story-cell-copy">FastScript mastery means learning the concept and then applying it in one runtime boundary with pages, APIs, styling, data, and shipping discipline.</p>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Lessons</p>
              <h2 class="h2">Work through both lessons before moving to the next level.</h2>
            </header>
            <div class="docs-card-grid">${lessonCards}</div>
          </section>
        </div>
      </div>
    </section>
  `;
}

export function hydrate({root}) {
  const storageKey = getSchoolStorageKey();
  const legacyStorageKey = getLegacySchoolStorageKey();
  const moduleSlug = root.querySelector("[data-module-slug]")?.getAttribute("data-module-slug");
  const fill = root.querySelector("[data-module-progress-fill]");
  const label = root.querySelector("[data-module-progress-label]");
  if (!moduleSlug) return;
  const current = window.localStorage.getItem(storageKey);
  const legacy = current ? "" : window.localStorage.getItem(legacyStorageKey);
  const state = parseSchoolState(current || legacy || "");
  if (!current && legacy) {
    window.localStorage.setItem(storageKey, serializeSchoolState(state));
    window.localStorage.removeItem(legacyStorageKey);
  }
  const summary = getModuleCompletion(state, moduleSlug);
  if (fill) fill.style.width = `${summary.percent}%`;
  if (label) label.textContent = `${summary.completed} of ${summary.total} lessons completed`;
}
