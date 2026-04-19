const COLLECTIONS = [
  "datasets",
  "dataset_versions",
  "dataset_sources",
  "dataset_transforms",
  "dataset_quality_reports",
  "experiments",
  "runs",
  "run_metrics",
  "run_artifacts",
  "training_jobs",
  "checkpoints",
  "eval_suites",
  "eval_runs",
  "eval_results",
  "specialization_recipes",
  "adapter_records",
  "synthetic_dataset_jobs",
  "model_records",
  "model_versions",
  "model_deployments",
  "workspaces",
  "organization_members",
  "audit_events",
  "incident_records",
  "cost_records",
  "readiness_assessments",
  "proof_packs",
  "command_requests",
  "command_responses",
];

const FUTURE_LAYER_CONTRACTS = [
  {
    title: "Datasets and lineage",
    copy: "Dataset registry, version history, transforms, quality reports, and provenance now live alongside experiments and proof.",
    entities: ["Dataset", "DatasetVersion", "DatasetSource", "DatasetTransform", "DatasetQualityReport"],
  },
  {
    title: "Training orchestration",
    copy: "Training jobs and checkpoints connect datasets to runs, evals, and deployment-ready proof.",
    entities: ["TrainingJob", "Checkpoint"],
  },
  {
    title: "Specialization and synthetic data",
    copy: "Adapters, specialization recipes, and synthetic dataset jobs close the post-training loop inside the same substrate.",
    entities: ["SpecializationRecipe", "AdapterRecord", "SyntheticDatasetJob"],
  },
  {
    title: "Models and deployments",
    copy: "Model registry, versions, deployment history, and readiness gates keep promotion grounded in evidence.",
    entities: ["ModelRecord", "ModelVersion", "ModelDeployment"],
  },
  {
    title: "Workspaces, ops, and commands",
    copy: "Workspace scoping, audit trails, incidents, costs, and grounded commands turn the platform into a real operating environment.",
    entities: ["Workspace", "OrganizationMember", "AuditEvent", "IncidentRecord", "CostRecord", "CommandRequest", "CommandResponse"],
  },
];

const PLATFORM_CONTRACTS = {
  primaryStory: "FastScript is the structured substrate for AI-system workflows.",
  shipped: [
    "Dataset",
    "DatasetVersion",
    "DatasetSource",
    "DatasetTransform",
    "DatasetQualityReport",
    "Experiment",
    "Run",
    "RunMetric",
    "RunArtifact",
    "TrainingJob",
    "Checkpoint",
    "EvalSuite",
    "EvalRun",
    "EvalResult",
    "ReadinessAssessment",
    "ProofPack",
    "SpecializationRecipe",
    "AdapterRecord",
    "SyntheticDatasetJob",
    "ModelRecord",
    "ModelVersion",
    "ModelDeployment",
    "Workspace",
    "OrganizationMember",
    "AuditEvent",
    "IncidentRecord",
    "CostRecord",
    "CommandRequest",
    "CommandResponse",
  ],
  futureLayers: FUTURE_LAYER_CONTRACTS,
};

