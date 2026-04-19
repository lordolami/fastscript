import {getPricingPlans, resolveEntitlementState} from "../lib/billing.mjs";
function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export async function load(ctx) {
  const url = new URL(ctx.req.url, "http://fastscript.local");
  return {
    plans: getPricingPlans().filter(plan => plan.id !== "enterprise"),
    entitlement: resolveEntitlementState(ctx.db, ctx.user),
    nextPath: url.searchParams.get("next") || "/platform/datasets",
    requestedPlan: url.searchParams.get("plan") || "team",
    stateHint: url.searchParams.get("state") || ""
  };
}
export default function BuyFastScriptPage({plans, entitlement, nextPath, requestedPlan, stateHint}) {
  const selected = plans.find(plan => plan.id === requestedPlan) || plans[0];
  const buttons = plans.map(plan => `
    <button type="button" class="btn btn-ghost btn-lg" data-plan-choice="${plan.id}">
      ${plan.name} - ${plan.priceLabel}
    </button>
  `).join("");
  return `
    <section class="learn-school">
      <header class="sec-header learn-hero">
        <p class="kicker">Buy FastScript</p>
        <h1 class="h1">Unlock the paid operator console.</h1>
        <p class="lead">The public site stays open. The interactive workflow demo stays public. The real operator console unlocks after purchase so serious teams can evaluate the product without us giving away the full operating surface.</p>
        <p class="learn-path-note">State: ${entitlement.state}${stateHint ? ` - ${escapeHtml(stateHint)}` : ""}</p>
      </header>

      <div class="docs-card-grid">
        <article class="docs-card">
          <p class="docs-card-title">Selected plan</p>
          <p class="h2" data-buy-plan-label>${selected.name}</p>
          <p class="docs-card-copy" data-buy-plan-copy>${selected.priceLabel}. ${selected.audience}</p>
          <div class="cta-actions">${buttons}</div>
        </article>
        <article class="docs-card">
          <p class="docs-card-title">What stays public</p>
          <ul class="prose-list">
            <li>The company thesis, pricing, docs, learn hub, and proof surfaces.</li>
            <li>The guided workflow demo under <code class="ic">/platform</code>.</li>
            <li>Enough product shape for YC, customers, and serious buyers to understand what we built.</li>
          </ul>
        </article>
      </div>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <div class="learn-sidebar-card">
            <p class="learn-sidebar-title">Purchase boundary</p>
            <p class="learn-sidebar-copy">We use a Paddle-backed billing boundary. In this repo build, checkout runs in verified local/mock mode until production Paddle credentials are configured.</p>
            <div class="private-points-list">
              <div class="private-point">Paid access from day one</div>
              <div class="private-point">Public demo on the main website</div>
              <div class="private-point">Billing, upgrades, and cancellations stay in one account boundary</div>
            </div>
          </div>
        </aside>
        <div class="docs-card">
          <p class="docs-card-title">Create your paid access</p>
          <p class="docs-card-copy">Create a workspace owner session, attach a paid plan, and continue into the real product.</p>
          <label class="step">
            <span class="step-num">1</span>
            <span class="step-body">
              <span class="step-title">Name</span>
              <input class="input" data-buy-name placeholder="Founder name" value="Founder">
            </span>
          </label>
          <label class="step">
            <span class="step-num">2</span>
            <span class="step-body">
              <span class="step-title">Email</span>
              <input class="input" data-buy-email placeholder="you@startup.ai" value="founder@startup.ai">
            </span>
          </label>
          <div class="cta-actions">
            <button type="button" class="btn btn-primary btn-lg" data-start-buy data-next-path="${escapeHtml(nextPath)}">Buy now</button>
            <a class="btn btn-secondary btn-lg" href="/pricing">Review pricing</a>
            <a class="btn btn-ghost btn-lg" href="/platform">See product demo</a>
          </div>
          <p class="learn-path-note" data-buy-note>${entitlement.allowed ? "You already have access. Open the platform or manage billing." : "Your session will be created first, then the paid plan will be attached."}</p>
        </div>
      </div>
    </section>
  `;
}
export function hydrate({root}) {
  const note = root.querySelector("[data-buy-note]");
  const nameInput = root.querySelector("[data-buy-name]");
  const emailInput = root.querySelector("[data-buy-email]");
  const startButton = root.querySelector("[data-start-buy]");
  const planLabel = root.querySelector("[data-buy-plan-label]");
  const planCopy = root.querySelector("[data-buy-plan-copy]");
  let selectedPlan = "team";
  const planMap = {
    team: {
      label: "Team",
      copy: "$299/mo. Built for early AI startups shipping their first serious model-backed product."
    },
    growth: {
      label: "Growth",
      copy: "$999/mo. Built for heavier experimentation, bigger teams, and deployment governance."
    }
  };
  root.querySelectorAll("[data-plan-choice]").forEach(button => {
    button.addEventListener("click", () => {
      selectedPlan = button.getAttribute("data-plan-choice") || "team";
      if (planLabel) planLabel.textContent = planMap[selectedPlan].label;
      if (planCopy) planCopy.textContent = planMap[selectedPlan].copy;
    });
  });
  startButton?.addEventListener("click", async () => {
    const nextPath = startButton.getAttribute("data-next-path") || "/platform/datasets";
    const name = nameInput?.value?.trim() || "Founder";
    const email = emailInput?.value?.trim() || "founder@startup.ai";
    if (note) note.textContent = "Creating session and attaching paid access...";
    try {
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name,
          email
        })
      });
      if (!authRes.ok) throw new Error("auth");
      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          planId: selectedPlan,
          mode: "paid",
          nextPath
        })
      });
      const checkout = await checkoutRes.json();
      if (!checkoutRes.ok || !checkout.ok) throw new Error("checkout");
      if (note) note.textContent = "Paid access active. Opening the platform...";
      window.location.href = checkout.redirectUrl || nextPath;
    } catch (_) {
      if (note) note.textContent = "Purchase could not be completed. Try again or contact us.";
    }
  });
}
