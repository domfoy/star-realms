import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 scrap an explorer in their hand", () => {
  const client = initClient({
    customState: {
      attacks: { 0: 3 },
      hands: {
        0: [],
      },
      plays: {
        0: ["scout_4", "scout_5", "explorer_1", "scout_2"],
      },
      scrapDeck: [],
    },
  });
  client.moves.applyScrapAction({ cardRef: "explorer_1" });
  const { G } = client.getState();

  expect(G.scrapDeck).toStrictEqual(["explorer_1"]);
  expect(G.hands["0"]).toStrictEqual([]);
  expect(G.plays["0"]).toStrictEqual(["scout_4", "scout_5", "scout_2"]);
  expect(G.attacks["0"]).toBe(5);
});
