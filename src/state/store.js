import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

let extraArgs = [];

if(process.env.IS_CLIENT){
  let state = {};

  // hydrate state from server
  if(window.__PRELOADED_STATE__) state = window.__PRELOADED_STATE__;
  // wire up the Redux dev tool && thunk middleware
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(...[
      thunk,
    ]),
  );

  extraArgs.push(state, enhancer);
}

export {
  applyMiddleware,
  createStore,
  extraArgs,
  reducer,
};
