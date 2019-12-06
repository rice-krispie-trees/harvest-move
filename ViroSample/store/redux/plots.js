import { FirebaseWrapper } from "../../firebase/firebase";
import firebasePath from "../../firebase_path";

import {
  hasDied,
  hasSprouted,
  hasRipened,
  hasDried,
  hasChanged
} from "../../js/logic";

export const GOT_ALL_PLOTS = "GOT_ALL_PLOTS";
export const MADE_NEW_PLOT = "MADE_NEW_PLOT";
export const WATERED_PLOT = "WATERED_PLOT";
export const PICKED_PLOT = "PICKED_PLOT";
export const SEEDED_PLOT = "SEEDED_PLOT";

export const gotAllPlots = plots => ({ type: GOT_ALL_PLOTS, plots });
export const madeNewPlot = plot => ({ type: MADE_NEW_PLOT, plot });
export const wateredPlot = plot => ({ type: WATERED_PLOT, plot });
export const seededPlot = plot => ({ type: SEEDED_PLOT, plot });
export const pickedPlot = (plot, crop) => ({ type: PICKED_PLOT, plot, crop });

export const getAllPlots = (lat, lng) => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().getAndUpdateUserPlots(
      lat,
      lng,
      async plots => dispatch(gotAllPlots(plots))
    );
  } catch (error) {
    console.log("error getting all plots", error);
  }
};

// 	const updatePlots = plots => async dispatch => {
// 		try {
// 			// await Promise.all(plots.filter(hasDied).map(plot => XXX))
// 			// await Promise.all(plots.filter(hasSprouted).map(plot => XXX))
// 			// await Promize.all(plots.filter)
// 		} catch (error) {
// 			console.log("error updating plots", error)
// 		}
// 	}
// }

export const makeNewPlot = (lat, lng) => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().createUserPlot(lat, lng, plot =>
      dispatch(madeNewPlot(plot))
    );
  } catch (error) {
    console.log("error creating plot", error);
  }
};

export const waterPlot = plot => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().waterUserPlot(plot.id, updatedPlot =>
      dispatch(wateredPlot(updatedPlot))
    );
  } catch (error) {
    console.log("error watering plot", error);
  }
};

export const seedPlot = (plot, seed) => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().seedUserPlot(
      plot.id,
      seed,
      updatedPlot => dispatch(seededPlot(updatedPlot))
    );
  } catch (error) {
    console.log("error seeding plot", error);
  }
};

export const pickPlot = plot => async dispatch => {
  try {
    await FirebaseWrapper.GetInstance().pickUserCrop(
      plot.id,
      plot.crop,
      updatedPlot => dispatch(pickedPlot(updatedPlot, plot.crop))
    );
  } catch (error) {
    console.log("error picking plot", error);
  }
};

function replacePlot(state, action) {
  const newState = [...state];
  const oldPlot = state.find(plot => plot.id === action.plot.id);
  newState[state.indexOf(oldPlot)] = action.plot;
  return newState;
}

const initialState = [];
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_ALL_PLOTS:
      return action.plots;
    case MADE_NEW_PLOT:
      return [action.plot, ...state];
    case WATERED_PLOT:
      return replacePlot(state, action);
    case SEEDED_PLOT:
      return replacePlot(state, action);
    case PICKED_PLOT:
      return replacePlot(state, action);
    default:
      return state;
  }
}
