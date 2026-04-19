# FastScript 5.0.0 Release Checklist

Use this checklist from the current repo state to produce a clean GitHub and npm release without sweeping unrelated worktree files into the release commit.

## 1. Confirm release gates

Run:

```powershell
npm run qa:gate
npm run docs:index
npm run docs:api-ref
npm run public:bundle
npm run proof:publish
npm run release:npm:prepare
npm run pack:check
```

Expected outcome:

- `qa:gate` passes
- `.release/npm-public` exists
- `benchmarks/latest-proof-pack.md` and `docs/PROOF_PACK.md` are refreshed
- `docs/API_REFERENCE.md` is refreshed
- `dist-public/` exists
- `fastscript-5.0.0.tgz` is produced by `pack:check`

## 2. Review the dirty worktree carefully

The current worktree may contain unrelated private planning files under ignored `spec/FASTCODE_*`, `spec/STUDIO_*`, and `spec/FASTSCRIPT_AGENT_*` patterns.

Do not include those unrelated private planning files in a public release commit.

Check:

```powershell
git status --short
```

## 3. Stage only the release set

Stage the tracked and newly added FastScript release files, but leave unrelated ignored planning files unstaged.

Recommended staging flow:

```powershell
git add CHANGELOG.md README.md package.json
git add app/db/migrations/001_init.fs app/db/seed.fs
git add app/lib/platform-alpha.mjs app/lib/learn-school.mjs
git add app/pages
git add app/api/platform
git add scripts/test-platform-alpha.mjs scripts/test-runtime-contract.mjs scripts/test-learn-school.mjs
git add src/build.mjs src/public-meta.mjs src/generated/docs-search-index.mjs src/generated/compatibility-registry-report.mjs
git add docs/NPM_PUBLISH_STATUS.md docs/PROOF_PACK.md docs/API_REFERENCE.md docs/SUPPORT_MATRIX.md docs/search-index.json docs/RELEASE_5_0_0_CHECKLIST.md
git add benchmarks/latest-proof-pack.md
git add .fastscript/proofs/compatibility-registry-report.json
git add .gitignore
```

Then inspect exactly what is staged:

```powershell
git diff --cached --stat
git status --short
```

If unrelated files are staged, unstage them explicitly:

```powershell
git restore --staged spec
```

## 4. Commit and tag

Commit with a release message:

```powershell
git commit -m "release: ship FastScript 5.0.0 universe platform"
git tag v5.0.0
```

Sanity-check before pushing:

```powershell
git show --stat --summary HEAD
git tag --list v5.0.0
```

## 5. Publish npm

Publish from the prepared public bundle, not the repo root:

```powershell
npm publish ./.release/npm-public --access public
```

Verify:

```powershell
npm view fastscript version
```

Expected result:

- npm reports `5.0.0`

## 6. Push GitHub release state

Push the commit and tag:

```powershell
git push origin HEAD
git push origin v5.0.0
```

Create a GitHub release for `v5.0.0` with notes covering:

- FastScript as the structured substrate for AI-system workflows
- full `/platform` console expansion
- datasets, training, specialization, models, deployments, workspaces, audit, incidents, costs, commands
- updated `/learn`
- proof pack and public docs alignment

## 7. Final post-publish checks

Check:

```powershell
npm view fastscript version
git ls-remote --tags origin v5.0.0
```

Then spot-check:

- README version/copy
- changelog entry
- `/platform` messaging
- proof pack docs
- npm tarball contents

## 8. If you want an even cleaner release branch

If you prefer not to release directly from the dirty main worktree:

```powershell
git switch -c release/5.0.0
```

Then stage only the release files, commit, tag, publish, and merge that branch afterward.
