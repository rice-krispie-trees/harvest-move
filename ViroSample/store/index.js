import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { plotReducer } from "./redux/plots";
import { coordsReducer } from "./redux/coords";

const reducer = combineReducers({ plots: plotReducer, coords: coordsReducer });
const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
);
const store = createStore(reducer, middleware);

export default store;
