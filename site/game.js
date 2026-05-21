export const DIRECTIONS = Object.freeze({
  up: "up",
  down: "down",
  left: "left",
  right: "right",
});

const VECTORS = Object.freeze({
  [DIRECTIONS.up]: { x: 0, y: -1 },
  [DIRECTIONS.down]: { x: 0, y: 1 },
  [DIRECTIONS.left]: { x: -1, y: 0 },
  [DIRECTIONS.right]: { x: 1, y: 0 },
});

const TILE_INFO = Object.freeze({
  "#": { kind: "wall", label: "Wall", symbol: "" },
  ".": { kind: "floor", label: "Floor", symbol: "" },
  y: { kind: "key", label: "Yellow key", symbol: "Key" },
  Y: { kind: "door", label: "Yellow door", symbol: "Door" },
  R: { kind: "item", label: "Ruby potion", symbol: "HP" },
  S: { kind: "item", label: "Sword", symbol: "ATK" },
  s: { kind: "item", label: "Shield", symbol: "DEF" },
  a: { kind: "monster", label: "Tower sentry", symbol: "S" },
  b: { kind: "monster", label: "Iron keeper", symbol: "K" },
  ">": { kind: "stairsUp", label: "Stairs up", symbol: "Up" },
  "<": { kind: "stairsDown", label: "Stairs down", symbol: "Down" },
  E: { kind: "exit", label: "Exit", symbol: "Exit" },
});

const MONSTERS = Object.freeze({
  a: Object.freeze({ name: "Tower sentry", hp: 20, attack: 8, defense: 1, gold: 3 }),
  b: Object.freeze({ name: "Iron keeper", hp: 35, attack: 12, defense: 3, gold: 8 }),
});

const ITEM_EFFECTS = Object.freeze({
  R: { stat: "hp", amount: 40, message: "Ruby potion restored 40 HP." },
  S: { stat: "attack", amount: 5, message: "Sword raised attack by 5." },
  s: { stat: "defense", amount: 3, message: "Shield raised defense by 3." },
});

const FLOOR_BLUEPRINTS = [
  {
    name: "Lower Tower",
    tiles: [
      "#######",
      "#P.y..#",
      "#.###a#",
      "#.s..Y#",
      "#..R.>#",
      "#.S...#",
      "#######",
    ],
  },
  {
    name: "Upper Tower",
    tiles: [
      "#######",
      "#<..R.#",
      "#.###.#",
      "#..b..#",
      "#.##..#",
      "#..S.E#",
      "#######",
    ],
  },
];

const INITIAL_STATS = Object.freeze({
  hp: 100,
  attack: 10,
  defense: 5,
  gold: 0,
});

