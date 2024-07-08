import { cardList } from "../consts.js";

const NAME_BY_REF_REGEX = /^(.+)_(\d)$/;

function getCardNameByRef(ref) {
  const result = NAME_BY_REF_REGEX.exec(ref);

  return result[1];
}

export function findCardByRef(fullRef) {
  const ref = getCardNameByRef(fullRef);

  return cardList.find((card) => card.Ref === ref);
}

const ACTION_HANDLERS = {
  GET_ATTACK: ({ G, playerID, action }) => {
    G.attacks[playerID] += action.amount;
  },
  GET_MONEY: ({ G, playerID, action }) => {
    G.moneys[playerID] += action.amount;
  },
};

export function applyAction(ctx) {
  const subActions = ctx.action;

  for (const subAction of subActions) {
    const actionType = subAction.type;

    ACTION_HANDLERS[actionType]({
      ...ctx,
      action: subAction,
    });
  }
}
