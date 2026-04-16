import {getCapstonePresets, getCapstoneRecommendation, getCapstones} from "../../lib/learn-school.mjs";
function capstoneCard(capstone) {
  const concepts = capstone.concepts.map(item => `<li>${item}</li>`).join("");
  const checklist = capstone.checklist.map(item => `<li>${item}</li>`).join("");
  return `
    <article class="docs-card">
      <p class="kicker">${capstone.title}</p>
      <p class="docs-card-copy">${capstone.goal}</p>
      <p class="story-cell-title">What you build</p>
      <p class="docs-card-copy">${capstone.build}</p>
      <p class="story-cell-title">Required FastScript concepts</p>
      <ul class="prose-list">${concepts}</ul>
      <p class="story-cell-title">Completion checklist</p>
      <ul class="prose-list">${checklist}</ul>
      <p class="story-cell-title">Done looks like</p>
      <p class="docs-card-copy">${capstone.done}</p>
    </article>
  `;
}
export default function LearnCapstonePage() {
  const cards = getCapstones().map(capstoneCard).join("");
  const presets = getCapstonePresets().map(preset => `
    <button
      type="button"
      class="btn btn-ghost btn-lg"
      id="${preset.slug}"
      data-capstone-preset="${preset.slug}"
      data-capstone-stage-value="${preset.values.stage}"
      data-capstone-product-value="${preset.values.product}"
      data-capstone-baseline-value="${preset.values.baseline}"
      data-capstone-deploy-value="${preset.values.deploy}"
    >${preset.title}</button>
  `).join("");
  return `
    <section class="learn-school">
      <header class="sec-header learn-hero">
        <p class="kicker">Capstone hub</p>
        <h1 class="h1">Turn the school into real product work.</h1>
        <p class="lead">Choose a capstone, pick a baseline, and leave with a practical build plan.</p>
      </header>

      <div class="docs-card-grid">
        <div class="docs-card">
          <p class="docs-card-title">Stable greenfield baseline</p>
          <p class="docs-card-copy"><code class="ic">startup-mvp</code> is the steady starting point for greenfield full-stack SaaS work.</p>
          <a class="docs-card-link" href="/docs/team-dashboard-saas">Study startup-mvp &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Strict TS proving-ground</p>
          <p class="docs-card-copy"><code class="ic">agency-ops</code> proves ordinary TypeScript inside <code class="ic">.fs</code> for product-shaped work.</p>
          <a class="docs-card-link" href="/docs/agency-ops">Study agency-ops &#8594;</a>
        </div>
        <div class="docs-card">
          <p class="docs-card-title">Mastery loop</p>
          <p class="docs-card-copy">The mastery lessons point here, and this hub points back into the final mastery module when you want the planning checklist first.</p>
          <a class="docs-card-link" href="/learn/mastery/capstone-product-architecture">Back to mastery lesson &#8594;</a>
          <a class="docs-card-link" href="/learn/mastery/delivery-checklist-and-release-readiness">Open release-readiness lesson &#8594;</a>
          <a class="docs-card-link" href="/learn/mastery-summary">Open mastery summary &#8594;</a>
        </div>
      </div>

      <hr class="section-divider">

      <section class="learn-next">
        <header class="sec-header-sm">
          <p class="kicker">Starter generator</p>
          <h2 class="h2">Get a guided first build plan.</h2>
        </header>
        <div class="docs-card-grid">
          <div class="docs-card" data-capstone-generator>
            <p class="docs-card-title">Your setup</p>
            <p class="docs-card-copy">Choose the shape you want to build and the generator will recommend the best baseline, docs, and first commands.</p>
            <div class="cta-actions">
              ${presets}
            </div>
            <div class="steps">
              <label class="step">
                <span class="step-num">1</span>
                <span class="step-body">
                  <span class="step-title">Learner stage</span>
                  <select class="input" data-capstone-stage>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professional">Professional</option>
                    <option value="mastery">Mastery</option>
                  </select>
                </span>
              </label>
              <label class="step">
                <span class="step-num">2</span>
                <span class="step-body">
                  <span class="step-title">Product shape</span>
                  <select class="input" data-capstone-product>
                    <option value="greenfield-saas">Greenfield SaaS</option>
                    <option value="internal-ops">Internal ops dashboard</option>
                    <option value="service-delivery">Service delivery workflow</option>
                    <option value="migration">Strict TS migration slice</option>
                  </select>
                </span>
              </label>
              <label class="step">
                <span class="step-num">3</span>
                <span class="step-body">
                  <span class="step-title">Baseline preference</span>
                  <select class="input" data-capstone-baseline>
                    <option value="auto">Auto choose</option>
                    <option value="startup-mvp">startup-mvp</option>
                    <option value="agency-ops">agency-ops</option>
                  </select>
                </span>
              </label>
              <label class="step">
                <span class="step-num">4</span>
                <span class="step-body">
                  <span class="step-title">Deployment posture</span>
                  <select class="input" data-capstone-deploy>
                    <option value="adapter">Adapter-first</option>
                    <option value="custom">Custom-host-first</option>
                  </select>
                </span>
              </label>
            </div>
            <div class="cta-actions">
              <button type="button" class="btn btn-primary btn-lg" data-capstone-build>Generate starter plan</button>
              <button type="button" class="btn btn-ghost btn-lg" data-capstone-copy>Copy plan</button>
            </div>
          </div>
          <div class="docs-card" data-capstone-output>
            <p class="docs-card-title">Starter recommendation</p>
            <p class="docs-card-copy" data-capstone-summary>Generate a plan to see your recommended baseline, first workflow, and proof commands.</p>
            <div class="steps" data-capstone-checklist></div>
            <div class="cta-actions">
              <a class="btn btn-secondary btn-lg" href="/docs/team-dashboard-saas" data-capstone-baseline-link>Open recommended baseline</a>
              <a class="btn btn-ghost btn-lg" href="/docs/support" data-capstone-support-link>Open support matrix</a>
            </div>
          </div>
        </div>
      </section>

      <hr class="section-divider">

      <section class="learn-next">
        <header class="sec-header-sm">
          <p class="kicker">Capstone tracks</p>
          <h2 class="h2">Choose the build that matches your current level.</h2>
        </header>
        <div class="docs-card-grid">${cards}</div>
      </section>
    </section>
  `;
}
export function hydrate({root}) {
  const stage = root.querySelector("[data-capstone-stage]");
  const product = root.querySelector("[data-capstone-product]");
  const baseline = root.querySelector("[data-capstone-baseline]");
  const deploy = root.querySelector("[data-capstone-deploy]");
  const summary = root.querySelector("[data-capstone-summary]");
  const checklist = root.querySelector("[data-capstone-checklist]");
  const baselineLink = root.querySelector("[data-capstone-baseline-link]");
  const buildButton = root.querySelector("[data-capstone-build]");
  const copyButton = root.querySelector("[data-capstone-copy]");
  const presetButtons = [...root.querySelectorAll("[data-capstone-preset]")];
  const resolveRecommendation = () => getCapstoneRecommendation({
    stage: stage?.value || "beginner",
    product: product?.value || "greenfield-saas",
    baseline: baseline?.value || "auto",
    deploy: deploy?.value || "adapter"
  });
  const render = () => {
    const recommendation = resolveRecommendation();
    if (summary) summary.textContent = recommendation.summary;
    if (checklist) {
      checklist.innerHTML = recommendation.checklist.map((item, index) => `
        <div class="step">
          <span class="step-num">0${index + 1}</span>
          <span class="step-body">
            <span class="step-copy">${item}</span>
          </span>
        </div>
      `).join("");
    }
    if (baselineLink) {
      baselineLink.setAttribute("href", recommendation.baselineDoc);
      baselineLink.textContent = `Open ${recommendation.recommendedBaseline} docs`;
    }
  };
  presetButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (stage) stage.value = button.getAttribute("data-capstone-stage-value") || "beginner";
      if (product) product.value = button.getAttribute("data-capstone-product-value") || "greenfield-saas";
      if (baseline) baseline.value = button.getAttribute("data-capstone-baseline-value") || "auto";
      if (deploy) deploy.value = button.getAttribute("data-capstone-deploy-value") || "adapter";
      render();
    });
  });
  const copyPlan = async () => {
    const recommendation = resolveRecommendation();
    const text = [recommendation.summary, "", ...recommendation.checklist.map((item, index) => `${index + 1}. ${item}`)].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      if (copyButton) copyButton.textContent = "Copied plan";
      setTimeout(() => {
        if (copyButton) copyButton.textContent = "Copy plan";
      }, 1200);
    } catch (_) {}
  };
  [stage, product, baseline, deploy].forEach(control => control?.addEventListener("change", render));
  buildButton?.addEventListener("click", render);
  copyButton?.addEventListener("click", copyPlan);
  render();
}
