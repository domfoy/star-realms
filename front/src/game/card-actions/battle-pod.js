import { addCombat, scrapCardInTradeRow } from "../card.js";

export const primaryAction = [addCombat(4), scrapCardInTradeRow()];
export const alliedAction = addCombat(2);
