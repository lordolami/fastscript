export async function up(db) {
  const users = db.collection("users");
  if (!users.get("u_1")) {
    users.set("u_1", {
      id: "u_1",
      name: "Dev"
    });
  }
  db.collection("datasets");
  db.collection("dataset_versions");
  db.collection("dataset_sources");
  db.collection("dataset_transforms");
  db.collection("dataset_quality_reports");
  db.collection("experiments");
  db.collection("runs");
  db.collection("run_metrics");
  db.collection("run_artifacts");
  db.collection("training_jobs");
  db.collection("checkpoints");
  db.collection("eval_suites");
  db.collection("eval_runs");
  db.collection("eval_results");
  db.collection("specialization_recipes");
  db.collection("adapter_records");
  db.collection("synthetic_dataset_jobs");
  db.collection("model_records");
  db.collection("model_versions");
  db.collection("model_deployments");
  db.collection("workspaces");
  db.collection("organization_members");
  db.collection("audit_events");
  db.collection("incident_records");
  db.collection("cost_records");
  db.collection("readiness_assessments");
  db.collection("proof_packs");
  db.collection("command_requests");
  db.collection("command_responses");
}
