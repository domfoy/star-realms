import CARD_ACTIONS from "./card-actions/index.js";

export function getAbility(abilityInfo) {
  const action = CARD_ACTIONS[abilityInfo.cardName][abilityInfo.actionType];

  return Array.isArray(action) ? action[abilityInfo.index] : action;
}
