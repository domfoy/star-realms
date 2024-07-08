import { default as allCardList } from "./cards.json";

import { default as specialCardList } from "./special_cards.json";

export const cardList = allCardList
  .filter((card) => card.Set === "Core Set")
  .concat(specialCardList);

export const startingDeck = [
  ...Array.from({ length: 8 }, (_, index) => `scout_${index + 1}`),
  ...Array.from({ length: 2 }, (_, index) => `viper_${index + 1}`),
];
