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

const _default = {
  app: null,
};
const initStore = ({ reducerArgs = [] } = {}) => {
  _default.app = createStore(
    reducer(...reducerArgs), // apply any initial state props if neccessary
    ...extraArgs
  );
};

export default _default;
export {
  applyMiddleware,
  initStore,
};
