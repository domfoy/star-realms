import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

import setup from "./setup.js";

function clickCell({ G, playerID }, id) {
  if (G.cells[id] !== null) {
    return INVALID_MOVE;
  }
  G.cells[id] = playerID;
}

function isVictory(cells) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

function isDraw(cells) {
  return cells.filter((c) => c === null).length === 0;
}

export const TicTacToe = {
  endIf: ({ ctx, G }) => {
    if (isVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (isDraw(G.cells)) {
      return { draw: true };
    }
  },
  moves: {
    clickCell,
  },
  setup,
  turn: {
    minMoves: 1,
    maxMoves: 1,
  },
};
