import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 buy an explorer", () => {
  const client = initClient({
    customState: {
      explorerDeckCount: 9,
      discards: {
        0: [],
      },
      hands: {
        0: [],
      },
      moneys: {
        0: 5,
      },
      plays: {
        0: ["scout_1", "scout_2", "scout_3", "scout_4", "scout_5"],
      },
    },
  });
  client.moves.buyExplorer();
  const { G } = client.getState();

  expect(G.discards["0"]).toStrictEqual(["explorer_2"]);
  expect(G.moneys["0"]).toBe(3);
});
