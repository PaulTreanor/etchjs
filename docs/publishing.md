# Publishing

npm updates are published via a git tag-triggered GitHub Actions workflow. 

## How it works

Pushing a git tag matching `v*` (e.g. `v0.1.0`) triggers `.github/workflows/publish.yml`, which runs `npm publish` with a signed provenance record. Normal pushes and PRs do not publish.

## One-time setup

1. On npm, create an Automation token (Access Tokens → Generate New Token → Automation).
2. In GitHub, add it as a repository secret named `NPM_TOKEN`
   (Settings → Secrets and variables → Actions → New repository secret).

## Releasing a version

`main` is branch-protected, so the version bump goes through a PR, and the tag is
created after merge. GitHub protects branches, not tags — so pushing the tag still
works once it points at the merged commit.

```bash
# 1. Bump the version in a release branch and open a PR
git checkout -b release/0.1.0 main
npm version 0.1.0 --no-git-tag-version   # updates package.json only, no commit/tag
git add package.json
git commit -m "v0.1.0"
git push origin release/0.1.0
# ... open and merge the PR into main (satisfies branch protection) ...

# 2. Tag the merged main and push — this triggers the publish
git checkout main
git pull
git tag v0.1.0
git push origin v0.1.0
```

`npm version <major|minor|patch> --no-git-tag-version` updates the version in
`package.json` without committing or tagging, so the change can go through review.
The `v*` tag is created afterwards against `main`'s HEAD.

