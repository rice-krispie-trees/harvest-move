import { createStore, combineReducers, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import thunkMiddleware from "redux-thunk"
import plots from "./redux/plots"
import coords from "./redux/coords"
import seed from "./redux/seed"
import auth from "./redux/auth"
import tool from "./redux/tool"
import inventory from "./redux/inventory"
import { verifyAuth } from "./redux/auth"

const reducer = combineReducers({ auth, plots, coords, seed, tool, inventory })
const middleware = applyMiddleware(
	thunkMiddleware,
	createLogger({ collapsed: true })
)

export default function configureStore(persistedState) {
	const store = createStore(reducer, persistedState, middleware)
	store.dispatch(verifyAuth())
	return store
}

// const store = createStore(reducer, middleware);

// export default store
