import { startingDeck as modelStartingDeck, cardList } from "../consts.js";

export default function setup({ random, ctx: { numPlayers } }) {
  const cardRefList = cardList.map((card) => card.Ref);
  const shuffledCardRefList = random.Shuffle(cardRefList);

  const initialState = {
    attacks: {},
    decks: {},
    discards: {},
    explorerDeckCount: 10,
    hands: {},
    influences: {},
    moneys: {},
    plays: {},
    scrapDeck: [],
    tradeDeck: shuffledCardRefList.slice(5),
    tradeRow: shuffledCardRefList.slice(0, 5),
  };
  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    const startingDeck = structuredClone(modelStartingDeck);
    const shuffledStartingDeck = random.Shuffle(startingDeck);
    const handCount = playerIndex === 0 ? 3 : 5;

    initialState.attacks[`${playerIndex}`] = 0;
    initialState.hands[`${playerIndex}`] = shuffledStartingDeck.slice(
      0,
      handCount
    );
    initialState.decks[`${playerIndex}`] =
      shuffledStartingDeck.slice(handCount);
    initialState.discards[`${playerIndex}`] = [];
    initialState.influences[`${playerIndex}`] = 50;
    initialState.moneys[`${playerIndex}`] = 0;
    initialState.plays[`${playerIndex}`] = [];
  }

  return initialState;
}
