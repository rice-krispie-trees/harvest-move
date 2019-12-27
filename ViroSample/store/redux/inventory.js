import { FirebaseWrapper } from "../../firebase/firebase"
import { LOGIN_SUCCESS, SIGNUP_SUCCESS, LOGOUT_SUCCESS } from "./auth"
import crops from "../../js/logic/crops"

export const GOT_USER_PROFILE = "GOT_USER_PROFILE"

export const BOUGHT_SEEDS = "BOUGHT_SEEDS"

const boughtSeeds = (newKolionTotal, alteredSeedType, alteredSeedTotal) => ({
	type: BOUGHT_SEEDS,
	newKolionTotal,
	alteredSeedType,
	alteredSeedTotal
})

const gotUserProfile = user => ({ type: GOT_USER_PROFILE, user })

export const getUserProfile = () => async dispatch => {
	try {
		console.log("IN GET USER PROFILE THUNK")
		await FirebaseWrapper.GetInstance().GetCurrentUserProfile(user =>
			dispatch(gotUserProfile(user))
		)
	} catch (error) {
		console.log("error getting user profile", error)
	}
}

export const buySeeds = crop => async dispatch => {
	try {
		await FirebaseWrapper.GetInstance().buySeeds(crop, user =>
			dispatch(boughtSeeds(user.kolions, crop.name, user.seeds[crop.name]))
		)
	} catch (error) {
		console.log("error buying seeds", error)
	}
}

export const initialState = {
	kolions: 0,
	crops: {},
	seeds: {}
}

//ensures that the initialized state always has fields for each existing croptype
for (cropName in crops) {
	initialState.crops[cropName] = 0
	initialState.seeds[cropName] = 0
}

export default (state = initialState, action) => {
	switch (action.type) {
		case GOT_USER_PROFILE:
			return {
				kolions: action.user.kolions,
				seeds: action.user.seeds,
				crops: action.user.crops
			}
		case BOUGHT_SEEDS:
			return {
				...state,
				kolions: action.newKolionTotal,
				seeds: {
					...state.seeds,
					[action.alteredSeedType]: action.alteredSeedTotal
				}
			}
		case LOGOUT_SUCCESS:
			return initialState
		default:
			return state
	}
}
