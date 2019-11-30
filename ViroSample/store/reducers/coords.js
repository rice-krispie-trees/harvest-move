import { FirebaseWrapper } from "../../firebase/firebase";

export const GOT_USER_COORDS = "GET_USER_COORDS";
export const DIDNT_GET_USER_COORDS = "DIDNT_GET_USER_COORDS";

export const gotUserCoords = (lat, long) => ({
  type: GOT_USER_COORDS,
  lat,
  long
});

export const failedGettingUserCoords = errorMsg => ({
  type: DIDNT_GET_USER_COORDS,
  errorMsg
});

export const getUserCoords = () => async dispatch => {
  try {
    await navigator.geolocation.getCurrentPosition(position => {
      dispatch(
        gotUserCoords(position.coords.latitude, position.coords.longitude)
      ),
        error => dispatch(failedGettingUserCoords(error.message)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
    });
  } catch (error) {
    console.log("error getting user coordinates", error);
  }
};

export const coordsState = { lat: 0, long: 0, error: null };

export const coordsReducer = (state = coordsState, action) => {
  switch (action.type) {
    case GOT_USER_COORDS:
      return { lat: action.lat, long: action.long, error: null };
    case DIDNT_GET_USER_COORDS:
      return { ...state, error: action.errorMsg };
    default:
      return state;
  }
};