const SEED = {
  datasets: [
    {
      id: "dataset_repo_tasks",
      slug: "repo-tasks",
      name: "Repo tasks corpus",
      description: "Compiler-sensitive repair tasks and release-discipline prompts harvested from the FastScript repo.",
      kind: "text",
      owner: "Core platform",
      status: "active",
      workspaceId: "workspace_core",
      createdAt: "2026-04-18T06:40:00.000Z",
      updatedAt: "2026-04-18T09:15:00.000Z",
      tags: ["compiler", "repair", "proof"],
    },
    {
      id: "dataset_public_surface",
      slug: "public-surface",
      name: "Public launch surface corpus",
      description: "Website, docs, proof, and README material used to keep launch messaging grounded in repo truth.",
      kind: "text",
      owner: "Launch readiness",
      status: "active",
      workspaceId: "workspace_launch",
      createdAt: "2026-04-18T06:45:00.000Z",
      updatedAt: "2026-04-18T09:20:00.000Z",
      tags: ["launch", "docs", "proof"],
    },
  ],
  dataset_versions: [
    {
      id: "dataset_version_repo_tasks_v1",
      datasetId: "dataset_repo_tasks",
      version: "v1",
      sourceCount: 3,
      rowCount: 182,
      splitSummary: { train: 132, validation: 28, test: 22 },
      createdAt: "2026-04-18T06:50:00.000Z",
      createdBy: "Core platform",
      notes: "Baseline repair corpus for experiment and training orchestration.",
    },
    {
      id: "dataset_version_public_surface_v1",
      datasetId: "dataset_public_surface",
      version: "v1",
      sourceCount: 4,
      rowCount: 94,
      splitSummary: { train: 64, validation: 18, test: 12 },
      createdAt: "2026-04-18T06:55:00.000Z",
      createdBy: "Launch readiness",
      notes: "Launch copy and proof corpus for narrative-grounding experiments.",
    },
  ],
  dataset_sources: [
    {
      id: "dataset_source_repo_proofs",
      datasetId: "dataset_repo_tasks",
      datasetVersionId: "dataset_version_repo_tasks_v1",
      kind: "repo",
      label: "Repo proof and validation tasks",
      uri: "/docs/latest",
      syncStatus: "healthy",
      lastSyncedAt: "2026-04-18T09:10:00.000Z",
    },
    {
      id: "dataset_source_repo_release",
      datasetId: "dataset_repo_tasks",
      datasetVersionId: "dataset_version_repo_tasks_v1",
      kind: "repo",
      label: "Release discipline evidence",
      uri: "/benchmarks",
      syncStatus: "healthy",
      lastSyncedAt: "2026-04-18T09:11:00.000Z",
    },
    {
      id: "dataset_source_public_homepage",
      datasetId: "dataset_public_surface",
      datasetVersionId: "dataset_version_public_surface_v1",
      kind: "docs",
      label: "Homepage and README launch surfaces",
      uri: "/",
      syncStatus: "healthy",
      lastSyncedAt: "2026-04-18T09:18:00.000Z",
    },
    {
      id: "dataset_source_public_learn",
      datasetId: "dataset_public_surface",
      datasetVersionId: "dataset_version_public_surface_v1",
      kind: "docs",
      label: "Builders course",
      uri: "/learn",
      syncStatus: "healthy",
      lastSyncedAt: "2026-04-18T09:19:00.000Z",
    },
  ],
  dataset_transforms: [
    {
      id: "dataset_transform_repo_redaction",
      datasetVersionId: "dataset_version_repo_tasks_v1",
      kind: "redaction",
      configSummary: "Strip secrets, normalize traces, and collapse duplicate repair prompts.",
      status: "complete",
      createdAt: "2026-04-18T06:52:00.000Z",
    },
    {
      id: "dataset_transform_launch_chunking",
      datasetVersionId: "dataset_version_public_surface_v1",
      kind: "chunking",
      configSummary: "Chunk docs and launch copy into proof-linked narrative units.",
      status: "complete",
      createdAt: "2026-04-18T06:57:00.000Z",
    },
  ],
  dataset_quality_reports: [
    {
      id: "dataset_quality_repo_tasks_v1",
      datasetVersionId: "dataset_version_repo_tasks_v1",
      checks: ["duplicate detection", "secret scan", "schema completeness"],
      warnings: ["A small test split keeps the benchmark signal high variance."],
      failures: [],
      score: 0.91,
      createdAt: "2026-04-18T07:00:00.000Z",
    },
    {
      id: "dataset_quality_public_surface_v1",
      datasetVersionId: "dataset_version_public_surface_v1",
      checks: ["source grounding", "mismatch detection", "copy coverage"],
      warnings: ["Benchmarks and roadmap prose evolve quickly and need frequent refresh."],
      failures: [],
      score: 0.94,
      createdAt: "2026-04-18T07:02:00.000Z",
    },
  ],
  experiments: [
    {
      id: "exp_fs_repo_repair",
      slug: "repo-repair-loop",
      name: "Repo repair loop",
      objective: "Measure whether FastScript-centered repair runs improve proof outcomes across compiler, validation, and deployment-sensitive tasks.",
      owner: "Core platform",
      status: "active",
      workspaceId: "workspace_core",
      createdAt: "2026-04-18T08:00:00.000Z",
      updatedAt: "2026-04-18T09:30:00.000Z",
      notes: "Designed to show FastScript as the substrate for repeatable model-development proof.",
      evalSuiteIds: ["suite_repo_truth", "suite_release_readiness"],
      datasetRefs: ["dataset_repo_tasks", "dataset_public_surface"],
      runCount: 2,
    },
    {
      id: "exp_fs_planning_alignment",
      slug: "planning-alignment",
      name: "Planning alignment and proof narratives",
      objective: "Track whether model outputs stay aligned with FastScript runtime, docs, and public-proof contracts during long-context planning tasks.",
      owner: "Launch readiness",
      status: "review",
      workspaceId: "workspace_launch",
      createdAt: "2026-04-18T07:10:00.000Z",
      updatedAt: "2026-04-18T09:05:00.000Z",
      notes: "Used for launch-readiness language and AI-substrate narrative consistency.",
      evalSuiteIds: ["suite_story_truth"],
      datasetRefs: ["dataset_public_surface"],
      runCount: 1,
    },
  ],
  training_jobs: [
    {
      id: "training_job_repo_sft_v1",
      type: "sft",
      name: "Repo repair SFT v1",
      status: "complete",
      experimentId: "exp_fs_repo_repair",
      datasetIds: ["dataset_repo_tasks"],
      runtimeTarget: "node20-local-proof",
      environmentSnapshot: "node20-cloudflare-proof",
      queueStatus: "finished",
      retries: 1,
      resumeCheckpointId: "checkpoint_repo_sft_v1",
      budgetSummary: "4 CPU hours, local proof budget",
      startedAt: "2026-04-18T07:40:00.000Z",
      endedAt: "2026-04-18T08:02:00.000Z",
      workspaceId: "workspace_core",
    },
    {
      id: "training_job_repo_eval_v1",
      type: "eval",
      name: "Repo repair eval replay",
      status: "running",
      experimentId: "exp_fs_repo_repair",
      datasetIds: ["dataset_repo_tasks", "dataset_public_surface"],
      runtimeTarget: "node20-local-proof",
      environmentSnapshot: "node20-cloudflare-proof",
      queueStatus: "active",
      retries: 0,
      resumeCheckpointId: "checkpoint_repo_eval_v1",
      budgetSummary: "2 CPU hours, continuous regression window",
      startedAt: "2026-04-18T08:59:00.000Z",
      endedAt: "",
      workspaceId: "workspace_core",
    },
    {
      id: "training_job_public_preference_v1",
      type: "preference-optimization",
      name: "Launch proof preference pass",
      status: "complete",
      experimentId: "exp_fs_planning_alignment",
      datasetIds: ["dataset_public_surface"],
      runtimeTarget: "node20-docs-proof",
      environmentSnapshot: "docs-proof-shell",
      queueStatus: "finished",
      retries: 0,
      resumeCheckpointId: "checkpoint_public_preference_v1",
      budgetSummary: "1 CPU hour, narrative proof tuning",
      startedAt: "2026-04-18T07:00:00.000Z",
      endedAt: "2026-04-18T07:22:00.000Z",
      workspaceId: "workspace_launch",
    },
  ],
  checkpoints: [
    {
      id: "checkpoint_repo_sft_v1",
      trainingJobId: "training_job_repo_sft_v1",
      modelVersionId: "model_version_fastscript_repair_v1",
      step: 900,
      status: "ready",
      createdAt: "2026-04-18T08:02:00.000Z",
      storageUri: "/platform/checkpoints/checkpoint_repo_sft_v1",
    },
    {
      id: "checkpoint_repo_eval_v1",
      trainingJobId: "training_job_repo_eval_v1",
      modelVersionId: "model_version_fastscript_repair_v1",
      step: 240,
      status: "active",
      createdAt: "2026-04-18T09:12:00.000Z",
      storageUri: "/platform/checkpoints/checkpoint_repo_eval_v1",
    },
    {
      id: "checkpoint_public_preference_v1",
      trainingJobId: "training_job_public_preference_v1",
      modelVersionId: "model_version_launch_proof_v1",
      step: 410,
      status: "ready",
      createdAt: "2026-04-18T07:21:00.000Z",
      storageUri: "/platform/checkpoints/checkpoint_public_preference_v1",
    },
  ],
  runs: [
    {
      id: "run_repo_repair_v2",
      experimentId: "exp_fs_repo_repair",
      trainingJobId: "training_job_repo_sft_v1",
      name: "Repair loop v2",
      status: "complete",
      startedAt: "2026-04-18T08:05:00.000Z",
      endedAt: "2026-04-18T08:47:00.000Z",
      seed: "fs-seed-4102",
      runtimeVersion: "fastscript@4.1.0",
      codeVersion: "launch-5-0-0-2026-04-18",
      environmentSnapshot: "node20-cloudflare-proof",
      hardwareProfile: "local-cpu-proof",
      notes: "Balanced repair quality against release-discipline evidence generation.",
    },
    {
      id: "run_repo_repair_v3",
      experimentId: "exp_fs_repo_repair",
      trainingJobId: "training_job_repo_eval_v1",
      name: "Repair loop v3",
      status: "running",
      startedAt: "2026-04-18T09:02:00.000Z",
      endedAt: "",
      seed: "fs-seed-4103",
      runtimeVersion: "fastscript@4.1.0",
      codeVersion: "launch-5-0-0-2026-04-18",
      environmentSnapshot: "node20-cloudflare-proof",
      hardwareProfile: "local-cpu-proof",
      notes: "Adds stronger release-readiness prompts and regression checks.",
    },
    {
      id: "run_story_alignment_v1",
      experimentId: "exp_fs_planning_alignment",
      trainingJobId: "training_job_public_preference_v1",
      name: "Story alignment v1",
      status: "complete",
      startedAt: "2026-04-18T07:25:00.000Z",
      endedAt: "2026-04-18T07:58:00.000Z",
      seed: "fs-story-2001",
      runtimeVersion: "fastscript@4.1.0",
      codeVersion: "launch-5-0-0-2026-04-18",
      environmentSnapshot: "docs-proof-shell",
      hardwareProfile: "local-cpu-proof",
      notes: "Measures startup narrative consistency against repo truth.",
    },
  ],
  run_metrics: [
    { id: "metric_1", runId: "run_repo_repair_v2", name: "proof_pass_rate", value: 0.92, step: 1, recordedAt: "2026-04-18T08:30:00.000Z", kind: "score" },
    { id: "metric_2", runId: "run_repo_repair_v2", name: "validation_success_rate", value: 0.96, step: 1, recordedAt: "2026-04-18T08:31:00.000Z", kind: "score" },
    { id: "metric_3", runId: "run_repo_repair_v2", name: "mean_runtime_ms", value: 842, step: 1, recordedAt: "2026-04-18T08:32:00.000Z", kind: "latency" },
    { id: "metric_4", runId: "run_repo_repair_v3", name: "proof_pass_rate", value: 0.95, step: 1, recordedAt: "2026-04-18T09:12:00.000Z", kind: "score" },
    { id: "metric_5", runId: "run_repo_repair_v3", name: "validation_success_rate", value: 0.98, step: 1, recordedAt: "2026-04-18T09:14:00.000Z", kind: "score" },
    { id: "metric_6", runId: "run_story_alignment_v1", name: "narrative_alignment", value: 0.9, step: 1, recordedAt: "2026-04-18T07:42:00.000Z", kind: "score" },
    { id: "metric_7", runId: "run_story_alignment_v1", name: "source_grounding", value: 0.94, step: 1, recordedAt: "2026-04-18T07:45:00.000Z", kind: "score" },
  ],
  run_artifacts: [
    { id: "artifact_1", runId: "run_repo_repair_v2", kind: "proof-pack", label: "Repair proof pack", uri: "/platform/proof/experiment/exp_fs_repo_repair", createdAt: "2026-04-18T08:46:00.000Z" },
    { id: "artifact_2", runId: "run_repo_repair_v2", kind: "comparison", label: "v2 run comparison", uri: "/platform/runs/run_repo_repair_v2", createdAt: "2026-04-18T08:47:00.000Z" },
    { id: "artifact_3", runId: "run_story_alignment_v1", kind: "docs-review", label: "Story alignment notes", uri: "/docs/latest", createdAt: "2026-04-18T07:58:00.000Z" },
  ],
  eval_suites: [
    {
      id: "suite_repo_truth",
      slug: "repo-truth",
      name: "Repo truth suite",
      category: "repair",
      description: "Checks whether a run stays grounded in compiler, validation, and release-proof evidence instead of optimistic guesswork.",
      scenarioCount: 4,
      owner: "Core platform",
      createdAt: "2026-04-18T07:00:00.000Z",
    },
    {
      id: "suite_release_readiness",
      slug: "release-readiness",
      name: "Release readiness suite",
      category: "launch",
      description: "Scores whether build, route, proof, and public-launch claims line up with the actual release contract.",
      scenarioCount: 3,
      owner: "Launch readiness",
      createdAt: "2026-04-18T07:05:00.000Z",
    },
    {
      id: "suite_story_truth",
      slug: "story-truth",
      name: "Story truth suite",
      category: "narrative",
      description: "Measures whether platform positioning stays defensible against repo truth while selling the AI-substrate thesis clearly.",
      scenarioCount: 3,
      owner: "Launch readiness",
      createdAt: "2026-04-18T07:12:00.000Z",
    },
  ],
  eval_runs: [
    {
      id: "eval_run_1",
      suiteId: "suite_repo_truth",
      runId: "run_repo_repair_v2",
      status: "complete",
      startedAt: "2026-04-18T08:33:00.000Z",
      endedAt: "2026-04-18T08:38:00.000Z",
      summaryScore: 0.93,
    },
    {
      id: "eval_run_2",
      suiteId: "suite_release_readiness",
      runId: "run_repo_repair_v2",
      status: "complete",
      startedAt: "2026-04-18T08:39:00.000Z",
      endedAt: "2026-04-18T08:42:00.000Z",
      summaryScore: 0.91,
    },
    {
      id: "eval_run_3",
      suiteId: "suite_story_truth",
      runId: "run_story_alignment_v1",
      status: "complete",
      startedAt: "2026-04-18T07:46:00.000Z",
      endedAt: "2026-04-18T07:55:00.000Z",
      summaryScore: 0.92,
    },
  ],
  eval_results: [
    { id: "eval_result_1", evalRunId: "eval_run_1", scenario: "compiler-grounded repairs", score: 0.94, status: "pass", notes: "Repairs remained inside compiler-backed constraints.", evidenceRefs: ["artifact_1"] },
    { id: "eval_result_2", evalRunId: "eval_run_1", scenario: "validation alignment", score: 0.91, status: "pass", notes: "Validation loop stayed consistent with release discipline.", evidenceRefs: ["artifact_1"] },
    { id: "eval_result_3", evalRunId: "eval_run_2", scenario: "public-launch truth", score: 0.9, status: "warn", notes: "Copy was strong but required clearer repo-boundary caveats.", evidenceRefs: ["artifact_2"] },
    { id: "eval_result_4", evalRunId: "eval_run_2", scenario: "proof artifact coherence", score: 0.93, status: "pass", notes: "Generated proof summary matched available evidence.", evidenceRefs: ["artifact_1", "artifact_2"] },
    { id: "eval_result_5", evalRunId: "eval_run_3", scenario: "story consistency", score: 0.92, status: "pass", notes: "Narrative stayed aligned with AI-substrate thesis and current platform proof.", evidenceRefs: ["artifact_3"] },
    { id: "eval_result_6", evalRunId: "eval_run_3", scenario: "source grounding", score: 0.93, status: "pass", notes: "Claims referenced repo truth and proof surfaces directly.", evidenceRefs: ["artifact_3"] },
  ],
  specialization_recipes: [
    {
      id: "recipe_launch_proof_hardening",
      name: "Launch proof hardening",
      status: "active",
      sourceDatasetVersionId: "dataset_version_public_surface_v1",
      sourceModelVersionId: "model_version_launch_proof_v1",
      linkedEvalSuiteIds: ["suite_story_truth", "suite_release_readiness"],
      proofStatus: "improved",
      notes: "Tightens launch messaging while keeping claims grounded in repo truth.",
      createdAt: "2026-04-18T08:10:00.000Z",
    },
  ],
  adapter_records: [
    {
      id: "adapter_launch_proof_v1",
      recipeId: "recipe_launch_proof_hardening",
      modelVersionId: "model_version_launch_proof_v1",
      kind: "lora",
      status: "ready",
      createdAt: "2026-04-18T08:18:00.000Z",
    },
  ],
  synthetic_dataset_jobs: [
    {
      id: "synthetic_job_launch_prompts_v1",
      recipeId: "recipe_launch_proof_hardening",
      status: "complete",
      outputDatasetVersionId: "dataset_version_public_surface_v1",
      createdAt: "2026-04-18T08:15:00.000Z",
      notes: "Generated additional launch-proof prompts for narrative consistency testing.",
    },
  ],
  model_records: [
    {
      id: "model_fastscript_repair",
      slug: "fastscript-repair",
      name: "FastScript repair model",
      lineage: "base -> repair tuned",
      benchmarkSummary: "Strong compiler-grounded repair and validation alignment.",
      safetyProfile: "repo-safe, local proof scope",
      latencyProfile: "sub-second on local proof runs",
      costProfile: "low local CPU cost",
      modalityMetadata: "text",
      workspaceId: "workspace_core",
      createdAt: "2026-04-18T07:30:00.000Z",
    },
    {
      id: "model_launch_proof",
      slug: "launch-proof",
      name: "Launch proof model",
      lineage: "base -> preference tuned for public-surface truth",
      benchmarkSummary: "Strong narrative grounding and public-proof coherence.",
      safetyProfile: "public-surface scoped",
      latencyProfile: "sub-second on docs proof workload",
      costProfile: "very low CPU cost",
      modalityMetadata: "text",
      workspaceId: "workspace_launch",
      createdAt: "2026-04-18T07:35:00.000Z",
    },
  ],
  model_versions: [
    {
      id: "model_version_fastscript_repair_v1",
      modelId: "model_fastscript_repair",
      version: "v1",
      readinessScore: 0.93,
      linkedEvalRunIds: ["eval_run_1", "eval_run_2"],
      checkpointIds: ["checkpoint_repo_sft_v1", "checkpoint_repo_eval_v1"],
      createdAt: "2026-04-18T08:02:00.000Z",
    },
    {
      id: "model_version_launch_proof_v1",
      modelId: "model_launch_proof",
      version: "v1",
      readinessScore: 0.92,
      linkedEvalRunIds: ["eval_run_3"],
      checkpointIds: ["checkpoint_public_preference_v1"],
      createdAt: "2026-04-18T07:21:00.000Z",
    },
  ],
  model_deployments: [
    {
      id: "deployment_fastscript_repair_canary",
      modelVersionId: "model_version_fastscript_repair_v1",
      environment: "canary",
      status: "active",
      rollout: "15%",
      fallbackModelVersionId: "model_version_launch_proof_v1",
      rollbackNotes: "Rollback if readiness drops below 0.9 or release-proof regressions appear.",
      createdAt: "2026-04-18T09:00:00.000Z",
    },
  ],
  workspaces: [
    {
      id: "workspace_core",
      slug: "core-platform",
      name: "Core platform",
      role: "owner",
      createdAt: "2026-04-18T06:00:00.000Z",
      summary: "Compiler, runtime, validation, datasets, experiments, and repair loops.",
    },
    {
      id: "workspace_launch",
      slug: "launch-readiness",
      name: "Launch readiness",
      role: "owner",
      createdAt: "2026-04-18T06:05:00.000Z",
      summary: "Public surfaces, proof packs, learn curriculum, and release discipline.",
    },
  ],
  organization_members: [
    {
      id: "member_owner",
      workspaceId: "workspace_core",
      name: "Codechef",
      email: "owner@fastscript.dev",
      role: "owner",
      joinedAt: "2026-04-18T06:00:00.000Z",
    },
    {
      id: "member_admin",
      workspaceId: "workspace_launch",
      name: "Launch lead",
      email: "launch@fastscript.dev",
      role: "admin",
      joinedAt: "2026-04-18T06:10:00.000Z",
    },
  ],
  audit_events: [
    {
      id: "audit_launch_proof_publish",
      workspaceId: "workspace_launch",
      actor: "launch@fastscript.dev",
      action: "proof-pack-published",
      subjectType: "proof-pack",
      subjectId: "proof_exp_fs_repo_repair",
      createdAt: "2026-04-18T08:49:30.000Z",
    },
  ],
  incident_records: [
    {
      id: "incident_eval_drift_window",
      workspaceId: "workspace_core",
      severity: "medium",
      status: "monitoring",
      summary: "Evaluation drift spike during repo repair v3 canary window.",
      createdAt: "2026-04-18T09:16:00.000Z",
    },
  ],
  cost_records: [
    {
      id: "cost_repo_repair_window",
      workspaceId: "workspace_core",
      category: "training",
      amountUsd: 18.4,
      periodLabel: "2026-04-18 launch window",
      createdAt: "2026-04-18T09:18:00.000Z",
    },
  ],
  readiness_assessments: [
    {
      id: "readiness_dataset_repo_tasks_v1",
      subjectType: "dataset",
      subjectId: "dataset_repo_tasks",
      score: 0.91,
      summary: "Dataset quality and lineage are strong enough for repair and proof workloads.",
      risks: ["Test split remains small for high-variance scenarios."],
      generatedAt: "2026-04-18T07:03:00.000Z",
    },
    {
      id: "readiness_exp_fs_repo_repair",
      subjectType: "experiment",
      subjectId: "exp_fs_repo_repair",
      score: 0.93,
      summary: "Experiment is proving FastScript's AI-system loop well: datasets, training, runs, evals, and proof stay inspectable together.",
      risks: ["Running v3 replay still needs full completion before release freeze."],
      generatedAt: "2026-04-18T08:48:00.000Z",
    },
    {
      id: "readiness_run_story_alignment_v1",
      subjectType: "run",
      subjectId: "run_story_alignment_v1",
      score: 0.92,
      summary: "Run is ready for public proof as a launch-story evaluation slice.",
      risks: ["Docs and public surfaces need to stay synchronized with package release language."],
      generatedAt: "2026-04-18T07:58:00.000Z",
    },
    {
      id: "readiness_model_fastscript_repair_v1",
      subjectType: "model",
      subjectId: "model_version_fastscript_repair_v1",
      score: 0.93,
      summary: "Model version is promotion-ready with grounded eval coverage and rollback metadata.",
      risks: ["Canary incident window remains open for monitoring."],
      generatedAt: "2026-04-18T09:02:00.000Z",
    },
    {
      id: "readiness_deployment_fastscript_repair_canary",
      subjectType: "deployment",
      subjectId: "deployment_fastscript_repair_canary",
      score: 0.9,
      summary: "Deployment is acceptable for canary promotion while proof and drift monitoring stay active.",
      risks: ["Escalate if regression or drift alerts increase."],
      generatedAt: "2026-04-18T09:18:30.000Z",
    },
  ],
  proof_packs: [
    {
      id: "proof_exp_fs_repo_repair",
      subjectType: "experiment",
      subjectId: "exp_fs_repo_repair",
      title: "Repo repair loop proof pack",
      generatedAt: "2026-04-18T08:49:00.000Z",
      sections: [
        "Objective: measure compiler-, validation-, and release-grounded repair quality.",
        "Signal: dataset quality is above 90%, training and checkpoint provenance are visible, and eval scores remain above 91%.",
        "Risk: running replay jobs and canary deployments still need monitoring before final release freeze.",
      ],
      artifactRefs: ["artifact_1", "artifact_2"],
    },
    {
      id: "proof_run_story_alignment_v1",
      subjectType: "run",
      subjectId: "run_story_alignment_v1",
      title: "Story alignment proof pack",
      generatedAt: "2026-04-18T07:58:30.000Z",
      sections: [
        "Objective: keep launch language aligned with repo truth while selling FastScript as the AI-system substrate.",
        "Result: narrative alignment and source grounding passed with public-launch quality.",
        "Risk: package, docs, and proof artifacts must remain synchronized through release.",
      ],
      artifactRefs: ["artifact_3"],
    },
    {
      id: "proof_model_fastscript_repair_v1",
      subjectType: "model",
      subjectId: "model_version_fastscript_repair_v1",
      title: "FastScript repair model proof pack",
      generatedAt: "2026-04-18T09:03:00.000Z",
      sections: [
        "Readiness gate: model version cleared proof, eval, and rollback checks for canary rollout.",
        "Lineage: dataset, training job, checkpoints, and eval evidence are all attached.",
        "Risk: canary incident monitoring remains open until drift window closes.",
      ],
      artifactRefs: ["artifact_1", "artifact_2"],
    },
  ],
  command_requests: [],
  command_responses: [],
};

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function byDateDesc(key) {
  return (a, b) => String(b?.[key] || "").localeCompare(String(a?.[key] || ""));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

function touchCollections(db) {
  for (const name of COLLECTIONS) db.collection(name);
}

function seedCollection(db, name, items) {
  const collection = db.collection(name);
  for (const item of items) {
    if (!collection.get(item.id)) collection.set(item.id, item);
  }
}

export function seedPlatformCollections(db) {
  touchCollections(db);
  for (const [name, items] of Object.entries(SEED)) seedCollection(db, name, items);
}

export function ensurePlatformSeed(db) {
  seedPlatformCollections(db);
}

function listCollection(db, name) {
  ensurePlatformSeed(db);
  return db.collection(name).all();
}

function getCollectionItem(db, name, id) {
  ensurePlatformSeed(db);
  return db.collection(name).get(id) || null;
}

function setCollectionItem(db, name, value) {
  ensurePlatformSeed(db);
  db.collection(name).set(value.id, value);
  return value;
}

function listRunMetricsFor(db, runId) {
  return listCollection(db, "run_metrics").filter((entry) => entry.runId === runId);
}

function listRunArtifactsFor(db, runId) {
  return listCollection(db, "run_artifacts").filter((entry) => entry.runId === runId);
}

function listEvalRunsByRunInternal(db, runId) {
  return listCollection(db, "eval_runs").filter((entry) => entry.runId === runId);
}

function listEvalResultsByEvalRunInternal(db, evalRunId) {
  return listCollection(db, "eval_results").filter((entry) => entry.evalRunId === evalRunId);
}

function listDatasetRefs(db, refs = []) {
  return refs.map((id) => getDataset(db, id)).filter(Boolean);
}

function latestDatasetVersion(db, datasetId) {
  return listDatasetVersions(db, datasetId)[0] || null;
}

function latestQualityForDataset(db, datasetId) {
  const version = latestDatasetVersion(db, datasetId);
  if (!version) return null;
  return getDatasetQuality(db, datasetId, version.id);
}

function buildDatasetLineage(db, datasetId) {
  const dataset = getDataset(db, datasetId);
  if (!dataset) return null;
  const versions = listDatasetVersions(db, datasetId);
  const latest = versions[0] || null;
  return {
    dataset,
    versions,
    latestVersion: latest,
    sources: latest ? listDatasetSources(db, datasetId, latest.id) : [],
    transforms: latest ? listDatasetTransforms(db, datasetId, latest.id) : [],
    quality: latest ? getDatasetQuality(db, datasetId, latest.id) : null,
  };
}

export function listDatasets(db) {
  return listCollection(db, "datasets").sort(byDateDesc("updatedAt"));
}

export function getDataset(db, id) {
  const dataset = getCollectionItem(db, "datasets", id);
  if (!dataset) return null;
  return {
    ...dataset,
    latestVersion: latestDatasetVersion(db, id),
    quality: latestQualityForDataset(db, id),
  };
}

export function listDatasetVersions(db, datasetId) {
  return listCollection(db, "dataset_versions")
    .filter((entry) => entry.datasetId === datasetId)
    .sort(byDateDesc("createdAt"));
}

export function listDatasetSources(db, datasetId, datasetVersionId = null) {
  return listCollection(db, "dataset_sources").filter((entry) => {
    if (entry.datasetId !== datasetId) return false;
    if (datasetVersionId && entry.datasetVersionId !== datasetVersionId) return false;
    return true;
  });
}

export function listDatasetTransforms(db, datasetId, datasetVersionId = null) {
  const allowedVersionIds = datasetVersionId
    ? new Set([datasetVersionId])
    : new Set(listDatasetVersions(db, datasetId).map((entry) => entry.id));
  return listCollection(db, "dataset_transforms").filter((entry) => allowedVersionIds.has(entry.datasetVersionId));
}

export function getDatasetQuality(db, datasetId, datasetVersionId = null) {
  const versions = listDatasetVersions(db, datasetId);
  const targetVersionId = datasetVersionId || versions[0]?.id;
  if (!targetVersionId) return null;
  return listCollection(db, "dataset_quality_reports").find((entry) => entry.datasetVersionId === targetVersionId) || null;
}

export function getDatasetLineage(db, id) {
  return buildDatasetLineage(db, id);
}

export function createDataset(db, input) {
  const now = new Date().toISOString();
  const dataset = setCollectionItem(db, "datasets", {
    id: uid("dataset"),
    slug: input.slug,
    name: input.name,
    description: input.description,
    kind: input.kind || "text",
    owner: input.owner || "Platform",
    status: input.status || "draft",
    workspaceId: input.workspaceId || "workspace_core",
    createdAt: now,
    updatedAt: now,
    tags: input.tags || [],
  });
  const version = setCollectionItem(db, "dataset_versions", {
    id: uid("dataset_version"),
    datasetId: dataset.id,
    version: input.version || "v1",
    sourceCount: Number(input.sourceCount || 0),
    rowCount: Number(input.rowCount || 0),
    splitSummary: input.splitSummary || { train: 0, validation: 0, test: 0 },
    createdAt: now,
    createdBy: input.owner || "Platform",
    notes: input.notes || "Created from platform API.",
  });
  setCollectionItem(db, "dataset_quality_reports", {
    id: uid("dataset_quality"),
    datasetVersionId: version.id,
    checks: ["created-via-api"],
    warnings: [],
    failures: [],
    score: Number(input.score || 0.85),
    createdAt: now,
  });
  return getDataset(db, dataset.id);
}

export function listExperiments(db) {
  return listCollection(db, "experiments").sort(byDateDesc("updatedAt"));
}

export function getExperiment(db, id) {
  const experiment = getCollectionItem(db, "experiments", id);
  if (!experiment) return null;
  const runs = listRunsForExperiment(db, id);
  return {
    ...experiment,
    runs,
    datasets: listDatasetRefs(db, experiment.datasetRefs),
    evalSuites: experiment.evalSuiteIds.map((suiteId) => getEvalSuite(db, suiteId)).filter(Boolean),
  };
}

export function createExperiment(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "experiments", {
    id: uid("exp"),
    slug: input.slug,
    name: input.name,
    objective: input.objective,
    owner: input.owner || "Platform",
    status: input.status || "draft",
    workspaceId: input.workspaceId || "workspace_core",
    createdAt: now,
    updatedAt: now,
    notes: input.notes || "",
    evalSuiteIds: input.evalSuiteIds || [],
    datasetRefs: input.datasetRefs || [],
    runCount: 0,
  });
}

