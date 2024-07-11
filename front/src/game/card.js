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
    message: `Add ${combatPoints} Combat`,
    updateGame: ({ G, playerID }) => {
      G.attacks[playerID] += combatPoints;
    },
  };
}

export function addTrade(tradePoints) {
  return {
    message: `Add 2 Trade`,
    updateGame: ({ G, playerID }) => {
      G.moneys[playerID] += tradePoints;
    },
  };
}
