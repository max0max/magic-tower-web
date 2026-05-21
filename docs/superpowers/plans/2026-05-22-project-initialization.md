# Magic Tower Web Initialization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a local static GitHub Pages repository for a future click-to-play Magic Tower game without implementing gameplay.

**Architecture:** Use a dependency-free `site/` directory as the deployable artifact. Keep project documentation and GitHub Pages automation at the repository root so future gameplay work can focus on the game loop.

**Tech Stack:** HTML, CSS, JavaScript, GitHub Actions, GitHub Pages.

---

### Task 1: Repository Shell

**Files:**
- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `README.md`
- Create: `GOAL_CONTRACT.md`

- [ ] **Step 1: Create baseline repository hygiene files**

Create `.editorconfig`, `.gitignore`, and `LICENSE` with UTF-8 formatting,
common local ignores, and the MIT license.

- [ ] **Step 2: Create project documentation**

Create `README.md` with the project purpose, future GitHub Pages play URL
shape, repository layout, and no-install player constraint.

- [ ] **Step 3: Preserve the future goal**

Create `GOAL_CONTRACT.md` with the GitHub-hosted click-to-play Magic Tower V1
contract so implementation can start later from stable criteria.

### Task 2: Static Site Placeholder

**Files:**
- Create: `site/index.html`
- Create: `site/styles.css`
- Create: `site/main.js`

- [ ] **Step 1: Add the browser entry**

Create `site/index.html` as a placeholder that states gameplay is not
implemented yet.

- [ ] **Step 2: Add responsive styling**

Create `site/styles.css` with a simple responsive layout that works when opened
directly from disk or deployed to GitHub Pages.

- [ ] **Step 3: Add minimal JavaScript**

Create `site/main.js` only for placeholder status text. Do not add game logic.

### Task 3: GitHub Pages Automation

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Add static deploy workflow**

Create a workflow that deploys `site/` to GitHub Pages on pushes to `main` and
on manual workflow dispatch.

### Task 4: Local Git Initialization

**Files:**
- Modify: repository metadata under `.git/`

- [ ] **Step 1: Initialize git**

Run `git init -b main`.

- [ ] **Step 2: Review files**

Run `git status --short` and inspect the initialized file set.

- [ ] **Step 3: Commit the shell**

Run `git add .` and `git commit -m "chore: initialize magic tower web project"`.
