import genCacheKey from 'UTILS/genCacheKey';
import log, {
  BLUE,
  BLACK_ON_GREEN,
  BLACK_ON_GRAY,
} from 'UTILS/logger';
import { initialState } from './constants';
import {
  SET_ITEM_RESULTS,
  SET_PREVIOUS_PAGE,
  SET_SHELL_CLASS,
  SET_VIEW_DATA,
} from './actionTypes';

function reducer(extendedData = {}){
  const st = {
    ...initialState(),
    ...extendedData,
  };

  return (state = st, action) => {
    if(action.type.indexOf('INIT') < 0)
      log(`${ BLACK_ON_GREEN } REDUCER`, action.type);

    switch( action.type ){
      case SET_ITEM_RESULTS: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'nextPage & reults');
        return {
          ...state,
          nextPage: action.payload.nextPage,
          results: [
            ...state.results,
            ...action.payload.results,
          ],
        };
      }

      case SET_PREVIOUS_PAGE: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'previous page to:', `${ BLUE } "${ action.payload }"`);
        return {
          ...state,
          previousPage: action.payload,
        };
      }

      case SET_SHELL_CLASS: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'Shell class to:', `${ BLUE } "${ action.payload }"`);
        return {
          ...state,
          shellClass: action.payload,
        };
      }

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
