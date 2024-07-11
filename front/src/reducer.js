export const initialGame = {
  modalComponent: null,
  showModal: false,
};

const ACTION_REDUCER = {
  CLOSE_MODAL: (draft) => {
    draft.showModal = false;
    draft.modalComponent = null;
  },
  OPEN_MODAL: (draft, { component }) => {
    draft.modalComponent = component;
    draft.showModal = true;
  },
};

export function gameReducer(gameState, action) {
  const actionReducer = ACTION_REDUCER[action.type];

  return actionReducer(gameState, action);
}
