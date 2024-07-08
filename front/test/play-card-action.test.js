import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 play a scout in their hand", () => {
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
  expect(G.moneys["0"]).toBe(1);
});

test("Should let P1 play a viper in their hand", () => {
  const client = initClient({
    customState: {
      hands: {
        0: ["viper_1", "scout_2", "scout_3"],
      },
      plays: {
        0: ["scout_4", "scout_5"],
      },
    },
  });
  client.moves.playCard(0);
  const { G } = client.getState();

  expect(G.hands["0"]).toStrictEqual(["scout_2", "scout_3"]);
  expect(G.plays["0"]).toStrictEqual(["scout_4", "scout_5", "viper_1"]);
  expect(G.attacks["0"]).toBe(1);
});

test("Should let P1 play an explorer in their hand", () => {
  const client = initClient({
    customState: {
      hands: {
        0: ["explorer_2", "scout_2", "scout_3"],
      },
      plays: {
        0: ["scout_4", "scout_5"],
      },
    },
  });
  client.moves.playCard(0);
  const { G } = client.getState();

  expect(G.hands["0"]).toStrictEqual(["scout_2", "scout_3"]);
  expect(G.plays["0"]).toStrictEqual(["scout_4", "scout_5", "explorer_2"]);
  expect(G.moneys["0"]).toBe(2);
});
