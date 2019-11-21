// import { createStore, applyMiddleware, compose, combineReducers } from "redux"
// import { firebaseReducer } from "react-redux-firebase"
// import { createLogger } from "redux-logger"
// import thunkMiddleware from "redux-thunk"
// // import {composeWithDevTools} from 'redux-devtools-extension'

// const rootReducer = combineReducers({ firebase: firebaseReducer })

import { compose, createStore } from "redux"
import RNFirebase from "react-native-firebase"
import { reactReduxFirebase } from "react-redux-firebase"
import thunk from "redux-thunk"
import makeRootReducer from "./reducers"

const reactNativeFirebaseConfig = {
	debug: true
}

const reduxFirebaseConfig = {
	userProfile: "User" // save users profiles to 'users' collection
}

export default (initialState = { firebase: {} }) => {
	// initialize firebase
	const firebase = RNFirebase.initializeApp(reactNativeFirebaseConfig)

	const store = createStore(
		makeRootReducer(),
		initialState,
		compose(
			reactReduxFirebase(firebase, reduxFirebaseConfig) // pass initialized react-native-firebase app instance
			// applyMiddleware can be placed here
		)
	)

	return store
}
