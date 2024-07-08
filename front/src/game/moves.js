import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

import { applyAction, findCardByRef } from "./card.js";

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
  const card = findCardByRef(playedCardRef);

  if (card.PrimaryAction) {
    applyAction({
      ...ctx,
      action: card.PrimaryAction,
    });
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
