import { createStore } from 'redux';
import reducer from './reducer';

const storeArgs = [reducer];

if(process.env.IS_CLIENT){
  // hydrate state from server
  if(window.__PRELOADED_STATE__) storeArgs.push(window.__PRELOADED_STATE__);
  // wire up the Redux dev tool
  if(window.__REDUX_DEVTOOLS_EXTENSION__) storeArgs.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

export default createStore.apply(null, storeArgs);
