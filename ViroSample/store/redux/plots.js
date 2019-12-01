import { FirebaseWrapper } from "../../firebase/firebase";

export const GOT_ALL_PLOTS = "GOT_ALL_PLOTS";
export const MADE_NEW_PLOT = "MADE_NEW_PLOT";

export const gotAllPlots = plots => ({ type: GOT_ALL_PLOTS, plots });
export const madeNewPlot = plot => ({ type: MADE_NEW_PLOT, plot });

// export const getAllPlots = () => async dispatch => {
// 	try {
// 		await FirebaseWrapper.GetInstance().SetupCollectionListener(
// 			"PeetPlotz",
// 			plots => dispatch(gotAllPlots(plots))
// 		)
// 	} catch (error) {
// 		console.log("error getting all plots", error)
// 	}
// }

export const getAllPlots = (lat, lng) => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().getNearbyPlots(
      "PeetPlotz",
      lat,
      lng,
      2,
      50,
      plots => dispatch(gotAllPlots(plots))
    );
  } catch (error) {
    console.log("error getting all plots", error);
  }
};
export const makeNewPlot = (lat, lng) => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().createPlot(
      "PeetPlotz",
      "NEWPLOT",
      lat,
      lng,
      plot => dispatch(madeNewPlot(plot))
    );
  } catch (error) {
    console.log("error creating plot", error);
  }
};

export const plotState = [];
export const plotReducer = (state = plotState, action) => {
  switch (action.type) {
    case GOT_ALL_PLOTS:
      return action.plots;
    case MADE_NEW_PLOT:
      return [...state, action.plot];
    default:
      return state;
  }
};
