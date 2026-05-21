import {
  DIRECTIONS,
  getCurrentFloor,
  getTileInfo,
  movePlayer,
  newGame,
  restoreGame,
  serializeGame,
} from "./game.js?v=2026052204";

const STORAGE_KEY = "magic-tower-web-state";
const stateFields = {
  hp: document.querySelector('[data-stat="hp"]'),
  attack: document.querySelector('[data-stat="attack"]'),
  defense: document.querySelector('[data-stat="defense"]'),
  gold: document.querySelector('[data-stat="gold"]'),
  yellowKeys: document.querySelector('[data-stat="yellowKeys"]'),
  floor: document.querySelector('[data-stat="floor"]'),
};
const message = document.querySelector("[data-message]");
const grid = document.querySelector("#tower-grid");
const startButton = document.querySelector('[data-action="start"]');
const restartButton = document.querySelector('[data-action="restart"]');
const moveButtons = document.querySelectorAll("[data-move]");

let state = loadState();

function loadState() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved ? restoreGame(saved) : null;
}

function saveState() {
  if (state) {
    window.localStorage.setItem(STORAGE_KEY, serializeGame(state));
  }
}

function startGame() {
  state = newGame();
  saveState();
  render();
}

function restartGame() {
  window.localStorage.removeItem(STORAGE_KEY);
  startGame();
}

function renderStats() {
  const active = state ?? newGame();
  stateFields.hp.textContent = String(active.stats.hp);
  stateFields.attack.textContent = String(active.stats.attack);
  stateFields.defense.textContent = String(active.stats.defense);
  stateFields.gold.textContent = String(active.stats.gold);
  stateFields.yellowKeys.textContent = String(active.inventory.yellowKeys);
  stateFields.floor.textContent = String(active.floorIndex + 1);
  message.textContent = state
    ? active.message
    : "Press Start game to enter the tower.";
}

function tileClass(tile, isPlayer) {
  if (isPlayer) {
    return "tile tile-player";
  }

  const kind = getTileInfo(tile).kind;
  const className = {
    wall: "tile-wall",
    floor: "tile-floor",
    key: "tile-key",
    door: "tile-door",
    item: "tile-item",
    monster: "tile-monster",
    stairsUp: "tile-stairs",
    stairsDown: "tile-stairs",
    exit: "tile-exit",
  }[kind] ?? "tile-floor";

  return `tile ${className}`;
}

function directionFromPosition(x, y) {
  if (!state) {
    return null;
  }

  if (x === state.position.x && y === state.position.y - 1) {
    return DIRECTIONS.up;
  }
  if (x === state.position.x && y === state.position.y + 1) {
    return DIRECTIONS.down;
  }
  if (x === state.position.x - 1 && y === state.position.y) {
    return DIRECTIONS.left;
  }
  if (x === state.position.x + 1 && y === state.position.y) {
    return DIRECTIONS.right;
  }
  return null;
}

function renderGrid() {
  grid.replaceChildren();

  if (!state) {
    for (let index = 0; index < 49; index += 1) {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile tile-floor";
      tile.disabled = true;
      tile.textContent = "";
      grid.append(tile);
    }
    return;
  }

  const floor = getCurrentFloor(state);
  floor.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      const isPlayer = state.position.x === x && state.position.y === y;
      const tileInfo = getTileInfo(tile);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = tileClass(tile, isPlayer);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute(
        "aria-label",
        isPlayer ? "Player position" : tileInfo.label
      );
      cell.textContent = isPlayer ? "You" : tileInfo.symbol;
      cell.addEventListener("click", () => {
        const direction = directionFromPosition(x, y);
        if (direction) {
          move(direction);
        }
      });
      grid.append(cell);
    });
  });
}

function render() {
  renderStats();
  renderGrid();
}

function move(direction) {
  if (!state) {
    startGame();
    return;
  }

  state = movePlayer(state, direction);
  saveState();
  render();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
moveButtons.forEach((button) => {
  button.addEventListener("click", () => move(button.dataset.move));
});

window.addEventListener("keydown", (event) => {
  const direction = {
    ArrowUp: DIRECTIONS.up,
    w: DIRECTIONS.up,
    W: DIRECTIONS.up,
    ArrowDown: DIRECTIONS.down,
    s: DIRECTIONS.down,
    S: DIRECTIONS.down,
    ArrowLeft: DIRECTIONS.left,
    a: DIRECTIONS.left,
    A: DIRECTIONS.left,
    ArrowRight: DIRECTIONS.right,
    d: DIRECTIONS.right,
    D: DIRECTIONS.right,
  }[event.key];

  if (direction) {
    event.preventDefault();
    move(direction);
  }
});

render();
