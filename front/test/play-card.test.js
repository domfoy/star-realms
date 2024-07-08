import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 play the second card in their hand", () => {
  const client = initClient({
    customState: {
      hands: {
        0: ["scout_1", "scout_2", "scout_3"],
      },
      plays: {
        0: ["scout_4", "scout_5"],
      },
    },
  });
  client.moves.playCard(1);
  const { G } = client.getState();

  expect(G.hands["0"]).toStrictEqual(["scout_1", "scout_3"]);
  expect(G.plays["0"]).toStrictEqual(["scout_4", "scout_5", "scout_2"]);
});

test("Should not let P1 play a card in their empty hand", () => {
  const client = initClient({
    customState: {
      hands: {
        0: [],
      },
      plays: {
        0: ["scout_1", "scout_2", "scout_3", "scout_4", "scout_5"],
      },
    },
  });
  client.moves.playCard(1);
  const { G } = client.getState();

  expect(G.hands["0"]).toStrictEqual([]);
  expect(G.plays["0"]).toStrictEqual([
    "scout_1",
    "scout_2",
    "scout_3",
    "scout_4",
    "scout_5",
  ]);
});
