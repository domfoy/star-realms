import {
  attack,
  applyScrapAction,
  buyExplorer,
  playAbility,
  playCard,
  playWholeHand,
  prepareNextTurn,
} from "./moves.js";

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
    applyScrapAction,
    buyExplorer,
    playAbility,
    playCard,
    playWholeHand,
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
