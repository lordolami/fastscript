import {getLegacySchoolStorageKey, getLessonProgress, getModule, getModuleAssessmentSummary, getModuleBadges, getModuleCompletion, getSchoolStorageKey, parseSchoolState, renderModulePills, serializeSchoolState} from "../../lib/learn-school.mjs";
export async function load(ctx) {
  const module = getModule(ctx.params.module);
  if (!module) return null;
  return {
    module
  };
}
function lessonCard(module, lesson) {
  return `
    <div class="docs-card" data-module-lesson-card data-module-lesson="${lesson.slug}">
      <p class="kicker">${lesson.minutes} min</p>
      <p class="docs-card-title">${lesson.title}</p>
      <p class="docs-card-copy">${lesson.summary}</p>
      <div class="learn-pill-row">
        <span class="learn-pill" data-module-lesson-status>Not started</span>
        <span class="learn-pill" data-module-lesson-assessments>0 / 2 assessments</span>
      </div>
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
          <a class="btn btn-primary" href="/learn">Back to builders course</a>
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
            <div class="learn-progress" data-module-assessment-progress data-module-slug="${module.slug}">
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-module-assessment-fill></div></div>
              <p class="learn-progress-label" data-module-assessment-label>0 of ${module.lessons.length * 2} assessments passed</p>
            </div>
            <p class="learn-path-note" data-module-badge-callout>Finish both lessons to earn this module badge.</p>
            <div class="cta-actions">
              <a class="btn btn-primary btn-lg" href="/learn/${module.slug}/${firstLesson.slug}">Start module</a>
              <a class="btn btn-secondary btn-lg" href="/learn/capstone">Capstone and proof hub</a>
              <a class="btn btn-ghost btn-lg" href="/learn/mastery-summary">Mastery summary</a>
              <a class="btn btn-ghost btn-lg" href="/learn">Back to builders course</a>
            </div>
          </div>
        </aside>

        <div>
          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">What you will master</p>
              <h2 class="h2">This module pairs concept work with application work.</h2>
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
                <p class="story-cell-copy">FastScript mastery means learning the concept and then applying it inside one runtime boundary with pages, APIs, proof, data, and shipping discipline.</p>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-next">
            <header class="sec-header-sm">
              <p class="kicker">Lessons</p>
              <h2 class="h2">Work through both lessons before moving to the next module.</h2>
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
  const assessmentFill = root.querySelector("[data-module-assessment-fill]");
  const assessmentLabel = root.querySelector("[data-module-assessment-label]");
  const badgeCallout = root.querySelector("[data-module-badge-callout]");
  const lessonCards = [...root.querySelectorAll("[data-module-lesson-card]")];
  if (!moduleSlug) return;
  const current = window.localStorage.getItem(storageKey);
  const legacy = current ? "" : window.localStorage.getItem(legacyStorageKey);
  const state = parseSchoolState(current || legacy || "");
  if (!current && legacy) {
    window.localStorage.setItem(storageKey, serializeSchoolState(state));
    window.localStorage.removeItem(legacyStorageKey);
  }
  const summary = getModuleCompletion(state, moduleSlug);
  const assessmentSummary = getModuleAssessmentSummary(state, moduleSlug);
  const badge = getModuleBadges(state).find(entry => entry.slug === moduleSlug);
  if (fill) fill.style.width = `${summary.percent}%`;
  if (label) label.textContent = `${summary.completed} of ${summary.total} lessons completed`;
  if (assessmentFill) assessmentFill.style.width = `${assessmentSummary.percent}%`;
  if (assessmentLabel) assessmentLabel.textContent = `${assessmentSummary.passed} of ${assessmentSummary.total} assessments passed`;
  if (badgeCallout) badgeCallout.textContent = badge?.earned ? "Module badge earned. You can move straight into the capstone path." : "Finish both lessons to earn this module badge.";
  lessonCards.forEach(card => {
    const lessonSlug = card.getAttribute("data-module-lesson") || "";
    const statusNode = card.querySelector("[data-module-lesson-status]");
    const assessmentNode = card.querySelector("[data-module-lesson-assessments]");
    const progress = getLessonProgress(state, moduleSlug, lessonSlug);
    if (!progress) return;
    if (statusNode) statusNode.textContent = progress.status === "complete" ? "Complete" : progress.status === "in-progress" ? "In progress" : "Not started";
    if (assessmentNode) assessmentNode.textContent = `${progress.passedAssessments} / ${progress.totalAssessments} assessments`;
  });
}
