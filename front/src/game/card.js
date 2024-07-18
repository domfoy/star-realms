import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

import { cardDictionary } from "../consts.js";

const NAME_BY_FULL_REF_REGEX = /^(.+)_(\d)$/;

export function getCardNameByRef(cardRef) {
  const result = NAME_BY_FULL_REF_REGEX.exec(cardRef);

  return result[1];
}

export function getCardByRef(cardRef) {
  const cardName = getCardNameByRef(cardRef);

  return cardDictionary[cardName];
}

export function addCombat(combatPoints) {
  return {
    message: `Add ${combatPoints} Combat.`,
    updateGame: ({ G, playerID }) => {
      G.attacks[playerID] += combatPoints;
    },
  };
}

export function addTrade(tradePoints) {
  return {
    message: `Add ${tradePoints} Trade.`,
    updateGame: ({ G, playerID }) => {
      G.moneys[playerID] += tradePoints;
    },
  };
}

export function scrapCardInTradeRow() {
  const message = "You may scrap a card in the trade row.";

  return {
    applyUi: async (gameContext) => {
      gameContext.dispatch({
        cardRefs: gameContext.G.tradeRow,
        type: "DEFINE_CHOOSE_POOL",
      });
    },
    message,
    updateGame: ({ G }, { scrapedTradeRowCardRef }) => {
      if (!scrapedTradeRowCardRef) {
        return;
      }
      const cardIndex = G.tradeRow.findIndex(
        (tradeRowCardRef) => tradeRowCardRef === scrapedTradeRowCardRef
      );

      if (cardIndex < 0) {
        return INVALID_MOVE;
      }
      const cardRefFromTradeDeck = G.tradeDeck.pop();

      G.tradeRow.splice(cardIndex, 1, cardRefFromTradeDeck);
      G.scrapDeck.push(scrapedTradeRowCardRef);
    },
  };
}

function drawOneCard({ G, playerID, random }) {
  if (!G.decks[playerID].length) {
    G.decks[playerID] = random.Shuffle(G.discards[playerID]);
    G.discards[playerID] = [];
  }
  const drawnCard = G.decks[playerID].pop();

  G.hands[playerID].push(drawnCard);
}

export function drawCards(cardCount) {
  return {
    message: `Draw ${cardCount > 1 ? `${cardCount} cards` : "a card."}`,
    updateGame: (ctx) => {
      for (let i = 0; i < cardCount; i++) {
        drawOneCard(ctx);
      }
    },
  };
}
