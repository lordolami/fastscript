import {getLegacySchoolStorageKey, getLesson, getLessonKey, getPrevNext, getSchoolStorageKey, parseSchoolState, renderLessonResources, renderModulePills, serializeSchoolState} from "../../../lib/learn-school.mjs";

function codeCard(title, code) {
  return `
    <div class="code-block">
      <div class="code-block-head">
        <span class="code-block-file">${title}</span>
        <span class="code-block-lang">lesson</span>
      </div>
      <pre class="code-block-body">${String(code).replace(/</g, "&lt;")}</pre>
    </div>
  `;
}

function checklist(lesson) {
  return lesson.checkpoints.map((item, index) => `
    <div class="learn-check" data-school-check-row>
      <button type="button" class="learn-check-btn" data-school-check="${index}" aria-pressed="false">Mark</button>
      <p class="learn-check-copy">${item}</p>
    </div>
  `).join("");
}

function cardList(items) {
  return items.map(item => `<li>${item}</li>`).join("");
}

export async function load(ctx) {
  const result = getLesson(ctx.params.module, ctx.params.lesson);
  if (!result) return null;
  return {
    module: result.module,
    lesson: result.lesson,
    nav: getPrevNext(ctx.params.module, ctx.params.lesson)
  };
}

export default function LearnLessonPage({module, lesson, nav}) {
  if (!module || !lesson) {
    return `
      <div class="not-found">
        <p class="not-found-code">404</p>
        <h1 class="not-found-title">Lesson not found</h1>
        <p class="not-found-copy">This lesson does not exist or has been moved.</p>
        <div class="not-found-actions">
          <a class="btn btn-primary" href="/learn">Back to school</a>
        </div>
      </div>
    `;
  }
  const prevHref = nav.prev ? `/learn/${nav.prev.moduleSlug}/${nav.prev.slug}` : `/learn/${module.slug}`;
  const nextHref = nav.next ? `/learn/${nav.next.moduleSlug}/${nav.next.slug}` : "/learn/capstone";
  const prevLabel = nav.prev ? nav.prev.title : "Back to level";
  const nextLabel = nav.next ? nav.next.title : "Capstone hub";
  const lessonKey = getLessonKey(module.slug, lesson.slug);
  return `
    <section class="learn-lesson-page">
      <header class="sec-header learn-lesson-top">
        <p class="kicker">${module.level}</p>
        <h1 class="h1">${lesson.title}</h1>
        <p class="lead">${lesson.summary}</p>
        ${renderModulePills(module)}
        <div class="cta-actions">
          <a class="btn btn-ghost btn-lg" href="/learn/${module.slug}">&larr; ${module.title}</a>
          <a class="btn btn-secondary btn-lg" href="${nextHref}">Next: ${nextLabel}</a>
        </div>
      </header>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">Lesson progress</p>
            <div class="learn-progress">
              <div class="learn-progress-bar"><div class="learn-progress-fill" data-school-lesson-fill></div></div>
              <p class="learn-progress-label" data-school-lesson-label>Work through the checkpoints below.</p>
            </div>
            <div class="cta-actions">
              <button type="button" class="btn btn-primary btn-lg" data-school-complete>Mark lesson complete</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-reset>Reset lesson</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-share>Share this lesson</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-export>Export progress</button>
              <button type="button" class="btn btn-ghost btn-lg" data-school-import>Import progress</button>
            </div>
            <input hidden type="file" accept="application/json" data-school-import-input />
            <p class="learn-path-note" data-school-portability-note>This lesson stores progress locally in your browser. No account is required.</p>
          </div>
        </aside>

        <div>
          <section class="learn-lesson-section">
            <header class="sec-header-sm">
              <p class="kicker">Core ideas</p>
              <h2 class="h2">What this lesson is teaching you</h2>
            </header>
            <div class="story-grid">
              <div class="story-cell">
                <p class="story-cell-title">Concepts</p>
                <ul class="prose-list">${cardList(lesson.concepts)}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Common mistakes</p>
                <ul class="prose-list">${cardList(lesson.mistakes)}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Real app use</p>
                <ul class="prose-list">${cardList(lesson.realUse)}</ul>
              </div>
              <div class="story-cell">
                <p class="story-cell-title">Time</p>
                <p class="story-cell-copy">About ${lesson.minutes} minutes for the main lesson, plus extra time if you expand the exercise.</p>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-lesson-section">
            <header class="sec-header-sm">
              <p class="kicker">Worked example</p>
              <h2 class="h2">Study the pattern before you change it.</h2>
            </header>
            <div class="code-pair">
              ${codeCard(lesson.workedExample.title, lesson.workedExample.code)}
              ${codeCard("What to notice", lesson.concepts.map((entry, index) => `${index + 1}. ${entry}`).join("\n"))}
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-lesson-section">
            <header class="sec-header-sm">
              <p class="kicker">Interactive lab</p>
              <h2 class="h2">Try the lesson in your browser.</h2>
            </header>
            <p class="body-copy">${lesson.exercise.prompt}</p>
            <div class="playground-wrap" data-school-lab data-school-lesson-key="${lessonKey}" data-school-last="/learn/${module.slug}/${lesson.slug}">
              <div class="playground-head">
                <span class="playground-head-title">${lesson.exercise.title}</span>
                <div class="pg-example-row">
                  <button type="button" class="btn btn-ghost btn-sm" data-school-load="starter">Starter</button>
                  <button type="button" class="btn btn-ghost btn-sm" data-school-load="reference">Reference</button>
                </div>
              </div>
              <textarea hidden data-school-reference>${lesson.exercise.reference}</textarea>
              <textarea class="playground-editor" data-school-input spellcheck="false">${lesson.exercise.starter}</textarea>
              <div class="playground-sep"></div>
              <div class="playground-output" data-school-output></div>
              <div class="playground-actions">
                <button type="button" class="btn btn-primary btn-sm" data-school-run>Preview &rarr;</button>
                <button type="button" class="btn btn-ghost btn-sm" data-school-restore>Restore starter</button>
                <span class="playground-note">This preview is browser-only and meant to build intuition fast.</span>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-lesson-section">
            <header class="sec-header-sm">
              <p class="kicker">Checkpoint</p>
              <h2 class="h2">Do not leave the lesson until these are true.</h2>
            </header>
            <div class="learn-checklist">${checklist(lesson)}</div>
            <div class="docs-card" data-school-complete-banner hidden>
              <p class="docs-card-title">Lesson completed</p>
              <p class="learn-callout-copy">You have finished this lesson locally. Keep going while the concepts are still fresh.</p>
              <div class="cta-actions">
                <a class="btn btn-secondary btn-lg" href="${prevHref}">&larr; ${prevLabel}</a>
                <a class="btn btn-primary btn-lg" href="${nextHref}">${nextLabel} &#8594;</a>
              </div>
            </div>
          </section>

          <hr class="section-divider">

          <section class="learn-lesson-section">
            <header class="sec-header-sm">
              <p class="kicker">Keep going</p>
              <h2 class="h2">Use these references as you build.</h2>
            </header>
            <div class="docs-card-grid">
              <div class="docs-card">
                <p class="docs-card-title">Support contract</p>
                <p class="docs-card-copy">Specific framework, deployment, and infrastructure lanes still belong to the governed compatibility story.</p>
                <a class="docs-card-link" href="/docs/support">Open support matrix &#8594;</a>
              </div>
              <div class="docs-card">
                <p class="docs-card-title">Reference links</p>
                <p class="docs-card-copy">Move from the lesson into the most relevant docs and proof apps.</p>
                ${renderLessonResources(lesson)}
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
  const lab = root.querySelector("[data-school-lab]");
  const input = root.querySelector("[data-school-input]");
  const output = root.querySelector("[data-school-output]");
  const fill = root.querySelector("[data-school-lesson-fill]");
  const label = root.querySelector("[data-school-lesson-label]");
  const completeButton = root.querySelector("[data-school-complete]");
  const resetButton = root.querySelector("[data-school-reset]");
  const completeBanner = root.querySelector("[data-school-complete-banner]");
  const shareButton = root.querySelector("[data-school-share]");
  const exportButton = root.querySelector("[data-school-export]");
  const importButton = root.querySelector("[data-school-import]");
  const importInput = root.querySelector("[data-school-import-input]");
  const portabilityNote = root.querySelector("[data-school-portability-note]");
  const lessonKey = lab?.getAttribute("data-school-lesson-key");
  const lastLesson = lab?.getAttribute("data-school-last");
  const checks = [...root.querySelectorAll("[data-school-check]")];
  const starter = input ? input.value : "";
  const reference = root.querySelector("[data-school-reference]")?.value || starter;

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
  const compileSnippet = source => {
    let compiled = String(source || "").trim();
    compiled = compiled.replace(/^(\s*)~\s*(\w+)\s*=/gm, "$1let $2 =");
    compiled = compiled.replace(/^(\s*)state\s+(\w+)\s*=/gm, "$1let $2 =");
    compiled = compiled.replace(/\bfn\s+(\w+)\s*\(/g, "function $1(");
    const notes = [];
    if ((/export default function/).test(source)) notes.push("Strict JS/TS-in-.fs page authoring detected.");
    if ((/load\(ctx\)|ctx\.params|ctx\.pathname/).test(source)) notes.push("Route or loader contract detected.");
    if ((/POST\(ctx|h\.json|\/api\//).test(source)) notes.push("API mutation pattern detected.");
    if ((/ctx\.db|db:migrate|DATABASE_URL|seed/i).test(source)) notes.push("Persistence or deployment thinking detected.");
    if (!notes.length) notes.push("FastScript accepts ordinary JS/TS in .fs and optional sugar where useful.");
    return `// lesson preview\n${compiled}\n\n// what this teaches\n${notes.map(item => `- ${item}`).join("\n")}`;
  };
  const exportState = state => {
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
  const updateVisualState = () => {
    const state = readState();
    const lessonState = state.lessons?.[lessonKey] || { checks: [], complete: false };
    const doneCount = lessonState.checks.filter(Boolean).length;
    const total = checks.length || 1;
    const percent = lessonState.complete ? 100 : Math.round(doneCount / total * 100);
    checks.forEach((button, index) => {
      const active = Boolean(lessonState.checks[index]);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.textContent = active ? "Done" : "Mark";
      const row = button.closest("[data-school-check-row]");
      if (row) row.classList.toggle("is-done", active);
    });
    if (fill) fill.style.width = `${percent}%`;
    if (label) label.textContent = lessonState.complete ? "Lesson complete" : `${doneCount} of ${checks.length} checkpoints marked`;
    if (completeBanner) completeBanner.hidden = !lessonState.complete;
  };
  const patchState = mutate => {
    const state = readState();
    if (!state.lessons[lessonKey]) {
      state.lessons[lessonKey] = { checks: checks.map(() => false), complete: false };
    }
    mutate(state.lessons[lessonKey], state);
    if (lastLesson) state.lastLesson = lastLesson;
    writeState(state);
    updateVisualState();
  };

  if (lastLesson) {
    const state = readState();
    state.lastLesson = lastLesson;
    writeState(state);
  }

  root.querySelectorAll("[data-school-load]").forEach(button => {
    button.addEventListener("click", () => {
      if (!input) return;
      input.value = button.getAttribute("data-school-load") === "starter" ? starter : reference;
      if (output) output.textContent = compileSnippet(input.value);
    });
  });
  input?.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      if (output) output.textContent = compileSnippet(input.value);
    }
  });
  root.querySelector("[data-school-run]")?.addEventListener("click", () => {
    if (input && output) output.textContent = compileSnippet(input.value);
  });
  root.querySelector("[data-school-restore]")?.addEventListener("click", () => {
    if (input) input.value = starter;
    if (output) output.textContent = compileSnippet(starter);
  });
  checks.forEach((button, index) => {
    button.addEventListener("click", () => {
      patchState(lessonState => {
        if (!Array.isArray(lessonState.checks)) lessonState.checks = checks.map(() => false);
        lessonState.checks[index] = !lessonState.checks[index];
        if (lessonState.complete && lessonState.checks.some(entry => !entry)) lessonState.complete = false;
      });
    });
  });
  completeButton?.addEventListener("click", () => {
    patchState(lessonState => {
      lessonState.checks = checks.map(() => true);
      lessonState.complete = true;
    });
  });
  resetButton?.addEventListener("click", () => {
    patchState(lessonState => {
      lessonState.checks = checks.map(() => false);
      lessonState.complete = false;
    });
    if (input) input.value = starter;
    if (output) output.textContent = compileSnippet(starter);
    if (portabilityNote) portabilityNote.textContent = "Lesson progress reset locally.";
  });
  shareButton?.addEventListener("click", async () => {
    const href = window.location.href;
    try {
      await navigator.clipboard.writeText(href);
      if (portabilityNote) portabilityNote.textContent = "Lesson link copied to your clipboard.";
    } catch (_) {
      if (portabilityNote) portabilityNote.textContent = href;
    }
  });
  exportButton?.addEventListener("click", () => {
    exportState(readState());
    if (portabilityNote) portabilityNote.textContent = "Progress exported as JSON.";
  });
  importButton?.addEventListener("click", () => importInput?.click());
  importInput?.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      writeState(parseSchoolState(text));
      if (portabilityNote) portabilityNote.textContent = "Progress imported successfully.";
      updateVisualState();
    } catch (_) {
      if (portabilityNote) portabilityNote.textContent = "Import failed. Use a progress JSON exported from this school.";
    } finally {
      importInput.value = "";
    }
  });

  if (output) output.textContent = compileSnippet(starter);
  updateVisualState();
}