export function listRunsForExperiment(db, experimentId) {
  return listCollection(db, "runs")
    .filter((entry) => entry.experimentId === experimentId)
    .sort(byDateDesc("startedAt"));
}

export function getRun(db, id) {
  const run = getCollectionItem(db, "runs", id);
  if (!run) return null;
  const experiment = getCollectionItem(db, "experiments", run.experimentId);
  return {
    ...run,
    experiment,
    trainingJob: run.trainingJobId ? getTrainingJob(db, run.trainingJobId) : null,
    metrics: listRunMetrics(db, id),
    artifacts: listRunArtifacts(db, id),
    evalRuns: listEvalRunsByRun(db, id),
  };
}

export function createRun(db, input) {
  const now = new Date().toISOString();
  const run = setCollectionItem(db, "runs", {
    id: uid("run"),
    experimentId: input.experimentId,
    trainingJobId: input.trainingJobId || "",
    name: input.name,
    status: input.status || "queued",
    startedAt: now,
    endedAt: "",
    seed: input.seed || "seed-local",
    runtimeVersion: input.runtimeVersion || "fastscript@5.0.1",
    codeVersion: input.codeVersion || "workspace",
    environmentSnapshot: input.environmentSnapshot || "local-dev",
    hardwareProfile: input.hardwareProfile || "local-cpu-proof",
    notes: input.notes || "",
  });
  const experiment = getCollectionItem(db, "experiments", input.experimentId);
  if (experiment) {
    setCollectionItem(db, "experiments", {
      ...experiment,
      updatedAt: now,
      runCount: Number(experiment.runCount || 0) + 1,
    });
  }
  return getRun(db, run.id);
}

