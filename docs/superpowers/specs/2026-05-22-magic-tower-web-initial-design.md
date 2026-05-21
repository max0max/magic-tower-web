# Magic Tower Web Initial Design

## Purpose

Create a local Git repository for a future click-to-play Magic Tower game. This
initialization does not implement gameplay. It prepares the smallest useful
static web project shape for GitHub Pages.

## Architecture

The project starts as dependency-free static HTML, CSS, and JavaScript under
`site/`. GitHub Pages deploys that directory through a workflow. Future game
work can either keep this direct static structure or introduce a build step, as
long as the published player entry remains a static URL.

## Components

- `site/index.html`: browser entry point and placeholder page.
- `site/styles.css`: responsive placeholder styling.
- `site/main.js`: minimal placeholder status behavior.
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow.
- `README.md`: repository purpose, play link placeholder, and structure.
- `GOAL_CONTRACT.md`: future playable-game contract.
- `.editorconfig`, `.gitignore`, `LICENSE`: baseline repository hygiene.

## Constraints

- Do not implement Magic Tower mechanics during initialization.
- Do not require a package manager for the current placeholder.
- Keep the future player route as a public URL, not a local setup flow.
