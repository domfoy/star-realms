export const primaryAction = {
  message: "Add 1 Combat",
  updateGame: ({ G, playerID }) => {
    G.attacks[playerID] += 1;
  },
};
