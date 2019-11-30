const GOT_PLOTS = "GOT_PLOTS";

export const gotPlots = plots => ({ type: GOT_PLOTS, plots });

export const plotState = {
  areaPlots: []
};

export const plotReducer = (state = plotState, action) => {
  switch (action.type) {
    case GOT_PLOTS:
      return { ...state, areaPlots: action.plots };
    default:
      return state;
  }
};
