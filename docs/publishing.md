# Publishing

npm updates are published via a git tag-triggered GitHub Actions workflow. 

## How it works

Pushing a git tag matching `v*` (e.g. `v0.1.0`) triggers `.github/workflows/publish.yml`, which runs `npm publish` with a signed provenance record. Normal pushes and PRs do not publish.

## One-time setup

1. On npm, create an Automation token (Access Tokens → Generate New Token → Automation).
2. In GitHub, add it as a repository secret named `NPM_TOKEN`
   (Settings → Secrets and variables → Actions → New repository secret).

## Releasing a version

```bash
npm version 0.1.0            # bumps package.json, commits, and tags v0.1.0
git push origin main
git push origin v0.1.0       # pushing the tag triggers the publish
```

`npm version <major|minor|patch>` does three things: updates the version in
`package.json`, commits that change, and creates the matching `v*` tag.

