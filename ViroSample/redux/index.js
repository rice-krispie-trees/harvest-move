import { combineReducers } from "redux";
import { firestoreReducer, getFirestore } from "redux-firestore";
import { firebaseReducer, getFirebase } from "react-redux-firebase";
import { FirebaseWrapper } from ".../firebase/firebase";

const GOT_PLOTS = "GOT_PLOTS";

const gotPlots = plots => ({ type: GOT_PLOTS, plots });

const plotState = {
  areaPlots: []
};

export const getPlots = (latitude, longitude, radius, limit) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    await FirebaseWrapper.GetInstance().getNearbyPlots(
      collectionPath,
      latitude,
      longitude,
      radius,
      limit,
      plots => dispatch(gotPlots(plots))
    );
  } catch (error) {
    console.log("getPlots thunk failed", error);
  }
};

const plotReducer = (state = plotState, action) => {
  switch (action.type) {
    case GOT_PLOTS:
      return { ...state, areaPlots: action.plots };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  plots: plotReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
