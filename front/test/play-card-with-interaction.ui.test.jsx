/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest";

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Client } from "boardgame.io/react";
import { SRGameBoard } from "../src/board.jsx";
import { initGame } from "./lib/index.js";

test.only("Play a battle pod and use its scrap-a-card-in-trade-row action with none option", async () => {
  const App = Client({
    board: SRGameBoard,
    game: initGame({
      customState: {
        attacks: {
          0: 0,
        },
        hands: {
          0: ["battle_pod_1", "scout_2", "scout_3", "scout_4", "scout_5"],
        },
        plays: {
          0: [],
        },
        tradeDeck: [
          "battle_pod_2",
          "battle_pod_3",
          "battle_pod_4",
          "battle_pod_5",
          "battle_pod_6",
        ],
      },
    }),
  });
  await render(<App />);
  // expect(screen.queryByText("Battle pod")).toBeTruthy();
  // await userEvent.click(screen.getByText("Battle pod"));
  // expect(
  //   screen.queryByText("You may scrap a card in the trade row")
  // ).toBeTruthy();
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
