import {getCapstones} from "../../lib/learn-school.mjs";

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
  return `
    <section class="learn-school">
      <header class="sec-header learn-hero">
        <p class="kicker">Capstone hub</p>
        <h1 class="h1">Turn the school into real product work.</h1>
        <p class="lead">Choose the capstone that matches your stage, then build against the most honest FastScript reference app for the job.</p>
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
        </div>
      </div>

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
