import { expect, test } from "vitest";

import { initClient } from "./lib/index.js";

test("Should let P1 attack P2", () => {
  const client = initClient({
    customState: {
      attacks: {
        0: 5,
        1: 0,
      },
      influences: {
        0: 20,
        1: 20,
      },
    },
  });
  client.moves.attack("1");
  const { G } = client.getState();

  expect(G.influences["1"]).toBe(15);
  expect(G.attacks["0"]).toBe(0);
});

test("Should let P1 kill P2", () => {
  const client = initClient({
    customState: {
      attacks: {
        0: 25,
        1: 0,
      },
      influences: {
        0: 20,
        1: 20,
      },
    },
  });
  client.moves.attack("1");
  const { G } = client.getState();

  expect(G.influences["1"]).toBe(-5);
  expect(G.attacks["0"]).toBe(0);
});

test("When P1 has 0 attack points, should NOT let P1 attack P2", () => {
  const client = initClient({
    customState: {
      attacks: {
        0: 0,
        1: 0,
      },
      influences: {
        0: 20,
        1: 20,
      },
    },
  });
  client.moves.attack("1");
  const { G } = client.getState();

  expect(G.influences["1"]).toBe(20);
  expect(G.attacks["0"]).toBe(0);
});
