import { expect, test } from "vitest";

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Client } from "boardgame.io/react";
import { SRGameBoard } from "../src/board.jsx";
import { initGame } from "./lib/index.js";

test("Play a battle pod and use its scrap-a-card-in-trade-row action with none option", async () => {
  const App = Client({
    board: SRGameBoard,
    game: initGame(),
  });
  render(<App />);

  await userEvent.click(screen.getByText("Battle pod"));
  expect(screen.queryByText(testMessage)).toBeNull();
  /**
   * Precondition: player has 5 cards in their hand, including one battle pod
   * Click on the battle pod card
   * Check:
   *   4 combat added
   *   card is played
   *   message "You may scrap a card in the trade row" is present
   * Click on "None"
   * Check: turn is over
   */
});
