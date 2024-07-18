export const initialGame = {
  highlightedCardRefs: [],
  moveCtx: null,
  moveName: null,
  pendingAbilityIndex: null,
  playCtx: null,
};

function setAbilityContext(draft, contextInput) {
  const pendingAbility =
    draft.playCtx.abilities[draft.playCtx.pendingAbilityIndex];

  draft.playCtx.abilitiesCtx[pendingAbility.ref] =
    pendingAbility.handleSetContext(contextInput);

  if (draft.playCtx.pendingAbilityIndex < draft.playCtx.abilities.length - 1) {
    draft.playCtx.pendingAbilityIndex++;
  } else {
    draft.playCtx.pendingAbilityIndex = null;
    draft.moveCtx = {
      cardRef: draft.playCtx.cardRef,
      actionCtx: draft.playCtx.abilitiesCtx,
    };
    draft.moveName = "playCard";
  }
}

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
    setAbilityContext(draft, { cardRef });
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
      return;
    }

    draft.playCtx = {
      abilities,
      abilitiesCtx: {},
      cardRef,
      pendingAbilityIndex: 0,
    };
  },
};

export function gameReducer(gameState, action) {
  const actionReducer = ACTION_REDUCER[action.type];

  return actionReducer(gameState, action);
}
