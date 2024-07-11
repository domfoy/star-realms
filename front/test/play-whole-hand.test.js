import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 play their whole hand", () => {
  const client = initClient({
    customState: {
      attacks: {
        0: 0,
      },
      hands: {
        0: ["viper_1", "scout_2", "scout_3"],
      },
      plays: {
        0: ["scout_4", "scout_5"],
      },
      moneys: {
        0: 2,
      },
    },
  });
  client.moves.playWholeHand();
  const { G } = client.getState();

  expect(G.hands["0"]).toStrictEqual([]);
  expect(G.plays["0"]).toStrictEqual([
    "scout_4",
    "scout_5",
    "viper_1",
    "scout_2",
    "scout_3",
  ]);
  expect(G.attacks[0]).toBe(1);
  expect(G.moneys[0]).toBe(4);
});
