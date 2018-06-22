import { createStore } from 'redux';
import reducer from './reducer';

const extraArgs = [];

if(process.env.IS_CLIENT){
  // hydrate state from server
  if(window.__PRELOADED_STATE__) extraArgs.push(window.__PRELOADED_STATE__);
  // wire up the Redux dev tool
  if(window.__REDUX_DEVTOOLS_EXTENSION__) extraArgs.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

export {
  createStore,
  extraArgs,
  reducer,
};
