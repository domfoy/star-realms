import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";
import { buildCardAbilities } from "../src/game/moves.js";

test("Should let P1 scrap an explorer in their hand", () => {
  const client = initClient({
    customState: {
      abilities: buildCardAbilities("explorer_1"),
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

test("Should let P1 scrap a battle blob in their hand", () => {
  const client = initClient({
    customState: {
      abilities: buildCardAbilities("battleBlob_1"),
      attacks: { 0: 8 },
      hands: {
        0: [],
      },
      plays: {
        0: ["scout_4", "scout_5", "explorer_1", "battleBlob_1"],
      },
      scrapDeck: [],
    },
  });
  client.moves.applyScrapAction({ cardRef: "battleBlob_1" });
  const { G } = client.getState();

  expect(G.scrapDeck).toStrictEqual(["battleBlob_1"]);
  expect(G.hands["0"]).toStrictEqual([]);
  expect(G.plays["0"]).toStrictEqual(["scout_4", "scout_5", "explorer_1"]);
  expect(G.attacks["0"]).toBe(12);
});
