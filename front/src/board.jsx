import React, { createContext, useContext } from "react";

const GameContext = createContext(null);

function Card({ name, onCardClick }) {
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
          {name}
        </div>
      </button>
    </div>
  );
}

function Hand({ playerID }) {
  const { ctx, G, moves } = useContext(GameContext);
  const cardRefs = G.hands[playerID];
  const onCardClick = (cardIndex) => {
    if (ctx.currentPlayer !== playerID) {
      return;
    }
    moves.playCard(cardIndex);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {cardRefs.map((cardRef, cardIndex) => (
        <Card
          key={cardRef}
          name={cardRef}
          onCardClick={() => onCardClick(cardIndex)}
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
  if (G.attacks[playerID] > 0) {
    return <button onClick={() => moves.attack()}>Attack!</button>;
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
        <ActionButton playerID={playerID}>End Turn</ActionButton>
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
  const { G } = useContext(GameContext);
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
        <Card key={cardRef} name={cardRef}></Card>
      ))}
    </div>
  );
}

function CentralRow({ tradeRowCardRefs, flexGrow }) {
  return (
    <div
      style={{
        display: "flex",
        flexGrow,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          paddingRight: "5vw",
        }}
      >
        <Card name={"explorer"}></Card>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {tradeRowCardRefs.map((cardRef) => (
          <Card key={cardRef} name={cardRef}></Card>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          paddingLeft: "5vw",
        }}
      >
        <Card name={"TRADE DECK"}></Card>
        <Card name={"DISCARD DECK"}></Card>
      </div>
    </div>
  );
}

export function SRGameBoard(ctx) {
  return (
    <GameContext.Provider value={ctx}>
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
        {<PlayerSide playerID={"0"}></PlayerSide>}
        {<CentralRow tradeRowCardRefs={ctx.G.tradeRow}></CentralRow>}
        {<PlayerSide playerID={"1"}></PlayerSide>}
      </div>
    </GameContext.Provider>
  );
}
