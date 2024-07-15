import { addCombat, drawCards } from "../card.js";

export const primaryAction = addCombat(8);
export const scrapAction = addCombat(4);
export const alliedAction = drawCards(1);
