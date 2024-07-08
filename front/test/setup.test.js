import { expect, test } from "vitest";

import setup from "../src/game/setup.js";

test("Should setup for 2 players", () => {
  const random = {
    Shuffle: (arg) => arg,
  };
  const actualState = setup({ ctx: { numPlayers: 2 }, random });

  expect(actualState.influences["0"]).toBe(50);
  expect(actualState.influences["1"]).toBe(50);

  expect(actualState.hands["0"]).toHaveLength(3);
  expect(actualState.hands["0"][0]).toMatch(/viper_|scout_/);
  expect(actualState.hands["1"]).toHaveLength(5);

  expect(actualState.decks["0"]).toHaveLength(7);
  expect(actualState.decks["1"]).toHaveLength(5);

  expect(actualState.plays["0"]).toStrictEqual([]);
  expect(actualState.plays["1"]).toStrictEqual([]);
  expect(actualState.discards["0"]).toStrictEqual([]);
  expect(actualState.discards["1"]).toStrictEqual([]);

  expect(actualState.tradeDeck.length > 0).toBe(true);
  expect(actualState.tradeRow).toHaveLength(5);
  expect(actualState.explorerDeckCount).toBe(10);
  expect(actualState.scrapDeck).toStrictEqual([]);
});
