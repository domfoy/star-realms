import React, { useContext, useRef, useEffect } from "react";
import "./modal-card.css";

import { getAbility } from "./game/ability.js";
import { getCardByRef } from "./game/card.js";

function Modal({ component, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (component) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [component, onClose]);

  if (!component) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        {component}
      </div>
    </div>
  );
}

function FullCard({ name, onCardClick, message }) {
  return (
    <section>
      <h2>{name}</h2>
      {onCardClick ? <button onClick={onCardClick}>{message}</button> : null}
    </section>
  );
}

function buildComponent({ abilities, cardRef, gameContext }) {
  const card = getCardByRef(cardRef);
  const uiCard = {
    ...card,
  };

  let message;
  let onCardClick;

  if (abilities.length) {
    message = abilities.map((ability) => ability.message).join("\n");
    onCardClick = async () => {
      const actionCtx = {};

      for (const ability of abilities) {
        actionCtx[ability.ref] = await ability.applyUi?.(gameContext, {
          cardRef,
        });
      }
      gameContext.dispatch({ type: "CLOSE_MODAL" });
      gameContext.moves.playCard({
        cardRef,
        actionCtx: gameContext.gameState.actionCtx,
      });
    };
  }

  return (
    <FullCard
      card={uiCard}
      message={message}
      onCardClick={onCardClick}
    ></FullCard>
  );
}

export function mkPlayedCardModal(GameContext) {
  const gameContext = useContext(GameContext);

  return function PlayedCardModal({ cardRef, onClose }) {
    const abilities = gameContext.G.abilities
      .filter((abilityInfo) => !abilityInfo.applied)
      .map((abilityInfo) => ({
        ...abilityInfo,
        ...getAbility(abilityInfo),
      }));
    const component = buildComponent({ abilities, cardRef, gameContext });

    return <Modal component={component} onClose={onClose}></Modal>;
  };
}