export function listRunMetrics(db, runId) {
  return listRunMetricsFor(db, runId).sort((a, b) => Number(a.step || 0) - Number(b.step || 0));
}

export function listRunArtifacts(db, runId) {
  return listRunArtifactsFor(db, runId).sort(byDateDesc("createdAt"));
}

export function compareRuns(db, leftRunId = "run_repo_repair_v2", rightRunId = "run_repo_repair_v3") {
  const left = getRun(db, leftRunId);
  const right = getRun(db, rightRunId);
  const leftMetrics = listRunMetrics(db, leftRunId);
  const rightMetrics = listRunMetrics(db, rightRunId);
  const metricNames = [...new Set([...leftMetrics, ...rightMetrics].map((entry) => entry.name))];
  return {
    left,
    right,
    metrics: metricNames.map((name) => ({
      name,
      left: leftMetrics.find((entry) => entry.name === name)?.value ?? null,
      right: rightMetrics.find((entry) => entry.name === name)?.value ?? null,
    })),
    evalSummary: {
      left: average(listEvalRunsByRun(db, leftRunId).map((entry) => entry.summaryScore)),
      right: average(listEvalRunsByRun(db, rightRunId).map((entry) => entry.summaryScore)),
    },
  };
}

export function listTrainingJobs(db) {
  return listCollection(db, "training_jobs").sort(byDateDesc("startedAt"));
}

