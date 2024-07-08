// import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";
import { attack, playCard, prepareNextTurn } from "./moves.js";

import setup from "./setup.js";

export const SRGame = {
  endIf: ({ ctx, G }) => {
    for (const playerID of Object.keys(G.influences)) {
      if (G.influences[playerID] <= 0) {
        return { winner: ctx.currentPlayer };
      }
    }
  },
  moves: {
    attack,
    playCard,
    prepareNextTurn,
  },
  setup,
  turn: {
    minMoves: 1,
    stages: {
      noHandNoAttack: {
        moves: {
          prepareNextTurn,
        },
      },
    },
  },
};
