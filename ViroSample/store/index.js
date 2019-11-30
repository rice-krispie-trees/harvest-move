import { createStore, combineReducers } from "redux";
import { firestoreReducer, getFirestore } from "redux-firestore";
import { firebaseReducer, getFirebase } from "react-redux-firebase";
import { coordsReducer } from "./reducers/coords";
import { FirebaseWrapper } from "../firebase/firebase";

// export const getPlots = (latitude, longitude, radius) => async (
//   dispatch,
//   getState,
//   { getFirebase, getFirestore }
// ) => {
//   try {
//     await FirebaseWrapper.GetInstance().getNearbyPlots(
//       collectionPath,
//       latitude,
//       longitude,
//       radius,
//       plots => dispatch(gotPlots(plots))
//     );
//   } catch (error) {
//     console.log("getPlots thunk failed", error);
//   }
// };

const rootReducer = combineReducers({
  // plots: plotReducer,
  // coords: coordsReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

const initialState = {};
const store = createStore(rootReducer, initialState);

export default store;
