import {listSpecializationRecipes} from "../../lib/platform-alpha.mjs";
export async function load(ctx) {
  return {
    recipes: listSpecializationRecipes(ctx.db)
  };
}
export default function PlatformSpecialization({recipes}) {
  return `
    <header class="sec-header"><p class="kicker">Specialization</p><h1 class="h1">Post-training and specialization</h1><p class="lead">Recipes connect datasets, models, evals, and proof so specialization stays visible instead of hidden in side scripts.</p></header>
    <div class="docs-card-grid">${recipes.map(recipe => `<div class="docs-card"><p class="kicker">${recipe.proofStatus}</p><p class="docs-card-title">${recipe.name}</p><p class="docs-card-copy">${recipe.notes}</p></div>`).join("")}</div>
  `;
}
