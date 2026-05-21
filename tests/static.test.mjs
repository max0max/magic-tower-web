import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the static page exposes a playable shell, module script, and controls", async () => {
  const html = await read("site/index.html");

  assert.match(html, /<main[^>]+id="game"/);
  assert.match(html, /data-action="start"/);
  assert.match(html, /data-action="restart"/);
  assert.match(html, /id="tower-grid"/);
  assert.match(html, /href="\.\/styles\.css\?v=2026052202"/);
  assert.match(html, /type="module"[^>]+src="\.\/main\.js\?v=2026052202"/);
  assert.doesNotMatch(html, /not implemented|intentionally pending/i);
});

test("the browser module import uses a versioned game engine URL", async () => {
  const main = await read("site/main.js");

  assert.match(main, /from "\.\/game\.js\?v=2026052202"/);
});

test("the stylesheet includes responsive grid and mobile control rules", async () => {
  const css = await read("site/styles.css");

  assert.match(css, /\.tower-grid/);
  assert.match(css, /grid-template-columns:\s*repeat\(7,\s*1fr\)/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /\.control-pad/);
  assert.match(css, /grid-template-columns:\s*repeat\(3,\s*64px\)/);
  assert.match(css, /min-width:\s*64px/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /\.stats\s*{\s*grid-template-columns:\s*1fr;/s);
  assert.match(css, /\.actions\s*{\s*display:\s*grid;\s*grid-template-columns:\s*1fr;/s);
  assert.match(css, /width:\s*min\(100%,\s*360px\)/);
  assert.match(css, /max-width:\s*100%/);
  assert.doesNotMatch(css, /font-size:[^;]*vw/);
});

test("README presents a player-facing online play path without local setup as a player requirement", async () => {
  const readme = await read("README.md");

  assert.match(readme, /https:\/\/max0max\.github\.io\/magic-tower-web\//);
  assert.doesNotMatch(readme, /<github-username>/);
  assert.match(readme, /Click the online play link/i);
  assert.doesNotMatch(readme, /Players should.*clone/i);
  assert.doesNotMatch(readme, /Players should.*install/i);
});

test("GitHub Pages workflow deploys the static site directory", async () => {
  const workflow = await read(".github/workflows/pages.yml");

  assert.match(workflow, /branches:\s*\n\s*-\s*main/);
  assert.match(workflow, /uses:\s*actions\/configure-pages@v5/);
  assert.match(workflow, /enablement:\s*true/);
  assert.match(workflow, /uses:\s*actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*\.\/site/);
  assert.match(workflow, /uses:\s*actions\/deploy-pages@v4/);
});