export function getTrainingJob(db, id) {
  const job = getCollectionItem(db, "training_jobs", id);
  if (!job) return null;
  return {
    ...job,
    datasets: (job.datasetIds || []).map((datasetId) => getDataset(db, datasetId)).filter(Boolean),
    experiment: job.experimentId ? getCollectionItem(db, "experiments", job.experimentId) : null,
    checkpoints: listCheckpointsByJob(db, id),
  };
}

export function createTrainingJob(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "training_jobs", {
    id: uid("training_job"),
    type: input.type,
    name: input.name,
    status: input.status || "queued",
    experimentId: input.experimentId || "",
    datasetIds: input.datasetIds || [],
    runtimeTarget: input.runtimeTarget || "local-proof",
    environmentSnapshot: input.environmentSnapshot || "local-dev",
    queueStatus: input.queueStatus || "queued",
    retries: Number(input.retries || 0),
    resumeCheckpointId: input.resumeCheckpointId || "",
    budgetSummary: input.budgetSummary || "unbudgeted",
    startedAt: now,
    endedAt: "",
    workspaceId: input.workspaceId || "workspace_core",
  });
}

export function listCheckpointsByJob(db, trainingJobId) {
  return listCollection(db, "checkpoints")
    .filter((entry) => entry.trainingJobId === trainingJobId)
    .sort(byDateDesc("createdAt"));
}

