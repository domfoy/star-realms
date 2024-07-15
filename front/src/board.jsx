import React, { createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

import { initialGame, gameReducer } from "./reducer.js";
import { default as CARD_ACTIONS } from "./game/card-actions/index.js";
import { Modal } from "./modal-card.jsx";

import { getCardByRef, getAbility } from "./game/card.js";

const GameContext = createContext(null);

function Card({ label, onCardClick }) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <button
        onClick={onCardClick}
        style={{
          aspectRatio: 2 / 3,
          backgroundColor: "Beige",
          border: "2px solid Bisque",
          borderRadius: 15,
          boxShadow: "4px 4px 4px",
          boxSizing: "border-box",
          height: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            overflowWrap: "break-word",
          }}
        >
          {label}
        </div>
      </button>
    </div>
  );
}

function Hand({ playerID }) {
  const { ctx, G, moves } = useContext(GameContext);
  const cardRefs = G.hands[playerID];
  const handleClick = (cardRef) => {
    if (ctx.currentPlayer !== playerID) {
      return;
    }
    moves.playCard({ cardRef });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {cardRefs.map((cardRef) => (
        <Card
          key={cardRef}
          label={cardRef}
          onCardClick={() => handleClick(cardRef)}
        ></Card>
      ))}
    </div>
  );
}

function ActionButton({ playerID }) {
  const { ctx, G, moves } = useContext(GameContext);

  if (ctx.currentPlayer !== playerID) {
    return null;
  }
  if (G.hands[playerID].length > 0) {
    return <button onClick={() => moves.playWholeHand()}>Play all</button>;
  }
  if (G.attacks[playerID] > 0) {
    return <button onClick={() => moves.attack()}>Attack</button>;
  }
  if (G.hands[playerID].length === 0) {
    return <button onClick={() => moves.prepareNextTurn()}>End Turn</button>;
  }
  return null;
}

function PlayerInfo({ playerID }) {
  const { ctx, G } = useContext(GameContext);
  const isCurrentPlayer = ctx.currentPlayer === playerID;

  return (
    <div
      style={{
        display: "flex",
        boxSizing: "border-box",
        padding: 8,
        borderRadius: 10,
        border: isCurrentPlayer ? "1px solid" : null,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div>Influence: {G.influences[playerID]}</div>
      <div>Deck: {G.decks[playerID].length}</div>
      <div>Discard: {G.discards[playerID].length}</div>
      {isCurrentPlayer ? (
        <>
          <div>Money: {G.moneys[playerID]}</div>
          <div>Attack: {G.attacks[playerID]}</div>
        </>
      ) : null}
      <div>
        <ActionButton playerID={playerID}></ActionButton>
      </div>
    </div>
  );
}

function PlayerSide({ playerID }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "5vw",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Hand playerID={playerID}></Hand>
          <PlayBoard playerID={playerID}></PlayBoard>
        </div>
        <PlayerInfo playerID={playerID}></PlayerInfo>
      </div>
    </div>
  );
}

function FullCard({ name, abilities }) {
  const

  return (
    <section>
      <h2>{name}</h2>
      {card.scrapAction ? (
        <button onClick={card.scrapAction.apply}>
          Scrap: {card.scrapAction.message}
        </button>
      ) : null}
    </section>
  );
}

function buildFullCard(gameContext, cardRef) {
  const card = getCardByRef(cardRef);
  const abilities = gameContext.G.abilities
    .filter(
      (abilityInfo) => abilityInfo.cardRef === cardRef && !abilityInfo.applied
    )
    .map((abilityInfo) => ({
      ...abilityInfo,
      ...getAbility(abilityInfo),
    }));
  const uiCard = {
    ...card,
  };


  if (abilities.length) {
    uiCard.scrapAction = {
      apply: async () => {
        const scrapContext = await scrapAction?.applyUiAction?.(gameContext, {
          cardRef,
        });
        gameContext.moves.applyScrapAction({ ...scrapContext, cardRef });
        gameContext.dispatch({ type: "CLOSE_MODAL" });
      },
      message: scrapAction.message,
    };
  }

  return <FullCard card={uiCard}></FullCard>;
}

function PlayBoard({ playerID }) {
  const gameContext = useContext(GameContext);
  const { dispatch, G } = gameContext;
  const cardRefs = G.plays[playerID];

  const openCardModal = (cardRef) => {
    const fullCard = buildFullCard(gameContext, cardRef);

    dispatch({ component: fullCard, type: "OPEN_MODAL" });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "15vh",
        justifyContent: "center",
      }}
    >
      {cardRefs.map((cardRef) => (
        <Card
          key={cardRef}
          label={cardRef}
          onCardClick={() => openCardModal(cardRef)}
        ></Card>
      ))}
    </div>
  );
}

function ExplorerDeck() {
  const { G, moves } = useContext(GameContext);
  const name =
    G.explorerDeckCount > 0
      ? `explorer (${G.explorerDeckCount})`
      : `No explorer left`;
  return <Card label={name} onCardClick={() => moves.buyExplorer()}></Card>;
}

function CentralRow({ tradeRowCardRefs, flexGrow }) {
  return (
    <div
      style={{
        display: "flex",
        flexGrow,
        justifyContent: "center",
        gap: "15px",
      }}
    >
      <ExplorerDeck></ExplorerDeck>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {tradeRowCardRefs.map((cardRef) => (
          <Card key={cardRef} label={cardRef}></Card>
        ))}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <Card label={"TRADE DECK"}></Card>
        <Card label={"SCRAP DECK"}></Card>
      </div>
    </div>
  );
}

export function SRGameBoard(ctx) {
  const [gameState, dispatch] = useImmerReducer(gameReducer, initialGame);

  return (
    <GameContext.Provider value={{ ...ctx, dispatch, gameState }}>
      <div
        style={{
          boxSizing: "border-box",
          padding: "16px 20vw 16px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Modal
          component={gameState.modalComponent}
          showModal={gameState.showModal}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        />
        <PlayerSide playerID={"0"}></PlayerSide>
        <CentralRow tradeRowCardRefs={ctx.G.tradeRow}></CentralRow>
        <PlayerSide playerID={"1"}></PlayerSide>
      </div>
    </GameContext.Provider>
  );
}
