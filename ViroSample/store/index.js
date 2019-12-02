import { createStore, combineReducers, applyMiddleware } from "redux"
import { createLogger } from "redux-logger"
import thunkMiddleware from "redux-thunk"
import plots from "./redux/plots"
import coords from "./redux/coords"
import seed from "./redux/seed"

const reducer = combineReducers({ plots, coords, seed })
const middleware = applyMiddleware(
	thunkMiddleware,
	createLogger({ collapsed: true })
)
const store = createStore(reducer, middleware)

export default store
