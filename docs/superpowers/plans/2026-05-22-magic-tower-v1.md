# Magic Tower V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 static Magic Tower game required by `GOAL_CONTRACT.md` while keeping the player experience click-to-play from GitHub Pages.

**Architecture:** Put deterministic game rules in `site/game.js` as a small ES module that can be tested with Node's built-in test runner. Keep DOM rendering and browser storage in `site/main.js`, with `site/index.html` and `site/styles.css` providing the static page deployed by GitHub Pages.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Node built-in test runner, GitHub Actions, GitHub Pages.

---

### Task 1: Test Harness

**Files:**
- Create: `package.json`
- Create: `tests/game.test.mjs`
- Create: `tests/static.test.mjs`

- [x] **Step 1: Add Node's built-in test runner script**

Use `node --test tests/*.test.mjs` so development tests need no third-party packages.

- [x] **Step 2: Add failing behavior tests**

Write tests for movement, item pickup, keys and doors, combat, floor transitions, completion, fatal combat, and save restoration.

- [x] **Step 3: Add failing static repository tests**

Write tests that require a playable page shell, module script, controls, deploy workflow, and player-facing README link.

### Task 2: Game Engine

**Files:**
- Create: `site/game.js`
- Modify: `tests/game.test.mjs`

- [x] **Step 1: Verify tests fail before implementation**

Run `npm test`. Expected: tests fail because `site/game.js` and playable page elements are missing.

- [x] **Step 2: Implement deterministic state and movement**

Create the map, player stats, inventory, movement, wall blocking, doors, keys, items, combat, floor transitions, completion, death, serialization, and restoration.

- [x] **Step 3: Verify engine tests pass**

Run `npm test`. Expected: all game behavior tests pass.

### Task 3: Static Playable UI

**Files:**
- Modify: `site/index.html`
- Modify: `site/styles.css`
- Modify: `site/main.js`
- Modify: `README.md`

- [x] **Step 1: Implement click-to-play UI**

Add start and restart controls, status panels, grid rendering, keyboard support, click/touch adjacent movement, and local refresh recovery.

- [x] **Step 2: Update README player path**

Show the future GitHub Pages play URL and keep player instructions free of clone/install/startup requirements.

- [x] **Step 3: Verify static tests pass**

Run `npm test`. Expected: static repository and UI checks pass.

### Task 4: Evidence, Publish, and Verification

**Files:**
- Modify: `docs/goal-progress-log.md`

- [x] **Step 1: Run full local verification**

Run `npm test`, `git diff --check`, inspect `git status`, and run a browser-accessible local static smoke check.

- [ ] **Step 2: Try GitHub publication**

Use available GitHub CLI authentication to create or connect a GitHub repository, push `main`, and enable/verify Pages if possible.

- [ ] **Step 3: Invoke verifier**

Dispatch a fresh verifier subagent with the Goal Contract, current progress, evidence, and blockers. Record the verdict in the progress log.
