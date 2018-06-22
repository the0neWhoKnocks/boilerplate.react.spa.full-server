import genCacheKey from 'UTILS/genCacheKey';
import log, {
  BLUE,
  BLACK_ON_GREEN,
  BLACK_ON_GRAY,
} from 'UTILS/logger';
import { initialState } from './constants';
import {
  SET_VIEW_DATA,
} from './actionTypes';

function reducer(){
  const st = initialState();

  return (state = st, action) => {
    if(action.type.indexOf('INIT') < 0)
      log(`${ BLACK_ON_GREEN } REDUCER`, action.type);

    switch( action.type ){
      case SET_VIEW_DATA: {
        const { data, reqOpts } = action.payload;
        // fake a caching structure for data
        const uniqueKey = genCacheKey(reqOpts);

        if(state.viewData[uniqueKey]) return state;
        else{
          const newState = { ...state };
          newState.viewData[uniqueKey] = data;
          log('  ', `${ BLACK_ON_GRAY } SET`, 'unique key for:', `${ BLUE } "${ uniqueKey }"`);
          return newState;
        }
      }

      default: return { ...state };
    }
  };
}

export default reducer;
