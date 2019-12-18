import { FirebaseWrapper } from "../../firebase/firebase"
import { getAllPlots } from "./plots"

export const GOT_USER_COORDS = "GET_USER_COORDS"
export const DIDNT_GET_USER_COORDS = "DIDNT_GET_USER_COORDS"

export const gotUserCoords = (lat, long) => ({
	type: GOT_USER_COORDS,
	lat,
	long
})

export const failedGettingUserCoords = errorMsg => ({
	type: DIDNT_GET_USER_COORDS,
	errorMsg
})

export const getUserCoordsAndPlots = () => dispatch => {
	try {
		return navigator.geolocation.getCurrentPosition(
			position => {
				dispatch(
					gotUserCoords(position.coords.latitude, position.coords.longitude)
				)
				dispatch(
					getAllPlots(position.coords.latitude, position.coords.longitude)
				)
			},
			error => dispatch(failedGettingUserCoords(error.message)),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		)
	} catch (error) {
		console.log("error getting user coordinates", error)
	}
}

const initialState = { lat: 0, lng: 0, error: null }

export default function(state = initialState, action) {
	switch (action.type) {
		case GOT_USER_COORDS:
			return { lat: action.lat, lng: action.long, error: null }
		case DIDNT_GET_USER_COORDS:
			return { ...state, error: action.errorMsg }
		default:
			return state
	}
}
