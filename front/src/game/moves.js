import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

import { getCardNameByRef } from "./card.js";
import { EXPLORER_COST, EXPLORER_DECK_COUNT } from "../consts.js";
import CARD_ACTIONS from "./card-actions/index.js";

function getTargetPlayerID({ G, playerID }) {
  const influenceIdList = Object.keys(G.influences);

  if (influenceIdList.length !== 2) {
    return INVALID_MOVE;
  }
  return influenceIdList.find((influenceId) => influenceId !== playerID);
}

function applyAttack({ G, targetPlayerID: rawTargetPLayerID, playerID }) {
  const targetPlayerID =
    rawTargetPLayerID ?? getTargetPlayerID({ G, playerID });

  G.influences[targetPlayerID] -= G.attacks[playerID];
  G.attacks[playerID] = 0;
}

export function attack({ G, playerID }, targetPlayerID) {
  if (G.attacks[playerID] === 0) {
    return INVALID_MOVE;
  }
  applyAttack({ G, targetPlayerID, playerID });
}

export function playCard(ctx, cardIndex) {
  const { G, playerID } = ctx;
  const playerHand = G.hands[playerID];

  if (playerHand.length <= cardIndex) {
    return INVALID_MOVE;
  }
  const playerPlays = G.plays[playerID];
  const playedCardRef = playerHand[cardIndex];

  playerHand.splice(cardIndex, 1);
  playerPlays.push(playedCardRef);
  const cardName = getCardNameByRef(playedCardRef);
  const cardActions = CARD_ACTIONS[cardName];
  const cardUpdateGame = cardActions?.primaryAction?.updateGame;

  if (cardUpdateGame) {
    cardUpdateGame(ctx);
  }
}

export function playWholeHand(ctx) {
  const { G, playerID } = ctx;
  const playerHand = G.hands[playerID];

  while (playerHand.length) {
    playerHand.unshift();

    playCard(ctx, 0);
  }
}

function moveCards(targetDeck, sourceDeck, rawNumber) {
  const number = rawNumber === undefined ? sourceDeck.length : rawNumber;
  const movedCards = sourceDeck.splice(0, number);

  targetDeck.push(...movedCards);
}

function moveCardsAcrossPlayerDecks({ G, playerID, random }) {
  const playerDeck = G.decks[playerID];
  const playerDiscard = G.discards[playerID];
  const playerHand = G.hands[playerID];
  const playerPlays = G.plays[playerID];

  moveCards(playerDiscard, playerPlays);
  moveCards(playerDiscard, playerHand);
  moveCards(playerHand, playerDeck, 5);
  const playerHandLength = playerHand.length;

  if (playerHandLength === 5) {
    return;
  }
  G.discards[playerID] = random.Shuffle(playerDiscard);
  moveCards(playerDeck, G.discards[playerID]);
  moveCards(playerHand, playerDeck, 5 - playerHandLength);
}

export function prepareNextTurn({ events, G, playerID, random }) {
  if (G.attacks[playerID] > 0) {
    applyAttack({ G, playerID });
  }
  moveCardsAcrossPlayerDecks({ G, playerID, random });
  G.moneys[playerID] = 0;
  events.endTurn();
}

export function buyExplorer({ G, playerID }) {
  if (G.explorerDeckCount <= 0 || G.moneys[playerID] < EXPLORER_COST) {
    return INVALID_MOVE;
  }
  const explorerCardRef = `explorer_${EXPLORER_DECK_COUNT - G.explorerDeckCount + 1}`;

  G.moneys[playerID] -= EXPLORER_COST;
  G.explorerDeckCount--;
  G.discards[playerID].push(explorerCardRef);
}

export function applyScrapAction(ctx, scrapContext) {
  const { G, playerID } = ctx;
  const { cardRef } = scrapContext;
  const cardIndex = G.plays[playerID].findIndex(
    (handCardRef) => handCardRef === cardRef
  );

  if (cardIndex < 0) {
    return INVALID_MOVE;
  }
  const cardName = getCardNameByRef(cardRef);
  const cardActions = CARD_ACTIONS[cardName];
  const cardUpdateGame = cardActions?.scrapAction?.updateGame;

  if (!cardUpdateGame) {
    return INVALID_MOVE;
  }
  G.plays[playerID].splice(cardIndex, 1);
  cardActions.scrapAction.updateGame(ctx, { ...scrapContext, cardIndex });
  G.scrapDeck.push(cardRef);
}
