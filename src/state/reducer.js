import genCacheKey from 'UTILS/genCacheKey';
import log from 'UTILS/logger';
import { initialState } from './constants';
import {
  SET_VIEW_DATA,
} from './actionTypes';

function reducer(){
  const st = initialState();

  return (state = st, action) => {
    if(action.type.indexOf('INIT') < 0)
      log('%bg REDUCER', action.type);

    switch( action.type ){
      case SET_VIEW_DATA: {
        const { data, reqOpts } = action.payload;
        // fake a caching structure for data
        const uniqueKey = genCacheKey(reqOpts);

        if(state.viewData[uniqueKey]) return state;
        else{
          const newState = { ...state };
          newState.viewData[uniqueKey] = data;
          log('  SET unique key for:', `${ uniqueKey }`);
          return newState;
        }
      }

      default: return { ...state };
    }
  };
}

export default reducer;
