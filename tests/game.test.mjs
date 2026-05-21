import assert from "node:assert/strict";
import test from "node:test";

import {
  DIRECTIONS,
  calculateCombat,
  movePlayer,
  newGame,
  restoreGame,
  serializeGame,
  walkPath,
} from "../site/game.js";

test("newGame creates an active floor-one state with stats and inventory", () => {
  const state = newGame();

  assert.equal(state.status, "playing");
  assert.equal(state.floorIndex, 0);
  assert.deepEqual(state.position, { x: 1, y: 1 });
  assert.deepEqual(Object.keys(state.stats).sort(), [
    "attack",
    "defense",
    "gold",
    "hp",
  ]);
  assert.equal(state.inventory.yellowKeys, 0);
  assert.equal(state.message.includes("Find the exit"), true);
});

test("movement blocks walls and unknown directions without mutating state", () => {
  const state = newGame();

  const wallResult = movePlayer(state, DIRECTIONS.left);
  assert.equal(wallResult.position.x, 1);
  assert.equal(wallResult.position.y, 1);
  assert.equal(wallResult.message, "A wall blocks the way.");

  const invalidResult = movePlayer(state, "northwest");
  assert.equal(invalidResult.position.x, 1);
  assert.equal(invalidResult.position.y, 1);
  assert.equal(invalidResult.message, "Choose a valid direction.");

  assert.equal(state.message.includes("Find the exit"), true);
});

test("the first floor path collects a key, wins combat, opens a door, and climbs stairs", () => {
  let state = newGame();

  state = walkPath(state, [
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
  ]);
  assert.equal(state.inventory.yellowKeys, 1);

  state = movePlayer(state, DIRECTIONS.down);
  assert.equal(state.lastEvent.type, "combat");
  assert.equal(state.stats.hp, 94);
  assert.equal(state.stats.gold, 3);

  state = movePlayer(state, DIRECTIONS.down);
  assert.equal(state.lastEvent.type, "door");
  assert.equal(state.inventory.yellowKeys, 0);

  state = movePlayer(state, DIRECTIONS.down);
  assert.equal(state.lastEvent.type, "stairs");
  assert.equal(state.floorIndex, 1);
  assert.deepEqual(state.position, { x: 1, y: 1 });
});

test("items change stats and combat uses deterministic damage math", () => {
  let state = newGame();
  state = walkPath(state, [
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.right,
  ]);
  assert.equal(state.stats.defense, 8);

  state = walkPath(state, [
    DIRECTIONS.left,
    DIRECTIONS.down,
    DIRECTIONS.right,
    DIRECTIONS.right,
  ]);
  assert.equal(state.stats.hp, 140);

  state = walkPath(state, [
    DIRECTIONS.down,
    DIRECTIONS.left,
  ]);
  assert.equal(state.stats.attack, 15);

  assert.deepEqual(
    calculateCombat(
      { hp: 100, attack: 10, defense: 5 },
      { hp: 20, attack: 8, defense: 1, gold: 3 }
    ),
    { playerWins: true, remainingHp: 94, damageTaken: 6, gold: 3, rounds: 3 }
  );
});

test("a complete route exists from a new game to the victory state", () => {
  const state = walkPath(newGame(), [
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.down,
    DIRECTIONS.down,
    DIRECTIONS.right,
  ]);

  assert.equal(state.status, "won");
  assert.equal(state.lastEvent.type, "win");
});

test("fatal combat marks the game dead and prevents later movement", () => {
  let state = newGame();
  state.stats.hp = 1;
  state = walkPath(state, [
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.right,
    DIRECTIONS.down,
  ]);

  assert.equal(state.status, "dead");
  assert.equal(state.stats.hp, 0);

  const afterDeath = movePlayer(state, DIRECTIONS.down);
  assert.deepEqual(afterDeath.position, state.position);
  assert.equal(afterDeath.message, "The tower is silent. Restart to try again.");
});

test("game state serializes and restores without sharing mutable floor data", () => {
  const original = walkPath(newGame(), [
    DIRECTIONS.right,
    DIRECTIONS.right,
  ]);
  const restored = restoreGame(serializeGame(original));

  assert.deepEqual(restored.position, original.position);
  assert.deepEqual(restored.stats, original.stats);
  assert.deepEqual(restored.inventory, original.inventory);

  const moved = movePlayer(restored, DIRECTIONS.right);
  assert.notDeepEqual(moved.position, original.position);
  assert.deepEqual(original.position, { x: 3, y: 1 });
});
