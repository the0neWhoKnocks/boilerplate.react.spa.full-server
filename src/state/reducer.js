import genCacheKey from 'UTILS/genCacheKey';
import log, {
  BLUE,
  BLACK_ON_GREEN,
  BLACK_ON_GRAY,
} from 'UTILS/logger';
import { initialState } from './constants';
import {
  SET_ITEM_LOADED,
  SET_ITEM_RESULTS,
  SET_LOGGING_ENABLED,
  SET_PREVIOUS_VIEW,
  SET_SHELL_CLASS,
  SET_SCROLL_POS,
  SET_VIEW_DATA,
} from './actionTypes';

function reducer(extendedData = {}){
  const st = {
    ...initialState(),
    ...extendedData,
  };

  return (state = st, action) => {
    const { payload, type } = action;

    if(type.indexOf('INIT') < 0)
      log(`${ BLACK_ON_GREEN } REDUCER`, type);

    switch( type ){
      case SET_ITEM_LOADED: {
        const ndx = payload;
        const results = [...state.results];
        
        results[ndx]._loaded = true;
        
        log('  ', `${ BLACK_ON_GRAY } SET`, `Item ${ ndx }'s image has loaded'`);
        return {
          ...state,
          results,
        };
      }
      
      case SET_ITEM_RESULTS: {
        const { nextPage, results } = payload;
        log('  ', `${ BLACK_ON_GRAY } SET`, 'nextPage & results');
        return {
          ...state,
          nextPage,
          results: [
            ...state.results,
            ...results,
          ],
        };
      }

      case SET_LOGGING_ENABLED: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'logging to:', `${ BLUE } ${ payload ? 'enabled' : 'disabled' }`);
        return {
          ...state,
          loggingEnabled: payload,
        };
      }

      case SET_PREVIOUS_VIEW: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'previous view to:', `${ BLUE } "${ payload }"`);
        return {
          ...state,
          previousView: payload,
        };
      }

      case SET_SHELL_CLASS: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'Shell class to:', `${ BLUE } "${ payload }"`);
        return {
          ...state,
          shellClass: payload,
        };
      }

      case SET_SCROLL_POS: {
        const { pos, uid } = payload;

        if(uid){
          log('  ', `${ BLACK_ON_GRAY } SET`, 'Scroll position for', `${ BLUE } "${ uid }"` ,'to:', `${ BLUE } ${ pos }`);
          return {
            ...state,
            scrollPos: {
              ...state.scrollPos,
              [uid]: pos,
            },
          };
        }

        return state;
      }

      case SET_VIEW_DATA: {
        const { data, reqOpts } = payload;
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
