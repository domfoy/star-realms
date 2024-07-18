import React, { createContext, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";

import { initialGame, gameReducer } from "./reducer.js";
import { getAbility } from "./game/ability.js";
// import { mkPlayedCardModal } from "./modal-card.jsx";

const GameContext = createContext(null);

// const PlayedCardModal = mkPlayedCardModal(GameContext);

function Card({ highlight = 0, label, onCardClick }) {
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
          border: `2px solid ${highlight ? "red" : "Bisque"}`,
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
  const { ctx, G, dispatch } = useContext(GameContext);
  const cardRefs = G.hands[playerID];
  const handleClick = (cardRef) => {
    if (ctx.currentPlayer !== playerID) {
      return;
    }
    const abilities = G.abilities
      .filter((abilityInfo) => abilityInfo.cardRef === cardRef)
      .filter(
        (abilityInfo) => !abilityInfo.applied && abilityInfo.handleInitContext
      )
      .map((abilityInfo) => ({
        ...abilityInfo,
        ...getAbility(abilityInfo),
      }));
    dispatch({ abilities, cardRef, type: "PLAY_CARD" });
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

function PlayBoard({ playerID }) {
  const gameContext = useContext(GameContext);
  const { G } = gameContext;
  const cardRefs = G.plays[playerID];

  return (
    <div
      style={{
        display: "flex",
        height: "15vh",
        justifyContent: "center",
      }}
    >
      {cardRefs.map((cardRef) => (
        <Card key={cardRef} label={cardRef}></Card>
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

function CentralRow() {
  const gameContext = useContext(GameContext);
  const { dispatch, G, gameState } = gameContext;
  return (
    <div
      style={{
        display: "flex",
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
        {G.tradeRow.map((cardRef) => {
          const highlight = gameState.highlightedCardRefs.includes(cardRef)
            ? 1
            : 0;
          const handleCardClick = () => {
            if (!highlight) {
              return;
            }
            dispatch({
              type: "CHOOSE_CARD",
              cardRef,
            });
          };

          return (
            <Card
              key={cardRef}
              label={cardRef}
              highlight={highlight}
              onCardClick={handleCardClick}
            ></Card>
          );
        })}
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

export function SRGameBoard(bgCtx) {
  const [gameState, dispatch] = useImmerReducer(gameReducer, initialGame);
  const ctx = {
    ...bgCtx,
    dispatch,
    gameState,
  };

  useEffect(() => {
    if (Number.isInteger(gameState.playCtx?.pendingAbilityIndex)) {
      gameState.playCtx?.abilities[
        gameState.playCtx?.pendingAbilityIndex
      ].handleInitContext(gameState);
    }
    if (gameState.moveName) {
      ctx.moves[gameState.moveName](gameState.moveCtx);
      dispatch({ type: "APPLIED_MOVE" });
    }
  }, [ctx]);

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
        {/* <PlayedCardModal
          cardRef={gameState.cardRef}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        ></PlayedCardModal> */}
        <PlayerSide playerID={"0"}></PlayerSide>
        <CentralRow></CentralRow>
        <PlayerSide playerID={"1"}></PlayerSide>
      </div>
    </GameContext.Provider>
  );
}
