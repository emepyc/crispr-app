import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createBrowserHistory from 'history/createBrowserHistory';
import rootReducer from '../modules';
// import {listenForHistoryChange, createReduxLocationActions} from 'redux-location-state';
// import {mapLocationToState, paramSetup} from '../location';

export const history = createBrowserHistory();

const initialState = {};
// const {locationMiddleware, reducersWithLocation} = createReduxLocationActions(paramSetup, mapLocationToState, history, rootReducer);

// const middleware = [thunk, routerMiddleware(history), locationMiddleware];
const middleware = [thunk, routerMiddleware(history)];

const enhancers = [];
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);
// const store = createStore(reducersWithLocation, initialState, composedEnhancers);

// listenForHistoryChange(store, history);

export default store;

// export default function createAppStore(reducer, history) {
//   const loggerMiddleware = createLogger({collapsed: true});
//   const {locationMiddleware, reducersWithLocation} = createReduxLocationActions(paramSetup, mapLocationToState, history, reducer);
//
//   const middleware = compact([
//     // thunk middleware, allows actions to return 'thunk' functions
//     thunkMiddleware,
//     // location middleware, updates location via replaceState when app state changes
//     locationMiddleware,
//     // logger middleware, logs all actions to the console (optional)
//     loggerMiddleware
//   ]);
