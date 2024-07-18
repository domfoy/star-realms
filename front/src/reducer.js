export const initialGame = {
  highlightedCardRefs: [],
  moveCtx: null,
  moveName: null,
  playCtx: null,
};

const ACTION_REDUCER = {
  APPLIED_MOVE: (draft) => {
    draft.moveCtx = null;
    draft.moveName = null;
    draft.playCtx = null;
  },
  CHOOSE_CARD: (draft, { cardRef }) => {
    if (!draft.playCtx) {
      return;
    }
    draft.highlightedCardRefs = [];
    draft.playCtx.abilitiesCtx[draft.playCtx.abilityRef] = {
      cardRef,
    };
  },
  DEFINE_CHOOSE_POOL: (draft, { cardRefs }) => {
    draft.highlightedCardRefs = cardRefs;
  },
  PLAY_CARD: (draft, { abilities, cardRef }) => {
    if (!abilities.length) {
      draft.moveCtx = {
        cardRef,
      };
      draft.moveName = "playCard";
    }

    draft.playCtx = {
      abilities,
      abilitiesCtx: {},
      cardRef,
      pendingAbilityCtx: {
        ability: abilities.at(0),
      },
    };
  },
};

export function mkGameReducer(ctx) {
  return (gameState, action) => {
    const actionReducer = ACTION_REDUCER[action.type];

    return actionReducer(gameState, action, ctx);
  };
}
