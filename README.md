# Magic Tower Web

A future click-to-play Magic Tower game hosted as a static web project.

The repository is initialized for GitHub Pages, but the game goal has not been
implemented yet. The current site is a placeholder that keeps the publishing
path simple while the gameplay contract remains separate.

## Play

Online play link, after the repository is published with GitHub Pages:

```text
https://<github-username>.github.io/magic-tower-web/
```

Players should only need to open the published URL in a browser. They should
not need to clone the repository, install dependencies, or start a local server.

## Repository Shape

- `site/` contains the static web entry point that GitHub Pages deploys.
- `.github/workflows/pages.yml` deploys `site/` to GitHub Pages.
- `GOAL_CONTRACT.md` preserves the future playable-game contract.
- `docs/superpowers/` contains the initialization design and plan notes.

## Development

For now, open `site/index.html` directly in a browser to inspect the placeholder.
No package manager is required.

Future gameplay work should keep the final player experience static-hostable.
