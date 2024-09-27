import { Client } from "boardgame.io/client";

import { SRGame } from "../../src/game/index.js";
import setup from "../../src/game/setup.js";

const random = {
  Shuffle: (arg) => arg,
};

export function initGame({
  customState = {},
  customGame = {},
  customRandom = {},
} = {}) {
  return {
    ...SRGame,
    setup: () => {
      const initialState = setup({
        ctx: { numPlayers: 2 },
        random: { ...random, ...customRandom },
      });

      return {
        ...initialState,
        ...customState,
      };
    },
    ...customGame,
  };
}

export function initClient(ctx) {
  return Client({
    game: initGame(ctx),
  });
}