export function getCheckpoint(db, id) {
  const checkpoint = getCollectionItem(db, "checkpoints", id);
  if (!checkpoint) return null;
  const modelVersion = checkpoint.modelVersionId ? getCollectionItem(db, "model_versions", checkpoint.modelVersionId) : null;
  return {
    ...checkpoint,
    trainingJob: checkpoint.trainingJobId ? getTrainingJob(db, checkpoint.trainingJobId) : null,
    modelVersion: modelVersion ? {
      id: modelVersion.id,
      modelId: modelVersion.modelId,
      version: modelVersion.version,
      readinessScore: modelVersion.readinessScore,
    } : null,
  };
}

export function listEvalSuites(db) {
  return listCollection(db, "eval_suites").sort(byDateDesc("createdAt"));
}

export function getEvalSuite(db, id) {
  const suite = getCollectionItem(db, "eval_suites", id);
  if (!suite) return null;
  return {
    ...suite,
    evalRuns: listEvalRunsBySuite(db, id),
  };
}

export function listEvalRunsBySuite(db, suiteId) {
  return listCollection(db, "eval_runs")
    .filter((entry) => entry.suiteId === suiteId)
    .sort(byDateDesc("startedAt"));
}

export function listEvalRunsByRun(db, runId) {
  return listEvalRunsByRunInternal(db, runId)
    .map((entry) => ({
      ...entry,
      suite: getCollectionItem(db, "eval_suites", entry.suiteId),
      results: listEvalResults(db, entry.id),
    }))
    .sort(byDateDesc("startedAt"));
}

export function getEvalRun(db, id) {
  const evalRun = getCollectionItem(db, "eval_runs", id);
  if (!evalRun) return null;
  return {
    ...evalRun,
    suite: getCollectionItem(db, "eval_suites", evalRun.suiteId),
    run: getCollectionItem(db, "runs", evalRun.runId),
    results: listEvalResults(db, id),
  };
}

export function listEvalResults(db, evalRunId) {
  return listEvalResultsByEvalRunInternal(db, evalRunId);
}

export function createEvalRun(db, input) {
  const now = new Date().toISOString();
  const evalRun = setCollectionItem(db, "eval_runs", {
    id: uid("eval_run"),
    suiteId: input.suiteId,
    runId: input.runId,
    status: "complete",
    startedAt: now,
    endedAt: now,
    summaryScore: 0.9,
  });
  setCollectionItem(db, "eval_results", {
    id: uid("eval_result"),
    evalRunId: evalRun.id,
    scenario: "generated proof pass",
    score: 0.9,
    status: "pass",
    notes: "Generated from the platform eval API.",
    evidenceRefs: [],
  });
  return getEvalRun(db, evalRun.id);
}

export function listSpecializationRecipes(db) {
  return listCollection(db, "specialization_recipes").sort(byDateDesc("createdAt"));
}