const INITIAL_INVENTORY = Object.freeze({
  yellowKeys: 0,
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseFloor(blueprint, floorIndex) {
  const tiles = blueprint.tiles.map((row) => [...row]);
  let start = null;
  let stairsUp = null;
  let stairsDown = null;

  for (let y = 0; y < tiles.length; y += 1) {
    for (let x = 0; x < tiles[y].length; x += 1) {
      const tile = tiles[y][x];
      if (tile === "P") {
        start = { x, y };
        tiles[y][x] = ".";
      }
      if (tile === ">") {
        stairsUp = { x, y };
      }
      if (tile === "<") {
        stairsDown = { x, y };
      }
    }
  }

  return {
    index: floorIndex,
    name: blueprint.name,
    tiles,
    start,
    stairsUp,
    stairsDown,
  };
}

function createFloors() {
  return FLOOR_BLUEPRINTS.map(parseFloor);
}

function normalizeState(state) {
  return {
    status: state.status,
    floorIndex: state.floorIndex,
    position: clone(state.position),
    stats: clone(state.stats),
    inventory: clone(state.inventory),
    floors: clone(state.floors),
    message: state.message,
    lastEvent: clone(state.lastEvent),
  };
}

function withMessage(state, message, lastEvent = { type: "notice" }) {
  return {
    ...state,
    message,
    lastEvent,
  };
}

function getTile(state, floorIndex, position) {
  const floor = state.floors[floorIndex];
  return floor?.tiles[position.y]?.[position.x];
}

function setTile(state, floorIndex, position, value) {
  state.floors[floorIndex].tiles[position.y][position.x] = value;
}

function moveTo(state, position, message, lastEvent) {
  return {
    ...state,
    position: clone(position),
    message,
    lastEvent,
  };
}

export function getTileInfo(tile) {
  return TILE_INFO[tile] ?? TILE_INFO["."];
}

export function newGame() {
  const floors = createFloors();

  return {
    status: "playing",
    floorIndex: 0,
    position: clone(floors[0].start),
    stats: clone(INITIAL_STATS),
    inventory: clone(INITIAL_INVENTORY),
    floors,
    message: "Find the exit at the top of the tower.",
    lastEvent: { type: "start" },
  };
}

export function calculateCombat(playerStats, monster) {
  const damagePerHit = Math.max(1, playerStats.attack - monster.defense);
  const rounds = Math.ceil(monster.hp / damagePerHit);
  const incomingHit = Math.max(1, monster.attack - playerStats.defense);
  const damageTaken = Math.max(0, rounds - 1) * incomingHit;
  const playerWins = playerStats.hp > damageTaken;

  return {
    playerWins,
    remainingHp: playerWins ? playerStats.hp - damageTaken : 0,
    damageTaken,
    gold: monster.gold,
    rounds,
  };
}

export function movePlayer(currentState, direction) {
  const vector = VECTORS[direction];
  const state = normalizeState(currentState);

  if (state.status !== "playing") {
    return withMessage(
      state,
      "The tower is silent. Restart to try again.",
      { type: "blocked", reason: "inactive" }
    );
  }

  if (!vector) {
    return withMessage(
      state,
      "Choose a valid direction.",
      { type: "blocked", reason: "invalid-direction" }
    );
  }

  const next = {
    x: state.position.x + vector.x,
    y: state.position.y + vector.y,
  };
  const tile = getTile(state, state.floorIndex, next);
  const info = getTileInfo(tile);

  if (!tile || info.kind === "wall") {
    return withMessage(
      state,
      "A wall blocks the way.",
      { type: "blocked", reason: "wall" }
    );
  }

  if (info.kind === "floor") {
    return moveTo(state, next, "Moved.", { type: "move" });
  }

  if (info.kind === "key") {
    setTile(state, state.floorIndex, next, ".");
    state.inventory.yellowKeys += 1;
    return moveTo(state, next, "Picked up a yellow key.", { type: "key" });
  }

  if (info.kind === "door") {
    if (state.inventory.yellowKeys < 1) {
      return withMessage(
        state,
        "A yellow key is required.",
        { type: "blocked", reason: "locked-door" }
      );
    }

    setTile(state, state.floorIndex, next, ".");
    state.inventory.yellowKeys -= 1;
    return moveTo(state, next, "Unlocked a yellow door.", { type: "door" });
  }

  if (info.kind === "item") {
    const effect = ITEM_EFFECTS[tile];
    setTile(state, state.floorIndex, next, ".");
    state.stats[effect.stat] += effect.amount;
    return moveTo(state, next, effect.message, {
      type: "item",
      stat: effect.stat,
      amount: effect.amount,
    });
  }

  if (info.kind === "monster") {
    const monster = MONSTERS[tile];
    const result = calculateCombat(state.stats, monster);

    if (!result.playerWins) {
      state.status = "dead";
      state.stats.hp = 0;
      return withMessage(
        state,
        `${monster.name} defeated you.`,
        { type: "death", monster: monster.name, damageTaken: result.damageTaken }
      );
    }

    setTile(state, state.floorIndex, next, ".");
    state.stats.hp = result.remainingHp;
    state.stats.gold += result.gold;
    return moveTo(state, next, `Defeated ${monster.name}.`, {
      type: "combat",
      monster: monster.name,
      damageTaken: result.damageTaken,
      gold: result.gold,
    });
  }

  if (info.kind === "stairsUp") {
    const nextFloorIndex = Math.min(state.floorIndex + 1, state.floors.length - 1);
    const destination = state.floors[nextFloorIndex].stairsDown;

    return {
      ...state,
      floorIndex: nextFloorIndex,
      position: clone(destination),
      message: `Reached ${state.floors[nextFloorIndex].name}.`,
      lastEvent: { type: "stairs", floorIndex: nextFloorIndex },
    };
  }

  if (info.kind === "stairsDown") {
    const nextFloorIndex = Math.max(state.floorIndex - 1, 0);
    const destination = state.floors[nextFloorIndex].stairsUp;

    return {
      ...state,
      floorIndex: nextFloorIndex,
      position: clone(destination),
      message: `Returned to ${state.floors[nextFloorIndex].name}.`,
      lastEvent: { type: "stairs", floorIndex: nextFloorIndex },
    };
  }

  if (info.kind === "exit") {
    return {
      ...state,
      status: "won",
      position: clone(next),
      message: "You reached the tower exit.",
      lastEvent: { type: "win" },
    };
  }

  return withMessage(
    state,
    "Nothing happens.",
    { type: "notice", reason: "unknown-tile" }
  );
}

export function walkPath(startState, directions) {
  return directions.reduce((state, direction) => movePlayer(state, direction), startState);
}

export function serializeGame(state) {
  return JSON.stringify(normalizeState(state));
}

export function restoreGame(serialized) {
  try {
    const parsed = JSON.parse(serialized);
    const required = [
      "status",
      "floorIndex",
      "position",
      "stats",
      "inventory",
      "floors",
      "message",
      "lastEvent",
    ];

    if (!required.every((key) => key in parsed)) {
      return newGame();
    }

    return normalizeState(parsed);
  } catch {
    return newGame();
  }
}

export function getCurrentFloor(state) {
  return state.floors[state.floorIndex];
}
