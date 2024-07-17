export const initialGame = {
  highlightedCardRefs: [],
  moveCtx: null,
  moveName: null,
  playCtx: null,
};

function build

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
    draft.playCtx[draft.playCtx.abilityRef] = {
      cardRef,
    };
  },
  PLAY_CARD: (draft, { cardAbilities, cardRef }) => {
    const abilityNeedingContext = cardAbilities.find(
      (ability) => ability.needContext
    );
    if (!abilityNeedingContext) {
      draft.moveCtx = {
        cardRef,
      };
      draft.moveName = "playCard";
    }

    draft.playCtx = {
      abilityRef: abilityNeedingContext.ref,
      cardAbilities,
      cardRef,
    };
  },
};

export function mkGameReducer(ctx) {
  return (gameState, action) => {
    const actionReducer = ACTION_REDUCER[action.type];

    return actionReducer(gameState, action, ctx);
  };
}