export function getSpecializationRecipe(db, id) {
  const recipe = getCollectionItem(db, "specialization_recipes", id);
  if (!recipe) return null;
  return {
    ...recipe,
    sourceDatasetVersion: recipe.sourceDatasetVersionId ? getCollectionItem(db, "dataset_versions", recipe.sourceDatasetVersionId) : null,
    sourceModelVersion: recipe.sourceModelVersionId ? getModelVersion(db, recipe.sourceModelVersionId) : null,
    evalSuites: (recipe.linkedEvalSuiteIds || []).map((suiteId) => getEvalSuite(db, suiteId)).filter(Boolean),
  };
}

export function createSpecializationRecipe(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "specialization_recipes", {
    id: uid("recipe"),
    name: input.name,
    status: input.status || "draft",
    sourceDatasetVersionId: input.sourceDatasetVersionId || "",
    sourceModelVersionId: input.sourceModelVersionId || "",
    linkedEvalSuiteIds: input.linkedEvalSuiteIds || [],
    proofStatus: input.proofStatus || "inconclusive",
    notes: input.notes || "",
    createdAt: now,
  });
}

export function listAdapterRecords(db) {
  return listCollection(db, "adapter_records").sort(byDateDesc("createdAt"));
}

export function listSyntheticDatasetJobs(db) {
  return listCollection(db, "synthetic_dataset_jobs").sort(byDateDesc("createdAt"));
}

export function listModels(db) {
  return listCollection(db, "model_records").sort(byDateDesc("createdAt"));
}

export function getModelVersion(db, id) {
  const version = getCollectionItem(db, "model_versions", id);
  if (!version) return null;
  return {
    ...version,
    evalRuns: (version.linkedEvalRunIds || []).map((evalRunId) => getEvalRun(db, evalRunId)).filter(Boolean),
    checkpoints: (version.checkpointIds || []).map((checkpointId) => {
      const checkpoint = getCollectionItem(db, "checkpoints", checkpointId);
      return checkpoint ? {
        id: checkpoint.id,
        trainingJobId: checkpoint.trainingJobId,
        step: checkpoint.step,
        status: checkpoint.status,
        createdAt: checkpoint.createdAt,
      } : null;
    }).filter(Boolean),
  };
}

export function getModel(db, id) {
  const model = getCollectionItem(db, "model_records", id);
  if (!model) return null;
  const versions = listCollection(db, "model_versions").filter((entry) => entry.modelId === id);
  return {
    ...model,
    versions: versions.map((entry) => getModelVersion(db, entry.id)),
    deployments: listDeployments(db).filter((entry) => {
      const modelVersion = getCollectionItem(db, "model_versions", entry.modelVersionId);
      return modelVersion?.modelId === id;
    }),
  };
}

export function createModel(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "model_records", {
    id: uid("model"),
    slug: input.slug,
    name: input.name,
    lineage: input.lineage || "",
    benchmarkSummary: input.benchmarkSummary || "",
    safetyProfile: input.safetyProfile || "",
    latencyProfile: input.latencyProfile || "",
    costProfile: input.costProfile || "",
    modalityMetadata: input.modalityMetadata || "text",
    workspaceId: input.workspaceId || "workspace_core",
    createdAt: now,
  });
}

export function listDeployments(db) {
  return listCollection(db, "model_deployments").sort(byDateDesc("createdAt"));
}

export function createDeployment(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "model_deployments", {
    id: uid("deployment"),
    modelVersionId: input.modelVersionId,
    environment: input.environment || "staging",
    status: input.status || "pending",
    rollout: input.rollout || "0%",
    fallbackModelVersionId: input.fallbackModelVersionId || "",
    rollbackNotes: input.rollbackNotes || "",
    createdAt: now,
  });
}

export function listWorkspaces(db) {
  return listCollection(db, "workspaces").sort(byDateDesc("createdAt"));
}

export function createWorkspace(db, input) {
  const now = new Date().toISOString();
  return setCollectionItem(db, "workspaces", {
    id: uid("workspace"),
    slug: input.slug,
    name: input.name,
    role: input.role || "owner",
    createdAt: now,
    summary: input.summary || "",
  });
}

export function listAuditEvents(db, workspaceId = null) {
  return listCollection(db, "audit_events")
    .filter((entry) => !workspaceId || entry.workspaceId === workspaceId)
    .sort(byDateDesc("createdAt"));
}

export function listIncidentRecords(db, workspaceId = null) {
  return listCollection(db, "incident_records")
    .filter((entry) => !workspaceId || entry.workspaceId === workspaceId)
    .sort(byDateDesc("createdAt"));
}

export function listCostRecords(db, workspaceId = null) {
  return listCollection(db, "cost_records")
    .filter((entry) => !workspaceId || entry.workspaceId === workspaceId)
    .sort(byDateDesc("createdAt"));
}

export function getWorkspaceSnapshot(db, workspaceId) {
  const workspace = getCollectionItem(db, "workspaces", workspaceId);
  if (!workspace) return null;
  return {
    workspace,
    members: listCollection(db, "organization_members").filter((entry) => entry.workspaceId === workspaceId),
    auditEvents: listAuditEvents(db, workspaceId),
    incidents: listIncidentRecords(db, workspaceId),
    costs: listCostRecords(db, workspaceId),
    datasets: listDatasets(db).filter((entry) => entry.workspaceId === workspaceId),
    experiments: listExperiments(db).filter((entry) => entry.workspaceId === workspaceId),
    models: listModels(db).filter((entry) => entry.workspaceId === workspaceId),
  };
}

function buildDefaultCommandSummary(db) {
  return {
    headline: "Platform summary",
    items: [
      `${listDatasets(db).length} datasets tracked`,
      `${listTrainingJobs(db).length} training jobs tracked`,
      `${listExperiments(db).length} experiments tracked`,
      `${listModels(db).length} models tracked`,
    ],
  };
}

export function listCommandHistory(db) {
  return listCollection(db, "command_responses").sort(byDateDesc("createdAt"));
}

export function executeCommand(db, input) {
  const now = new Date().toISOString();
  const query = String(input.query || "").toLowerCase();
  const request = setCollectionItem(db, "command_requests", {
    id: uid("command_request"),
    query: input.query,
    workspaceId: input.workspaceId || "workspace_core",
    createdAt: now,
  });

  let result;
  if (query.includes("quality")) {
    const datasets = listDatasets(db).filter((entry) => Number(entry.quality?.score || 0) < 0.93);
    result = {
      headline: "Datasets with quality warnings",
      items: datasets.map((entry) => `${entry.name}: ${Math.round(Number(entry.quality?.score || 0) * 100)}% quality`),
      refs: datasets.map((entry) => `/platform/datasets/${entry.id}`),
    };
  } else if (query.includes("regression") || query.includes("failure")) {
    const failing = listCollection(db, "eval_results").filter((entry) => entry.status !== "pass");
    result = {
      headline: "Regression and failure signals",
      items: failing.map((entry) => `${entry.scenario}: ${entry.status}`),
      refs: failing.map((entry) => `/platform/evals/${getCollectionItem(db, "eval_runs", entry.evalRunId)?.suiteId || ""}`),
    };
  } else if (query.includes("not ready") || query.includes("deployment")) {
    const blocked = listCollection(db, "model_versions").filter((entry) => Number(entry.readinessScore || 0) < 0.93);
    result = {
      headline: "Models below deployment readiness",
      items: blocked.map((entry) => `${entry.version}: ${Math.round(Number(entry.readinessScore || 0) * 100)}% readiness`),
      refs: blocked.map((entry) => `/platform/models/${entry.modelId}`),
    };
  } else {
    result = buildDefaultCommandSummary(db);
  }

  const response = setCollectionItem(db, "command_responses", {
    id: uid("command_response"),
    requestId: request.id,
    query: input.query,
    headline: result.headline,
    items: result.items,
    refs: result.refs || [],
    createdAt: now,
  });
  return { request, response };
}

