import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

import { getCardNameByRef } from "./card.js";
import {
  EXPLORER_COST,
  EXPLORER_DECK_COUNT,
  cardDictionary,
} from "../consts.js";
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

function getAbilityUpdateGame(ctx, abilityRef) {
  const abilityInfo = ctx.G.abilities.find(
    (ability) => ability.ref === abilityRef
  );
  const action = CARD_ACTIONS[abilityInfo.cardName][abilityInfo.actionType];

  if (Array.isArray(action)) {
    return action[abilityInfo.index].updateGame;
  }
  return action.updateGame;
}

function applyAbility(ctx, abilityRef, abilityCtx) {
  const ability = ctx.G.abilities.find((ability) => ability.ref === abilityRef);
  const updateGame = getAbilityUpdateGame(ctx, abilityRef);

  updateGame(ctx, abilityCtx);
  ability.applied = true;
}

function checkAbilityIsApplicable(ctx, ability) {
  if (ability.applied) {
    return false;
  }
  if (ability.actionType === "primaryAction") {
    return true;
  }
  if (ability.actionType === "alliedAction") {
    const { G, playerID } = ctx;
    const cardFaction = cardDictionary[ability.cardName].faction;

    return G.plays[playerID]
      .filter((cardRef) => cardRef !== ability.cardRef)
      .map((cardRef) => cardDictionary[getCardNameByRef(cardRef)])
      .some((card) => card.faction === cardFaction);
  }
}

function applyAbilities(ctx, actionCtx) {
  const refs = ctx.G.abilities
    .filter((ability) => checkAbilityIsApplicable(ctx, ability, actionCtx))
    .map((ability) => ability.ref);

  for (const abilityRef of refs) {
    applyAbility(ctx, abilityRef, actionCtx?.[abilityRef] ?? {});
  }
}

function toArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return [obj].filter((x) => x);
}

export function buildCardAbilities(cardRef) {
  const cardName = getCardNameByRef(cardRef);
  const cardActions = CARD_ACTIONS[cardName];
  const primaryAbilities = toArray(cardActions.primaryAction).map(
    (ability, index) => ({
      index,
      ref: `${cardRef}_primary_${index}`,
      actionType: "primaryAction",
    })
  );
  const alliedAbilities = toArray(cardActions.alliedAction).map(
    (ability, index) => ({
      index,
      ref: `${cardRef}_allied_${index}`,
      actionType: "alliedAction",
    })
  );
  const scrapAbilities = toArray(cardActions.scrapAction).map(
    (ability, index) => ({
      index,
      ref: `${cardRef}_scrap_${index}`,
      actionType: "scrapAction",
    })
  );
  const cardAbilities = [
    ...primaryAbilities,
    ...alliedAbilities,
    ...scrapAbilities,
  ].map((ability) => ({
    ...ability,
    cardName,
    cardRef,
  }));

  return cardAbilities;
}

export function playCard(ctx, { cardRef, actionCtx }) {
  const { G, playerID } = ctx;
  const playerHand = G.hands[playerID];
  const cardIndex = playerHand.findIndex(
    (handCardRef) => handCardRef === cardRef
  );

  if (cardIndex < 0) {
    return INVALID_MOVE;
  }
  const playerPlays = G.plays[playerID];

  playerHand.splice(cardIndex, 1);
  playerPlays.push(cardRef);
  G.abilities.push(...buildCardAbilities(cardRef));
  applyAbilities(ctx, actionCtx);
}

export function playWholeHand(ctx) {
  const { G, playerID } = ctx;
  const playerHand = G.hands[playerID];

  while (playerHand.length) {
    const cardRef = playerHand[0];

    playCard(ctx, { cardRef });
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
  G.abilities = [];
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

export function applyScrapAction(ctx, { cardRef, ...scrapContext }) {
  const { G, playerID } = ctx;
  const cardIndex = G.plays[playerID].findIndex(
    (playedCardRef) => playedCardRef === cardRef
  );

  if (cardIndex < 0) {
    return INVALID_MOVE;
  }
  const abilityInfos = G.abilities.filter(
    (ctxAbilityInfo) =>
      ctxAbilityInfo.cardRef === cardRef &&
      ctxAbilityInfo.actionType === "scrapAction"
  );

  if (abilityInfos.length === 0) {
    return INVALID_MOVE;
  }

  G.plays[playerID].splice(cardIndex, 1);

  for (const abilityInfo of abilityInfos) {
    const updateGame = getAbilityUpdateGame(ctx, abilityInfo.ref);

    updateGame(ctx, scrapContext?.[abilityInfo.ref] ?? {});
    abilityInfo.applied = true;
  }
  G.scrapDeck.push(cardRef);
}
