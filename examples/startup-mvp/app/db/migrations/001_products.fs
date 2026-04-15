export async function up(db) {
  const plans = db.collection("plans");
  if (!plans.get("plan_starter")) {
    plans.set("plan_starter", { id: "plan_starter", name: "Starter", price: 29, seats: 5, support: "Email support" });
  }
  if (!plans.get("plan_growth")) {
    plans.set("plan_growth", { id: "plan_growth", name: "Growth", price: 79, seats: 15, support: "Priority support" });
  }
  if (!plans.get("plan_scale")) {
    plans.set("plan_scale", { id: "plan_scale", name: "Scale", price: 199, seats: 50, support: "Shared Slack channel" });
  }
}
