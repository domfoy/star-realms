import { Client } from "boardgame.io/client";

import { SRGame } from "../../src/game/index.js";
import setup from "../../src/game/setup.js";

export function initClient({
  customState = {},
  customGame = {},
  customRandom = {},
} = {}) {
  const random = {
    Shuffle: (arg) => arg,
  };

  const scenario = {
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

  return Client({
    game: scenario,
  });
}
