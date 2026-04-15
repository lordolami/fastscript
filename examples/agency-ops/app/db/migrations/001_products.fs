export async function up(db) {
  const plans = db.collection("plans");
  if (!plans.get("plan_starter")) {
    plans.set("plan_starter", { id: "plan_starter", name: "Starter", price: 29, seats: 5, support: "Email support for solo operators" });
  }
  if (!plans.get("plan_growth")) {
    plans.set("plan_growth", { id: "plan_growth", name: "Growth", price: 79, seats: 15, support: "Priority support for active client teams" });
  }
  if (!plans.get("plan_scale")) {
    plans.set("plan_scale", { id: "plan_scale", name: "Scale", price: 199, seats: 50, support: "Shared channel for agency operations leadership" });
  }
}
