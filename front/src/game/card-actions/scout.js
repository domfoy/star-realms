export const primaryAction = {
  message: "Add 1 Trade",
  updateGame: ({ G, playerID }) => {
    G.moneys[playerID] += 1;
  },
};