export function getReadinessAssessment(db, subjectType, subjectId) {
  ensurePlatformSeed(db);
  const existing = listCollection(db, "readiness_assessments").find((entry) => entry.subjectType === subjectType && entry.subjectId === subjectId);
  return existing || buildReadinessAssessment(db, subjectType, subjectId);
}

export function buildReadinessAssessment(db, subjectType, subjectId) {
  const generatedAt = new Date().toISOString();
  let summary = "No readiness signal available yet.";
  let score = 0.75;
  let risks = [];

  if (subjectType === "dataset") {
    const quality = latestQualityForDataset(db, subjectId);
    score = Number(quality?.score || 0.8);
    summary = `Dataset quality and lineage are visible for ${getDataset(db, subjectId)?.name || subjectId}.`;
    risks = quality?.warnings || ["Dataset quality is missing explicit warnings."];
  } else if (subjectType === "experiment") {
    const experiment = getExperiment(db, subjectId);
    const runScores = experiment?.runs.flatMap((run) => listEvalRunsByRun(db, run.id).map((entry) => entry.summaryScore)) || [];
    score = average(runScores) || 0.85;
    summary = `Experiment ${experiment?.name || subjectId} ties datasets, training, runs, evals, and proof together.`;
    risks = experiment?.datasets.some((entry) => Number(entry?.quality?.score || 0) < 0.9)
      ? ["One or more linked datasets are below the preferred quality threshold."]
      : ["Continue monitoring active runs and replay jobs."];
  } else if (subjectType === "run") {
    const run = getRun(db, subjectId);
    score = average((run?.evalRuns || []).map((entry) => entry.summaryScore)) || 0.86;
    summary = `Run ${run?.name || subjectId} has reproducibility metadata, metrics, and eval coverage.`;
    risks = run?.status === "running" ? ["Run is still active, so readiness can change before freeze."] : ["Keep docs and proof surfaces in sync with the run evidence."];
  } else if (subjectType === "model") {
    const version = getModelVersion(db, subjectId);
    score = Number(version?.readinessScore || 0.88);
    summary = `Model version ${version?.version || subjectId} has readiness-gated eval and checkpoint coverage.`;
    risks = score < 0.93 ? ["Model remains below the promotion threshold."] : ["Monitor canary deployment drift before widening rollout."];
  } else if (subjectType === "deployment") {
    const deployment = getCollectionItem(db, "model_deployments", subjectId);
    const version = deployment ? getModelVersion(db, deployment.modelVersionId) : null;
    score = Math.min(Number(version?.readinessScore || 0.88), deployment?.status === "active" ? 0.9 : 0.86);
    summary = `Deployment ${subjectId} is gated by model readiness, rollback metadata, and current incident state.`;
    risks = listIncidentRecords(db).length ? listIncidentRecords(db).map((entry) => entry.summary) : ["No active incidents recorded."];
  }

  return {
    id: uid("readiness"),
    subjectType,
    subjectId,
    score,
    summary,
    risks,
    generatedAt,
  };
}

export function getProofPack(db, subjectType, subjectId) {
  const existing = listCollection(db, "proof_packs").find((entry) => entry.subjectType === subjectType && entry.subjectId === subjectId);
  return existing || buildProofPack(db, subjectType, subjectId);
}

export function buildProofPack(db, subjectType, subjectId) {
  const readiness = getReadinessAssessment(db, subjectType, subjectId);
  let title = `Proof pack for ${subjectType} ${subjectId}`;
  let sections = [
    `Readiness score: ${Math.round(Number(readiness.score || 0) * 100)}%.`,
    readiness.summary,
    `Risks: ${(readiness.risks || []).join(" ")}`,
  ];
  let artifactRefs = [];

  if (subjectType === "dataset") {
    const lineage = getDatasetLineage(db, subjectId);
    title = `${lineage?.dataset?.name || subjectId} proof pack`;
    sections = [
      `Dataset lineage includes ${lineage?.versions.length || 0} versions and ${lineage?.sources.length || 0} upstream sources.`,
      `Quality score: ${Math.round(Number(lineage?.quality?.score || 0) * 100)}%.`,
      `Transform coverage: ${(lineage?.transforms || []).map((entry) => entry.kind).join(", ") || "none recorded"}.`,
    ];
  } else if (subjectType === "experiment") {
    const experiment = getExperiment(db, subjectId);
    title = `${experiment?.name || subjectId} proof pack`;
    sections = [
      `Objective: ${experiment?.objective || "n/a"}`,
      `Datasets: ${(experiment?.datasets || []).map((entry) => entry.name).join(", ") || "none"}`,
      `Proof signal: ${Math.round(Number(readiness.score || 0) * 100)}% readiness across runs and evals.`,
    ];
    artifactRefs = (experiment?.runs || []).flatMap((run) => listRunArtifacts(db, run.id).map((entry) => entry.id));
  } else if (subjectType === "model") {
    const modelVersion = getModelVersion(db, subjectId);
    title = `${getCollectionItem(db, "model_records", modelVersion?.modelId)?.name || subjectId} proof pack`;
    sections = [
      `Model version: ${modelVersion?.version || "n/a"}`,
      `Checkpoint coverage: ${(modelVersion?.checkpoints || []).length}`,
      `Promotion gate: ${Math.round(Number(readiness.score || 0) * 100)}% readiness with deployment rollback metadata attached.`,
    ];
  }

  return {
    id: uid("proof"),
    subjectType,
    subjectId,
    title,
    generatedAt: new Date().toISOString(),
    sections,
    artifactRefs,
  };
}

export function getPlatformOverview(db) {
  const datasets = listDatasets(db);
  const experiments = listExperiments(db);
  const runs = listCollection(db, "runs");
  const evalRuns = listCollection(db, "eval_runs");
  const trainingJobs = listTrainingJobs(db);
  const models = listModels(db);
  const deployments = listDeployments(db);
  const workspaces = listWorkspaces(db);
  const readiness = listCollection(db, "readiness_assessments").sort(byDateDesc("generatedAt"))[0] || null;

  return {
    datasets: datasets.length,
    experiments: experiments.length,
    runs: runs.length,
    evalSuites: listCollection(db, "eval_suites").length,
    trainingJobs: trainingJobs.length,
    recipes: listCollection(db, "specialization_recipes").length,
    models: models.length,
    deployments: deployments.length,
    workspaces: workspaces.length,
    meanEvalScore: average(evalRuns.map((entry) => entry.summaryScore)),
    latestReadiness: readiness,
    futureLayers: FUTURE_LAYER_CONTRACTS,
  };
}

export function getPlatformAlphaNarrative() {
  return {
    title: "FastScript platform universe",
    copy: "Experiments, runs, evals, and proof were the first public center. The platform now extends that same substrate into datasets, training, specialization, models, deployments, workspaces, governance, and grounded commands.",
  };
}

export { PLATFORM_CONTRACTS };
