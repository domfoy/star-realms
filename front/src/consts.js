import { default as allTemplateCardList } from "../data/cards.json";

export const baseTemplateCardList = allTemplateCardList.filter(
  (card) => card.basic
);

export const nonBaseTemplateCardList = allTemplateCardList.filter(
  (card) => !card.basic
);

export const coreSetTemplateCardList = nonBaseTemplateCardList.filter(
  (card) => card.set === "Core Set"
);
export const templateCardList =
  coreSetTemplateCardList.concat(baseTemplateCardList);

export const cardDictionary = Object.fromEntries(
  templateCardList.map((card) => [card.name, card])
);

export const coreSetCardList = coreSetTemplateCardList
  .map((card) =>
    Array.from({ length: card.qty }, (_, index) => ({
      ...card,
      ref: `${card.name}_${index + 1}`,
    }))
  )
  .flat();

export const startingDeck = [
  // ...Array.from({ length: 8 }, (_, index) => `scout_${index + 1}`),
  // ...Array.from({ length: 2 }, (_, index) => `viper_${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `battlePod_${index + 1}`),
];

const explorer = baseTemplateCardList.find((card) => card.name === "explorer");

export const EXPLORER_COST = explorer.cost;
export const EXPLORER_DECK_COUNT = 10;
