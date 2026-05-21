# Magic Tower Web

A click-to-play Magic Tower game hosted as a static web project.

The game runs entirely in the browser: move through the tower, collect keys,
open doors, pick up stat items, win deterministic battles, and reach the exit.

## Play

Click the online play link after the repository is published with GitHub Pages:

```text
https://<github-username>.github.io/magic-tower-web/
```

The player path is the public URL. No local setup is part of playing.

## Repository Shape

- `site/` contains the static web entry point that GitHub Pages deploys.
- `.github/workflows/pages.yml` deploys `site/` to GitHub Pages.
- `GOAL_CONTRACT.md` preserves the playable-game contract.
- `docs/goal-progress-log.md` records goal execution state and verification.
- `docs/superpowers/` contains design and implementation plan notes.

## Development

The deployed player page remains static, but development uses Node's built-in
test runner:

```powershell
npm test
```

You can also open `site/index.html` directly in a browser for a quick local
smoke check.
