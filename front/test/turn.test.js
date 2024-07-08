import { expect, test } from "vitest";
import { MockRandom } from "boardgame.io/testing";

import { initClient } from "./lib/index.js";

test("Should prepare next turn without deck reset", () => {
  const client = initClient({
    customState: {
      decks: {
        0: ["viper_2", "scout_4", "scout_5", "scout_6", "scout_7", "scout_8"],
      },
      discards: {
        0: ["viper_1"],
      },
      hands: {
        0: ["scout_3"],
      },
      plays: {
        0: ["scout_1", "scout_2"],
      },
      attacks: {
        0: 5,
      },
      influences: {
        0: 20,
        1: 20,
      },
      moneys: {
        0: 2,
      },
    },
  });
  client.moves.prepareNextTurn();
  const { ctx, G } = client.getState();

  expect(ctx.currentPlayer).toBe("1");
  expect(G.attacks["0"]).toBe(0);
  expect(G.moneys["0"]).toBe(0);
  expect(G.influences["0"]).toBe(20);
  expect(G.influences["1"]).toBe(15);
  expect(G.discards["0"]).toStrictEqual([
    "viper_1",
    "scout_1",
    "scout_2",
    "scout_3",
  ]);
  expect(G.hands["0"]).toStrictEqual([
    "viper_2",
    "scout_4",
    "scout_5",
    "scout_6",
    "scout_7",
  ]);
  expect(G.decks["0"]).toStrictEqual(["scout_8"]);
});

test("Should prepare next turn with deck reset", () => {
  const randomPlugin = MockRandom({
    Shuffle: () => [
      "scout_4",
      "scout_5",
      "scout_6",
      "scout_7",
      "scout_8",
      "viper_1",
      "scout_1",
      "scout_2",
      "scout_3",
    ],
  });
  const client = initClient({
    customGame: {
      plugins: [randomPlugin],
    },
    customState: {
      decks: {
        0: ["viper_2"],
      },
      discards: {
        0: ["scout_4", "scout_5", "scout_6", "scout_7", "scout_8", "viper_1"],
      },
      hands: {
        0: ["scout_3"],
      },
      plays: {
        0: ["scout_1", "scout_2"],
      },
      attacks: {
        0: 5,
      },
      influences: {
        0: 20,
        1: 20,
      },
    },
  });
  client.moves.prepareNextTurn();
  const { G } = client.getState();

  expect(G.attacks["0"]).toBe(0);
  expect(G.influences["0"]).toBe(20);
  expect(G.influences["1"]).toBe(15);
  expect(G.discards["0"]).toHaveLength(0);
  expect(G.hands["0"]).toStrictEqual([
    "viper_2",
    "scout_4",
    "scout_5",
    "scout_6",
    "scout_7",
  ]);
  expect(G.decks["0"]).toStrictEqual([
    "scout_8",
    "viper_1",
    "scout_1",
    "scout_2",
    "scout_3",
  ]);
});
